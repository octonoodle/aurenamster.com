const database = require("./database");
const get = require("../../get");
const fs = require("fs");

/*
3/29/26
launch CSVs: 

/api/csv/file/{id}

pretty simple. the single argument to this endpoint, {id}, is a launch_id from the launches table.
as specified in csv-org.txt, this must correspond to a single csv file (which is the launch data
for that launch_id). returns a csv file.

8/22/26

/api/csv/sessions

returns all launch sessions with at least one corresponding launch record that
has a valid csv file. used to display a select menu in the data visualizer.

*/

module.exports = async function (request, response) {
  let filename; // the name of the requested csv file to construct

  let path = request.url;
  if (path.includes("?")) {
    path = request.url.substr(0, request.url.indexOf("?")); // ignore querystring
  }
  let urlBits = path.substring(1).split("/");
  if (urlBits[2] === "sessions") {
    console.log("[api/csv] returning vaild-file sessions");
    database.queryReadWrite(
      "SELECT DISTINCT launch_sessions.* FROM launch_sessions JOIN launches ON launch_sessions.session_id = launches.session_id WHERE launches.launch_data_filename IS NOT NULL;",
        response
    );
  } else if (urlBits[2] === "file") {
    let launch = await database.queryReadOnly(
      `SELECT * FROM launches WHERE launch_id = ${urlBits[3]};`,
    );
    launch = launch[0]; // there is one launch
    if (!launch.launch_data_filename) {
      get.error404(request.url, response);
      console.log(
        "[api/csv/file] failed to retrieve data file information for launch",
      );
      return;
    }
    filename = `/assets/rocket-flight-csvs/${launch.session_id}/${launch.launch_data_filename}`;
    console.log(`[api/csv/file] requested file: ${filename}`);
    get.serveFile(filename, response, "text/plain");
  } else {
    console.log(
      `[api/csv] error: did not recognize subpath /api/csv/${urlBits[2]}...`,
    );
    get.error404(path, response);
  }
};
