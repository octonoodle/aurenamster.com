const Pool = require("pg").Pool;
const get = require("../../get");
require("dotenv").config();

const localQuerier = new Pool({
  user: "postgres",
  host: "localhost",
  database: "aurenamster.com",
  password: "",
  port: 5432,
});

const remoteQuerier = new Pool({
  user: "website_write",
  host: "localhost",
  database: "rocketry",
  password: "",
  port: 7775,
});

const remoteQuerierReadOnly = new Pool({
  user: "website_read",
  host: "localhost",
  database: "rocketry",
  password: "",
  port: 7775,
});

// wrapper for raw query function
// optional response parameter for quick raw json response
async function queryRaw(query, response, querier, querierName) {
  console.log(`password is: ${process.env.PASSWORD}`)
  try {
    let results = await querier.query(query);
    if (response) {
      console.log(
        "[database/" + querierName + "/json] serving json to response",
      );
      get.json(JSON.stringify(results.rows), response);
    } else {
      console.log(
        "[database/" + querierName + "/json] returning raw json data",
      );
      return JSON.stringify(results.rows);
    }
  } catch (error) {
    console.log(
      "[database/" + querierName + "/errors] invalid query: " + query,
    );
    console.log(
      "[database/" + querierName + '/errors] produced error : "' + error + '"',
    );
    if (response) {
      get.error404(query, response);
    }
  }
}

async function queryReadWrite(query, response) {
  queryRaw(query, response, remoteQuerier, "write-read");
}

async function queryReadOnly(query, response) {
  queryRaw(query, response, remoteQuerierReadOnly, "read-only");
}

module.exports = { queryReadWrite, queryReadOnly };
