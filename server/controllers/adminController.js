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
    // jQuery AJAX call for JSON
    $.getJSON('/api/v1/discovered', function(data) {
        availableClients = data;
        // For each item in JSON, add a table row and cells to the content string
        $.each(data, function() {
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
    $.getJSON('/api/v1/connect', function(data) {
    	$('#status').text('Connected.');
		$("#htmlInputArea").prop("disabled", false);
	    $("#refresh").prop("disabled", false);
    });
});