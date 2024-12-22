let count = 0;
let tetrisBoard = document.querySelector('#tetris-board');
let bestScore = localStorage.getItem('bestScore') || 0;
document.querySelector('#tetris-score').innerHTML = `${count}`;
let isLegalRotate = true;
let isPossibleToMove = true;
let gameOver = document.querySelector('#gameOver');
gameOver.style.display = 'none';


let playBtn = document.querySelector('#play-btn');

let isGameOver = false;


let checkIfGameOverInterval = setInterval(checkIfGameOver, 1);
let movePieceDownInterval = setInterval(movePieceDown, 500);
let checkInterval = setInterval(check, 500);

let randomColor = [ 'blue', 'green', 'purple', 'orange', 'pink'];
let tetrisValues = Array(15).fill(0).map(() => Array(10).fill(0));

let tetrisPieces = [
  [[1, 1, 1, 1]], //0
  [[1], [1], [1], [1]], //1
  
  [[1, 1, 0], [0, 1, 1]], //2 
  [[0, 1], [1, 1], [1, 0]], //3
  [[0, 1, 1], [1, 1, 0]], //4
  [[1,0], [1, 1], [0, 1]],  //5
  
  [[1, 1, 1], [0, 0, 1]],   //6
  [[1, 1], [1, 0], [1, 0]], //7
  [[1, 0, 0], [1, 1, 1]],  //8
  [[0, 1], [0, 1], [1, 1]], //9
  
  
  [[0, 0, 1], [1, 1, 1]],   //10
  [[1, 1], [0, 1], [0, 1]], //11
  [[1, 1, 1], [1, 0, 0]],   //12
  [[1, 0], [1, 0], [1, 1]],   //13
  
  [[0, 1, 0], [1, 1, 1]],   //14  
  [[0, 1], [1, 1], [0, 1]], //15
  [[1, 1, 1], [0, 1, 0]],   //16
  [[1, 0], [1, 1], [1, 0]], //17
  
  [[1, 1], [1, 1]], //18
]

let randomColorForBoard = ['tomato', 'turquoise', 'aliceblue', 'bisque', 'orange', 'pink', '#fff'];

function drawBoard(){
let randomColorIndex = Math.floor(Math.random() * randomColorForBoard.length);
console.log(randomColorForBoard[randomColorIndex]);
  if(document.querySelector('#tetris-board')){
    document.querySelector('#tetris-board').remove();
  }
  var tetrisBoard = document.createElement('div');
  tetrisBoard.id = 'tetris-board';
  tetrisBoard.style.position = 'relative';
  tetrisValues.forEach((row, rowId) => {
    let rowBlock = document.createElement('div');
    rowBlock.classList.add('row');
    row.forEach((cell, cellId) => {
      let cellBlock = document.createElement('div');
      cellBlock.classList.add('cell');
      cellBlock.style.width = '25px';
      cellBlock.style.height = '25px';
      cellBlock.style.border = '1px solid green';
      cellBlock.style.backgroundColor = 'black';
      cellBlock.id = `cell-${rowId}-${cellId}`;
      rowBlock.appendChild(cellBlock);
      if(cell === 1){
        cellBlock.classList.add('filled');
        cellBlock.style.backgroundColor = randomColorForBoard[randomColorIndex];
      }
    })
    tetrisBoard.appendChild(rowBlock);
    document.body.appendChild(tetrisBoard);
  })
}

