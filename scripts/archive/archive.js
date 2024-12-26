if (typeof jQuery === "undefined") {
  var script = document.createElement("script");
  script.src = "https://code.jquery.com/jquery-latest.min.js";
  script.type = "text/javascript";
  document.getElementsByTagName("head")[0].appendChild(script);
}

$.get("/api/read/all/launch_sessions", function (sessions) {
  // check for superuser tools
  $.get("/amiloggedin", (loggedin) => {
    loggedin = loggedin === "true"; // convert string to bool
    sessions.sort((sesh1, sesh2) => {
      return Date.parse(sesh2.date) - Date.parse(sesh1.date);
    });
    for (const session of sessions) {
      let rowID = `session${session.session_id}`;
      // container elements
      $("#launches").append(`<tr id="${rowID}"></tr>`);
      $("#" + rowID).append('<td class="date"></td>');
      $("#" + rowID).append('<td class="synopsis"></td>');
      $("#" + rowID).append('<td class="rockets"><ul></ul></td>');
      $("#" + rowID).append('<td class="objectives"><ul></ul></td>');
      $("#" + rowID).append('<td class="link"></td>');

      // set values
      let date = new Date(session.date);
      $("#" + rowID + " .date").html(date.toDateString());
      $("#" + rowID + " .synopsis").html(session.synopsis);
      $("#" + rowID + " .link").html(
        `<a class="button-link" href="/rocketry/archive/view?id=${
          session.session_id
        }">${loggedin ? "edit" : "view"}</a>`
      );

      // load launches
      $.get(
        "/api/read/match/launches/session_id/" + session.session_id,
        (launches) => {
          if (launches.length == 0) {
            $("#" + rowID + " .rockets").html("n/a");
          } else {
            rockets = new Set(launches.map((launch) => launch.rocket));
            for (rocket of rockets) {
              $("#" + rowID + " .rockets ul").append("<li>" + rocket + "</li>");
            }
          }
        }
      );
      $.get(
        "/api/read/match/launch_objectives/session_id/" + session.session_id,
        function (objectives) {
          for (const objective of objectives) {
            let objectiveID = "objective" + objective.objective_id;
            $("#" + rowID + " .objectives ul").append(
              "<li id=" + objectiveID + "></li>"
            );
            $.get(
              "/api/read/match/objectives/objective_id/" +
                objective.objective_id,
              function (protoObjectives) {
                $("#" + rowID + " #" + objectiveID).append(
                  protoObjectives[0].description + ": "
                );
                if (objective.success) {
                  $("#" + rowID + " #" + objectiveID).append(
                    "<yay>success</yay>"
                  );
                } else {
                  $("#" + rowID + " #" + objectiveID).append(
                    "<boo>failed</boo>"
                  );
                }
              }
            );
          }
          if (objectives.length == 0) {
            $("#" + rowID).attr("class", "inconclusive");
          } else if (objectives.every((objective) => objective.success)) {
            $("#" + rowID).attr("class", "success");
          } else if (objectives.some((objective) => objective.success)) {
            $("#" + rowID).attr("class", "partial-success");
          } else {
            $("#" + rowID).attr("class", "failure");
          }
        }
      );
    }
    // extra superuser buttons
    if (loggedin) {
      $("#subtitle-area").append(
        '<a class="button-link" id="add-button" href="/rocketry/archive/edit/new-session">add session</a>'
      );
      $("#table-head").append('<th class="delete"></th>');
      $("#launches tr").each((i, row) => {
        if (i === 0) {
          return;
        }
        $(row).append(
          '<td class="delete"><a class="button-link" ' +
            "href=/rocketry/archive/delete?table=launch_sessions&column=session_id&value=" +
            $(row).attr("id").replace("session", "") +
            ">delete</a></td>"
        );
      });
    }
  });
});
