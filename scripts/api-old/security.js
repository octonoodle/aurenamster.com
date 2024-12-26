const fs = require('fs');
const get = require('../../get');
const process = require('./router');
const parseCookie = require('../cookies');

function verifyContinue(request, response, verifiedAction) {
    let password = parseCookie(request).password;
    console.log(password);
    if (password !== fs.readFileSync('./scripts/pg-api/api.txt').toString()) { // validate password
        get.html('/pages/api/auth-failed.html', response);
    } else {
        verifiedAction(password);
    }
}

function fulfil(request, response) {
    if (request.method === 'GET') {
        process(request, response);
    } else if (request.method === 'POST') {
        verifyContinue(request, response, function() {
            process(request, response);
        });
    } else {
        get.error405(response);
    }
}

module.exports = fulfil;