var newPiece;
let currentColor;
function drawPiece(){
if(!isGameOver){let randomColorIndex = Math.floor(Math.random() * randomColor.length);
  document.querySelector('#best-score').innerHTML = `Best: ${bestScore}`;
  let randomPiece = Math.floor(Math.random() * tetrisPieces.length)
  let currentPiece = tetrisPieces[randomPiece];
  newPiece = randomPiece;
  if(document.querySelector('.piece')){
    document.querySelectorAll('.piece').forEach(piece => {
      piece.remove();
      
    })
  }

  currentPiece.forEach((piece, id) => {
    piece.forEach((pieceCell, pieceCellId) => {
      currentColor = randomColor[randomColorIndex];
      if(pieceCell === 1){
        let pieceBlock = document.createElement('div');
        pieceBlock.style.position = 'absolute';
        pieceBlock.classList.add('piece');
        pieceBlock.style.width = '25px';
        pieceBlock.style.height = '25px';
        pieceBlock.id = `piece-${id}-${pieceCellId}`;
        pieceBlock.style.border = '1px solid white';
        pieceBlock.style.backgroundColor = currentColor;
        pieceBlock.style.top = 25 * id + 'px';
        pieceBlock.style.left = 100 + 25 * pieceCellId + 'px';
        pieceBlock.style.zIndex = 200;
        document.querySelector('#tetris-board').appendChild(pieceBlock);
      }
    })
  })
  return newPiece, currentColor;}
}

function checkIfRowIsFull(){
  for (let i = 0; i < tetrisValues.length; i++) {
    if(tetrisValues[i].every(cell => cell === 1)){
      tetrisValues.splice(i, 1);
      tetrisValues.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      count += 50;
      counter();
      drawBoard();
    }
  }
}

// * * * * * * * * * * * * *

function movePieceDown(){
  if(!isGameOver){checkIfRowIsFull();

  let allPieces = document.querySelectorAll('.piece');
  for (let i = allPieces.length - 1; i >= 0; i--) {
    if(parseInt(allPieces[i].style.top) >= 350 || tetrisValues[parseInt(allPieces[i].style.top) / 25 + 1][parseInt(allPieces[i].style.left) / 25] === 1 || tetrisValues[parseInt(allPieces[i].style.top) / 25 + 1][parseInt(allPieces[i].style.left) / 25] === 1){
      isPossibleToMove = false;
      break;
    } else {
      isPossibleToMove = true;
    }
  }
  if(isPossibleToMove){
    allPieces.forEach(piece => {
      piece.style.top = parseInt(piece.style.top) + 25 + 'px';    
    });
  } else {
    allPieces.forEach(piece => {
      tetrisValues[parseInt(piece.style.top) / 25][parseInt(piece.style.left) / 25] = 1;
      count += 3;
      console.log(count);
      counter();
    })
    drawBoard();
    drawPiece();
  }}
}
let isPossibleToRotateRight = true;
let isPossibleToRotateBottom = true;

function rotatePiece(){
  isLegalRotate = true;
  if(newPiece <= 1){
    if(newPiece === 0){
      newPiece = 1;
    } else {
      newPiece = 0;
    }
  }
  if(newPiece >= 2 && newPiece <= 5){
    if(newPiece == 5){
      newPiece = 2;
    } else{
      newPiece = newPiece + 1;
    }
  }
  if(newPiece >= 6 && newPiece <= 9){
    if(newPiece == 9){
      newPiece = 6;
    } else{
      newPiece = newPiece + 1;
    }
  }
  if(newPiece >= 10 && newPiece <= 13){
    newPiece = newPiece + 1;
    if(newPiece == 14){
      newPiece = 10;
    }
  }
  if(newPiece >= 14 && newPiece <= 17){
    newPiece = newPiece + 1;
    if(newPiece == 18){
      newPiece = 14;
    }
  }
  let currentPiece = tetrisPieces[newPiece];
  let pieceTop = parseInt(document.querySelectorAll('.piece')[0].style.top);
  let pieceLeft = parseInt(document.querySelectorAll('.piece')[0].style.left);
  for(let i = 0; i < currentPiece.length; i++){
    for(let j = 0; j < currentPiece[i].length; j++){
      if(currentPiece[i][j] === 1){
        if(pieceTop + 25 * i >= 325){
          isLegalRotate = false;
        } else {
          isLegalRotate = true;
        }
        if(pieceLeft + 25 * j >= 225){
          isPossibleToRotateRight = false;
        } else {
          isPossibleToRotateRight = true;
        }
        if(pieceTop + 25 * i < 325 && pieceLeft + 25 * j < 250 && tetrisValues[(pieceTop + 25 * i) / 25][(pieceLeft + 25 * j) / 25] == 1){
          return isLegalRotate = false;
        } else {
          isLegalRotate = true;
        }
      }
    }
  }
  console.log(currentPiece, newPiece);
  rotate();
}

