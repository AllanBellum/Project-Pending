vWidth = 1366;
vHeight = 768;

xs = 0;
spin = 0;
textPos = 0;
lastBack = 0;
textSpin = 0;
runningAnimation = false;

progressBar = [];
let myFont;
cardSize = 8 //number of elements on card
var cardStorage = new Array();
let currentCard; //card being read by program
let cardFace;
let hovering = false;

let buttons = [];

let lines;

let gpa = 2.0;
let mHealth = 100;
let money = 0;

let mute = false;


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
	backgroundGoodImg = loadImage('Assets/Imgs/Background-Good.png');
	backgroundPoorImg = loadImage('Assets/Imgs/Background-Poor.png');
	backgroundBadImg = loadImage('Assets/Imgs/Background-Bad.png');
	backgroundImg = loadImage('Assets/Imgs/Background-Good.png');
  mutedIcon = loadImage('Assets/Imgs/mutedIcon.png');
  soundIcon = loadImage('Assets/Imgs/soundIcon.png');
    
  intro = loadSound('Assets/Music/CDintroSong.mp3');
  loopNuetral = loadSound('Assets/Music/CDLoopNtrl.mp3');
  loopGood = loadSound('Assets/Music/CDLoopGood.mp3');
  loopBad = loadSound('Assets/Music/CDLoopBad.mp3')
}


function setup() {  
  createCanvas(vWidth, vHeight, WEBGL);
  ortho();//Enables an orthographic view. This will keep everyting "flat" so that we don't see the top or bottom of shapes.

  addBackground();
  //addProgressBar();
  addCard();
  displayStats(); 
  
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
    image(soundIcon, -684, -43);
}

let hoveringOn = "";
function draw(){
    //137, 75, 275, 150
    if (cardFace == "front" && !runningAnimation) {
        if (!hovering && mouseX >= ((vWidth / 2) + -137) - (275 / 2) && mouseX <= ((vWidth / 2) + -137) + (275 / 2) &&
			mouseY >= ((vHeight / 2) + 75) - (150 / 2) && mouseY <= ((vHeight / 2) + 75) + (150 / 2)) {
            hovering = true;
            hoveringOn = "l";
			push();
            fill(255, 255, 0, 60);
            noStroke();
            translate(-137, 75, 0);
            box(275, 150, 0);
            pop();
		} else if (!hovering && mouseX >= ((vWidth / 2) + 137) - (275 / 2) && mouseX <= ((vWidth / 2) + 137) + (275 / 2) &&
			mouseY >= ((vHeight / 2) + 75) - (150 / 2) && mouseY <= ((vHeight / 2) + 75) + (150 / 2)) {
            hovering = true;
            hoveringOn = "r";
			push();
            fill(255, 255, 0, 60);
            noStroke();
            translate(137, 75, 0);
            box(275, 150, 0);
            pop();
        } else if (hovering && (hoveringOn == "r" || hoveringOn == "l")) {
            hovering = false;
            redrawCanvas();
        }
    }
    
    if (runningAnimation) {
        drawAnimation();
    }
    
    displayCardText();
    
    playSound();


    new Button(-605, 0, 200, 200, function(){//mute button located on/around laptop
      if (mute){mute = false;}
      else {mute = true;}
      redrawCanvas()
    });
  
}


function drawAnimation() {
    if(cardFace != "front" && textSpin < 3) {
        if(cardFace == "back1") {
            spin += .1;
            textSpin += .1;
        } else if (cardFace == "back2") {
            spin -= .1;
            textSpin -= .1;
        }
        
    } else if (cardFace == "front") {
        if (xs != -25) {
            xs+=25;
            textPos+=25;
        } else {
            xs+=25;
            textPos+=25;
            runningAnimation = false;
        }
        
    }
    
    if(spin >= 3 || spin <= -3) {
        spin = 0;
        textSpin = 0;
        runningAnimation = false;
    }
    
    if(xs > 1000) {
        xs = -1000;
        textPos = -1000;
    }
    redrawCanvas();
}

function mousePressed() {

	// Button clicks
	for (i = 0; i < buttons.length; i++) {
		buttons[i].clicked(mouseX, mouseY);
	}

}


function addBackground() {
	push();
	noStroke();
	texture(backgroundImg);
	translate(0, 0, -200);
	plane(vWidth, vHeight);
	pop();
}


