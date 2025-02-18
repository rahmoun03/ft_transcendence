const canvas = document.getElementById("pong");
const ctx = canvas.getContext('2d');
let player;
let keysPressed = {
  ArrowUp: false,
  ArrowDown: false,
  a: false,
  d: false,
  j: false,
  l: false,
  w: false,
  s: false
};
const user1 = { //paddle
  x : 0,
  y : canvas.height / 2 - 100/*(paddle.height)*/ / 2, ///YOU CAN JUST CALL H instead of 100
  w : 10 /*(paddle.width)*/,
  h : 100 /*(paddle.height)*/,
  score : 7,
  color : "#9EEB20"
}
const user2 = {
  x : canvas.width - 10, // - width of paddle
  y : (canvas.height - 100)/2, // -100 the height of paddle
  w : 10 /*(paddle.width)*/,
  h : 100 /*(paddle.height)*/,
  color : "#9EEB20",
  score : 7
}

const user3 = { //paddle
  x : canvas.width / 2 - 50,
  y : 0,
  w : 100 /*(paddle.width)*/,
  h : 10 /*(paddle.height)*/,
  score : 7,
  color : "#9EEB20"
}

const user4 = {
  x : canvas.width / 2 - 50,
  y : canvas.height - 10, // -100 the height of paddle
  w : 100 /*(paddle.width)*/,
  h : 10 /*(paddle.height)*/,
  color : "#9EEB20",
  score : 7
}

const ball = {
  x : canvas.width / 2,
  y : canvas.height / 2,
  r : 10,
  color : "#9EEB20",
  speed : 5,
  velocityX : 5,
  velocityY : 5
}

const net1 = {
  x : canvas.width / 2 - 2/2, ///test how to call w
  y : 0,
  w : 2,
  h : 10,
  color : "#9EEB20",
}

const net2 = {
  x : 0,
  y : canvas.height / 2 - 2/2, ///test how to call w
  w : 10,
  h : 2,
  color : "#9EEB20",
}

function drawRect(x, y, w, h, color){
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color){
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2 , true);
  ctx.closePath();
  ctx.fill();
}

function drawText(text, x, y, color){
  ctx.fillStyle = color;
  ctx.font = "bold 48px serif";
  ctx.fillText(text, x, y);
}

function render(){
    drawRect(0, 0, canvas.width, canvas.height, "#212529");

    /*score*/
    drawText(user1.score, canvas.width/25, canvas.height/2 + 12, "#9EEB20");
    drawText(user2.score,canvas.width - 95 , canvas.height/2 + 12, "#9EEB20");
    drawText(user3.score, canvas.width/2 - 12, canvas.height/10, "#9EEB20");
    drawText(user4.score, canvas.width/2 - 12, canvas.height - 70, "#9EEB20");

    /*paddles*/
    drawRect(user1.x, user1.y, user1.w, user1.h, user1.color);
    drawRect(user2.x, user2.y, user2.w, user2.h, user2.color);
    drawRect(user3.x, user3.y, user3.w, user3.h, user3.color);
    drawRect(user4.x, user4.y, user4.w, user4.h, user4.color);
    
    /*ball*/
    drawCircle(ball.x, ball.y, ball.r, ball.color);
    
}

canvas.addEventListener("mousemove", moveLeftPaddle);

function moveLeftPaddle(evt) {
  let rect = canvas.getBoundingClientRect(); ////

  user1.y = evt.clientY - rect.top - user1.h / 2;
}


function resetBall(){
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;

    speed = 5;
    ball.velocityX = -ball.velocityX;
}
function collision(b, u1, u2, u3, u4) {
  b.top = b.y - b.r;
  b.bottom = b.y + b.r;
  b.left = b.x - b.r;
  b.right = b.x + b.r;

  u1.top = u1.y;
  u1.bottom = u1.y + u1.h;
  u1.left = u1.x;
  u1.right = u1.x + u1.w;

  u2.top = u2.y;
  u2.bottom = u2.y + u2.h;
  u2.left = u2.x;
  u2.right = u2.x + u2.w;

  u3.top = u3.y;
  u3.bottom = u3.y + u3.h;
  u3.left = u3.x;
  u3.right = u3.x + u3.w;

  u4.top = u4.y;
  u4.bottom = u4.y + u4.h;
  u4.left = u4.x;
  u4.right = u4.x + u4.w;

  if (u1.left < b.right && u1.top < b.bottom && u1.right > b.left && u1.bottom > b.top)
  {
    player = user1
    return true;
  }
  if (u2.left < b.right && u2.top < b.bottom && u2.right > b.left && u2.bottom > b.top)
  {
    player = user2;
    return true;
  }
  if (u3.left < b.right && u3.top < b.bottom && u3.right > b.left && u3.bottom > b.top)
  { player = user3;
    return true;
  }
  if (u4.left < b.right && u4.top < b.bottom && u4.right > b.left && u4.bottom > b.top)
  {
    player = user4;
    return true;
  }
  return false;
}

function update() {
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;


  if (collision(ball, user1, user2,user3, user4)) {
    // ball.velocityX = - ball.velocityX;

       let collidePoint = (ball.y - (player.y + player.h/2));
       collidePoint = collidePoint / (player.h/2);
       let angleRad = (Math.PI/4) * collidePoint;
       let direction = (ball.x + ball.r < canvas.width/2) ? 1 : -1;
       ball.velocityX = direction * ball.speed * Math.cos(angleRad);
       ball.velocityY = ball.speed * Math.sin(angleRad);
       if (ball.speed <=10) /// add this on all
          ball.speed += 1;

  }
  if (ball.x - ball.r < 0){
      user1.score--;
      resetBall();
    }
     if (ball.x + ball.r > canvas.width) {
      user2.score--;
      resetBall();
    }
     if (ball.y - ball.r < 0 ){
      user3.score--;
      resetBall();
    }
     if (ball.y + ball.r > canvas.height ){
      user4.score--;
      resetBall();
    }
}

function game() {

    update();
    render();

    updatePaddles();


}

const framPerSec = 50;
setInterval(game, 1000 / framPerSec);


document.addEventListener("keydown", (event) => {
  if (event.key in keysPressed) {
      keysPressed[event.key] = true;
  }
});

document.addEventListener("keyup", (event) => {
  if (event.key in keysPressed) {
      keysPressed[event.key] = false;
  }
});

function updatePaddles() {
  const paddleSpeed = 20; 

  
  if (keysPressed["ArrowUp"]) {
      user2.y -= paddleSpeed;
      if (user2.y < 0) {
          user2.y = 0; 
      }
  } 
  if (keysPressed["ArrowDown"]) {
      user2.y += paddleSpeed;
      if (user2.y + user2.h > canvas.height) {
          user2.y = canvas.height - user2.h; 
      }
  }

  
  if (keysPressed["a"]) {
      user3.x -= paddleSpeed;
      if (user3.x < 0) {
          user3.x = 0; 
      }
  }
  if (keysPressed["d"]) {
      user3.x += paddleSpeed;
      if (user3.x + user3.w > canvas.width) {
          user3.x = canvas.width - user3.w; 
      }
  }

  
  if (keysPressed["j"]) {
      user4.x -= paddleSpeed;
      if (user4.x < 0) {
          user4.x = 0; 
      }
  }
  if (keysPressed["l"]) {
      user4.x += paddleSpeed;
      if (user4.x + user4.w > canvas.width) {
          user4.x = canvas.width - user4.w; 
      }
  }

}