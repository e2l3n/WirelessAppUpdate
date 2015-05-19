var discovered_clients = [];
var arrayUtils = require('./helpers/array');
var stringUtils = require('./helpers/string');
var constants = require('./constants');

// Import mdns  module
var mdns = require('mdns');

// advertise the server /testing purposes only/

//var ad = mdns.createAdvertisement(mdns.tcp('http'), constants.kServerPort);
//ad.start();

/*
  On ‘serviceUp’ event attempt to filter the IP addresses array
  by preserving IPv.4 address types only. In case this is not possible 
  then leave the array as is. The current server version is compatible with IPv.4 only.
*/
var default_sequence = [
    mdns.rst.DNSServiceResolve(), 
	mdns.rst.DNSServiceGetAddrInfo(),
	mdns.rst.makeAddressesUnique()
];

var browser = mdns.createBrowser(mdns.tcp('http'), default_sequence);
browser.on('serviceUp', function(service) {
    console.log("service up: ", service);
    if (!service.name.hasPrefix(constants.kServicePrefix)) {
        return;
    }

    var ip4Addresses = getFilteredIPAddresses(service.addresses);
    // console.log('FILTERED IP Addresses : ' + ip4Addresses);
    if (ip4Addresses.length > 0) {
        service.addresses = ip4Addresses;
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

browser.on('serviceChanged', function(service) {
    console.log("service changed: ", service);
    var existing = arrayUtils.findObjectInArray(discovered_clients, function(aService) {
        if (aService.name.localeCompare(service.name) == 0) {
            aService.name = service.name;
            aService.port = service.port;
            var ip4Addresses = getFilteredIPAddresses(service.addresses);
            // console.log('FILTERED IP Addresses : ' + ip4Addresses);
            if (ip4Addresses.length > 0) {
                aService.addresses = ip4Addresses;
            }
            return true;
        }

        return false;
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

//Utilities 
function getFilteredIPAddresses(addresses) {
    if (!addresses || addresses.constructor !== Array) {
        return [];
    }

    var result = addresses.filter(function(ipAddr) {
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

    return result;
}