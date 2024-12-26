const get = require('../../get');
const read = require('./read');
const edit = require('./edit');

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

/api/delete/rockets/rocket_name/Hèctor (delete row from rockets with rocket_name == Hèctor)
*/

module.exports = function(request, response) {
  let resource = {};
  parse(request, response, resource);
  if (resource.invalid ?? false) {
    return;
  } else {
    if (request.method === "GET") {
      read(resource, response);
    } else if (request.method === "POST") {
      edit(resource, response);
    } else {
      get.error405(response);
    }
  }
}

function parse(request, response, resource) {
  process.stdout.write('[api/parse] ');
  let urlBits = request.url.substring(1).split("/");
  let resourcePath = urlBits.slice(2);
  if (urlBits[0] !== "api") {
    // called when path didn't begin wtih '/api'
    get.error404(request.url, response);
    console.log("error, called api with non-api path");
  } else if (urlBits[1] === "all") {
    all(resourcePath, resource);
  } else if (urlBits[1] === "match") {
    match(resourcePath, resource);
  } else if (urlBits[1] === 'columns') {
    columns(resourcePath, resource);
  } else {
    // called when specified selection method wasn't recognized
    get.error404(request.url, response);
    console.log(
      'error, selection method "' + urlBits[2] + '" not recognized'
    );
    resource.invalid = true;
  }
}

function all(args, resource) {
  if (args.length === 1) {
    // /table
    console.log(`type: all, table: ${args[0]}`);
  } else if (args.length === 2) {
    // /table/column
    console.log(
      `type: all, table: ${args[0]}, column: ${args[1]}`
    );
    resource.column = args[1];
  }
  resource.table = args[0];
  resource.pattern = 'all';
}
// /api/match/table/column/value
// table column value
function match(args, resource) {
  if (args.length !== 3 || !args[0] || !args[1] || !args[2]) {
    get.error404("/api/match/" + args.join("/"), response);
    console.log("match: bad arguments " + args.join(", "));
    return;
  }
  args[2] = decodeURIComponent(args[2]); // decode spaces and stuff in match value
  console.log(
    `type: match, table: ${args[0]}, column: ${args[1]}, value: "${args[2]}"`
  );
  resource.table = args[0];
  resource.column = args[1];
  resource.matchValue = args[2];
  resource.pattern = 'match';
}

// /api/columns/table
// get names/types of columns in given table
function columns(args, resource) {
  if (!args[0]) {
    get.error404("/api/columns/" + args.join("/"), response);
    console.log("columns: bad arguments " + args.join(", "));
    return;
  }
  resource.table = args[0];
  resource.pattern = 'columns';
}