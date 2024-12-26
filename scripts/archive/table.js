if (typeof jQuery === "undefined") {
  var script = document.createElement("script");
  script.src = "https://code.jquery.com/jquery-latest.min.js";
  script.type = "text/javascript";
  document.getElementsByTagName("head")[0].appendChild(script);
}

// target document MUST have <table id="data-table"></table> element
function displayTable(tableName) {
    $('h1').html("table \""+tableName+"\" in rocketry database");
  $.get("/api/read/columns/" + tableName, (columns) => {
    for (column of columns) {
      let columnName = column.column_name;
      $("#data-table").append(
        "<tr id=" + columnName + "><th>" + columnName + "</th></tr>"
      );
      $.get("/api/read/all/" + tableName + "/" + columnName, (values) => {
        for (value of values) {
          $("#" + columnName).append("<td>" + value[columnName] + "</td>");
        }
      });
    }
  });
}
