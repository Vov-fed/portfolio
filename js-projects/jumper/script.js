const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 600;

let score = 0;
let bestScore = localStorage.getItem("bestScore") || 0;
let boardValues = [];
var isJumping = false;
const player = {
    x: 190,
    y: 100,
    width: 60,
    height: 60,
    speedX: 0,
    speedY: 0,
    gravity: 0.2, // Increased gravity
    jumpPower: -8, // Increased jump power
    speed: 5, // Increased speed
    image: new Image()
};

player.image.src = 'jumper.png';

let platforms = [];
let boosts = [];
let coins = [];
let breakablePlatforms = [];

function createPlatform(y, xPositions, breakable = false) {
    let x;
    do {
        x = Math.random() * (canvas.width - 100);
    } while (xPositions.some(pos => Math.abs(pos - x) < player.width + 25)); // Ensure a minimum distance of 25 pixels

    return {
        x: x,
        y: y,
        width: 100,
        height: 20,
        image: new Image(),
        breakable: breakable,
        broken: false
    };
}

function createBoost(platform) {
    return {
        x: platform.x + Math.random() * (platform.width - 30),
        y: platform.y - 30,
        width: 30,
        height: 30,
        image: new Image(),
        active: true,
        platform: platform
    };
}

function createCoin(platform) {
    return {
        x: platform.x + Math.random() * (platform.width - 20),
        y: platform.y - 20,
        width: 20,
        height: 20,
        image: new Image(),
        collected: false,
        platform: platform
    };
}

let animationFrameId;
let lastTime = 0;
const fixedTimeStep = 1000 / 120; // 120 FPS

function initializeGame() {
    platforms = [];
    boosts = [];
    coins = [];
    breakablePlatforms = [];
    for (let i = 0; i < 5; i++) {
        const y = 120 * i;
        const isBreakable = Math.random() < 0.2; // 20% chance to be breakable
        const platform = createPlatform(y, [], isBreakable);
        platforms.push(platform);
        if (platform.breakable) {
            breakablePlatforms.push(platform);
        }
        if (Math.random() < 0.05) {
            boosts.push(createBoost(platform));
        }
        if (Math.random() < 0.05) {
            coins.push(createCoin(platform));
        }
    }
    score = 0;
    boardValues = [];
    player.x = 190;
    player.y = 100;
    player.speedX = 0;
    player.speedY = 0;
    lastTime = performance.now();
    gameLoop(lastTime);
}

