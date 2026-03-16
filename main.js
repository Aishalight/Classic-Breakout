const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const overlay = document.getElementById("overlay");
const startBtn = document.getElementById("startBtn");
const statsMsg = document.getElementById("stats-msg");

// --- GAME STATE ---
let audioCtx, gameRunning = false, score = 0, lives = 3;
let highScore = localStorage.getItem("breakoutHighScore") || 0;

let x, y, dx, dy, paddleX;
const ballRadius = 10;
const paddleWidth = 100;
const paddleHeight = 12;

const rowCount = 4, colCount = 6;
const bWidth = 80, bHeight = 24, bPad = 10, bOffTop = 50, bOffLeft = 35;
let bricks = [];

// --- AUDIO ---
function initAudio() { 
    if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); 
}

function playNote(freq, type = 'square', duration = 0.1) {
    if(!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + duration);
}

// --- CORE LOGIC ---
function startGame() {
    if (gameRunning) return;
    initAudio();
    score = 0; 
    lives = 3;
    resetLevel();
    overlay.style.display = "none";
    gameRunning = true;
    draw();
}

function resetLevel() {
    x = canvas.width / 2; y = canvas.height - 40;
    dx = 4; dy = -4;
    paddleX = (canvas.width - paddleWidth) / 2;
    bricks = [];
    for(let c=0; c<colCount; c++) {
        bricks[c] = [];
        for(let r=0; r<rowCount; r++) bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

// --- INPUTS ---
let rightPressed = false, leftPressed = false;

document.addEventListener("keydown", (e) => {
    if(e.key.includes("Right")) rightPressed = true;
    if(e.key.includes("Left")) leftPressed = true;
    if((e.key === "Enter" || e.key === " ") && !gameRunning) startGame();
});

document.addEventListener("keyup", (e) => {
    if(e.key.includes("Right")) rightPressed = false;
    if(e.key.includes("Left")) leftPressed = false;
});

function handleTouch(e) {
    if(!gameRunning) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const touchX = (e.touches[0].clientX - rect.left) * scaleX;
    paddleX = touchX - paddleWidth / 2;
    if (paddleX < 0) paddleX = 0;
    if (paddleX > canvas.width - paddleWidth) paddleX = canvas.width - paddleWidth;
    e.preventDefault();
}

canvas.addEventListener("touchstart", handleTouch, {passive: false});
canvas.addEventListener("touchmove", handleTouch, {passive: false});
startBtn.addEventListener("click", startGame);

// --- DRAW LOOP ---
function draw() {
    if(!gameRunning) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw Bricks
    for(let c=0; c<colCount; c++) {
        for(let r=0; r<rowCount; r++) {
            if(bricks[c][r].status === 1) {
                let bx = (c*(bWidth+bPad))+bOffLeft;
                let by = (r*(bHeight+bPad))+bOffTop;
                bricks[c][r].x = bx; bricks[c][r].y = by;
                ctx.fillStyle = "#0095DD";
                ctx.fillRect(bx, by, bWidth, bHeight);
            }
        }
    }

    // Draw Ball & Paddle
    ctx.fillStyle = "#FFF";
    ctx.beginPath(); ctx.arc(x, y, ballRadius, 0, Math.PI*2); ctx.fill();
    ctx.fillRect(paddleX, canvas.height-paddleHeight - 5, paddleWidth, paddleHeight);

    // UI Text
    ctx.font = "bold 16px Arial";
    ctx.fillText(`SCORE: ${score}`, 20, 30);
    ctx.fillText(`BEST: ${highScore}`, canvas.width/2 - 40, 30);
    ctx.fillText(`LIVES: ${lives}`, canvas.width-100, 30);

    // Brick Collision
    for(let c=0; c<colCount; c++) {
        for(let r=0; r<rowCount; r++) {
            let b = bricks[c][r];
            if(b.status === 1) {
                if(x > b.x && x < b.x+bWidth && y > b.y && y < b.y+bHeight) {
                    dy = -dy; b.status = 0; score++;
                    playNote(400 + (score * 10));
                    if(score > highScore) {
                        highScore = score;
                        localStorage.setItem("breakoutHighScore", highScore);
                    }
                    if(score === rowCount * colCount) {
                        gameRunning = false;
                        statsMsg.innerHTML = `NEW HIGH SCORE: ${highScore}`;
                        overlay.style.display = "flex";
                    }
                }
            }
        }
    }

    // Walls & Paddle Physics
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) dx = -dx;
    if(y + dy < ballRadius) dy = -dy;
    else if(y + dy > canvas.height-ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy; playNote(200, 'triangle');
        } else {
            lives--;
            playNote(100, 'sawtooth');
            if(!lives) {
                gameRunning = false;
                statsMsg.innerHTML = `SCORE: ${score} | BEST: ${highScore}`;
                overlay.style.display = "flex";
            } else {
                x = canvas.width/2; y = canvas.height-40; dx = 4; dy = -4;
            }
        }
    }

    if(rightPressed && paddleX < canvas.width-paddleWidth) paddleX += 8;
    else if(leftPressed && paddleX > 0) paddleX -= 8;

    x += dx; y += dy;
    requestAnimationFrame(draw);
}