const get = require("../../get");
const read = require("./read");

module.exports = function respond(table, column, value, response) {
  switch (table) {
    case "launch_objectives":
      read({
        table: table,
        column: column,
        matchValue: value,
        pattern: "match",
      }).then((results) => {
        if (results && JSON.parse(results)[0]) {
          results = JSON.parse(results);
          get.redirect(
            "/rocketry/archive/edit/objectives?id=" + results[0].session_id,
            response
          );
        } else {
          get.redirect("/rocketry/archive", response);
        }
      });
      break;
    case "launches":
      read({
        table: table,
        column: column,
        matchValue: value,
        pattern: "match",
      }).then((results) => {
        if (results && JSON.parse(results)[0]) {
          results = JSON.parse(results);
          get.redirect(
            "/rocketry/archive/edit/launches?id=" + results[0].session_id,
            response
          );
        } else {
          get.redirect("/rocketry/archive", response);
        }
      });
      break;
    default:
      get.redirect("/rocketry/archive", response);
  }
};
