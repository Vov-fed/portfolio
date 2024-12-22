let board = document.getElementById("gameBoard");
let snakeBody = [];
let snakeHead = document.createElement("div");
snakeHead.classList.add("snake-segment", "snake-head");
snakeHead.style.backgroundColor = "green";
snakeBody.push(snakeHead);
let food = document.createElement("div");
food.classList.add("food");
snakeHead.style.left = "100px";
snakeHead.style.top = "100px";

let bigFood = document.createElement("div");
bigFood.classList.add("bigFood"); 
bigFood.style.backgroundColor = "blue";

let counter = document.getElementById("counter");
counter.classList.add("counter");

const initialSnakeLength = 4;

function updateCounter() {
  counter.innerHTML = `Length: ${snakeBody.length - initialSnakeLength}`;
}

function generateBigFood() {
  let randomX = Math.floor(Math.random() * 10);
  if(randomX >= 8){
    let x = Math.floor(Math.random() * (board.clientWidth / 20)) * 20;
    let y = Math.floor(Math.random() * (board.clientHeight / 20)) * 20;
    bigFood.style.left = `${x}px`;
    bigFood.style.top = `${y}px`;
    board.appendChild(bigFood);
    for (let i = 0; i < snakeBody.length; i++) {
      if (x === parseInt(snakeBody[i].style.left) && y === parseInt(snakeBody[i].style.top)) {
        generateBigFood();
      }
    }
    if (x === parseInt(snakeHead.style.left) && y === parseInt(snakeHead.style.top)) {
      generateBigFood();
    }
    setTimeout(() => {
      if (board.contains(bigFood)) {
        board.removeChild(bigFood);
      }
    }, 5000); // Remove big food after 5 seconds
  }
}

let stopButton = document.getElementsByClassName("stop-button")[0];
stopButton.innerHTML = "||";

stopButton.addEventListener("click", function () {
  if (stopButton.innerHTML === "||") {
    stopButton.innerHTML = ">";
    clearInterval(animationFrameId);
  } else {
    stopButton.innerHTML = "||";
    moveSnake();
  }
});

let direction = { x: 20, y: 0 };
function initializeSnake() {
  for (let i = 1; i < initialSnakeLength; i++) {
    let bodyElement = document.createElement("div");
    bodyElement.style.backgroundColor = "black";
    bodyElement.classList.add("snake-segment");
    bodyElement.style.left = `${100 - 20 * i}px`;
    bodyElement.style.top = "100px";
    snakeBody.push(bodyElement);
    board.appendChild(bodyElement);
  }
  updateCounter();
}
initializeSnake();
board.appendChild(snakeHead);

function generateFood() {
  generateBigFood();
  let x = Math.floor(Math.random() * (board.clientWidth / 20)) * 20;
  let y = Math.floor(Math.random() * (board.clientHeight / 20)) * 20;
  food.style.left = `${x}px`;
  food.style.top = `${y}px`;
  food.style.backgroundColor = "red";
  board.appendChild(food);
  if (
    x === parseInt(snakeHead.style.left) &&
    y === parseInt(snakeHead.style.top)
  ) {
    generateFood();
  }
  for (let i = 0; i < snakeBody.length; i++) {
    if (
      x === parseInt(snakeBody[i].style.left) &&
      y === parseInt(snakeBody[i].style.top)
    ) {
      generateFood();
    }
  }
}
generateFood();