// This is the center notecard
function addCard() {
	push();
	fill(100, 100, 100);
	strokeWeight(1);
	stroke(175, 194, 212);

	texture(notecardImg);
	translate(0, -7, 0);

	// Translate to position for animation
	rotateY(spin);
	translate(xs, 0, 0);

	box(569, 344, 0);
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

	for (let i = 0; i < total; i++) {
		push();
		fill(100, 100, 100);
		translate(-(w / 2) + ((w / total) * i), y, 0);
		append(progressBar, box(w / total, h, 10));
		pop();
	}
}


function displayStats() {
	push();
	textFont(myFont);
	textSize(30);
	fill(209, 188, 1);
	text("GPA: " + (gpa).toFixed(1), -536, 310);
	text("Money: " + money, -100, 310);
	text("Mental Health: " + mHealth, 383, 310);
	pop();
}

function getOutcomeVal(lineN) {
	// Cards in text go gpa money mHealth 
	// For example 0 1 0
	let vals = cardStorage[currentCard][lineN].split(" ");
	if (gpa + parseFloat(vals[0]) > 4.0) {
		gpa = 4.0;
	} else if (gpa + parseFloat(vals[0]) < 0.0) {
		gpa = 0.0;
	} else {
		gpa += parseFloat(vals[0]);
	}

	money += parseInt(vals[1]);

	if (mHealth + parseInt(vals[2]) > 100) {
		mHealth = 100;
	} else if (mHealth + parseInt(vals[2]) < 0) {
		mHealth = 0;
	} else {
		mHealth += parseInt(vals[2]);
	}


	//document.write(gpa + " " + mHealth + " " + money);\
	//console.log(gpa + " " + mHealth + " " + money);
}


function getTextSize(width, height, minSize, txt) {
	txtSize = 1 * sqrt((width * height) / (txt.length + 50));

	if (txtSize > minSize) {
		txtSize = minSize
	}

	return txtSize;
}


function displayCardText() {
	push();
	textFont(myFont);
	fill(0, 0, 0);

	let tCardFace = cardFace

	if (runningAnimation) {
		if (cardFace == "back1" || cardFace == "back2") {
			if (spin < 1.5) {
				tCardFace = "front";

			}
			/*else {
			               print("2: " + textSpin);
			               //textSpin = 3 - textSpin
			           }*/
		}
	}

	if (tCardFace == "front") {
		textAlign(CENTER);
		textLeading(37);

		// Calculate text size to fit in area

		textSize(getTextSize(840, 170, 37, cardStorage[currentCard][1]));

		translate(0, 0, 100);

		// Draw animation
		rotateY(textSpin);

		text(cardStorage[currentCard][1], textPos - 280, -147, 560, 170); // Dilema Text
		pop();

		push();
		fill(0, 0, 0);
		textFont(myFont);
		textAlign(CENTER);
		textLeading(30);
		// Calculate text size to fit in area
		textSize(getTextSize(550, 150, 30, cardStorage[currentCard][2]));

		translate(0, 0, 100);

		// Draw animation
		rotateY(textSpin);

		text(cardStorage[currentCard][2], textPos - 275, 25, 260, 150); //Option 1
		pop();

		push();
		fill(0, 0, 0);
		textFont(myFont);
		textAlign(CENTER);
		textLeading(30);
		// Calculate text size to fit in area
		textSize(getTextSize(550, 150, 30, cardStorage[currentCard][2]));

		translate(0, 0, 100);

		rotateY(textSpin);

		text(cardStorage[currentCard][3], textPos + 10, 25, 280, 150); //Option 2
		pop();


		if (!runningAnimation) {
			new Button(-137, 75, 275, 150, function() {
				cardFace = "back1";
				getOutcomeVal(6);
				runningAnimation = true;
				redrawCanvas();
			});


			new Button(137, 75, 275, 150, function() {
				cardFace = "back2";
				getOutcomeVal(7);
				runningAnimation = true;
				redrawCanvas();
			});
		}
	}
	if (tCardFace == "back1") {
		textAlign(CENTER);
		textLeading(37);
		// Calculate text size to fit in area

		textSize(getTextSize(840, 170, 37, cardStorage[currentCard][1]));

		translate(0, 0, 100);

		// Draw animation
		rotateY(textSpin);

		text(cardStorage[currentCard][4], -280, -147, 560, 320); // Outcome 1
		pop();


		if (!runningAnimation) {
			new Button(0, -7, 569, 344, function() {
				nextCard();
				cardFace = "front";
				runningAnimation = true;
				redrawCanvas();
			});
		}


	}
	if (tCardFace == "back2") {
		textAlign(CENTER);
		textLeading(37);
		// Calculate text size to fit in area

		textSize(getTextSize(840, 170, 37, cardStorage[currentCard][1]));

		translate(0, 0, 100);

		// Draw animation
		rotateY(textSpin);

		text(cardStorage[currentCard][5], -280, -147, 560, 320); // Outcome 2

		if (!runningAnimation) {
			new Button(0, -7, 569, 344, function() {
				nextCard();
				cardFace = "front";
				runningAnimation = true;
				redrawCanvas();
			});
		}
		pop();



	}
}

