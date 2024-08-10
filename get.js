const fs = require('fs');


// serve a file
function serveFile(file, response, contentType) {
    fs.readFile('.' + file, function(error, data) {
        if (error) {
            error404(file, response);
        } else {
            response.writeHead(200, {'Content-Type': contentType});
            response.write(data);
            console.log('served ' + contentType + ' \'' + file + '\' successfully');
        }
        response.end();
    });
}

function html(file, response) {
    serveFile(file, response, 'text/html');
}

function js(file, response) {
    serveFile(file, response, 'text/javascript');
}

function img(file, extension, response) {
    serveFile(file, response, 'img/' + extension.substring(1));
}

// errors

function error404(path, response) {
    response.writeHead(404, {'Content-Type': 'text/html'});
    fs.readFile('pages/util/404.html', (error, file404) => {
        if (error) {
            response.write("<h1>404</h1>");
            console.log("failed to fetch 404 page");
        } else {
            // file404.getElementById('err-file').innerHTML = path;
            response.write(file404);
            console.log('404 error on url ' + path);
        }
        response.end();
    });
    
}

function error501(extension, response) {
    response.writeHead(501, {'Content-Type': 'text/html'});
    response.write('<h1>501</h1>')
    response.write('<p>server error: cannot process ' + extension + ' file</p>');
    response.end();
}

function error503(response) {
    response.writeHead(503, {'Content-Type': 'text/html'});
    fs.readFile('site-down.html', (error,data) => {
        if (error) {
            response.write('<h1>503: Server Down</h1>');
        } else {
            response.write(data);
        }
        response.end();
    });
    
    console.log('ignored url ' + request.url + ' during server maintenance');
}

module.exports = {
    serveFile,
    html,
    img,
    js,
    error501,
    error503,
    error404
};