vWidth = 1366;
vHeight = 768;
xs = 0;
spin = 0;
textPos = -305;
lastBack = 0;
textSpin = 0;

let progressBar = [];
let myFont;
cardSize = 8 //number of elements on card
var cardStorage = new Array();
let currentCard; //card being read by program
let cardFace;

let buttons = [];

let lines;

let gpa = 2.0;
let mHealth = 100;
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

  //background(220);
  //addProgressBar();
  //displayStats();
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

    if (cardFace != "front" && textSpin < 3){
    rotateY(spin);
    spin += .1;
    }

    if(cardFace == "front"){
      translate(xs, 0, 0);
    }
    box(569, 344, 0);
    pop();

      if(xs == 0){
        displayButtons();
        noLoop();
      }
      xs+=25;
      textPos+=25;
        
        if(xs > 1000){
          xs = -1000;
          textPos = -1305;
          spin = 0;
        }
      push();
        fill(0,0,0);
        textFont(myFont);
        textAlign(CENTER);

        if(cardFace == "back1"){
          if(cardFace != "front" && textSpin < 3){
            rotateY(textSpin);
            textSpin += .1;
          }
          textSize(getTextSize(840, 170, 37, cardStorage[currentCard][1]));
          text(cardStorage[currentCard][4],  -280, -147, 560, 320); // Outcome 1
          lastBack = 1;
        }
        else if(cardFace == "back2"){
          if(cardFace != "front" && textSpin < 3){
            rotateY(textSpin);
            textSpin += .1;
          }
          textSize(getTextSize(840, 170, 37, cardStorage[currentCard][1]));
          text(cardStorage[currentCard][5], -280, -147, 560, 320); // Outcome 2
          lastBack = 2;
        }
        else{
          textSize(getTextSize(840, 170, 37, cardStorage[currentCard][1]));
          text(cardStorage[currentCard][1], textPos, -147, 560, 170); // Dilema Text

          textSize(getTextSize(550, 150, 30, cardStorage[currentCard][2]));
          text(cardStorage[currentCard][2], textPos+5, 25, 260, 150); //Option 1

          textSize(getTextSize(550, 150, 30, cardStorage[currentCard][2]));
          text(cardStorage[currentCard][3], textPos+290, 25, 280, 150); //Option 2
          textSpin = 0;
        }
      pop();
}

function mousePressed() {
    
    // Button clicks
    for(i = 0; i < buttons.length; i++) {
        buttons[i].clicked(mouseX, mouseY);
    }
    loop();
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

function displayStats(){
  push();
    textFont(myFont);
    textSize(30);
    fill(0, 0, 0);
    text("GPA: " + (gpa).toFixed(1),-536,310);
    text("Money: " + money,-100,310);
    text("Mental Health: "+ mHealth,383,310);
    pop();
    

}

function getOutcomeVal(lineN){
  // Cards in text go gpa money mHealth 
  // For example 0 1 0
  let vals = cardStorage[currentCard][lineN].split(" ");
  if(gpa+parseFloat(vals[0])>4.0){
    gpa=4.0;
  }
  else if(gpa+parseFloat(vals[0])<0.0){
    gpa=0.0;
  }
  else{
    gpa+=parseFloat(vals[0]);
  }

  money+=parseInt(vals[1]);

  if(mHealth+parseInt(vals[2])>100){
    mHealth=100;
  }
  else if(mHealth+parseInt(vals[2])<0){
    mHealth=0;
  }
  else{
    mHealth+=parseInt(vals[2]);
  }


  //document.write(gpa + " " + mHealth + " " + money);\
  console.log(gpa + " " + mHealth + " " + money);
}


function getTextSize(width, height, minSize, txt) {
    txtSize = 1 * sqrt((width * height) / (txt.length + 50));
    
    if(txtSize > minSize) {
        txtSize = minSize
    }
    
    return txtSize;
}

function displayButtons(){
  if(cardFace == "front"){
  new Button(-137, 75, 275, 150, function(){ cardFace = "back1"; getOutcomeVal(6); redrawCanvas(); });
  new Button(137, 75, 275, 150, function(){ cardFace = "back2"; getOutcomeVal(7); redrawCanvas(); });
  }
  else{
    new Button(0, -7, 569, 344, function(){nextCard(); cardFace = "front";  redrawCanvas();});
  }
}

function redrawCanvas() {
    //background(220);
    progressBar = [];
  addProgressBar();
    buttons = [];
  //addCard();
  displayStats();
}

function nextCard(){ // function to include code for selecting new card for any cases not specified it will move to the next sequential card
  let newCard;
  //example of what condition should look like for branching card, xxxx is cardID
  /*else if (cardStorage[currentCard][0] == "xxxx") {
      if (cardFace == "back1")                          //this conditional can be based on any variables including which decision was made on this card or the GPA, Wealth, or Mental Health. Multiple if else statements are also accesable if more than 2 branches is desired, could also include just a cardID assignment to jump cards uncondiationally
        newCard = "xxxx";
      else
        newCard = "xxxx";}
  */
  if (cardStorage[currentCard][0] == "0001"){ //branching example
    if (cardFace == "back1")
      newCard = "0002";
    else
      newCard = "0003";
  }

  else if (cardStorage[currentCard][0] == "0002"){ //unconditional jump example
     newCard = "0004";
  }


  else //default case
    ++currentCard;

  for(i = 0; i < cardStorage.length; ++i ){ //loop identifies which card has the selected ID
    if (cardStorage[i][0] == newCard)
      currentCard = i;
  }
}