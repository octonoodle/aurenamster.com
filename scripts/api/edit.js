const get = require("../../get");
const database = require("./database");
const quersystring = require("querystring");
const redirect = require("./response-redirect");

/*
edit: /api/edit/table/column/value + form payload
target: row with column of table where column == value
returns: 301 redirect to response page
*/

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
      console.log(data);

      let updates = Object.entries(data).reduce((rest, entry) => {
        return rest + entry[0] + "=" + entry[1] + ",";
      }, "");
      updates = updates.substring(0, updates.length - 1);
      console.log(Object.entries(data));
      console.log(updates);

      database
        .query(`SELECT * FROM ${table} WHERE ${column}=${value};`)
        .then((results) => {
            results = JSON.parse(results); // convert to an object
          if (!results || results.length === 0) {
            console.log("[api/edit] entry not found, creating new row...");
            create(request, response);
          } else if (results.length >= 2) {
            console.log(
              "[api/edit] error: more than one row matched, aborting..."
            );
            console.log(results);
            get.error404(request.url, response);
          } else {
            // actually edit in database
            let constructedQuery = `UPDATE ${table} SET ${updates} WHERE ${column}=${value};`;
            process.stdout.write("[api/edit] ");
            console.log(constructedQuery);
            database.query(constructedQuery);
            redirect(table, column, value, response);
          }
        });
    });

  //   response.writeHead(200);
  //   response.end("edit endpoint");
  //   console.log("[api/edit] edit!");
};
