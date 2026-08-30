// sketch to graph flight data from rockets

let dataTable;

const GRAPH_WIDTH = 
Math.max(400, 
  Math.min(window.screen.width * 0.6, 
    window.innerWidth)); // fullscreen & mobile compensation
const GRAPH_HEIGHT = window.innerHeight * 0.5;
const AXES_PADDING = 70;

let BKGR_COLOR;
let seriesMaster = new Array(); // list of all the series

const AXIS = {
  Y: "y",
  X: "x",
};

// let heightZeroAGL; // zero point for raw altitude measurements
// let timeZero; // time since liftoff
let ALT_SCALE = 250; // highest printed number on y axis
let TIME_SCALE = 40; // highest printed number on y axis

// state variables
let seriesCt = 0; // number of series plotted (used for coloring the graphs)
let finishedGraphing = false; // flag to allow refresh on new launch ids added

function preload() {
  // dataTable = loadTable('/assets/data.csv', 'csv', 'header');
}

function setup() {
  BKGR_COLOR = color(240);

  createCanvas(GRAPH_WIDTH, GRAPH_HEIGHT);
}

function draw() {
    push();
  noStroke();
  fill(BKGR_COLOR);
  rect(
    AXES_PADDING + (2 / 3) * GRAPH_WIDTH,
    AXES_PADDING / 2,
    (1 / 4) * GRAPH_WIDTH,
    AXES_PADDING,
  );
  fill(255, 0, 255);
  textAlign(CENTER, CENTER);
  textSize(15);

  let valX = round(
    map(mouseX, AXES_PADDING, GRAPH_WIDTH - AXES_PADDING, 0, TIME_SCALE),
    1,
  );
  let valY = round(
    map(mouseY, GRAPH_HEIGHT - AXES_PADDING, AXES_PADDING, 0, ALT_SCALE),
  );
  text(
    `${valY} m, ${valX} s`,
    AXES_PADDING + (2 / 3 + 1 / 8) * GRAPH_WIDTH,
    AXES_PADDING,
  );
  pop();

  if (!finishedGraphing) {
    background(BKGR_COLOR);
    textFont("Courier New", 15);
    textStyle("bold");

    // global graph features
    drawAxes();
    textAlign(CENTER, CENTER);
    push();
    rotate(PI / 2);
    text("altitude (m)", GRAPH_HEIGHT / 2, -AXES_PADDING / 5);
    pop();
    text(
      "time since liftoff (s)",
      GRAPH_WIDTH / 2,
      GRAPH_HEIGHT - AXES_PADDING / 5,
    );

    // populateData(dataTable);

    drawTickMarks(10, AXIS.Y, ALT_SCALE);
    drawTickMarks(15, AXIS.X, TIME_SCALE);

    push();
    strokeWeight(5);
    stroke(220, 0, 0);
    graphMultipleSeries(displayedLaunchIDs, () => {
      /*
    1: 605g, 10 deg, 5 rod
    2: 615g, 0 deg, 5 rod
    3: 615g, 20 deg, 5 rod
    4: 628g, 0 deg, 0 rod
    5: 640g, 0 deg, 0 rod
    
    */
      // simulateGraph(605, 10, 5, 1.3, 8);
      // simulateGraph(615, 0, 5, 1.3, 8);
      // simulateGraph(615, 20, 5, 1.3, 8);
      // simulateGraph(628, 0, 10, 1.3, 8);
      // simulateGraph(640, 0, 10, 1.3, 8);
    });
    finishedGraphing = true;
    pop();
  }
}

// DATA PROCESSING

// populateData(): zero out data, populate global alts and times tables, otherwise prepare for graphing (SIDE EFFECTS: MODIFIES GLOBAL VARIABLES)
// returns object with alts array and times array
function populateData(table) {
  let altsArray = table.getColumn("altitude (m)");
  let timesArray = zipMap(
    (sec, ms) => {
      if (ms.length <= 3) {
        ms = clamp(round(ms) * 10, 0, 1000); // don't ask me why this works
      }

      return round(round(sec) + 0.001 * ms, 3);
    },
    table.getColumn("seconds"),
    table.getColumn("millisec"),
  );

  // altScale = roundNearest(max(alts) - heightZeroAGL, 50);
  // timeScale = roundNearest(times[times.length-1]-timeZero, 5);
  let finished = { alts: altsArray, times: timesArray };
  seriesMaster.push(finished);
  return finished;
}

// trim data points before and after actual flight
function trimData(table) {
  let rawAlts = table.getColumn("altitude (m)");
  let baselineAlt = rawAlts[9]; // might be bit noisy right at initial sample so effectively skip first 2 sec of samples
  let row = 0;
  // find first row at least 10 m above baseline
  while (rawAlts[row + 2] - 10 < baselineAlt) {
    table.removeRow(0);
    row++;
  }
  let firstRow = row;
  row += 10; // skip ~2 sec into flight
  while (rawAlts[row - 6] - 10 > baselineAlt) {
    row++;
  }
  // let finalRow = row;
  // row = finalRow - firstRow; // number of valid/useful rows
  // while(row < table.getRowCount()) {
  //   table.removeRow(row);
  // }
  return table;
}

