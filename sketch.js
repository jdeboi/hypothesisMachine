var textS = 30;
var consoleMargin = {x:100, y:100};
var f;
var lastTime = 0;
var cursorTime = 0;
var currentlyTyped = "";
var response = "";
var consoleColor;

var promptYear = 0;
var waitingForInput = true;
var sendingResponse = false;
var sendingResponseTime = 0;

var correctResponses = [
  "Correct. That is definitely going to happen",
  "Correctamundo."
]

var wrongResponses = [
  "Sorry. No. That is incorrect. Please try again.",
  "Nope. Wrong."
]

var timeoutResponses = [
  "...human civilization will have migrated to Mars and Earth, while technically still habitable, has been overrun with obscenely large cockroaches."
]



function setup() {
  createCanvas(windowWidth, windowHeight);
  f = loadFont("Retro Computer_DEMO.ttf");
  textSize(textS);
  textFont(f);
  consoleColor  = color(0, 225, 0);
  promptYear = floor(random(2050, 5000));
}

function draw() {
  background(0);
  var inputHeight = consoleMargin.y + 200;
  var inputMargin = consoleMargin.x+250;

  fill(consoleColor);

  text("COMPUTER:", consoleMargin.x, consoleMargin.y);
  text("In the year " + promptYear + "...", inputMargin, consoleMargin.y);
  var w = textWidth(currentlyTyped);

  text("User:", consoleMargin.x, inputHeight);
  text(currentlyTyped, inputMargin, inputHeight);
  if (waitingForInput) blinkCursor(inputMargin + w, inputHeight  - textS*.85);


  if (sendingResponse) {
    fill(consoleColor);
    text("COMPUTER:", consoleMargin.x, consoleMargin.y+300);
    text(response, inputMargin, consoleMargin.y+300);
    if (millis() - sendingResponseTime > 5000) {
      resetPrompt();
    }
  }


}

function resetPrompt() {
  sendingResponse = false;
  waitingForInput = true;
  promptYear = floor(random(2050, 5000));
  currentlyTyped = "";
}

function blinkCursor(x, y) {
  var delayT = 1000;
  if (millis()%delayT < delayT/2) fill(consoleColor);
  else fill(0)
  rect(x, y, 15, textS);
}

function getResponse() {
  if (floor(random(2)) == 0) return random(correctResponses);
  else return random(wrongResponses);
}

function enteredInput() {
  waitingForInput = false;
  sendingResponse = true;
  response = getResponse();
  sendingResponseTime = millis();
}

function keyTyped() {
  if (keyCode == RETURN) {
    if(waitingForInput) enteredInput();
  }
  else if (keyCode == BACKSPACE || keyCode == DELETE) {
    currentlyTyped = currentlyTyped.substring(0, currentlyTyped.length-1);
    console.log(currentlyTyped.substring(0, 3));
  }
  else {
    if (textWidth(currentlyTyped) < windowWidth + 2 * consoleMargin.x) currentlyTyped += key;
  }

}