function moveSnake() {
  animationFrameId = setInterval(() => {
  for (let i = snakeBody.length - 1; i > 0; i--) {
    let previousSegment = snakeBody[i - 1];
    snakeBody[i].style.left = previousSegment.style.left;
    snakeBody[i].style.top = previousSegment.style.top;
  }
  
  let headPosition = {
    x: parseInt(snakeHead.style.left),
    y: parseInt(snakeHead.style.top),
  };
  
  let newHeadPosition = {
    x: headPosition.x + direction.x,
    y: headPosition.y + direction.y,
  };
  checkFood();
  if(board.contains(bigFood)){
    if(newHeadPosition.x === parseInt(bigFood.style.left) && newHeadPosition.y === parseInt(bigFood.style.top)){
      for (let i = 0; i < 5; i++) {
        let newElement = document.createElement("div");
        newElement.classList.add("snake-segment");
        newElement.style.backgroundColor = "black";
        newElement.style.left = snakeBody[snakeBody.length - 1].style.left;
        newElement.style.top = snakeBody[snakeBody.length - 1].style.top;
        snakeBody.push(newElement);
        board.appendChild(newElement);
      }
      board.removeChild(bigFood);
      updateCounter();
    }
  }
  function checkFood() {
  if (
    newHeadPosition.x === parseInt(food.style.left) &&
    newHeadPosition.y === parseInt(food.style.top)
  ) {
    let newElement = document.createElement("div");
    newElement.classList.add("snake-segment");
    newElement.style.backgroundColor = "black";
    newElement.style.left = snakeBody[snakeBody.length - 1].style.left;
    newElement.style.top = snakeBody[snakeBody.length - 1].style.top;
    snakeBody.push(newElement);
    board.appendChild(newElement);
    generateFood();
    updateCounter();
  }}
  snakeHead.style.left = `${newHeadPosition.x}px`;
  snakeHead.style.top = `${newHeadPosition.y}px`;

  if (newHeadPosition.y >= board.clientHeight) {
    snakeHead.style.top = "0px";
    if(food.style.top === "0px" && food.style.left === snakeHead.style.left){
      let newElement = document.createElement("div");
      newElement.classList.add("snake-segment");
      newElement.style.backgroundColor = "black";
      newElement.style.left = snakeBody[snakeBody.length - 1].style.left;
      newElement.style.top = snakeBody[snakeBody.length - 1].style.top;
      snakeBody.push(newElement);
      board.appendChild(newElement);
      generateFood();
      updateCounter();
    }
  }

  if (newHeadPosition.y < 0) {
    snakeHead.style.top = `${board.clientHeight - 20}px`;
    if(food.style.top === `${board.clientHeight - 20}px` && food.style.left === snakeHead.style.left){
      let newElement = document.createElement("div");
      newElement.classList.add("snake-segment");
      newElement.style.backgroundColor = "black";
      newElement.style.left = snakeBody[snakeBody.length - 1].style.left;
      newElement.style.top = snakeBody[snakeBody.length - 1].style.top;
      snakeBody.push(newElement);
      board.appendChild(newElement);
      generateFood();
      updateCounter();
    }
  }
  if (newHeadPosition.x >= board.clientWidth) {
    snakeHead.style.left = "0px";
    if(food.style.left === "0px" && food.style.top === snakeHead.style.top){
      let newElement = document.createElement("div");
      newElement.classList.add("snake-segment");
      newElement.style.backgroundColor = "black";
      newElement.style.left = snakeBody[snakeBody.length - 1].style.left;
      newElement.style.top = snakeBody[snakeBody.length - 1].style.top;
      snakeBody.push(newElement);
      board.appendChild(newElement);
      generateFood();
      updateCounter();
    }
  }
  if (newHeadPosition.x < 0) {
    snakeHead.style.left = `${board.clientWidth - 20}px`;
    if(food.style.left == `${board.clientWidth - 20}px` && food.style.top === snakeHead.style.top){
      let newElement = document.createElement("div");
      newElement.classList.add("snake-segment");
      newElement.style.backgroundColor = "black";
      newElement.style.left = snakeBody[snakeBody.length - 1].style.left;
      newElement.style.top = snakeBody[snakeBody.length - 1].style.top;
      snakeBody.push(newElement);
      board.appendChild(newElement);
      generateFood();
      updateCounter();
    }
  }
  if (checkCollision()) {
    alert("Game Over");
    window.location.reload();
    snakeBody.forEach((segment) => {
      board.removeChild(segment);
    });
    snakeBody = [];
    snakeHead.style.left = "100px";
    snakeHead.style.top = "100px";
    snakeBody.push(snakeHead);
    document.getElementById("gameBoard").appendChild(snakeHead);
    initializeSnake();
    direction = { x: 20, y: 0 };
    generateFood();
    cancelAnimationFrame(animationFrameId);
  }
}, 100);
}

function checkCollision() {
  let headPosition = {
    x: parseInt(snakeHead.style.left),
    y: parseInt(snakeHead.style.top),
  };
  for (let i = 1; i < snakeBody.length; i++) {
    let segmentPosition = {
      x: parseInt(snakeBody[i].style.left),
      y: parseInt(snakeBody[i].style.top),
    };
    if (
      headPosition.x === segmentPosition.x &&
      headPosition.y === segmentPosition.y
    ) {
      return true;
    }
  }
  return false; 
}

document.addEventListener("keydown", function (event) {
  switch (event.key) {
    case "ArrowUp":
      if (direction.y === 0) {
        direction = { x: 0, y: -20 };
      }
      break;
    case "ArrowDown":
      if (direction.y === 0) {
        direction = { x: 0, y: 20 };
      }
      break;
    case "ArrowLeft":
      if (direction.x === 0) {
        direction = { x: -20, y: 0 };
      }
      break;
    case "ArrowRight":
      if (direction.x === 0) {
        direction = { x: 20, y: 0 };
      }
      break;
  }
});

// Start Button
let startButton = document.createElement("button");
startButton.innerHTML = "Start Game";
startButton.classList.add("start-button");
document.body.appendChild(startButton);

startButton.addEventListener("click", function () {
  startButton.style.display = "none";
  moveSnake();
});

// Adjust board dimensions to be divisible by 20
function adjustBoardDimensions() {
  let width = Math.floor(window.innerWidth / 20) * 20;
  let height = Math.floor((window.innerHeight * 0.8) / 20) * 20;
  board.style.width = `${width}px`;
  board.style.height = `${height}px`;
}

adjustBoardDimensions();
window.addEventListener('resize', adjustBoardDimensions);
