const startButton = document.getElementById('startButton');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 480;
canvas.height = 500; // キャンバスの高さをさらに増やす

let ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
let rightPressed = false;
let leftPressed = false;

const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

const paddleSpeed = 7; // パドルの速度

const brickRowCount = 4; 
const brickColumnCount = 5; 
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 70; // ブロックのオフセットをさらに広く変更
const brickOffsetLeft = 30;
let bricks = [];
let remainingBricks = brickRowCount * brickColumnCount; // 残りのブロック数を追跡

// 効果音の定義
let collisionSound;
let gameoverSound;

function preloadSounds() {
    collisionSound = new Audio('collision.mp3');
    gameoverSound = new Audio('gameover.mp3');
}

for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: c * (brickWidth + brickPadding) + brickOffsetLeft, y: r * (brickHeight + brickPadding) + brickOffsetTop, status: 1 };
    }
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                ctx.beginPath();
                ctx.rect(bricks[c][r].x, bricks[c][r].y, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if (b.status === 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    remainingBricks--;

                    // 効果音を再生
                    collisionSound.play();

                    // ボールの速度を調整
                    if (remainingBricks === 15) { // 残り15個 (3列目の途中)
                        dx *= 1.2;
                        dy *= 1.2;
                    } else if (remainingBricks === 10) { // 残り10個 (2列目の途中)
                        dx *= 1.3;
                        dy *= 1.3;
                    } else if (remainingBricks === 5) { // 残り5個 (1列目の途中)
                        dx *= 1.4;
                        dy *= 1.4;
                    } else if (remainingBricks === 0) {
                        alert("Congratulations! You win!");
                        resetGame();
                        return;
                    }
                }
            }
        }
    }
}

function updateGame() {
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            gameoverSound.play(); // ゲームオーバーの効果音を再生
            alert("Game Over!");
            resetGame();
            return;
        }
    }
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += paddleSpeed; // パドルの速度を固定
    } else if (leftPressed && paddleX > 0) {
        paddleX -= paddleSpeed; // パドルの速度を固定
    }
    x += dx;
    y += dy;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();
    updateGame();
    requestAnimationFrame(draw);
}

document.addEventListener('keydown', function(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
});

document.addEventListener('keyup', function(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
});

// スタートボタンのイベントリスナーに効果音のプレロードを追加
startButton.addEventListener('click', function() {
    preloadSounds();
    draw(); // ゲームを開始
    startButton.style.display = 'none'; // スタートボタンを隠す
});

// ゲームのリセット
function resetGame() {
    document.location.reload();
    startButton.style.display = 'block'; // スタートボタンを再表示
}

// ゲーム初期化関数、最初に呼び出される
function init() {
    startButton.style.display = 'block'; // スタートボタンを表示
}

init(); // ゲーム初期化
