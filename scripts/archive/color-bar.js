// let canvasWidth = $(document).width() - 20;
let CANVAS_WIDTH = 400;
let CANVAS_HEIGHT = 200;

function setup() {
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    noStroke();
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(25);
    textFont("Space Grotesk");
    strokeWeight(6);
    // stroke(255, 165, 0)
}

function draw() {
    // background(220, 0, 189);
    drawScale();
    push();
    textStyle(ITALIC);
    textAlign(CENTER, TOP);
    textSize(20);
    fill(255);
    rotate(-HALF_PI);
    text("great success",-CANVAS_HEIGHT/2,10);
    textAlign(CENTER, BOTTOM);
    text("abject failure",-CANVAS_HEIGHT/2,CANVAS_WIDTH-10);
    pop();
    
    if (mouseX > 0 && mouseY > 0 && mouseX < CANVAS_WIDTH && mouseY < CANVAS_HEIGHT) {
        drawBar();
    } else {
        drawPreview();
    }
}

function drawScale() {
    noStroke();
    for (let i = 0; i < CANVAS_WIDTH; i++) {
        let ratio = i / CANVAS_WIDTH;
        fill(...colorFunc(ratio)); // assume archive.js already loaded
        rect(i,0,1,CANVAS_HEIGHT);
    }
}

function drawBar() {
    let bodyStyles = window.getComputedStyle(document.body);
    let dominant = bodyStyles.getPropertyValue('--dominant');
    noStroke();
    fill(dominant);
    text(round(100 * (1 - mouseX / CANVAS_WIDTH)) + "%", mouseX, CANVAS_HEIGHT / 2);
    stroke(dominant);
    line(mouseX,0,mouseX,CANVAS_HEIGHT/2 - 20);
    line(mouseX,CANVAS_HEIGHT/2 + 20,mouseX,CANVAS_HEIGHT);
}

function drawPreview() {
    let bodyStyles = window.getComputedStyle(document.body);
    let dominant = bodyStyles.getPropertyValue('--dominant');
    fill(dominant);
    text("hover...",CANVAS_WIDTH/2,CANVAS_HEIGHT/2);
}