const database = require("./database");
const get = require("../../get");
const fs = require("fs");
const os = require("os");
const path = require("path");
const busboy = require("busboy");
const verify = require("./verify");

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

9/1/26

/api/csv/upload (POST)
/api/csv/remove/{id}

endpoint for uploading/deleting new csv files.
uploading over an existing file will error.

*/

module.exports = async function (request, response) {
  let filename; // the name of the requested csv file to construct

  let mypath = request.url;
  if (mypath.includes("?")) {
    mypath = request.url.substr(0, request.url.indexOf("?")); // ignore querystring
  }
  let urlBits = mypath.substring(1).split("/");
  if (urlBits[2] === "sessions") {
    console.log("[api/csv] returning vaild-file sessions");
    database.queryReadWrite(
      "SELECT DISTINCT launch_sessions.* FROM launch_sessions JOIN launches ON launch_sessions.session_id = launches.session_id WHERE launches.launch_data_filename IS NOT NULL;",
      response,
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
  } else if (urlBits[2] === "upload") {
    verify(request, response, () => {
      if (request.method === "POST") {
        console.log("[api/csv/upload] beginning to parse form");
        const bb = busboy({ headers: request.headers });
        let form = new Object(); // output object with form fields

        bb.on("file", (name, file, info) => {
          const { filename, encoding, mimeType } = info;

          form.data = "";
          file
            .on("data", (data) => {
              console.log(`File [${name}] got ${data.length} bytes`);
              form.data += data;
            })
            .on("close", () => {
              console.log(`File [${name}] done`);
            });
          form.filename = filename;
        });

        bb.on("field", (name, val, info) => {
          console.log("field!");
          form[name] = val;
        });

        bb.on("close", () => {
          console.log("[api/csv/upload] Done parsing form!");
          let saveToDir = path.join(
            path.dirname(require.main.filename),
            `/assets/rocket-flight-csvs/${form.session_id}/`,
          );
          fs.mkdir(saveToDir, { recursive: true }, () => 3); // make session-specific subdir if necessary
          fs.writeFile(saveToDir + form.filename, form.data, (err) => {
            if (err) {
              console.log(
                `[api/csv/upload] failed to write file '${form.filename}' \n (produced error "${err}")`,
              );
              response.writeHead(500);
              response.write(
                `failed to write file '${form.filename}' \n (produced error "${err}")`,
              );
              response.end();
            } else {
              // update database associating the launch with its new data file
              let dbstate = database.queryReadWrite(
                `UPDATE launches SET launch_data_filename = '${form.filename}' WHERE launch_id = ${form.launch_id};`,
              );

              if (Object.prototype.toString.call(dbstate) == 'Error') {
                console.log("[api/csv/upload] errored when entering filename into database!")
              }

              response.writeHead(200);
              response.write(`uploaded ${form.filename} successfully!`);
              response.end();
            }
          });
        });

        request.pipe(bb);
      } else {
        get.error405(response);
      }
    });
  } else {
    console.log(
      `[api/csv] error: did not recognize subpath /api/csv/${urlBits[2]}...`,
    );
    get.error404(path, response);
  }
};
