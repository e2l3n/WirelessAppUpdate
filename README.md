# WirelessAppUpdate
A client-server architecture that will allow iOS application to be refreshed upon request.
<h2>Details</h2>
<DL>
<DT>Client side (mobile app)
<DD>A hybrid mobile application (created via Apache Cordova) that hosts a simple HTML page. 
Upon start the app broadcasts its presence. The broadcast should be picked up by the 
server and the device is dynamically registered for communication. Being registered, 
the app is able to respond to commands sent from the server. 
The client side code is abstracted in a reusable Cordova plugin that can be added to 
multiple iOS applications.
<DT>Server side
<DD>A Node.js application which exposes REST API. The API has the following routes:
<br><i> /update - updates the index.html page of the mobile app with the posted content</i>
<br><i> /refresh - refreshes the web view in order to see the updated content</i>
</DL>