function update(deltaTime) {
    // moves for player
    player.x += player.speedX * deltaTime;
    player.y += player.speedY * deltaTime;
    player.speedY += player.gravity * deltaTime;

    // moves to the beginning of the canvas if player goes out of the canvas
    if (player.x > canvas.width) {
        player.x = 0;
    } else if (player.x < 0) {
        player.x = canvas.width;
    }

    // platforms update
    platforms.forEach(platform => {
        ctx.fillStyle = platform.color || '#000'; // Default color if no color is set
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);

        // check if player is on the platform
        if (
            player.y + player.height >= platform.y &&
            player.y + player.height <= platform.y + platform.height &&
            player.x + player.width >= platform.x &&
            player.x <= platform.x + platform.width &&
            player.speedY > 1
        ) {
            player.speedY = player.jumpPower;
            isJumping = true;
            player.image.src = left ? 'isSitting-rotated.png' : 'isSitting.png';
            player.height = 57;
            if (platform.breakable && !platform.broken) {
                platform.broken = true;
                // add some effect for breaking the platform
                setTimeout(() => {
                    platforms = platforms.filter(p => p !== platform); // Remove the broken platform
                }, 200);
            }
        } else {
            if(player.speedY > -1) {
                isJumping = false;
                player.height = 60;
                player.image.src = left ? 'jumper-rotated.png' : 'jumper.png';
            }
       }
    });

    // Check if player is above the middle of the canvas
    if (player.y < canvas.height / 2) {
        const offset = (canvas.height / 2) - player.y;
        player.y = canvas.height / 2;

        // Move platforms, boosts, and coins down
        platforms.forEach(platform => {
            platform.y += offset;
        });
        boosts.forEach(boost => {
            boost.y += offset;
        });
        coins.forEach(coin => {
            coin.y += offset;
        });

        // Increase score based on the offset
        score += offset / 20;
    }

    // check if platforms are out of the canvas
    platforms = platforms.filter((platform) => platform.y < canvas.height);
    if (platforms.length < 5) {
        const y = platforms[platforms.length - 1].y - 120;
        const isBreakable = Math.random() < 0.1; // 10% chance to be breakable
        const newPlatform = createPlatform(y, [], isBreakable);
        platforms.push(newPlatform);
        if (newPlatform.breakable) {
            breakablePlatforms.push(newPlatform);
        }
        if (Math.random() < 0.05) {
            boosts.push(createBoost(newPlatform));
        }
        if (Math.random() < 0.05) {
            coins.push(createCoin(newPlatform));
        }
    }

    // check if game is over
    if (player.y >= canvas.height) {
        console.log('Game Over');
        endGame();
    }

    // update score
    document.getElementById('score').innerHTML = Math.floor(score);

    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('bestScore', bestScore);
    }
    document.getElementById('bestScore').innerHTML = Math.floor(bestScore);

    // update boosts
    boosts.forEach(boost => {
        boost.y = boost.platform.y - 30; // Move with platform
        if (boost.active && player.x < boost.x + boost.width && player.x + player.width > boost.x && player.y < boost.y + boost.height && player.y + player.height > boost.y) {
            player.speedY = player.jumpPower * 1.5; // Boost jump power
            boost.active = false;
        }
        if (boost.y > canvas.height - boost.height) {
            boost.active = false;
        }
    });

    // update coins
    coins.forEach(coin => {
        coin.y = coin.platform.y - 20; // Move with platform
        if (!coin.collected && player.x < coin.x + coin.width && player.x + player.width > coin.x && player.y < coin.y + coin.height && player.y + player.height > coin.y) {
            score += 10; // Increase score by 10
            coin.collected = true;
        }
        if (coin.y > canvas.height - coin.height) {
            coin.collected = true;
        }
    });
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(player.image, player.x, player.y, player.width, player.height);

    // draw platforms
    platforms.forEach(platform => {
        if (platform.breakable) {
            platform.image.src = 'breakable.svg';
        } else {
            platform.image.src = 'ground.svg';
        }
        ctx.drawImage(platform.image, platform.x, platform.y, platform.width, platform.height);
    });

    // draw boosts
    boosts.forEach(boost => {
        if (boost.active) {
            boost.image.src = 'boost.svg';
            ctx.drawImage(boost.image, boost.x, boost.y, boost.width, boost.height);
        }
    });

    // draw coins
    coins.forEach(coin => {
        if (!coin.collected) {
            coin.image.src = 'coin.svg';
            ctx.drawImage(coin.image, coin.x, coin.y, coin.width, coin.height);
        }
    });
}

// game over
function endGame() {
    cancelAnimationFrame(animationFrameId);
    document.querySelector('#gameOver').classList.add('show');
    document.querySelector('#finalScore').innerHTML = Math.floor(score);
}

// start game
function gameLoop(timestamp) {
    const deltaTime = (timestamp - lastTime) / fixedTimeStep;
    lastTime = timestamp;

    update(deltaTime);
    render();

    animationFrameId = requestAnimationFrame(gameLoop);
}

// restart game
document.querySelector('#restart').addEventListener('click', () => {
    document.querySelector('#gameOver').classList.remove('show');
    initializeGame();
});

let left = false;
// movement for player
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        player.speedX = player.speed;
        player.image.src = isJumping ? 'isSitting.png' :'jumper.png' ; // Default image when moving right
        left = false;
    }
    if (e.key === 'ArrowLeft') {
        player.speedX = -player.speed;
        player.image.src = isJumping ? 'isSitting-rotated.png' : 'jumper-rotated.png'; // Mirrored image when moving left
        left = true;
    }
});

// stop player if key is released
document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        player.speedX = 0;
    }
});
// touch logic for mobile devices
document.addEventListener('touchstart', (e) => {
    if (e.touches[0].clientX > canvas.width / 2) {
        player.speedX = player.speed;
    } else {
        player.speedX = -player.speed;
    }
});

// stop player if touch is released
document.addEventListener('touchend', () => {
    player.speedX = 0;
});

// incline screen logic for mobile devices
window.addEventListener('deviceorientation', (e) => {
    if (e.gamma > 2) {
        player.speedX = player.speed;
    } else if (e.gamma < -2) {
        player.speedX = -player.speed;
    } else {
        player.speedX = 0;
    }
});

initializeGame();