function rotate(){
  console.log(isLegalRotate, isPossibleToRotateRight, isPossibleToRotateBottom);
  if(isLegalRotate && isPossibleToRotateRight && isPossibleToRotateBottom){
    runRotate();
  } else if(!isLegalRotate){
    return;
  } else if(!isPossibleToRotateRight){
    runRotate();
    document.querySelectorAll('.piece').forEach(piece => {
      piece.style.left = parseInt(piece.style.left) - 25 + 'px';
    })
  }
}

function runRotate(){
  let pieceTop = parseInt(document.querySelectorAll('.piece')[0].style.top);
  let pieceLeft = parseInt(document.querySelectorAll('.piece')[0].style.left);
  let currentPiece = tetrisPieces[newPiece];
    document.querySelectorAll('.piece').forEach(piece => {
      piece.remove();
    })
    let randomColorIndex = Math.floor(Math.random() * randomColor.length);
    currentPiece.forEach((piece, id) => {
      piece.forEach((pieceCell, pieceCellId) => {
        if(pieceCell === 1){
          let pieceBlock = document.createElement('div');
          pieceBlock.style.position = 'absolute';
          pieceBlock.classList.add('piece');
          pieceBlock.style.width = '25px';
          pieceBlock.style.height = '25px';
          pieceBlock.id = `piece-${id}-${pieceCellId}`;
          pieceBlock.style.backgroundColor = currentColor;
          pieceBlock.style.border = '1px solid white';
          if(pieceTop >= 325){
            pieceTop = 300;
          }
          pieceBlock.style.top = pieceTop + 25 * id + 'px';
          if(pieceLeft >= 225){
            pieceLeft = 200;
          }
          pieceBlock.style.left = pieceLeft + 25 * pieceCellId + 'px';
          pieceBlock.style.zIndex = 200;
          document.querySelector('#tetris-board').appendChild(pieceBlock);
        }
      })
    })
}

function movePieceRight(){
  let allPieces = document.querySelectorAll('.piece');
  for (let i = allPieces.length - 1; i >= 0; i--) {
    if(parseInt(allPieces[i].style.left) >= 225){
      return isPossibleToMove = false;
    } else {
      isPossibleToMove = true;
    }
    if(tetrisValues[parseInt(allPieces[i].style.top) / 25][parseInt(allPieces[i].style.left) / 25 + 1] === 1){
      return isPossibleToMove = false;
    }
  }

  if(isPossibleToMove){
    allPieces.forEach(piece => {
      piece.style.left = parseInt(piece.style.left) + 25 + 'px';
    })
  }
}
function movePieceLeft(){
  let allPieces = document.querySelectorAll('.piece');
  for (let i = 0; i < allPieces.length; i++) {
    if (parseInt(allPieces[i].style.left) <= 0) {
      return isPossibleToMove = false;
    } else {
      isPossibleToMove = true;
    }
    if (tetrisValues[parseInt(allPieces[i].style.top) / 25][parseInt(allPieces[i].style.left) / 25 - 1] === 1) {
      return isPossibleToMove = false;
    }
  }

  if (isPossibleToMove) {
    allPieces.forEach(piece => {
      piece.style.left = parseInt(piece.style.left) - 25 + 'px';
    });
  }
}
document.addEventListener('keydown', (e) => {
  if(e.key === 'ArrowUp'){
    rotatePiece();
  }
  if(e.key === 'ArrowRight'){
    movePieceRight();
  }
  if(e.key === 'ArrowLeft'){
    movePieceLeft();
  }
  if(e.key === 'ArrowDown'){
    movePieceDown();
  }
})

