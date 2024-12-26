get = require('../../get');

module.exports = function(resource, request, response) {
    let payload;
    request.on('data', data=>payload = data.toString()).on('end', () => {
        if (payload.operation === 'create') {
            create(resource, payload, response);
        } else if (payload.operation === 'update') {
            update(resource, payload, response);
        } else if (payload.operation === 'remove') {
            remove(resource, payload, response);
        } else {
            get.error405(response);
        }
    });
}

function create(resource, payload, response) {
    process.stdout.write('[api/create] MODIFYING ');
    headPat(response);
}

function update(resource, payload, response) {
    process.stdout.write('[api/update] MODIFYING ');
    headPat(response);
}

function remove(resource, response) {
    process.stdout.write('[api/remove] MODIFYING ');
    headPat(response);
}

function headPat(response) {
    response.writeHead(204);
    response.end('modified database');
}