// require jQuery
if (typeof jQuery === 'undefined') {
  var script = document.createElement('script');
  script.src = 'https://code.jquery.com/jquery-latest.min.js';
  script.type = 'text/javascript';
  document.getElementsByTagName('head')[0].appendChild(script);
}

let launches = 0;
let objectives = 0;
function addLaunchSection() {
  launches++;
  let thisLaunch = launches;
  $('#launch-list').append(`<row id=launch${thisLaunch}></row>`);
  $('#launch-list').append(`<br id=launchbr${thisLaunch}>`);
  $(`#launch${thisLaunch}`).load(
    '/pages/util/api-form.html .launch-row >',
    () => {
      $(`#launch${thisLaunch} .delete`).on('click', function () {
        $(`#launch${thisLaunch}`).remove();
        $(`#launchbr${thisLaunch}`).remove();
        launches--;
      });
      loadLaunchOptions(`#launch${thisLaunch}`);
    }
  );
}

function addObjectiveSection() {
  objectives++;
  let thisObjective = objectives;
  $('#objective-list').append(`<row id=objective${thisObjective}></row>`);
  $('#objective-list').append(`<br id=objectivebr${thisObjective}>`);
  $(`#objective${thisObjective}`).load(
    '/pages/util/api-form.html .objective-row >',
    () => {
      $(`#objective${thisObjective} .delete`).on('click', function () {
        $(`#objective${thisObjective}`).remove();
        $(`#objectivebr${thisObjective}`).remove();
        objectives--;
      });

      checkbox = $(`#objective${thisObjective} #success`);
      indicator = $(`#objective${thisObjective} #success_indicator`);
      indicator.html('failed ');
      checkbox.on('click', () => {
        if (checkbox.prop('checked')) {
          indicator.html('success ');
        } else {
          indicator.html('failed ');
        }
      });

      loadObjectiveOptions(`#objective${thisObjective}`);
    }
  );
}

function loadLaunchSiteOptions() {
    $.get('/api/all/launchsites', sites => {
        $('#launchsite').html('');
        for (site of sites) {
            $('#launchsite').append(genOption(site.name, site.name));
        }
    });
}

// selector: top-level selector for 'new launch' container (#launch<n>)
function loadLaunchOptions(selector) {
  $.get('/api/all/rockets', (rockets) => {
    $.get('/api/all/motors', (motors) => {
      $(selector + ' #rocket').html('');
      for (rocket of rockets) {
        let date = new Date(rocket.rocket_build_date_start);
        $(selector + ' #rocket').append(
          genOption(
            rocket.rocket_name,
            rocket.rocket_name +
              ' [' +
              (date.toDateString() ?? 'undated') +
              ']'
          )
        );
      }
      $(selector + ' #motor').html('');
      for (motor of motors) {
        $(selector + ' #motor').append(
          genOption(motor.motor_id, motor.motor_name)
        );
      }
    });
  });
}

// selector: top-level selector for 'new objective' container (#objective<n>)
function loadObjectiveOptions(selector) {
  $.get('/api/all/objectives', (protoObjectives) => {
    $(selector + ' #objective').html('');
    for (protoObjective of protoObjectives) {
      $(selector + ' #objective').append(
        genOption(
          protoObjective.objective_id,
          protoObjective.objective_description
        )
      );
    }
  });
}

// create new option
function genOption(value, name) {
  return '<option value="' + value + '">' + name + '</option>';
}
