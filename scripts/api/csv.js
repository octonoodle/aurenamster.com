const database = require("./database");
const get = require('../../get');
const fs = require("fs");

/*
3/29/26
launch CSVs: 

/api/csv/{id}

pretty simple. the single argument to this endpoint, {id}, is a launch_id from the launches table.
as specified in csv-org.txt, this must correspond to a single csv file (which is the launch data
for that launch_id). returns a csv file.

*/

module.exports = async function(request, response) {
    let filename; // the name of the requested csv file to construct

    let path = request.url;
    if (path.includes('?')) {
        path = request.url.substr(0, request.url.indexOf('?')); // ignore querystring
    }
    let urlBits = path.substring(1).split("/");
    console.log(path);
    console.log(urlBits);
    let launch = await database.queryReadOnly(`SELECT * FROM launches WHERE launch_id = ${urlBits[2]};`);
    launch = launch[0]; // there is one launch
    console.log(launch);
    if (!launch.launch_data_filename) {
        get.error404(request.url, response);
        console.log("[api/csv] failed to retrieve data file information for launch");
        return;
    }
    filename = `/assets/rocket-flight-csvs/${launch.session_id}/${launch.launch_data_filename}`
    console.log(`[api/csv] requested file: ${filename}`);
    get.serveFile(filename, response, "text/plain");
}

