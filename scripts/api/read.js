const database = require("./database");
const get = require("../../get");

module.exports = async function (resource, response) {
  process.stdout.write("[api/read] ");
  if (resource.pattern === "all") {
    let column = resource.column ?? "*";
    console.log(
      `reading [all] from table: ${resource.table} column(s): ${column}`
    );
    let results = await database.query(`SELECT ${column} FROM ${resource.table}`, response);
    return results;
  } else if (resource.pattern === "match") {
    console.log(
      `reading [matched] value "${resource.matchValue}" in column ${resource.column} of table ${resource.table}`
    );
    let results = await database.query(
      `SELECT * FROM ${resource.table} WHERE ${resource.column} = ${resource.matchValue}`,
      response
    );
    return results;
  } else if (resource.pattern === "columns") {
    console.log(`reading [columns] from table: ${resource.table}`);
    let results = await database.query(
      `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = ${resource.table}`,
      response
    );
    return results;
  } else {
    get.error405(response);
  }
};
