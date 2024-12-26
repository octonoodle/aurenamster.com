const database = require("./database");
const get = require("../../get");

module.exports = function (resource, response) {
  process.stdout.write("[api/read] ");
  if (resource.pattern === "all") {
    let column = resource.column ?? "*";
    console.log(
      `reading [all] from table: ${resource.table} column(s): ${column}`
    );
    database.query(`SELECT ${column} FROM ${resource.table}`, response);
  } else if (resource.pattern === "match") {
    console.log(
      `reading [matched] value "${resource.matchValue}" in column ${resource.column} of table ${resource.table}`
    );
    database.query(
      `SELECT * FROM ${resource.table} WHERE ${resource.column} = '${resource.matchValue}'`,
      response
    );
  } else if (resource.pattern === "columns") {
    console.log(`reading [columns] from table: ${resource.table}`);
    database.query(
      `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '${resource.table}'`,
      response
    );
  } else {
    get.error405(response);
  }
};
