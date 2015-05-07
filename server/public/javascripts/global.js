
var availableClients = [];

// DOM Ready =============================================================
$(document).ready(function() {
   // Client details link click
    $('#clientList table tbody').on('click', 'td a.linkshowdetails', showClientInfo);
    // Populate the clients table on initial page load
    displayClients();
});

// Functions =============================================================

// Fill table with data
function displayClients() {
    // Empty content string
    var tableContent = '';
    // jQuery AJAX call for JSON
    $.getJSON( '/clients/discovered', function( data ) {
	availableClients = data;
        // For each item in JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowdetails" rel="' + this.addresses[0] + '">' + this.name + '</a></td>';
            tableContent += '<td>' + this.addresses[0] + '</td>';
            tableContent += '<td>' + this.port + '</td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#clientList table tbody').html(tableContent);
    });
};

// Show Client Info
function showClientInfo(event) {
    // Prevent link from firing
    event.preventDefault();
    // Retrieve ip address from link rel attribute
    var thisIPAddress = $(this).attr('rel');
    // Get index of object based on id value
    var arrayPosition = availableClients.map(function(arrayItem) { return arrayItem.addresses[0]; }).indexOf(thisIPAddress);
    // Get client object
    var thisClientObject = availableClients[arrayPosition];

    //Populate info box
    $('#clientInfoFullname').text(thisClientObject.fullname);
    $('#clientInfoHost').text(thisClientObject.host);
    $('#clientInfoIP').text(thisClientObject.addresses[0]);
    $('#clientInfoPort').text('' + thisClientObject.port);
};











