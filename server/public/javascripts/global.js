
// DOM Ready =============================================================
$(document).ready(function() {

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
        // For each item in JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.name + '">' + this.name + '</a></td>';
            tableContent += '<td>' + this.addresses[0] + '</td>';
            tableContent += '<td>' + this.port + '</td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#clientList table tbody').html(tableContent);
    });
};
