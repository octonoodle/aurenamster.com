const Pool = require('pg').Pool;

const localQuerier = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'aurenamster.com',
    password: '',
    port: 5432,
});

const querier = new Pool({
    user: 'website',
    host: 'localhost',
    database: 'rocketry',
    password: '3n%x95#2k)s',
    port: 7775,
});

function query(query, response) {
    localQuerier.query(query, (error, results) => {
      if (error) {
        get.error404(query, response);
        return;
      }
      response.writeHead(200, { "Content-Type": "application/json" });
      response.write(JSON.stringify(results.rows));
      response.end();
    });
}

module.exports = {query};