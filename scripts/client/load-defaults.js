// fix for jQuery not loading when page navigated to from history in browser
let perfEntries = performance.getEntriesByType("navigation");
if (perfEntries[0].type === "back_forward") {
  location.reload();
}

head = document.head; //document.getElementsByTagName('head')[0];

// load styling resources
head.innerHTML =
  head.innerHTML + `<link rel="icon" href="/images/site-logo.jpg" />\n`;
head.innerHTML =
  head.innerHTML +
  `<link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=space-grotesk@300,400,500,600,700,1&display=swap">\n`;
head.innerHTML =
  head.innerHTML + `<link rel="stylesheet" href="/styles/default.css">\n`;

if (typeof jQuery === "undefined") {
  var script = document.createElement("script");
  script.src = "https://code.jquery.com/jquery-latest.min.js";
  script.type = "text/javascript";
  document.getElementsByTagName("head")[0].appendChild(script);
}

// wrapper for dbFormat() to target object by id
function addEscapeChars(id) {
  let original = $("#" + id).val();
  let formatted = dbFormat(original);
  $("#" + id).val(formatted);
}

// escapes strings with quotes for SQL-like backend
// add single quotes for backend
function dbFormat(original) {
  let split = original.split("'");
  let formatted =
    split
      .slice(0, split.length - 1)
      .reduce((rest, first) => rest + first + "''", "'") +
    split[split.length - 1] +
    "'";
  return formatted;
}
