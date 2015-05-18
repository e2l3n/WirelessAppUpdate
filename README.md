# WirelessAppUpdate
by [Toma Popov] (https://github.com/e2l3n/WirelessAppUpdate)

## Index

1. [Description](#1-description)
2. [Setup and Installation](#2-setup and installation)
3. [Known Issues](#3-issues)
4. [License](#4-license)

## 1. Description
A client-server architecture that allows control over iOS hybrid mobile apps using the [Communicator](https://github.com/agnat/node_mdns) plugin.

###Server side
The server is an Express app written in node.js and javascript. It exposes REST API and provides a simple UI built with jade framework. 
- Upon start the server begins browsing all advertised services within the particular LAN by using the [mdns](https://github.com/agnat/node_mdns) service discovery framework.  
All available services are filtered by using a predefined service name prefix (<i>wau</i>). 
- After successfully establishing a web socket connection, the server is able to send and receive commands. <i>Acknowledgement</i> is currently not implmented.
- The server manages connections by storing in-memmory socket references associated to client IP addresses and ports.

<br>The REST API has the following routes:
* /clients/discoverd - get all discovered clients.</i>
* /isconnected/ip/:ip/port/:port - check for established connection.</i>
* /connect/ip/:ip/port/:port - connect to a client.</i>
* /disconnect/ip/:ip/port/:port - disconnect from client.</i>
* /update/ip/:ip/port/:port - update the index.html page of the mobile app with the posted content.</i>
* /refresh/ip/:ip/port/:port - refresh the web view in order to see the updated content.</i>


###Client side
Hybrid apps are expected to use the [Communicator](https://github.com/e2l3n/Communicator) plugin.
- The client UI allows users to manipulate connections and send commands over to connected hybrid mobile apps. 
- The input area’s purpose is to allow users to send HTML data over to connected .
- By clicking the ‘Update’ button, the input is being sent to the connected hybrid app, the app is expected to store locally the data.
- By clicking the ‘Refresh’ button, a refresh command is sent to the other side. Hybrid apps using the <i>Communicator</i> Apache Cordova plugin refresh the current web view on screen.

## 2. Setup and Installation

### Prerequisites:

* Machine running on Mac OS or Linux with installed node.js. 

### Usage:

<p>To run the server open ‘Terminal’ application and go to the root project directory. Execute the following command:</p>

<pre><code>npm start</code></pre>

<p>If server is to be started under Linux environment, before executing the aforementioned command execute the following:</p>

<pre><code>npm install mdns</code></pre>


## 3. Known Issues

- Connections are established only for IP v.4 addresses.

## 4. License

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
