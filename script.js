const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 600;

const playerImage = new Image();
playerImage.src = 'heart.png';

const enemyImage = new Image();
enemyImage.src = 'enemy.png';

const explosionSound = document.getElementById('explosionSound');
const pauseButton = document.getElementById('pauseButton');

let player = {
    x: canvas.width / 2 - 15,
    y: canvas.height - 50,
    width: 30,
    height: 30,
    speed: 5,
    bullets: [],
    canShoot: true,
    shootCooldown: 500
};

let enemies = [];
let enemySpeed = 2;
let enemySpawnInterval = 1000;
let score = 0;
let isGameOver = false;
let isPaused = false;

function drawPlayer() {
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
}

function drawBullets() {
    ctx.fillStyle = '#f00';
    player.bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        bullet.y -= bullet.speed;
    });
}

function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
        enemy.y += enemySpeed;
    });
}

function movePlayer() {
    if (leftPressed && player.x > 0) {
        player.x -= player.speed;
    } else if (rightPressed && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }
}

function shootBullet() {
    if (player.canShoot) {
        player.bullets.push({
            x: player.x + player.width / 2 - 2.5,
            y: player.y,
            width: 5,
            height: 10,
            speed: 7
        });
        player.canShoot = false;
        setTimeout(() => player.canShoot = true, player.shootCooldown);
    }
}

function spawnEnemy() {
    if (!isPaused) {
        const enemyX = Math.random() * (canvas.width - 30);
        enemies.push({
            x: enemyX,
            y: 0,
            width: 30,
            height: 30
        });
    }
}

function detectCollisions() {
    for (let i = 0; i < enemies.length; i++) {
        for (let j = 0; j < player.bullets.length; j++) {
            if (player.bullets[j].x < enemies[i].x + enemies[i].width &&
                player.bullets[j].x + player.bullets[j].width > enemies[i].x &&
                player.bullets[j].y < enemies[i].y + enemies[i].height &&
                player.bullets[j].y + player.bullets[j].height > enemies[i].y) {
                explosionSound.play();
                enemies.splice(i, 1);
                player.bullets.splice(j, 1);
                score += 10;
                break;
            }
        }

        if (enemies[i] && enemies[i].y > canvas.height - enemies[i].height) {
            isGameOver = true;
            break;
        }
    }
}

function update() {
    if (!isGameOver && !isPaused) {
        movePlayer();
        detectCollisions();
        player.bullets = player.bullets.filter(bullet => bullet.y > 0);
        enemies = enemies.filter(enemy => enemy.y < canvas.height);
    } else if (isGameOver) {
        restartGame();
    }
}

function restartGame() {
    player.x = canvas.width / 2 - 15;
    player.bullets = [];
    enemies = [];
    score = 0;
    isGameOver = false;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawBullets();
    drawEnemies();
    update();
    drawScore();
    requestAnimationFrame(draw);
}

function drawScore() {
    document.getElementById('score').textContent = `Puntuación: ${score}`;
}

let leftPressed = false;
let rightPressed = false;

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        leftPressed = true;
    } else if (e.key === 'ArrowRight') {
        rightPressed = true;
    } else if (e.key === ' ') {
        e.preventDefault();  // Evitar que la barra espaciadora active el botón de pausa
        shootBullet();
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') {
        leftPressed = false;
    } else if (e.key === 'ArrowRight') {
        rightPressed = false;
    }
});

pauseButton.addEventListener('click', () => {
    isPaused = !isPaused;
    pauseButton.textContent = isPaused ? 'Reanudar' : 'Pausa';
});

setInterval(spawnEnemy, enemySpawnInterval);
draw();



window.addEventListener('load', () => {
    const scrollElement = document.querySelector('.scroll');
    scrollElement.classList.add('unrolled');
});


