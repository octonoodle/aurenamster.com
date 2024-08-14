const get = require('./get');
const catPics = require('./images/site-down-cats/get-sad-cat');

const http = require('http');
const fs = require('fs');
const port = 80;
const down = false;

const imgExtensions = ['.png','.jpg','.jpeg'];

const server = http.createServer(function(request, response) {
    // response.write('hello i am serber');
    // response.end();
    
    console.log('url: ' + request.url);

    let i = request.url.lastIndexOf('.');
    if (i > -1) { // file directly requested
        let extension = request.url.substring(i);

        console.log('serving file type: ' + extension);

        if (down) get.error503(response);

        // serve simple html
        if (extension === '.html') {
            get.html(request.url, response);
        } else if (imgExtensions.includes(extension)) {
            get.img(request.url, extension, response);
        } else if (extension === '.js') {
            get.js(request.url, response);
        }
        
        else {
            get.error501(extension, response);
        }
    } else { // using extensionless name
        console.log('(exensionless page)');

        // special cases 
        if (request.url === '/404cat') {
            cat = catPics.getCat();
            response.writeHead(200, {'Content-Type':'text/plain'});
            response.write(cat);
            response.end();
            return;
        }

        fs.readFile('pages/sources.json', (error, data) => {
            if (error) {
                console.log('no such file pages/sources.json');
                throw new Error('404 on ' + request.url);
            } else {
                let json = JSON.parse(data);
                let sourceKey = Object.keys(json).find(str => str === request.url);
                let page = json[sourceKey];
                if (page) {
                    get.html(page, response)
                } else {
                    get.error404(page, response);
                }
            }
        })
    }
});

server.listen(port, function(error) {
    if (error) {
        console.log('something went wrong, got error' + error);
    } else {
        console.log('server listening on port: ' + port);
    }
});