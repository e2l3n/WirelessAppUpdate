var discovered_clients = [];
var arrayUtils = require('./helpers/array');
var stringUtils = require('./helpers/string');
var constants = require('./constants');

// Import mdns  module
var mdns = require('mdns');
// advertise the server /testing purposes only/
var ad = mdns.createAdvertisement(mdns.tcp('http'), constants.kServerPort);
ad.start();
// watch available services
var browser = mdns.createBrowser(mdns.tcp('http'));
browser.on('serviceUp', function(service) {
    console.log("service up: ", service);
    if (!service.name.hasPrefix(constants.kServicePrefix)) {
        return;
    }

    var filteredIP4Addresses = service.addresses.filter(function(ipAddr) {
        var octets = ipAddr.split(".");
        var block;
        var regex = new RegExp('^[0-9]{1,3}$');
        for (var i = 0; i < octets.length; i++) {
            block = octets[i];
            if (!regex.test(block)) {
                return false;
            }
        }

        return true;
    });
	// console.log('FILTERED IP Addresses : ' + filteredIP4Addresses);
    if (filteredIP4Addresses.length > 0) {
        service.addresses = filteredIP4Addresses;
    }

    discovered_clients.pushIfNotExist(service, function(existingElem) {
        return existingElem.name === service.name;
    });


});

browser.on('serviceDown', function(service) {
    console.log("service down: ", service);
    discovered_clients = discovered_clients.filter(function(aService) {
        return aService.name.localeCompare(service.name) != 0;
    });
});

//Public methods
module.exports = {
    startBrowsing: function() {
        browser.start();
    },
    discovered_clients: function() {
        return discovered_clients;
    }
};
