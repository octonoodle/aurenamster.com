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
  
  // synchronous jquery load
  let script = document.createElement("script");
  const request = new XMLHttpRequest();
  request.open("GET", "https://code.jquery.com/jquery-3.7.1.min.js", false);
  request.send(null);
  script.innerHTML = request.responseText;
  script.type = "text/javascript";
  document.getElementsByTagName("head")[0].appendChild(script);

  // let migrate = document.createElement("script");
  // const request2 = new XMLHttpRequest();
  // request2.open("GET", "https://code.jquery.com/jquery-migrate-3.5.2.js", false);
  // request2.send(null);
  // migrate.innerHTML = request2.responseText;
  // migrate.type = "text/javascript";
  // document.getElementsByTagName("head")[0].appendChild(migrate);
}

function defer(method) {
  if (window.jQuery) {
      method();
  } else {
      setTimeout(function() { defer(method) }, 50);
  }
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

// formats ugly ISO date from database into nice MDY format (ex. Dec 5, 2012)
function niceDate(dbDate) {
  if (dbDate) {
    date = new Date(dbDate);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(date);
  } else {
    return undefined;
  }
}
