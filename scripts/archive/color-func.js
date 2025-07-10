let sech = function (x) {
  return 2.0 / (Math.pow(Math.E, x) + Math.pow(Math.E, -x));
};

let multiplier = 0.3;
let trim = .5;
let flatten = 1.5;
let offset = 0; // with a negative value, green 
// gets less dark than red by the edges (offset of sech() edge tapering)
let bump = 0.1; // middle yellow bump

let theMath = (x) => {
  return 255 * sech(Math.pow(Math.abs(x - 0.5) / trim, flatten));
};

let bumper = (x) => {
    return 1 + bump * sech((x - 0.5) / 0.1);
}

// return r g b values as a 3-tuple
// apply to a function expecting 3 args f(r, g, b) with spread operator f(...colorFunc(ratio))
var colorFunc = (ratio) => {
  return [
    theMath(ratio - offset) * Math.pow(ratio, multiplier) * bumper(ratio),
    theMath(1 - ratio + offset) * Math.pow(1 - ratio, multiplier) * bumper(ratio),
    0,
  ];
};
