vWidth = 1366;
vHeight = 768;

progressBar = [];
let myFont;
cardSize = 8 //number of elements on card
var cardStorage = new Array();
let currentCard; //card being read by program
let cardFace;

let buttons = [];

let lines;

let gpa = 0;
let mHealth = 0;
let money = 0;

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
            print("Yes");
            this.action();
        }
    }
}


function preload(){  
  lines = loadStrings('templatedCards.txt');
  myFont = loadFont('Assets/Helvetica.otf');
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
  displayCardText();
}

function mousePressed() {
    
    // Button clicks
    for(i = 0; i < buttons.length; i++) {
        buttons[i].clicked(mouseX, mouseY);
    }

}


// This is the center notecard
function addCard() {
    push();
    fill(100, 100, 100);
    translate(0, -7, 0);
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

function getOutcomeVal(lineN){
    // Cards in text go gpa mHealth money 
    // For example 0 1 0
    let vals = cardStorage[currentCard][lineN].split(" ");
    gpa+=parseInt(vals[0]);
    mHealth+=parseInt(vals[1]);
    money+=parseInt(vals[2]);
    //document.write(gpa + " " + mHealth + " " + money);\
    //console.log(gpa + " " + mHealth + " " + money);
}

function displayCardText(){
  textFont(myFont);
  textSize(30);
    fill(0,0,0);
  if (cardFace == "front"){
    text(cardStorage[currentCard][1], -275, -175, 565, 170); // Dilema Text
    

      text(cardStorage[currentCard][2], -275, 0, 275, 150); //Option 1
   

    text(cardStorage[currentCard][3], 10, 0, 280, 150); //Option 2
      
      new Button(-137, 75, 275, 150, function(){ cardFace = "back1"; redrawCanvas();});
    new Button(137, 75, 275, 150, function(){ cardFace = "back2";redrawCanvas();});
  }
  if (cardFace == "back1"){
    text(cardStorage[currentCard][4], -275, -175, 565, 330); // Outcome 1
    
    fill(0,0,0);
    new Button(0, -7, 569, 344, function(){ cardFace = "front"; getOutcomeVal(6); ++currentCard; redrawCanvas();});
    

  }
  if (cardFace == "back2"){
    text(cardStorage[currentCard][5], -275, -175, 565, 330); // Outcome 2
    
    fill(0,0,0);
      new Button(0, -7, 569, 344, function(){ cardFace = "front"; getOutcomeVal(7); ++currentCard; redrawCanvas(); });
      
   }
}


function redrawCanvas() {
    background(220);
    progressBar = [];
  addProgressBar();
    buttons = [];
  addCard();
}