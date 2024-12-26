const get = require('../../get');

module.exports = parse;

function parse(request, response, resource) {
  process.stdout.write("[api/parse] ");
  let urlBits = request.url.substring(1).split("/");
  let resourcePath = urlBits.slice(3);
  if (urlBits[2] === "all") {
    all(resourcePath, resource);
  } else if (urlBits[2] === "match") {
    match(resourcePath, resource);
  } else if (urlBits[2] === "columns") {
    columns(resourcePath, resource);
  } else {
    // called when specified selection method wasn't recognized
    get.error404(request.url, response);
    console.log('error, selection method "' + urlBits[2] + '" not recognized');
    resource.invalid = true;
  }
}

function all(args, resource) {
  if (args.length === 1) {
    // /table
    console.log(`type: all, table: ${args[0]}`);
  } else if (args.length === 2) {
    // /table/column
    console.log(`type: all, table: ${args[0]}, column: ${args[1]}`);
    resource.column = args[1];
  }
  resource.table = args[0];
  resource.pattern = "all";
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
  resource.pattern = "match";
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
  resource.pattern = "columns";
}
