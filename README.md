# WirelessAppUpdate
by [Toma Popov] (https://github.com/e2l3n/WirelessAppUpdate)

## Index

1. [Description](#1-description)
2. [Setup and Installation](#2-Setup and Installation)
3. [License](#6-license)

## 1. Description
A client-server architecture that allows clients to be refreshed upon command sent by the server. 

###Client side (mobile app)
A hybrid mobile application (created via Apache Cordova) that hosts a simple HTML page. Part of the client side code is abstracted in a reusable cordova plugin.
* Compatible with [Cordova Plugman](https://github.com/apache/cordova-plugman).
Upon start the app broadcasts its presence using the native mDNS service and advertises itses as a service . The app then starts listening on specific port for socket connections initiated by the server.

###Server side
The server is an <i>express</i> app which which exposes REST API and provides a simple UI built with <i>jade</i> framework for sending commands to clients. Upon start the server begings browsing all services on the local network and lists all available clients. 
<br>The REST API has the following routes:
* /update - updates the index.html page of the mobile app with the posted content</i>
* /refresh - refreshes the web view in order to see the updated content</i>
* /clients/discoverd - a list of all discovered clients</i>


## 2. Setup and Installation

### Prerequisites:

* Machine running on Mac OS with installed node.js and apache cordova. 

### Automatically (CLI / Plugman)

## 3. License

[The MIT License (MIT)](http://www.opensource.org/licenses/mit-license.html)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
