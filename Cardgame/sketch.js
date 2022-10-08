vWidth = 1366;
vHeight = 768;

progressBar = [];
let myFont;
cardSize = 8 //number of elements on card
var cardStorage = new Array();
let currentCard; //card being read by program
let cardFace;

let lines;
function preload(){  
  lines = loadStrings('Cards.txt');
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
}
function draw(){
  displayCardText();
  
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
    translate(-(w / 2) + ((w / total) * i), y, 0);
    append(progressBar, box(w / total, h, 10));
    pop();
  }
}

function displayCardText(){
  textFont(myFont);
  textSize(30)
  if (cardFace == "front"){
    text(cardStorage[currentCard][1], -275, -175, 565, 170); // Dilema Text
    fill(0,0,0);

    text(cardStorage[currentCard][2], -275, 0, 275, 150); //Option 1
   

    text(cardStorage[currentCard][3], 10, 0, 280, 150); //Option 2
  }
  if (cardFace == "back1"){
    text(cardStorage[currentCard][4], -275, -175, 565, 330); // Outcome 1
    fill(0,0,0);

  }
  if (cardFace == "back2"){
    text(cardStorage[currentCard][5], -275, -175, 565, 330); // Outcome 2
    fill(0,0,0);
   }
}