function check(){
  if(!isGameOver){
    if(!document.querySelector('#tetris-board') && !isGameOver){
      drawBoard();
    }
    if(!document.querySelector('.piece') && !isGameOver){
      drawPiece();
    }}
}

function counter(){
    document.querySelector('#tetris-score').innerText = `${count}`;
    if (count > bestScore) {
      bestScore = count;
      localStorage.setItem('bestScore', bestScore);
    }
    document.querySelector('#best-score').innerText = `Best: ${bestScore}`;
}
function updateScore() {
}

function checkIfGameOver(){
    if(tetrisValues[0].some(cell => cell === 1)){
      document.querySelectorAll('.piece').forEach(piece => {
        piece.remove();
      })
      isGameOver = true;
      document.querySelector('#tetris-board').remove();
      clearInterval(checkInterval);
      clearInterval(movePieceDownInterval);
      clearInterval(checkIfGameOverInterval);
      gameOver.style.display = 'block';
      document.querySelector('#gameOverScore').innerHTML = count;
      document.querySelector('#bestScore').innerHTML = bestScore;
      document.querySelector('.tetris-mini-wrapper').style.display = 'none';
      document.querySelector('#best-score').style.display = 'none';
      document.querySelector('#restart-btn').addEventListener('click', () => {
        resetGame();
        gameOver.style.display = 'none';
      })
      function resetGame(){
        clearInterval(checkInterval);
        clearInterval(movePieceDownInterval);
        clearInterval(checkIfGameOverInterval);

        isGameOver = false;
        gameOver.style.display = 'none';
        tetrisValues = Array(15).fill(0).map(() => Array(10).fill(0));
        checkIfGameOverInterval = setInterval(checkIfGameOver, 1);
        movePieceDownInterval = setInterval(movePieceDown, 500);
        checkInterval = setInterval(check, 500);
        count = 0;
        document.querySelector('#best-score').style.display = 'block';
        document.querySelector('.tetris-mini-wrapper').style.display = 'flex';
        document.querySelector('#tetris-score').innerHTML = `${count}`;
        
        drawBoard();
        drawPiece();
      }
      tetrisValues = Array(15).fill(0).map(() => Array(10).fill(0));
      count = 0;
    }
}

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

function handleTouchStart(e) {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}

function handleTouchEnd(e) {
  touchEndX = e.changedTouches[0].clientX;
  touchEndY = e.changedTouches[0].clientY;

  handleGesture();
}

function handleGesture() {
  let diffX = touchEndX - touchStartX;
  let diffY = touchEndY - touchStartY;

  if (Math.abs(diffX) > Math.abs(diffY)) {
    // Horizontal swipe
    if (diffX > 30) {
      // Swipe right
      movePieceRight();
    } else if (diffX < -30) {
      // Swipe left
      movePieceLeft();
    }
  } else {
    // Vertical swipe
    if (diffY > 30) {
      // Swipe down
      movePieceDown();
    } else if (diffY < -30) {
      // Swipe up
      rotatePiece();
    }
  }
}

// Add event listeners for touch gestures
document.addEventListener('touchstart', handleTouchStart);
document.addEventListener('touchend', handleTouchEnd);


drawBoard();
drawPiece();



playBtn.addEventListener('click', () => {
  if (playBtn.classList.contains('paused')) {
    // Resume the game
    checkIfGameOverInterval = setInterval(checkIfGameOver, 1);
    movePieceDownInterval = setInterval(movePieceDown, 500);
    checkInterval = setInterval(check, 500);
    playBtn.classList.remove('paused');
    playBtn.innerHTML = `<i class="fa-solid fa-pause" style="color: rgb(90, 54, 54);"></i>`;
  } else {
    // Pause the game
    clearInterval(checkIfGameOverInterval);
    clearInterval(movePieceDownInterval);
    clearInterval(checkInterval);
    playBtn.classList.add('paused');
    playBtn.innerHTML = `<i class="fa-solid fa-play" style="color: rgb(90, 54, 54);"></i>`;
  }
});