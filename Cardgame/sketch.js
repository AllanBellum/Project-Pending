vWidth = 1366;
vHeight = 768;
x = 0;
spin = 0;

progressBar = [];
let myFont;
cardSize = 8 //number of elements on card
var cardStorage = new Array();
let currentCard; //card being read by program
let cardFace;
phase = 2;

let buttons = [];

let lines;


// This class will create a button that detects a mouse click and does a function
class Button {
    constructor(x, y, width, height, action) {
        this.x = (vWidth / 2) + x;
        this.y = (vHeight / 2) + y;
        this.width = width;
        this.height = height;
        this.action = action;
        append(buttons, this);
    }
    
    clicked(mouseX, mouseY) {
        if (mouseX >= this.x - (this.width / 2) && mouseX <= this.x + (this.width / 2) && 
            mouseY >= this.y - (this.height / 2) && mouseY <= this.y + (this.height / 2)) {
            this.action();
        }
    }
}


function preload(){  
  lines = loadStrings('templatedCards.txt');
  myFont = loadFont('Assets/Fonts/Papernotes.ttf');
  notecardImg = loadImage('Assets/Imgs/Notecard.png');
}


function setup() {  
  createCanvas(vWidth, vHeight, WEBGL);
  ortho();//Enables an orthographic view. This will keep everyting "flat" so that we don't see the top or bottom of shapes.

  background(220);
  addProgressBar();
  addCard();
  // GPA text should be at position x=-536 y=310
  // Money text is position x=-100 y=310
  // Mental Health is position x=383 y=310
//--------------------------------------------------------------------------------------------------------------------------------------------------------
//Loads cards into memory
  i = 0; //line
  k = 0; //card
  EOF = false;
  while (EOF == false){
    cardStorage.push([]);
    for (j = 0; j < cardSize; ++j) {
      cardStorage[k].push(lines[i]);
      if (lines[i] == "EOF"){
        EOF = true;
      }
      ++i //increment of line within for loop
    }
    ++k;
    if (lines[i] == "EOF"){ //this check shouldn't be necesary if the EOF is correctly placed in the text file
        EOF = true;
    }
    ++i; //increment of line to clear blankspace between cards
  }

  currentCard = 0;
  cardFace = "front"; 
    
    mousePressed();
}


function draw(){
  background(220);
  redrawCanvas();
  push();
    fill(100, 100, 100);
    strokeWeight(1);
    stroke(175, 194, 212);
    texture(notecardImg);

    if (spin <3 && cardFace != "front"){
    rotateY(spin);
    spin += .1;
    }

    if(cardFace == "front"){
      translate(x, -7, 0);
    }
    box(569, 344, 0);
    pop();
      if(x == 0){
        displayCardText();
        noLoop();
        spin = 0;
      }
      x+=25;
      
      if(x > 1000){
        x = -1000;
      }
}

function mousePressed() {
    
    // Button clicks
    for(i = 0; i < buttons.length; i++) {
        buttons[i].clicked(mouseX, mouseY);
    }
    loop();
}


// This is the center notecard
function addCard() {
    push();
    fill(100, 100, 100);
    strokeWeight(1);
    stroke(175, 194, 212);
    texture(notecardImg);
    translate(x, -7, 0);
    box(569, 344, 10);
    pop();

}


// This is the progress bar
function addProgressBar() {
  // Bar dimensions
  let w = 1000;
  let h = 39;
  let y = -338;
  
  //Sections
  let cardsPerYr = 16;
  let total = 16 * 4;
  
  for(let i = 0; i < total; i++) {
    push();
      fill(100, 100, 100);
    translate(-(w / 2) + ((w / total) * i), y, 0);
    append(progressBar, box(w / total, h, 10));
    pop();
  }
}

function getTextSize(width, height, minSize, txt) {
    txtSize = 1 * sqrt((width * height) / (txt.length + 50));
    
    if(txtSize > minSize) {
        txtSize = minSize
    }
    
    return txtSize;
}


function displayCardText(){
    push();
    textFont(myFont);
    fill(0,0,0);
    if (cardFace == "front"){
        textAlign(CENTER);
        textLeading(37);
        // Calculate text size to fit in area
        
        textSize(getTextSize(840, 170, 37, cardStorage[currentCard][1]));
        
        text(cardStorage[currentCard][1], -280, -147, 560, 170); // Dilema Text
        pop();
    
        push();
        fill(0,0,0);
        textFont(myFont);
        textAlign(CENTER);
        textLeading(30);
        // Calculate text size to fit in area
        textSize(getTextSize(550, 150, 30, cardStorage[currentCard][2]));

        text(cardStorage[currentCard][2], -275, 25, 260, 150); //Option 1
        pop();
   

        push();
        fill(0,0,0);
        textFont(myFont);
        textAlign(CENTER);
        textLeading(30);
        // Calculate text size to fit in area
        textSize(getTextSize(550, 150, 30, cardStorage[currentCard][2]));
        
        text(cardStorage[currentCard][3], 10, 25, 280, 150); //Option 2
        pop();
      
        new Button(-137, 75, 275, 150, function(){ cardFace = "back1"; redrawCanvas();});
        new Button(137, 75, 275, 150, function(){ cardFace = "back2"; redrawCanvas();});
    }
    if (cardFace == "back1"){
        textAlign(CENTER);
        textLeading(37);
        // Calculate text size to fit in area
        
        textSize(getTextSize(840, 170, 37, cardStorage[currentCard][1]));
        
        text(cardStorage[currentCard][4],  -280, -147, 560, 320); // Outcome 1
        pop();
        
        new Button(0, -7, 569, 344, function(){ cardFace = "front"; ++currentCard; redrawCanvas();});
        phase = 2;
    }
    if (cardFace == "back2"){
      moveCard();
        textAlign(CENTER);
        textLeading(37);
        // Calculate text size to fit in area
        
        textSize(getTextSize(840, 170, 37, cardStorage[currentCard][1]));
        
        text(cardStorage[currentCard][5], -280, -147, 560, 320); // Outcome 2
        pop();
        
        new Button(0, -7, 569, 344, function(){ cardFace = "front"; ++currentCard; redrawCanvas();});
        phase = 1;
    }
}


function redrawCanvas() {
    progressBar = [];
  addProgressBar();
    buttons = [];
}
