var textS = 40;
var consoleMargin = {x:100, y:100};
var f;
var lastTime = 0;
var cursorTime = 0;
var cursorPosition = {x: 0, y: 0};
var currentlyTyped = "";
var response = "";
var consoleColor;
var textBoxWidth;
var inputY;
var inputX;
var inputW;
var blockSpacing = 100;

var promptYear = 0;
var waitingForInput = true;
var sendingResponse = false;
var sendingResponseTime = 0;
var waitingResponseTime = 0;

var correctResponses = [
  "Correctamundo.",

  "You are 100% correct and also, might I say, quite easy on the eyes.",

  " You are right. Domo Arigato.",

  "That is correct.",

  "Yes! Yeeeeeesssss! YES!!!",

  "Ummmmm, yep that’s about right",

  "You know you! You smarty pants you!",

  "Get outta town, you are so right!",

  "Hahahahahaha, you are on point.",

  "Nailed it!",

  "Always knew you were the sharpest knife in the drawer.",
  "Pat yourself on the back, cause you are correct!",

  "Go ahead, give yourself a high five, cause you called it.",

  "Absolutely, you sly dog you.",

  "Precisely.",

  "I reckon so.",

  "Heavens to Betsy!"

];

var wrongResponses = [
  "That dog don’t hunt.",

  "You’ve got to be kidding me.",

  "Not in a million years.",

  "You’ve never been more incorrect in your whole life.",

  "Wrong, wrong, & WRONG!",

  "Nope, never.",

  "Never, say never, but like NEVER!",

  "LMAO, no.",

  "It’s ok, you tried, but no.",

  "Better luck next time, cause your wrong.",

  "The future is bleak if you are correct, luckily you’re not.",

  "Bless your heart.",

  "That doesn’t amount to a hill of beans.",

  "Incorrect."

];

var timeoutResponses = [
  "...human civilization will have migrated to Mars and Earth, while technically still habitable, has been overrun with obscenely large cockroaches."
];

var hypotheses;

function preload() {
  hypotheses = loadJSON("hypotheses.json");
  f = loadFont("clacon.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  //f = loadFont("Retro Computer_DEMO.ttf");
  textSize(textS);
  textFont(f);
  consoleColor  = color(0, 225, 0);
  promptYear = floor(random(2050, 5000));
  inputY = consoleMargin.y + blockSpacing;
  inputX = consoleMargin.x+250;
  inputW = width - 2*consoleMargin.x-inputX;
  responseX = inputX;
  responseY = inputY + blockSpacing;
  cursorPosition = {x: inputX, y: inputY - textS*.85};

  console.log(hypotheses.responses[0]);
}

function draw() {
  background(0);
  var labelX = consoleMargin.x;


  fill(consoleColor);
  text("COMPUTER: ", labelX, consoleMargin.y);
  text("In the year " + promptYear + "...", inputX, consoleMargin.y);



  text("USER: ", labelX, inputY);
  //fill(255, 0, 0);
  //rect(inputX, inputY, inputW, 100);
  fill(consoleColor);
  textBox(currentlyTyped, inputX, inputY, inputW);
  if (waitingForInput) {
    // inputX + textW, inputY - textS*.85
    blinkCursor();
    if (millis() - waitingResponseTime > 60000 && currentlyTyped.length > 0) {
      sendingResponse = true;
      waitingForInput = false;
      response = random(timeoutResponses);
      sendingResponseTime = millis();
    }
  }


  else if (sendingResponse) {
    fill(consoleColor);
    text("COMPUTER:", labelX, responseY);
    textBox(response, responseX, responseY, inputW);
    if (millis() - sendingResponseTime > getResponseDelay(response)) {
      resetPrompt();
    }
    else if (millis() - sendingResponseTime > 1000 && keyIsDown(RETURN)) {
      resetPrompt();
    }
  }
}

function textBox(words, x, y, w) {
  var lines = wordsToArray(words, w);
  var h = y;
  lines.forEach((line, index)  => {
    text(line, x, h);
    cursorPosition.y = h-textS*.67;
    cursorPosition.x = inputX + textWidth(line);
    h+=30;
  });
  responseY = h + blockSpacing;
}

function resetPrompt() {
  sendingResponse = false;
  waitingForInput = true;
  promptYear = floor(random(2050, 5000));
  currentlyTyped = "";
  cursorPosition = {x: inputX, y: inputY};
  waitingResponseTime = millis();
}

function blinkCursor() {
  var delayT = 1000;
  if (millis()%delayT < delayT/2) fill(consoleColor);
  else fill(0)
  rect(cursorPosition.x, cursorPosition.y, textWidth("A")*.7, textS*.7);
}

function getResponse() {
  if (currentlyTyped.length == 0) return "Enter a hypothesis. Try again...";
  var r = floor(random(3));
  if (r === 0) return random(correctResponses);
  else if (r === 1) return "Actually, in " + promptYear + " " + random(hypotheses.responses)
  else return random(wrongResponses);
}

function enteredInput() {
  waitingForInput = false;
  sendingResponse = true;
  response = getResponse();
  sendingResponseTime = millis();
}

function keyTyped() {
  waitingResponseTime = millis();
  if (keyCode == RETURN) {
    if(waitingForInput) enteredInput();
  }
  else if (keyCode == UP_ARROW || keyCode == DOWN_ARROW || keyCode == LEFT_ARROW || keyCode == RIGHT_ARROW) {}
  else {
    if(waitingForInput) {
      if (currentlyTyped.length < 200) {
        currentlyTyped += key;

      }
    }
  }
}

function keyPressed() {
  if (keyCode == BACKSPACE || keyCode == DELETE) {
    currentlyTyped = currentlyTyped.substring(0, currentlyTyped.length-1);
  }
}

function wordsToArray(words, textW) {
  var lineStr = "";
  var lines = [];
  while(words.length > 0) {
    var nextSpace = words.indexOf(" ");
    if (nextSpace == -1) {
      if (textWidth(lineStr + words) > textW) {
        lines.push(lineStr);
        lines.push(words);
      }
      else {
        lines.push(lineStr + words);
      }
      return lines;
    }
    else {
      if (textWidth(lineStr + words.substring(0, nextSpace+1)) > textW) {
        lines.push(lineStr);
        lineStr = words.substring(0, nextSpace+1);
      }
      else {
        lineStr += words.substring(0, nextSpace+1);
      }
      words = words.substring(nextSpace+1, words.length);
    }
  }
  lines.push(lineStr);
  return lines;
}

function getResponseDelay(words) {
  // 9 seconds for 16 words, 100 letters
  return words.length *90 + 1000;
}
