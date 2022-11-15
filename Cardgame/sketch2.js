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


class Text { //I don't think the member functions of this class are getting called. They might not be real.
  constructor(currentCard,cardStorage,cardFace){
    this.x = -280;
    this.y = -147;
    this.stoutness = 560;
    this.width = 840;
    this.height = 170;
    this.minSize = 37;

    // Not sure if I need to do these one. If not, they can be gotten rid of with ease.
    this.currentCard = currentCard;
    this.cardStorage = cardStorage;
    this.cardFace = cardFace
  } 


  //I tried to split DisplayText into 3 functions.
  //It basically did three things that needed to be done in different places.
  //Still not sure why they aren't getting called.
  cardButtons(){ //For displaying the buttons
    if(this.cardFace == "front"){
      new Button(-137, 75, 275, 150, function(){ this.cardFace = "back1"; redrawCanvas();}); //Not sure if redrawCanvas() is being called.
      new Button(137, 75, 275, 150, function(){ this.cardFace = "back2"; redrawCanvas();});  //It might be out of range. But I'm not sure.
                                                                                             //I'm really tired when writing this.
    }
    else{
      new Button(0, -7, 569, 344, function(){ this.cardFace = "front"; ++this.currentCard; redrawCanvas();}); //Also the buttons are getting made.
    }
  }

  //I moved getTextSize into the class since it only really interacts with the text.
  getTextSize(width, height, minSize, txt) {
    txtSize = 1 * sqrt((width * height) / (txt.length + 50));
    
    if(txtSize > minSize) {
        txtSize = minSize
    }
    
    return txtSize;
  }
  

  //I got rid of the push() and pop() functions,they seemed to make things disappear.
  //This might be incorrect. Also textFont and textAlign could probably be put somewhere else.
  //Hopefully in draw() since we'd only have to have them once if they're in there.
  dispFront(){ // This is for displaying the text that'll be on the front of the card.
    textFont(myFont);
    textAlign(CENTER);
    textLeading(37);
    fill(0,0,0);
    textSize(getTextSize(this.width, this.height, this.minSize, this.cardStorage[this.currentCard][1]));
    text(this.cardStorage[this.currentCard][1], this.x, this.y, this.stoutness, this.height);
    //Dilema

    textFont(myFont);
    textAlign(CENTER);
    textLeading(30);
    fill(0,0,0);
    textSize(getTextSize(this.width-290, this.height-20, this.minSize-7, this.cardStorage[this.currentCard][2]));
    text(this.cardStorage[this.currentCard][2], this.x+5, this.y+178, this.stoutness-300, this.height-20);
    //Option 1

    textFont(myFont);
    textAlign(CENTER);
    textLeading(30);
    fill(0,0,0);
    textSize(getTextSize(this.width-290, this.height-20, this.minSize-7, this.cardStorage[this.currentCard][2]));
    text(this.cardStorage[this.currentCard][3], this.x+290, this.y+172, this.stoutness-280, 150);
    //Option 2
  }

  dispBack(){ 
    if(cardFace == "back1"){
      textFont(myFont);
      textAlign(CENTER);
      textLeading(37);
      textSize(getTextSize(this.width, this.height, this.minSize, this.cardStorage[this.currentCard][1]));
      text(this.cardStorage[this.currentCard][4],  this.x, this.y, this.stoutness, this.height+150);
      //For outcome 1
    }

    if(cardFace == "back2"){
      textFont(myFont);
      textAlign(CENTER);
      textLeading(37);
      textSize(getTextSize(this.width, this.height, this.minSize, this.cardStorage[this.currentCard][1]));
      text(this.cardStorage[this.currentCard][5],  this.x, this.y, this.stoutness, this.height+150);
      //Outcome 2
    }
  }
}


function preload(){  
  lines = loadStrings('templatedCards.txt');
  myFont = loadFont('Papernotes.ttf');
  notecardImg = loadImage('Notecard.png');
}


function setup() {  
  createCanvas(vWidth, vHeight, WEBGL);
  ortho();//Enables an orthographic view. This will keep everyting "flat" so that we don't see the top or bottom of shapes.

  background(220);
  addProgressBar();
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

  theCard = new Text(currentCard,cardStorage,cardFace);//For some reason if this line isn't here everything doesn't display. 
                                                       //I mean the text doesn't display,
                                                       // but the notecard, progress bar, and background don't show up
                                                       //I'm not sure where the initial card text is called tbh.
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

    if(cardFace == "front"){
      translate(x, -7, 0);
      theCard.translate(x); // Really not sure if this works.
    }

    if (spin <3 && cardFace != "front"){
      if(spin == 1.5){
        theCard.dispBack();
        //This will hopefully mask the change in cards when the card is perpendicular to the audience's view
      }
      rotateY(spin);
      theCard.rotateY(spin);// not sure if this works. 
      spin += .1;
    }

    box(569, 344, 0);
    pop();

      if(x == 0){
        spin = 0;
        theCard.cardButtons();
        noloop();
        // The buttons only need to be displayed when it's not animated. The noloop() prevents it from animating.
      }
      x+=25;
      theCard.x+=25;
      
      if(x > 1000){
        x = -1000;
        theCard.dispFront(); //The new front will be displayed when the card is off screen.
      }
}

function mousePressed() {
    
    // Button clicks
    for(i = 0; i < buttons.length; i++) {
        buttons[i].clicked(mouseX, mouseY);
    }
    loop();// when clicked the button will start the animation.
}


// This is the center notecard
//This function bascially has no purpose anymore.
/*function addCard() {
    push();
    fill(100, 100, 100);
    strokeWeight(1);
    stroke(175, 194, 212);
    texture(notecardImg);
    translate(x, -7, 0);
    box(569, 344, 10);
    pop();

}*/


// This is the progress bar
function addProgressBar() {
  // Bar dimensions
  let w = 1000;
  let h = 39;
  let y = -338;
  
  //Sections
  let cardsPerYr = 16;
  let total = cardsPerYr * 4;
  
  for(let i = 0; i < total; i++) {
    push();
      fill(100, 100, 100);
    translate(-(w / 2) + ((w / total) * i), y, 0);
    append(progressBar, box(w / total, h, 10));
    pop();
  }
}

//Moved into the text class
/*function getTextSize(width, height, minSize, txt) {
    txtSize = 1 * sqrt((width * height) / (txt.length + 50));
    
    if(txtSize > minSize) {
        txtSize = minSize
    }
    
    return txtSize;
}*/

//All of the functionality of displayCardText() has been put into the Text Class
/*function displayCardText(){
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
        //textFont(myFont);
        //textAlign(CENTER);
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
    }
    if (cardFace == "back2"){
        textAlign(CENTER);
        textLeading(37);
        // Calculate text size to fit in area
        
        textSize(getTextSize(840, 170, 37, cardStorage[currentCard][1]));
        
        text(cardStorage[currentCard][5], -280, -147, 560, 320); // Outcome 2
        pop();
        
        new Button(0, -7, 569, 344, function(){ cardFace = "front"; ++currentCard; redrawCanvas();});
        
    }
}*/


function redrawCanvas() {
    progressBar = [];
  addProgressBar();
    buttons = [];
}