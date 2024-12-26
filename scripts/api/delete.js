const get = require("../../get");
const database = require("./database");
const quersystring = require("querystring");
const redirect = require("./response-redirect");

module.exports = function (request, response) {
  let payload = "";
  request
    .on("data", (data) => (payload += data.toString()))
    .on("end", () => {
      let urlBits = request.url.substring(1).split("/");
      let table = urlBits[2];
      let column = urlBits[3];
      let value = urlBits[4];
      let data = quersystring.parse(payload);

      // check for duplicate rows
      database
        .query(`SELECT * FROM ${table} WHERE ${column}=${value};`)
        .then((results) => {
          if (results) {
            results = JSON.parse(results); // convert to an object
          }
          if (!results || results.length === 0) {
            console.log("[api/delete] entry not found, aborting...");
            get.html("/pages/util/api-results/delete-no-change.html", response);
            return;
          } else if (results.length >= 2) {
            console.log(
              "[api/delete] error: more than one row matched, aborting..."
            );
            console.log(results);
            console.log(results.length);
            get.html(
              "/pages/util/api-results/delete-multiple-match.html",
              response
            );
          } else {
            // actually edit in database
            let constructedQuery = `DELETE FROM ${table} WHERE ${column}=${value} RETURNING *;`;
            process.stdout.write("[api/delete] ");
            console.log(constructedQuery);
            redirect(table, column, value, response);
            database.query(constructedQuery);
          }
        });
    });

  // response.writeHead(200);
  // response.end('delete endpoint');
  // console.log('[api/delete] delete!');
};
