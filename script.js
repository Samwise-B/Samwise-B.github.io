

// board class
class Board {
  constructor() {
    // camera initialisation
    this.cameraOffset = { x: window.innerWidth/2, y: window.innerHeight/2 };
    this.cameraZoom = 1;
    this.MAX_ZOOM = 5;
    this.MIN_ZOOM = 0.5;
    this.SCROLL_SENSITIVITY = 0.0005;
    this.lastZoom = this.cameraZoom;

    // mouse drag tracking
    this.isDragging = false;
    this.dragStart = {x: 0, y: 0};

    // board event handlers
    canvas.addEventListener('mousedown', this.onPointerDown.bind(this));
    canvas.addEventListener('mouseup', this.onPointerUp.bind(this));
    canvas.addEventListener('mousemove', this.onPointerMove.bind(this));
    canvas.addEventListener('wheel', (e) => this.adjustZoom(e.deltaY*this.SCROLL_SENSITIVITY));

    // frame count
    this.gameFrame = 0;
    
    // begin drawing
    this.draw();
    }
  
  // draw the board
  draw() {
    // console.log("drawing board");

    // board width initialisation
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // translate canvas to camera offset
    ctx.translate( window.innerWidth / 2, window.innerHeight / 2 );
    // scale canvas to zoom (between 0.5 and 5)
    ctx.scale(this.cameraZoom, this.cameraZoom);
    ctx.translate( -window.innerWidth / 2 + this.cameraOffset.x, -window.innerHeight / 2 + this.cameraOffset.y );
    ctx.clearRect(0,0, window.innerWidth, window.innerHeight);

    // draw rectangle
    ctx.beginPath();
    ctx.rect(-250, -250, 500, 500);
    ctx.fillStyle = "#00FF00";
    ctx.fill();
    ctx.closePath();

    
    meanie.draw(this.gameFrame);
    if (this.gameFrame <= meanie.frameStagger * 14) {
      baddie.draw(this.gameFrame);
    }
    this.gameFrame += 1;

    if (this.gameFrame == meanie.frameStagger * 3) {
      meanie.maxAnims = 3
      meanie.changeSkin(1);
    }
    if (this.gameFrame == meanie.frameStagger * 9) {
      meanie.changeSkin(2);
      baddie.changeSkin(1);
      baddie.y = baddie.y - 92;
      baddie.frameSize = '74';
    }
    if (this.gameFrame == meanie.frameStagger * 15) {
      meanie.maxAnims = 7;
      meanie.changeSkin(3);
    }
    if (this.gameFrame % 5 == 0 && this.gameFrame > meanie.frameStagger *15) meanie.x++;

    window.requestAnimationFrame(this.draw.bind(this));
  }

  // event location
  // MouseEvent.clientX is a viewport relative coordinate
  getEventLocation(e) {
    if (e.clientX && e.clientY) {
      return { x: e.clientX, y:e.clientY } 
    }
  }

  // on pointer down
  onPointerDown(e) {
    this.isDragging = true;
    this.dragStart.x = this.getEventLocation(e).x/this.cameraZoom - this.cameraOffset.x;
    this.dragStart.y = this.getEventLocation(e).y/this.cameraZoom - this.cameraOffset.y;
  }

  // on pointer up
  onPointerUp(e) {
    this.isDragging = false;
    this.lastZoom = this.cameraZoom;
  }

  // on pointer move
  onPointerMove(e) {
    if (this.isDragging) {
      // get new camera offset (divide by zoom to get correct location with respect to zoom factor)
      this.cameraOffset.x = this.getEventLocation(e).x/this.cameraZoom - this.dragStart.x;
      this.cameraOffset.y = this.getEventLocation(e).y/this.cameraZoom - this.dragStart.y;
      //console.log(this.cameraOffset);
    }
  }

  // adjust viewport
  adjustZoom(zoomAmount) {
    if (zoomAmount) {
      this.cameraZoom += zoomAmount;
      console.log(this.cameraZoom);
    }
  }
}

class Sprite {
  constructor(sprite, x, y, frameSize, skinFiles, scrollLeft) {
    this.sprite = sprite;
    this.x = x;
    this.y = y;
    this.frameX = 0;
    this.frameY = 0;
    this.frameSize = frameSize;
    if (!this.scrollLeft) {
      this.frame = this.frameY;
    }
    else {
      this.frame = this.frameX;
    }
    /*
    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;
    */
    this.maxAnims = 3;
    this.frameStagger = 30;
    this.skinFile = skinFiles;
    this.scrollLeft = scrollLeft;
    this.changeSkin(0);
  }
  changeSkin(i) {
    this.frame = 0;
    this.sprite.src = `static/${this.skinFile[i]}.png`;
  }
  draw(gameFrame) {
    // stagger animation change
    if (gameFrame % this.frameStagger == 0) {
      console.log(`frame: ${this.frame}`);
      if (this.frame < this.maxAnims) {
        this.frame++;
      }
      else this.frame = 0;
    }
    
    if (!this.scrollLeft) {
      ctx.drawImage(this.sprite, 0, this.frameSize * this.frame, this.sprite.width, this.frameSize, this.x, this.y, this.sprite.width * 2, this.frameSize * 2);
    }
    else ctx.drawImage(this.sprite, this.frameSize * this.frame, 0, this.frameSize, this.sprite.height, this.x, this.y, this.frameSize, this.sprite.height);
  }
}


var canvas = document.getElementById("map");
var ctx = canvas.getContext("2d");
var sprite1 = document.getElementById('sprite1');
var sprite2 = document.getElementById('sprite2');
let meanie = new Sprite(sprite1, -125, -50, '26', ['wake', 'charge', 'shootFX', 'moveFX'], false);
let baddie = new Sprite(sprite2, 125, -70, '55', ['Hell-Beast-Files/PNG/without-stroke/hell-beast-idle', 'Hell-Beast-Files/PNG/without-stroke/hell-beast-burn'], true);
baddie.maxAnims = 5;
let map = new Board();

