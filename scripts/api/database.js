const Pool = require("pg").Pool;
const get = require("../../get");
require('dotenv').config();

const localQuerier = new Pool({
  user: "postgres",
  host: "localhost",
  database: "aurenamster.com",
  password: "",
  port: 5432,
});

const querierReadOnly = new Pool({
  user: "website_read",
  host: "/var/run/postgresql",
  database: "rocketry",
  port: 7775,
});

const querierReadWrite = new Pool({
  user: "website_write",
  host: "/var/run/postgresql",
  database: "rocketry",
  //password: process.env.PASSWORD,
  port: 7775,
});

// wrapper for raw query function
// optional response parameter for quick raw json response
async function queryRaw(query, response, queryType) {
   let theQuerier;
  switch (queryType) {
    case "read-only":
      theQuerier = querierReadOnly;
      break;
    case "read-write":
      theQuerier = querierReadWrite;
      break;
    case "local":
      theQuerier = localQuerier;
      break;
    default:
      throw new Error(`[database]: choose a query type! (given: '${queryType}'`);
  }

  try {
    let results = await theQuerier.query(query);
    if (response) {
      console.log(`[database/${queryType}/json] serving json to response`);
      get.json(JSON.stringify(results.rows), response);
    } else {
      console.log(`[database/${queryType}/json] returning raw json data`);
      return JSON.stringify(results.rows);
    }
  } catch (error) {
    console.log(`[database/${queryType}] invalid query: ${query}`);
    console.log(`[database/${queryType}] produced error: "${error}"`);
    if (response) {
      get.error404(query, response);
    }
  }
}

function queryReadOnly(query, response) {
  return queryRaw(query, response, "read-only");
}
function queryReadWrite(query, response) {
  return queryRaw(query, response, "read-write");
}

module.exports = { queryReadOnly, queryReadWrite };
