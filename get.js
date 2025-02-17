const fs = require('fs');


// serve a file
function serveFile(file, response, contentType) {
    fs.readFile('.' + file, function(error, data) {
        if (error) {
            error404(file, response);
            return;
        } else {
            response.writeHead(200, {'Content-Type': contentType});
            response.write(data);
            console.log('[get] served ' + contentType + ' \'' + file + '\' successfully');
        }
        response.end();
    });
}

// serve json
function json(data, response) {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.write(data);
    response.end();
    console.log('[get/json] served json data successfully (no validation!)');
}

function html(file, response) {
    serveFile(file, response, 'text/html');
}

function js(file, response) {
    serveFile(file, response, 'text/javascript');
}

function css(file, response) {
    serveFile(file, response, 'text/css');
}

function img(file, extension, response) {
    serveFile(file, response, 'img/' + extension.substring(1));
}

function svg(file, response) {
    serveFile(file, response, 'image/svg+xml');
}


// errors

function error404(path, response) {
    response.writeHead(404, {'Content-Type': 'text/html'});
    fs.readFile('pages/util/404.html', (error, file404) => {
        if (error) {
            response.write("<h1>404</h1>");
            console.log("[get/404] failed to fetch 404 page");
        } else {
            response.write(file404);
            console.log('[get/404] 404 error on url ' + path);
        }
        response.end();
    });
}

function error415(extension, response) {
    response.writeHead(415, {'Content-Type': 'text/html'});
    response.write('<h1>415</h1>')
    response.write('<p>server error: cannot process .' + extension + ' file</p>');
    response.end();
    console.log('[get/415] refused to serve file with extension .' + extension)
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
    
    console.log('[get/503] ignored url ' + request.url + ' during server maintenance');
}

function error405(response) {
    response.writeHead(405);
    response.end();
}


// other helpful functions

function redirect(target, response) {
    response.writeHead(301, {'Content-Type': 'text/plain', location: target});
    response.end();
}
module.exports = {
    serveFile,
    html,
    img,
    js,
    css,
    svg,
    json,
    error415,
    error503,
    error404,
    error405,
    redirect
};