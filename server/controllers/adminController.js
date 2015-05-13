var availableClients = [];
/* 
	DOM Ready
*/

$(document).ready(function() {
    // Client details link click
    $('#clientList table tbody').on('click', 'td a.linkshowdetails', showClientInfo);
    // Populate the clients table on initial page load
    displayClients();
});

/* 
	FUNCTIONS
*/

// Fill table with data
function displayClients() {
    // Empty content string
    var htmlContent = '';
    $.ajax({
        type: 'GET',
        url: '/api/v1/discovered'
    }).done(function(response) {
        availableClients = response;
        // For each item in JSON, add a table row and cells to the content string
        $.each(response, function() {
            htmlContent += '<tr>';
            htmlContent += '<td><a href="#" class="linkshowdetails" rel="' + this.addresses[0] + '">' + this.name + '</a></td>';
            htmlContent += '<td>' + this.addresses[0] + '</td>';
            htmlContent += '<td>' + this.port + '</td>';
            htmlContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#clientList table tbody').html(htmlContent);
    });


    $("#connect").prop("disabled", true);
};

// Show Client Info
function showClientInfo(event) {
    // Prevent link from firing
    event.preventDefault();
    // Retrieve ip address from link rel attribute
    var thisIPAddress = $(this).attr('rel');
    // Get index of object based on id value
    var arrayPosition = availableClients.map(function(arrayItem) {
        return arrayItem.addresses[0];
    }).indexOf(thisIPAddress);
    // Get client object
    var thisClientObject = availableClients[arrayPosition];
    //Populate info box
    $('#clientInfoFullname').text(thisClientObject.fullname);
    $('#clientInfoHost').text(thisClientObject.host);
    $('#clientInfoIP').text(thisClientObject.addresses[0]);
    $('#clientInfoPort').text('' + thisClientObject.port);
    //Update buttons state appropriately.
    $("#connect").prop("disabled", false);
    $("#htmlInputArea").prop("disabled", true);
    $("#update").prop("disabled", true);
    $("#refresh").prop("disabled", true);

    $('#status').text('');
};

/* 
	USER-EVENT HANDLERS
*/

//Notifiy client that new content is available by sending command
//via the established socket connection and triggering update request on the client side.
$('button#update').click(function() {
    var htmlToPost = $('textarea#htmlInputArea').val();
    if (!htmlToPost) {
        window.alert('There is no HTML content to post. Please input and try again.');
        return;
    }

    window.alert(htmlToPost);
});

//Enable/Disable buttons on textarea input change event
$('textarea#htmlInputArea').on('keyup', function() {
    var textarea_value = $("#htmlInputArea").val();
    if (textarea_value.length) {
        $('button#update').attr('disabled', false);
    } else {
        $('button#update').attr('disabled', true);
    }
});

//Trigger refresh on the client side
$('button#refresh').click(function() {

});

//Trigger socket connection
$('button#connect').click(function() {
    $('#status').text('Establishing connection ...');
    var urlAddr = '/connect/ip/' + $('#clientInfoIP').val() + '/port/' + $('#clientInfoPort').val();
    $.ajax({
        type: 'GET',
        url: urlAddr
    }).done(function(response) {
        // Check for a successful (blank) response
        if (response.error === '') {
            $('#status').text('Connected.');
            $("#htmlInputArea").prop("disabled", false);
            $("#refresh").prop("disabled", false);
        } else {
            $('#status').text('Failed to connect.');
            $("#htmlInputArea").prop("disabled", true);
            $("#refresh").prop("disabled", true);
        }
    });
});
