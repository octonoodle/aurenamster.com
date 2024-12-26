const Pool = require("pg").Pool;
const get = require("../../get");

const localQuerier = new Pool({
  user: "postgres",
  host: "localhost",
  database: "aurenamster.com",
  password: "",
  port: 5432,
});

const querier = new Pool({
  user: "website",
  host: "localhost",
  database: "rocketry",
  password: "3n%x95#2k)s",
  port: 7775,
});

// wrapper for raw query function
// optional response parameter for quick raw json response
async function query(query, response) {
  try {
    let results = await localQuerier.query(query);
    if (response) {
      console.log('[database/json] serving json to response');
      response.writeHead(200, { "Content-Type": "application/json" });
      response.write(JSON.stringify(results.rows));
      response.end();
    } else {
      console.log('[database/json] returning raw json data');
      return JSON.stringify(results.rows);
    }
  } catch (error) {
    console.log('[database] invalid query: '+query);
    console.log('[database] produced error : "' + error + '"');
    if (response) {
      get.error404(query, response);
    }
  }
}

module.exports = { query };
