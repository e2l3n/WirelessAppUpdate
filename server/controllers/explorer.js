var discovered_clients = [];
var arrayUtils = require('./utilities/array');

// Import mdns  module
var mdns = require('mdns');
// advertise a http server on port 4321
var ad = mdns.createAdvertisement(mdns.tcp('http'), 4321);
ad.start();
// watch available services
var browser = mdns.createBrowser(mdns.tcp('http'));
browser.on('serviceUp', function(service) {
  console.log("service up: ", service);
  discovered_clients.pushIfNotExist(service, function(existingElem) { 
    return existingElem.name === service.name; 
});
});
browser.on('serviceDown', function(service) {
  console.log("service down: ", service);
  discovered_clients = discovered_clients.filter(function (aService) {
		return aService.fullname !== service.fullname;	
		});
});


module.exports = {
  startBrowsing: function () {
     browser.start();
 },
 discovered_clients: function () {
     return discovered_clients;
 } 
};



