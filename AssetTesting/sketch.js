let sound1;
let playMode = 'sustain';
function preload() {
  soundFormats('wav');
  sound1 = loadSound('Sounds/backgroundSound.wav');

}
function setup() {
  createCanvas(1000, 2000);
  img = loadImage('images/8.png');
  img2 = loadImage('images/cat.png');//image has transparent parts


}

function draw() {
  //background(220);
  sound1.play();
  image(img, 0, 0, img.width / 2, img.height / 2);//fields are: image, x pos, y pos, x length, y length
  image(img2, 0, 100, img2.width, img2.height/2);
  filter(INVERT);
  image(img2, 0, 1000, img2.width, img2.height);
  filter(INVERT);//filter applies to entire canvas, but only those images loaded in before the filter is applied, in the case of invert this load order can be used to only invert images selectively
  
}
