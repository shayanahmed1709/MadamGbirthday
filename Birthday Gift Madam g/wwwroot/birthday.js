// 🎉 Starts the Celebration & Expands the Message Box
window.continueCelebration = function () {
    const box = document.getElementById('messageBox');
    if (box) {
        box.classList.add('show');
        box.style.display = 'flex';
    }

    window.activateCanvas();
    window.startSnowfall();
    window.releaseBalloons();
    window.playBackgroundMusic?.();
};

// ❌ Hides the Message Box
window.closeMessageBox = function () {
    const box = document.getElementById('messageBox');
    if (box) {
        box.classList.remove('show');
        setTimeout(() => {
            box.style.display = 'none';
        }, 400);
    }
};

// 🕯️ Blow Candles → Swap Popup + Light up Cake & Effects
window.blowCandles = function () {
    const oldPopup = document.getElementById('messageBox');
    if (oldPopup) {
        oldPopup.classList.remove('show');
        setTimeout(() => {
            oldPopup.style.display = 'none';
        }, 400);
    }

    const newPopup = document.getElementById('celebrationBox');
    if (newPopup) {
        newPopup.style.display = 'flex';
        setTimeout(() => {
            newPopup.classList.add('show');
        }, 100);
    }

    const cake = document.getElementById('cakeImage');
    if (cake) {
        cake.src = 'cake_candles_on.jpg';
        cake.classList.remove('cake-unlit');
        cake.classList.add('cake-lit');
    }

    window.startConfetti?.();
    window.showFlame?.();
};

// 🎶 Single-Instance Music Playback
let musicStarted = false;
window.playBackgroundMusic = function () {
    if (musicStarted) return;
    musicStarted = true;

    const audio = document.getElementById("bgMusic");
    if (audio) {
        audio.play().catch(err => console.warn("🎶 Music playback blocked:", err));
    }
};

document.addEventListener('click', function startMusic() {
    playBackgroundMusic();
    document.removeEventListener('click', startMusic);
});


// ☁️ Activate Canvas Visibility
window.activateCanvas = function () {
    const canvas = document.getElementById("animationCanvas");
    if (canvas) {
        canvas.classList.add("active");
        canvas.style.display = "block";
    }
};

// ❄️ Snowfall Effect
window.startSnowfall = function () {
    const canvas = document.getElementById("animationCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let snowflakes = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function createSnowflakes() {
        snowflakes = [];
        for (let i = 0; i < 80; i++) {
            snowflakes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 3 + 1,
                d: Math.random() * 1 + 0.5
            });
        }
    }

    function drawSnowflakes() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(255,255,255,0.85)";
        ctx.beginPath();
        for (let f of snowflakes) {
            ctx.moveTo(f.x, f.y);
            ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        }
        ctx.fill();
        moveSnowflakes();
    }

    function moveSnowflakes() {
        for (let f of snowflakes) {
            f.y += Math.pow(f.d, 2) + 1;
            if (f.y > canvas.height) {
                f.x = Math.random() * canvas.width;
                f.y = 0;
            }
        }
    }

    createSnowflakes();
    setInterval(drawSnowflakes, 33);
};

// 🎈 Floating Balloons
window.releaseBalloons = function (count = 6) {
    for (let i = 0; i < count; i++) {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        balloon.style.left = Math.random() * 80 + 10 + '%';
        balloon.style.animationDelay = (i * 0.5) + 's';
        balloon.style.width = (Math.random() * 20 + 20) + 'px';
        document.body.appendChild(balloon);

        setTimeout(() => balloon.remove(), 5000);
    }
};

// 🔥 Candle Flame Flicker
window.showFlame = function () {
    const container = document.getElementById('cake-container');
    if (!container) return;

    const flame = document.createElement('div');
    flame.className = 'candle-flame';
    container.appendChild(flame);

    setTimeout(() => flame.remove(), 4000);
};

// 🎊 Confetti Effect
window.startConfetti = function () {
    const canvas = document.getElementById("animationCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let confetti = [];

    for (let i = 0; i < 150; i++) {
        confetti.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            r: Math.random() * 6 + 4,
            color: `hsl(${Math.random() * 360}, 80%, 55%)`,
            speed: Math.random() * 2 + 1
        });
    }

    function drawConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let c of confetti) {
            ctx.beginPath();
            ctx.arc(c.x, c.y, c.r, 0, 2 * Math.PI);
            ctx.fillStyle = c.color;
            ctx.fill();
            c.y += c.speed;
            if (c.y > canvas.height) {
                c.y = -10;
                c.x = Math.random() * canvas.width;
            }
        }
    }

    setInterval(drawConfetti, 30);
};

// 🧪 Fallback DOM Trigger
window.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById("celebrateBtn");
    if (btn) {
        btn.addEventListener("click", () => {
            window.releaseBalloons();
            window.showFlame();
        });
    }
});