function simulateGraph(weight, angle, wind, burn, smoke) {
  let steps = 10; // number of steps per sec

  let rod = 10; // rod angle
  let w = 0; //wind * angle / 80; // wind factor
  let p = 1010; // pressure (hPa) at launchpad
  let drag = 3; // coast drag
  let a_c = (weight * 9.8) / 3500 + drag * 3.2; // coast phase acceleration factor

  let burnOffset = 0; // sec

  let a_m = 55000 / weight; // motor acceleration factor
  let v = 0;
  let x = 0;
  stroke(128);
  //noStroke();

  for (i = 0; i < (burn + burnOffset) * steps; i++) {
    let last = x;
    x += v / steps - w;
    v += a_m / steps;
    let posn = scaleDataPoint(x, i / steps);
    let posnLast = scaleDataPoint(last, (i - 1) / steps);
    line(posn.x, posn.y, posnLast.x, posnLast.y);
  }

  for (i = (burn + burnOffset) * steps; i < smoke * steps; i++) {
    let last = x;
    x += v / steps - 0.83 * drag - 5.5 * w;
    v -= a_c / steps;
    let posn = scaleDataPoint(x, i / steps);
    let posnLast = scaleDataPoint(last, (i - 1) / steps);
    line(posn.x, posn.y, posnLast.x, posnLast.y);
  }
}

// GRAPHICS

function graphMultipleSeries(ids, callback) {
  if (ids.length == 1) {
    graphSeries(ids[0], () => {
      readyInteractive = true;
      typeof callback === "function" && callback();
    });
  } else if (ids.length > 1) {
    graphSeries(ids[0], graphMultipleSeries(ids.slice(1), callback));
  }
}

function graphSeries(id, callback) {
  loadTable("/api/csv/file/" + id, "csv", "header", (table) => {
    // trim table to usable section
    table = trimData(table);
    let data = populateData(table);
    let alts = data.alts;
    let times = data.times;

    push();
    strokeWeight(6);
    colorMode(HSL);
    let hue = 30 * seriesCt;
    stroke(hue, 100, 50);
    // indicate plot color in the key table
    $(`#plot-key-${id} div`)
    .css("background-color", `hsl(${hue}, 100%, 50%)`);

    // graph points
    for (let i = 0; i < alts.length; i++) {
      // graphDataPoint(i,i);
      let posn = scaleDataPoint(alts[i] - alts[0], times[i] - times[0]);
      point(posn.x, posn.y);
    }

    pop();

    //readyInteractive = true;
    // call callback function if it's there
    seriesCt++;
    typeof callback === "function" && callback();
  });
}

// put a data value at the appropriate point on the graph
function scaleDataPoint(alt, time) {
  // map from graphical coordinates to data coordinates
  return {
    x: map(time, 0, TIME_SCALE, AXES_PADDING, GRAPH_WIDTH - AXES_PADDING),
    y: map(alt, 0, ALT_SCALE, GRAPH_HEIGHT - AXES_PADDING, AXES_PADDING),
  };
}

// draw the basic axis lines
function drawAxes() {
  strokeWeight(3);
  // y axis
  line(AXES_PADDING, AXES_PADDING, AXES_PADDING, GRAPH_HEIGHT - AXES_PADDING);

  // x axis
  line(
    AXES_PADDING,
    GRAPH_HEIGHT - AXES_PADDING,
    GRAPH_WIDTH - AXES_PADDING,
    GRAPH_HEIGHT - AXES_PADDING,
  );
}

// draw even tick marks from zero to [max] on given axis
function drawTickMarks(number, axis, max) {
  if (axis == "y") {
    textAlign(RIGHT, CENTER);
  } else /*if (axis == 'x')*/ {
    textAlign(CENTER, TOP);
  }

  let tick = function (i) {
    let pos; // coordinate of the ith tick on axis of choice

    if (axis == "y") {
      pos =
        ((number - i) / number) * (GRAPH_HEIGHT - 2 * AXES_PADDING) +
        AXES_PADDING;

      line(AXES_PADDING - 10, pos, AXES_PADDING + 10, pos);
      text(round((i / number) * max), AXES_PADDING - 15, pos);
    } else if (axis == "x") {
      pos = (i / number) * (GRAPH_WIDTH - 2 * AXES_PADDING) + AXES_PADDING;

      line(
        pos,
        GRAPH_HEIGHT - AXES_PADDING - 10,
        pos,
        GRAPH_HEIGHT - AXES_PADDING + 10,
      );
      text(round((i / number) * max), pos, GRAPH_HEIGHT - AXES_PADDING + 15);
    } else {
      throw new Error(`unknown axis "${axis}"`);
    }
  };

  for (i = 0; i <= number; i++) {
    tick(i);
  }
}

// util functions
function zipMap(mapper, ...arrays) {
  const shortestLength = Math.min(...arrays.map((arr) => arr.length));
  return Array.from({ length: shortestLength }, (_, index) => {
    // Get the tuple for the current index
    const tuple = arrays.map((arr) => arr[index]);
    // Apply the mapper to the tuple (using spread to pass tuple elements as arguments)
    return mapper(...tuple);
  });
}

function roundNearest(val, base) {
  return base * (round(val / base) + 1);
}

function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num;
}
