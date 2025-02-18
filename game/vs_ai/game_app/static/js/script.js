
const canvas = document.getElementById("pong");
const ctx = canvas.getContext('2d');
let gameInterval;
let gameRunning = true; 
const user = { //paddle
    x : 0,
    y : canvas.height / 2 - 100/*(paddle.height)*/ / 2, ///YOU CAN JUST CALL H instead of 100
    w : 10 /*(paddle.width)*/,
    h : 100 /*(paddle.height)*/,
    score : 0,
    color : "#9EEB20",
    games_played:0,
    victories:0,
    lost:0,
}

const computer = {
    x : canvas.width - 10, // - width of paddle
    y : (canvas.height - 100)/2, // -100 the height of paddle
    w : 10 /*(paddle.width)*/,
    h : 100 /*(paddle.height)*/,
    color : "#9EEB20",
    score : 0
}

const ball = {
  x : canvas.width / 2,
  y : canvas.height / 2,
  r : 10,
  color : '#9EEB20',
  speed : 10,
  velocityX : 5,
  velocityY : 5
}

const net = {
  x : canvas.width / 2 - 2/2, ///test how to call w
  y : 0,
  w : 2,
  h : 10,
  color : '#9EEB20',
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

function drawNet(){
  for (let i = 0; i <= canvas.height ; i += (net.h + 5)){
    drawRect(net.x, net.y + i, net.w, net.h, net.color);
  }
}

function render(){
    drawRect(0, 0, canvas.width, canvas.height, "#212529");

    drawNet();

    /*score*/
    drawText(user.score, canvas.width/4, canvas.height/5, "#9EEB20");
    drawText(computer.score, 3*canvas.width/4, canvas.height/5, "#9EEB20");

    /*paddles*/
    drawRect(user.x, user.y, user.w, user.h, user.color);
    drawRect(computer.x, computer.y, computer.w, computer.h, computer.color);

    /*ball*/
    drawCircle(ball.x, ball.y, ball.r, ball.color);
    
}
canvas.addEventListener("mousemove", movePaddle);

function movePaddle(evt) {
  let rect = canvas.getBoundingClientRect(); ////

  user.y = evt.clientY - rect.top - user.h / 2;
}

function resetBall(){
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;

    speed = 10;
    ball.velocityX = -ball.velocityX;
}
function collision(b, p) {
  b.top = b.y - b.r;
  b.bottom = b.y + b.r;
  b.left = b.x - b.r;
  b.right = b.x + b.r;

  p.top = p.y;
  p.bottom = p.y + p.h;
  p.left = p.x;
  p.right = p.x + p.w;

  if (p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top)
    return true;
  return false;
}

function update() {
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;


  /* AI */  ////
  let computerLevel = 1;
  computer.y += (ball.y - (computer.y + computer.h / 2)) * computerLevel;
  
  if (ball.y + ball.r > canvas.height || ball.y - ball.r < 0)
    ball.velocityY = - ball.velocityY;
  
  let player;
  if (ball.x + ball.r < canvas.width / 2)
    player = user;
  else {
    player = computer;
  }

  if (collision(ball, player)) {
    // ball.velocityX = - ball.velocityX;

       // we check where the ball hits the paddle
       let collidePoint = (ball.y - (player.y + player.h/2));
       // normalize the value of collidePoint, we need to get numbers between -1 and 1.
       // -player.height/2 < collide Point < player.height/2
       collidePoint = collidePoint / (player.h/2);
       
       // when the ball hits the top of a paddle we want the ball, to take a -45degees angle
       // when the ball hits the center of the paddle we want the ball to take a 0degrees angle
       // when the ball hits the bottom of the paddle we want the ball to take a 45degrees
       // Math.PI/4 = 45degrees
       let angleRad = (Math.PI/4) * collidePoint;
       
       // change the X and Y velocity direction
       let direction = (ball.x + ball.r < canvas.width/2) ? 1 : -1;
       ball.velocityX = direction * ball.speed * Math.cos(angleRad);
       ball.velocityY = ball.speed * Math.sin(angleRad);
       
       // speed up the ball everytime a paddle hits it.
       ball.speed += 0.1;
  }
  if (ball.x + ball.r > canvas.width){
      user.score++;
      resetBall();
    }
    else if (ball.x - ball.r < 0) {
        computer.score++;
        resetBall();
    }
    return 0;
}
function game() {
    if (computer.score == 7 || user.score == 7){
      if (user.score == 7)
        user.victories = 1;
      else{
        user.lost = 1;
      }
      const popup = document.getElementById("popup");
      popup.style.display = "flex";
      document.getElementById("play-again").addEventListener("click", restartGame);
      document.getElementById("go-home").addEventListener("click", goHome);
      postScore();
      clearInterval(gameInterval);
      return;

  }
  else{

    update();
    render();
  }

}

function restartGame(){
  location.reload();
}

function startGame() {
  gameInterval = setInterval(game, 1000 / 50);
}

startGame();

function goHome() {
  window.location.href = "index.html";
}
const data = {
  score: user.score,
  games_played: user.games_played,
  victories: user.victories,
  lost: user.lost,
};
async function postScore() {

    fetch('http://localhost:8001/score/', {
        method : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        
        credentials: 'include', 
        body: JSON.stringify(data),
    })
    .then(response => {
      if (response.ok) {
        console.log('Score updated successfully');
        return response.json();
      } else {
        console.error('Error updating score:', response.statusText);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}
