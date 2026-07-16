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
            window.typewriterCelebration?.();
        }, 100);
    }

    const cake = document.getElementById('cakeImage');
    if (cake) {
        cake.src = 'cake_candles_on.gif';
        cake.classList.remove('cake-unlit');
        cake.classList.add('cake-lit');
    }

    window.showFlame?.();
    window.activateCanvas();
    window.startSnowfall();
    window.releaseBalloons();
};

// 🎶 Unified Music Playback
window.playBackgroundMusic = function () {
    const audio = document.getElementById("bgMusic");
    if (audio && audio.paused) {
        audio.play().catch(err => console.warn("🎶 Music playback blocked:", err));
    }
};

// 🎬 Pause/Resume Music for Video
window.pauseBackgroundMusic = function () {
    const audio = document.getElementById("bgMusic");
    if (audio && !audio.paused) {
        audio.pause();
    }
};

window.resumeBackgroundMusic = function () {
    const audio = document.getElementById("bgMusic");
    if (audio && audio.paused) {
        audio.play().catch(err => console.warn("🎶 Music resume blocked:", err));
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

// 🎬 Video Playback for "View Surprise"
window.playVideoSurprise = function () {
    const videoContainer = document.getElementById('videoContainer');
    const video = document.getElementById('surpriseVideo');
    
    if (!videoContainer || !video) return;

    // Pause background music
    window.pauseBackgroundMusic();

    // Hide all popup messages
    const popups = document.querySelectorAll('.popup-message');
    popups.forEach(p => {
        p.style.display = 'none';
        p.classList.remove('show');
    });

    // Hide background videos
    const bgVideos = document.querySelectorAll('video[id*="Background"]');
    bgVideos.forEach(v => {
        v.style.opacity = '0';
        v.style.pointerEvents = 'none';
    });

    // Hide all canvases (tree and snow effects)
    const canvases = document.querySelectorAll('canvas');
    canvases.forEach(c => {
        c.style.opacity = '0';
        c.style.pointerEvents = 'none';
    });

    // Show video container
    videoContainer.style.display = 'flex';
    setTimeout(() => {
        videoContainer.style.opacity = '1';
    }, 50);
    
    // Play video
    video.play().catch(err => console.warn("🎬 Video playback blocked:", err));
};

// 🎬 Close video and resume celebration
window.closeVideoSurprise = function () {
    const videoContainer = document.getElementById('videoContainer');
    const video = document.getElementById('surpriseVideo');
    
    if (!videoContainer || !video) return;

    // Pause video
    video.pause();
    video.currentTime = 0;

    // Resume background music
    window.resumeBackgroundMusic();

    // Show background videos again
    const bgVideos = document.querySelectorAll('video[id*="Background"]');
    bgVideos.forEach(v => {
        v.style.opacity = '1';
        v.style.pointerEvents = 'auto';
    });

    // Show canvases again
    const canvases = document.querySelectorAll('canvas');
    canvases.forEach(c => {
        c.style.opacity = '1';
        c.style.pointerEvents = 'auto';
    });

    // Restore celebration box
    const celebrationBox = document.getElementById('celebrationBox');
    if (celebrationBox) {
        celebrationBox.style.display = 'flex';
        celebrationBox.classList.add('show');
    }

    // Hide video container
    videoContainer.style.opacity = '0';
    setTimeout(() => {
        videoContainer.style.display = 'none';
    }, 300);
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
