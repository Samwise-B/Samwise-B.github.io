

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
    this.dragStart = {x: 0, y: 0}

    // board event handlers
    canvas.addEventListener('mousedown', this.onPointerDown.bind(this));
    canvas.addEventListener('mouseup', this.onPointerUp.bind(this));
    canvas.addEventListener('mousemove', this.onPointerMove.bind(this));
    canvas.addEventListener('wheel', (e) => this.adjustZoom(e.deltaY*this.SCROLL_SENSITIVITY));

    // frame count
    this.gameFrame = 0;
    
    // begin drawing
    this.draw()
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
    this.gameFrame += 1;

    if (this.gameFrame == meanie.frameStagger * 4) {
      meanie.maxAnims = 3
      meanie.changeSkin(0);
    }
    if (this.gameFrame == meanie.frameStagger * 10) {
      meanie.changeSkin(1);
    }
    if (this.gameFrame == meanie.frameStagger * 20) {
      meanie.maxAnims = 7;
      meanie.changeSkin(2);
    }
    if (this.gameFrame % 5 == 0 && this.gameFrame > meanie.frameStagger *20) meanie.x++;

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
  constructor() {
    this.x = -125;
    this.y = -50;
    this.frameX = 0;
    this.frameY = 0;
    this.maxAnims = 4;
    this.frameStagger = 30;
    this.skinFile = ['charge', 'shootFX', 'moveFX'];
  }
  changeSkin(i) {
    sprite.src = `static/${this.skinFile[i]}.png`;
  }
  draw(gameFrame) {
    this.frameHeight = '26';
    

    // stagger animation change
    if (gameFrame % this.frameStagger == 0) {
      console.log(`frame y ${this.frameHeight}`);
      if (this.frameY < this.maxAnims) {
        this.frameY++;
      }
      else this.frameY = 0;
    }
    
    ctx.drawImage(sprite, 0, this.frameHeight * this.frameY, sprite.width, this.frameHeight, this.x, this.y, sprite.width * 2, 52);
  }
}


// player class
class Player {
  constructor() {
    // to do
  }
}


var canvas = document.getElementById("map");
var ctx = canvas.getContext("2d");
var sprite = document.getElementById('sprite');
let meanie = new Sprite();
let map = new Board();

