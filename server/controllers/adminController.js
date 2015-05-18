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
    var urlAddr = '/api/v1/discovered';
    $.ajax({
        type: 'GET',
        url: urlAddr
    }).done(function(response) {
        availableClients = response.result.clients;
        // For each item in JSON, add a table row and cells to the content string
        $.each(availableClients, function() {
            htmlContent += '<tr>';
            htmlContent += '<td><a href="#" class="linkshowdetails" rel="' + this.addresses[0] + '">' + this.name + '</a></td>';
            htmlContent += '<td>' + this.addresses[0] + '</td>';
            htmlContent += '<td>' + this.port + '</td>';
            htmlContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#clientList table tbody').html(htmlContent);
		$("#prefix").text("Service prefix filter: " + response.result.service_prefix);
    });

    $("#connect").prop("disabled", true);
};

// Show Client Info
function showClientInfo(event) {
    // Prevent link from firing
    // event.preventDefault();
    // Retrieve ip address from link rel attribute
    var thisIPAddress = $(this).attr('rel');
    // Get index of object based on id value
    var arrayPosition = availableClients.map(function(arrayItem) {
        return arrayItem.addresses[0];
    }).indexOf(thisIPAddress);
    // Get client object
    var thisClientObject = availableClients[arrayPosition];
	//Update interaction ability
	$("#connect").prop("disabled", !thisClientObject.addresses[0] || !thisClientObject.port);
    //Populate info box
    $('#clientInfoFullname').text(thisClientObject.fullname);
    $('#clientInfoHost').text(thisClientObject.host);
    $('#clientInfoIP').text(thisClientObject.addresses[0]);
    $('#clientInfoPort').text('' + thisClientObject.port);
    //Update buttons state appropriately.
    var urlAddr = generalIPPortURL('isconnected');
    $.ajax({
        type: 'GET',
        url: urlAddr,
    }).done(function(response) {
        // Check for a successful (blank) response
        if (!response.error || response.error == '') {} else {}
    }).complete(function(xhr, status) {
        // Check for a successful (blank) response and update client info appropriately.
        if (xhr.status == 200) {
            $("#status").text('Connected.');
            $("#htmlInputArea").prop("disabled", false);
            $("#htmlInputArea").keyup(); //trigger keyup() event in order to update the 'update' button state appropriately
            $("#refresh").prop("disabled", false);
            $("#connect").html('Disconnect');
        } else {
            $("#status").text('Not connected.');
            $("#htmlInputArea").prop("disabled", true);
            $("#refresh").prop("disabled", true);
            $("#update").prop("disabled", true);
            $("#connect").html('Connect');
        }
    });
};

/*
	USER-EVENT HANDLERS
*/

//Enable/Disable buttons on textarea input change event
$('textarea#htmlInputArea').on('keyup', function() {
    var textarea_value = $("#htmlInputArea").val();
    if (textarea_value.length) {
        $('button#update').attr('disabled', false);
    } else {
        $('button#update').attr('disabled', true);
    }
});

//Trigger socket connection
$('button#connect').click(function() {
    var shouldConnect = $('#connect').text().localeCompare('Connect') == 0;
    $('#status').text(shouldConnect ? 'Establishing connection ...' : 'Disconnecting ...');
    var urlAddr = generalIPPortURL(shouldConnect ? 'connect' : 'disconnect');
    $.ajax({
        type: 'GET',
        url: urlAddr
    }).done(function(response) {
        // Check for a successful (blank) response
        if (!response.error || response.error == '') {} else {}
    }).complete(function(xhr, status) {
        // Check for a successful (blank) response
         if (xhr.status == 200) {
            $("#status").text(shouldConnect ? 'Connected.' : 'Not connected.');
            $("#htmlInputArea").prop("disabled", !shouldConnect);
            if (shouldConnect) {
                $("#htmlInputArea").keyup(); //trigger keyup() event in order to update the 'update' button state appropriately
            } else {
   	            $("#update").prop("disabled", true);
            }
            $("#refresh").prop("disabled", !shouldConnect);
            $("#connect").html(shouldConnect ? 'Disconnet' : 'Connect');
         } else {
            $("#status").text(shouldConnect ? 'Not connected.' : 'Connected.');
            $("#htmlInputArea").prop("disabled", shouldConnect);
            $("#refresh").prop("disabled", shouldConnect);
            if (shouldConnect) {
 				$("#update").prop("disabled", true);
            } else {
   	            $("#htmlInputArea").keyup(); //trigger keyup() event in order to update the 'update' button state appropriately
            }
            $("#connect").html(shouldConnect ? 'Connect' : 'Disconnect');
        }
    });
});

//Send refresh command
$('button#refresh').click(function() {    
    var urlAddr = generalIPPortURL('refresh');
    $.ajax({
        type: 'GET',
         url: urlAddr
    }).done(function(response) {
        // Check for a successful (blank) response
        if (!response.error || response.error == '') {} else {}
    });
});

//Send html content to client.
$('button#update').click(function() {
    var htmlToPost = $('textarea#htmlInputArea').val();
    if (!htmlToPost) {
        window.alert('There is no HTML content to post. Please input and try again.');
        return;
    }

    var urlAddr = generalIPPortURL('update');
    $.ajax({
        type: 'POST',
        url: urlAddr,
        data: {
            'html': $("#htmlInputArea").val()
        },
        dataType: 'JSON'
    }).done(function(response) {
        // Check for a successful (blank) response
        if (!response.error || response.error == '') {} else {}
    }).complete(function(xhr, status) {
        // Check for a successful (blank) response
        // window.alert(xhr.status);
        if (xhr.status == 200) {} else {}
    });
});

// //Utilities
function generalIPPortURL(pathComponent) {
    var urlAddr = null;
    if (typeof pathComponent === 'string') {
        urlAddr = '/api/v1/' + pathComponent + '/ip/' + $('#clientInfoIP').text() + '/port/' + $('#clientInfoPort').text();
    }

    return urlAddr;
};