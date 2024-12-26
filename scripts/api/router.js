const get = require("../../get");
const read = require("./read");
const create = require("./create");
const edit = require("./edit");
const deleter = require("./delete");
const parse = require("./parse");
const fs = require("fs");
const parseCookie = require("../cookies");

/*
resource indication format
/api/type/table/params...?&

api: required prefix
type: all, match, bool, etc.
table: table in rocketry database
params: parameters to the type of selection

*/

/*
new format: 
/api/action/select-type/table/params...?&
action: read, create, edit, delete
returns:
read -> matched results [json]
create/edit/delete -> 301 redirect to response page (success/failure)

errors:
- 404 not found
- 403 forbidden (failed authentication)

examples:
/api/read/all/rockets (get all data from table rockets)

/api/create/rockets [+ POST fields payload] (create new row in table rockets)

/api/edit/rockets/rocket_id/3 [+ POST fields payload] 
(update fields of row in rockets with rocket_id == 3)

/api/delete/rockets/rocket_name/'Hèctor' (delete row from rockets with rocket_name == Hèctor)

note: endpoints that require value inputs like /read/match should be given SQL literal inputs,
i.e. string should be formatted as 'string', number as 1234, composite as (12, 'abc'), etc.

for security purposes (anti-injection), ALL FIELDS between backslashes, 
e.g. abcdefg in /api/abcdefg/hijklmn/1234567,
are limited to 20 characters. all api requests with any field longer than 20 chars will be rejected with 40
*/

module.exports = route;

function route(request, response) {
  process.stdout.write("[api/router] ");
  let urlBits = request.url.substring(1).split("/");
  if (urlBits[0] !== "api") {
    // called when path didn't begin wtih '/api'
    get.error404(request.url, response);
    console.log("error, called api with non-api path");
  } else if (urlBits[1] === "read") {
    console.log("switching to path [read]");
    let resource = {};
    parse(request, response, resource);
    if (resource.invalid ?? false) {
      return;
    } else {
      read(resource, response);
    }
  } else if (urlBits[1] === "create") {
    console.log("switching to path [create]");
    verifyContinue(request, response, () => {
      create(request, response);
    })
  } else if (urlBits[1] === "edit") {
    console.log("switching to path [edit]");
    verifyContinue(request, response, () => {
      edit(request, response);
    })
  } else if (urlBits[1] === "delete") {
    console.log("switching to path [delete]");
    verifyContinue(request, response, () => {
      deleter(request, response);
    })
  } else {
    console.log(`non-recognized operation ${urlBits[1]}`);
    get.error404(request.url, response);
  }
}

function verifyContinue(request, response, verifiedAction) {
  let password = parseCookie(request).password;
  if (password !== fs.readFileSync("./scripts/api/api.txt").toString()) {
    // validate password
    console.log("[api/auth] password authentication failed, aborting...");
    get.html("/pages/util/api-results/auth-failed.html", response);
  } else {
    console.log("[api/auth] password authentication success");
    verifiedAction(password);
  }
}
