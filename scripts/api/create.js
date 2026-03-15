const database = require("./database");
const quersystring = require("querystring");
const redirect = require("./response-redirect");
const get = require('../../get');

/*
create: /api/create/table + form payload
table: table to add row to
returns: 301 redirect to response page
*/

module.exports = function (request, response) {
  let payload = "";
  request
    .on("data", (data) => (payload += data.toString()))
    .on("end", () => {
      let urlBits = request.url.substring(1).split("/");
      let table = urlBits[2];
      let data = quersystring.parse(payload);
      console.log(data);
      
      let keys = Object.keys(data).reduce((rest, key) => (key + ',' + rest), '');
      keys = keys.substring(0,keys.length-1);
      let values = Object.values(data).reduce((rest, value) => (`${value},${rest}`),'');
      values = values.substring(0,values.length-1);
      console.log(Object.values(data));
        
      let constructedQuery = `INSERT INTO ${table} (${keys}) VALUES (${values});`;
      process.stdout.write('[api/create] ');
      console.log(constructedQuery);
      database.query(constructedQuery);
      if (data.session_id) {
        redirect(table, 'session_id', data.session_id, response);
      } else {
        get.redirect('/rocketry/archive', response);
        console.log('[api/create] object had no session_id, redirected to archive home');
      }
    });

//   response.writeHead(200);
//   response.end("create endpoint");
//   console.log("[api/create] create!");
};
