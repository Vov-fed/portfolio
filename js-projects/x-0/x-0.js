let box = document.querySelector('#box');
let currentPlayer = 'X';
let winner = null;
let xWinsElement = document.querySelector('#x');
let oWinsElement = document.querySelector('#o');
let xWins = localStorage.getItem('xWins') || 0;
let reset = document.querySelector('#reset');
let resetXY = document.querySelector('#resetX-Y-localStorage');
let oWins = localStorage.getItem('oWins') || 0;
let board = ['', '', '', '', '', '', '', '', ''];
xWinsElement.textContent = `X: ${localStorage.getItem('xWins') || 0}`;
oWinsElement.textContent = `O: ${localStorage.getItem('oWins') || 0}`;
let winCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
];
resetXY.addEventListener('click', () => {
    localStorage.removeItem('xWins');
    localStorage.removeItem('oWins');
    xWins = 0;
    oWins = 0;
    xWinsElement.textContent = `X: ${xWins}`;
    oWinsElement.textContent = `O: ${oWins}`;
});
let draw = false;

for(let i = 0; i < 9; i++) {
    let boxItem = document.createElement('div');
    boxItem.className = 'boxItem';
    boxItem.id = i;
    box.appendChild(boxItem);
}

let boxItems = document.querySelectorAll('.boxItem');
boxItems.forEach((boxItem, index) => {
    boxItem.addEventListener('click', () => {
        if(!winner && !board[index]) {
            board[index] = currentPlayer;
            boxItem.textContent = currentPlayer;
            boxItem.classList.add('clicked');
            boxItems.forEach(item => item.classList.remove('x', 'o'));
            boxItems.forEach(item => item.classList.add(currentPlayer === 'X' ? 'o' : 'X'));
            winner = checkWinner();
            if (!winner) {
                if (checkDraw()) {
                    setTimeout(() => {
                        let drawWrapper = document.createElement('div');
                        drawWrapper.className = 'winnerWrapper';
                        let drawMessage = document.createElement('div');
                        let drawMessageText = document.createElement('div');
                        drawMessageText.textContent = 'It\'s a draw!';
                        drawMessageText.className = 'winnerMessageText';
                        drawWrapper.appendChild(drawMessageText);
                        let drawClose = document.createElement('div');
                        drawClose.className = 'winnerClose';
                        drawWrapper.appendChild(drawClose);
                        drawMessage.appendChild(drawWrapper);
                        drawClose.className = 'winnerClose';
                        drawClose.textContent = 'close';
                        drawClose.addEventListener('click', () => {
                            drawMessage.remove();
                            draw = true;
                        });
                        drawMessage.className = 'winnerMessage';
                        document.body.appendChild(drawMessage);
                        board = ['', '', '', '', '', '', '', '', ''];
                        boxItems.forEach(item => {
                            item.textContent = '';
                            item.classList.remove('clicked');
                            item.classList.remove('X', 'o');
                            item.classList.add('X');
                        });
                        currentPlayer = 'X';
                    }, 2000);
                } else {
                    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                }
            }
        }
    });
});
function checkDraw() {
    let draw = true;
    let i = 0;
    boxItems.forEach(item => {
        if (item.classList.contains('clicked')) {
            i++;
        }
    });
    if (i === 9) {
        draw = true;
    } else {
        draw = false;
    }
    if (checkWinner()) {
        draw = false;
    }
    return draw;
}
function checkWinner() {
    for (let i = 0; i < winCombinations.length; i++) {
        let [a, b, c] = winCombinations[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            // Highlight the winning combination
            document.getElementById(a).classList.add('winner');
            document.getElementById(b).classList.add('winner');
            document.getElementById(c).classList.add('winner');

            // Add background color to the winning combination with a timeout
            setTimeout(() => {
                document.getElementById(a).style.backgroundColor = 'lightgreen';
                document.getElementById(b).style.backgroundColor = 'lightgreen';
                document.getElementById(c).style.backgroundColor = 'lightgreen';
            }, 500);

            setTimeout(() => {
                let winnerMessage = document.createElement('div');
                let winnerClose = document.createElement('div');
                winnerClose.className = 'winnerClose';
                winnerClose.textContent = 'close';
                winnerClose.addEventListener('click', () => {
                    winnerMessage.remove();
                    board = ['', '', '', '', '', '', '', '', ''];
                    boxItems.forEach(item => {
                        item.textContent = '';
                        item.classList.remove('clicked');
                        item.classList.remove('X', 'o');
                        item.classList.remove('winner');
                        item.classList.add('X');
                        item.style.backgroundColor = ''; // Remove background color
                    });
                    currentPlayer = 'X';
                    winner = null;
                });
                let winnerWrapper = document.createElement('div');
                winnerWrapper.className = 'winnerWrapper';
                winnerMessage.appendChild(winnerWrapper);
                winnerMessage.className = 'winnerMessage';
                let winnerMessageText = document.createElement('div');
                winnerMessageText.textContent = `${board[a]} wins!`;
                winnerMessageText.className = 'winnerMessageText';
                winnerWrapper.appendChild(winnerMessageText);
                winnerWrapper.appendChild(winnerClose);
                if (board[a] === 'X') {
                    xWins++;
                    xWinsElement.textContent = `X: ${xWins}`;
                    localStorage.setItem('xWins', xWins);
                } else {
                    oWins++;
                    oWinsElement.textContent = `O: ${oWins}`;
                    localStorage.setItem('oWins', oWins);
                }
                document.body.appendChild(winnerMessage);
            }, 2000);
            return board[a];
        }
    }
    return null;
}
