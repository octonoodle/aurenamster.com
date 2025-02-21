const https = require('https');
const http = require('http');
const fs = require('fs');
const myserver = require('./httpserver');
const portHTTP = 48180;
const portHTTPS = 48180;

const useHTTPS = (process.argv[2] !== 'false');
console.log(process.argv);
if (useHTTPS) {
    const httpServer = http.createServer(function(request, response) {
	console.log('[http/redirect] redirected http request '+request.url);
	response.writeHead(301, {
	    location:'https://aurenamster.com'+request.url
	});
	response.end();
    });

    httpServer.listen(portHTTP, function(error) {
	if (error) {
            console.log('[http/redirect] something went wrong, got error' + error);
	} else {
            console.log('[http/redirect] server listening on port: ' + portHTTP);
	}
    });


    const server = https.createServer(
	{
	    key: fs.readFileSync('/etc/letsencrypt/live/aurenamster.com/privkey.pem'),
	    cert: fs.readFileSync('/etc/letsencrypt/live/aurenamster.com/fullchain.pem')
	},
	myserver.serverFunction
    );

    server.listen(portHTTPS, function(error) {
	if (error) {
            console.log('[https/main] something went wrong, got error' + error);
	} else {
            console.log('[https/main] server listening on port: ' + portHTTPS);
	}
    });
} else {
    const server = http.createServer(myserver.serverFunction);
    server.listen(portHTTP, function(error) {
        if (error) {
            console.log('[http/main] something went wrong, got error' + error);
        } else {
            console.log('[http/main] server listening on port: ' + portHTTP);
        }
    });
}
