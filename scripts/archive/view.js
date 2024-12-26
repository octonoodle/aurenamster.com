function loadAll() {
  if (typeof jQuery === "undefined") {
    var script = document.createElement("script");
    script.src = "https://code.jquery.com/jquery-latest.min.js";
    script.type = "text/javascript";
    document.getElementsByTagName("head")[0].appendChild(script);
  }

  // parse session id
  let params = new URLSearchParams(location.search);
  let sessionID = params.get("id");
  $.get("/amiloggedin", (loggedin) => {
    loggedin = loggedin === "true"; // convert string to bool
    $.get(
      "/api/read/match/launch_sessions/session_id/" + sessionID,
      (sessions) => {
        // error checking
        if (sessions.length === 0) {
          $("body").html('<div id="menu"></div>');
          $("#menu").append("<h1>error, no matching session found</h1>");
        } else if (sessions.length > 1) {
          $("body").html("");
          $("body").append(
            "<h2>error, multiple sessions found matching id " +
              sessionID +
              "</h2>"
          );
          $("body").append("<ul></ul>");
          for (session of sessions) {
            $("ul").append("<li>" + session.date + "</li>");
          }
          $("head").append("<style>ul {text-align:left;}</style>");
        } else {
          // fill in data
          let session = sessions[0];
          let date = new Date(session.date);
          $("#menu").append("<h1>Launch on " + date.toDateString() + "</h1>");
          $(".description p").html(session.description);
          loadObjectiveList(sessionID);
          loadLaunches(sessionID);
          loadThumbnail(session.thumbnail_image_id);
          if (loggedin) {
            loadSuperuserUI(sessionID);
          }
        }
      }
    );
  });
}

function loadObjectiveList(sessionID, callback) {
  $.get(
    "/api/read/match/launch_objectives/session_id/" + sessionID,
    (objectives) => {
      if (objectives.length == 0) {
        $("#objectives").html("<br>no objectives found");
      } else {
        $("#objectives").html("");
        for (const objective of objectives) {
          let objectiveID = "objective" + objective.objective_id;
          $("#objectives").append("<li id=" + objectiveID + "></li>");
          $.get(
            "/api/read/match/objectives/objective_id/" + objective.objective_id,
            function (protoObjectives) {
              if (objective.success) {
                $("#" + objectiveID).prepend("<yay>success</yay>");
              } else {
                $("#" + objectiveID).prepend("<boo>failed</boo>");
              }
              $("#" + objectiveID).prepend(
                protoObjectives[0].description + ": "
              );
            }
          );
        }
        // for objective editing page
        if (callback) callback();
      }
    }
  );
}

function loadLaunches(sessionID, callback) {
  // launches
  $.get("/api/read/match/launches/session_id/" + sessionID, (launches) => {
    if (launches.length == 0) {
      $("#launches").html("<br>no launches found");
    } else {
      launches.sort(
        (launch1, launch2) =>
          launch1.time.replace(/:/g, "") - launch2.time.replace(/:/g, "")
      );
      for (let i = 0; i < launches.length; i++) {
        let motorID = launches[i].motor_id;
        let launchID = launches[i].launch_id;
        $("#launches").append("<tr id=launch" + launchID + "></tr>");
        $("#launch" + launchID).append(
          "<td>" + launches[i].time.substring(0, 5) + "</td>"
        );
        $("#launch" + launchID).append("<td>" + launches[i].rocket + "</td>");
        $("#launch" + launchID).append(
          '<td id="launch' + launchID + '-motor"></td>'
        );
        $("#launch" + launchID).append(
          "<td>" + (launches[i].altitude_m ?? "n/a") + "</td>"
        );
        $.get("/api/read/match/motors/motor_id/" + motorID, (motors) => {
          let motor = motors[0];
          $("#launch" + launchID + "-motor").html(motor.motor_name);
        });
      }
    }
    // for launch editing page
    if (callback) callback();
  });
}

function loadThumbnail(imageID) {
  $.get("/api/read/match/images/image_id/" + imageID, (images) => {
    if (!images[0]) {
      return;
    }
    $("#thumbnail").attr(
      "src",
      "/images/rocketry/" + images[0].image_id + "." + images[0].image_extension
    );
  });
}

function loadSuperuserUI(sessionID) {
  // superuser extras
  $(".description").append(
    '<a class="button-link edit-button" href="./edit/session?id=' +
      sessionID +
      '">edit session info</a>'
  );
  $(".objectives").append(
    '<a class="button-link edit-button" href="./edit/objectives?id=' +
      sessionID +
      '">edit objectives</a>'
  );
  $(".launches").append(
    '<a class="button-link edit-button" href="./edit/launches?id=' +
      sessionID +
      '">edit launches</a>'
  );
  $("style").append(".edit-button {margin:0.5em;}");
}