function redrawCanvas() {
    addBackground();
    progressBar = [];
  //addProgressBar();
    buttons = [];

    if (mute){image(mutedIcon, -684, -43);} //changeing laptop screen depending on mute status
    else {image(soundIcon, -684, -43);}
     
    addCard();
    displayStats();
 
}

function nextCard() { // function to include code for selecting new card for any cases not specified it will move to the next sequential card
	let newCard;
	//example of what condition should look like for branching card, xxxx is cardID
	/*else if (cardStorage[currentCard][0] == "xxxx") {
	    if (cardFace == "back1")                          //this conditional can be based on any variables including which decision was made on this card or the GPA, Wealth, or Mental Health. Multiple if else statements are also accesable if more than 2 branches is desired, could also include just a cardID assignment to jump cards uncondiationally
	      newCard = "xxxx";
	    else
	      newCard = "xxxx";}
	*/
	if (cardStorage[currentCard][0] == "0005") { //branching based on stats
		if (gpa < 1.0) {
			newCard = "0101";
		} else if (gpa < 2.0) {
			newCard = "0100";
		} else if (mHealth < 50) {
			newCard = "0200";
		} else if (money < 100) {
			newCard = "0300";
		} else if (gpa > 3.3) {
			newCard = "0400";
		} else {
			newCard = "0006"
		}
	} else if (cardStorage[currentCard][0] == "0100") {
		if (cardFace == "back2")
			newCard = "9999";
	} else if (cardStorage[currentCard][0] == "0101" || cardStorage[currentCard][0] == "0100" || cardStorage[currentCard][0] == "0200" || cardStorage[currentCard][0] == "0300" || cardStorage[currentCard][0] == "0400") { //leaving branch
		newCard = "0006";
	} else if (cardStorage[currentCard][0] == "9999") {
		reload();
	} else //default case


	++currentCard;

	for (i = 0; i < cardStorage.length; ++i) { //loop identifies which card has the selected ID
		if (cardStorage[i][0] == newCard)
			currentCard = i;
	}

}

let introDuration = 15.151;
let fadeTimer = 3;

function playSound(){
  if (mute){loopNuetral.setVolume(0); loopGood.setVolume(0); loopBad.setVolume(0); intro.setVolume(0);}
  else{
    if(intro.isPlaying){intro.setVolume(1);}
    if (!intro.isPlaying() && !loopNuetral.isPlaying()){ //Music startup function, plays intro then the loop tracks
    intro.play(0);
    
    loopNuetral.playMode('sustain');
    loopNuetral.play(introDuration);

    loopGood.playMode('sustain'); 
    loopGood.play(introDuration, 1, 0.0);
    
    loopBad.playMode('sustain');
    loopBad.play(introDuration, 1, 0.0);

    userStartAudio(); //allows music to play after use interacts with the window

    }
   if (loopNuetral.isPlaying() && !intro.isPlaying()) { //track switching for loops, 
		if (gpa > 3 && mHealth > 75) {
			loopNuetral.setVolume(0, fadeTimer);
			loopGood.setVolume(1, fadeTimer);
			loopBad.setVolume(0, fadeTimer);
			backgroundImg = backgroundGoodImg
		} //sets track to Good
		else if (gpa < 2 || mHealth < 25) {
			loopNuetral.setVolume(0, fadeTimer);
			loopGood.setVolume(0, fadeTimer);
			loopBad.setVolume(1, fadeTimer);
			backgroundImg = backgroundBadImg
		} //sets track to Bad
		else {
			loopNuetral.setVolume(1, fadeTimer);
			loopGood.setVolume(0, fadeTimer);
			loopBad.setVolume(0, fadeTimer);
			backgroundImg = backgroundPoorImg
		} //defaults track to nuetral
  }
}
}

function reload() {
    vWidth = 1366;
    vHeight = 768;

    xs = 0;
    spin = 0;
    textPos = 0;
    lastBack = 0;
    textSpin = 0;
    runningAnimation = false;

    progressBar = [];
    currentCard = 0;
    cardFace = "front"; 


    gpa = 2.0;
    mHealth = 100;
    money = 0;
    
    intro.stop();
    loopNuetral.stop();
    loopGood.stop();
    loopBad.stop();
    
    redrawCanvas();
    playSound();

    // Keep mute status
    //let mute = false;
}