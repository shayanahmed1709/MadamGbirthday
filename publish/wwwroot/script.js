// ✅ Make hideAppPlaceholder globally available BEFORE Blazor loads
window.hideAppPlaceholder = () => {
    const placeholder = document.getElementById("app-placeholder");
    if (!placeholder) {
        console.warn("⚠️ #app-placeholder not found.");
        return;
    }

    placeholder.style.transition = "opacity 0.5s ease";
    placeholder.style.opacity = "0";
    setTimeout(() => {
        placeholder.style.display = "none";
    }, 500);
};

// 📱 Mobile detection and touch support
const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           window.innerWidth <= 768 ||
           ('ontouchstart' in window);
};

// 🎯 Touch-friendly interactions
const addTouchSupport = () => {
    const buttons = document.querySelectorAll('button, .close-btn, [role="button"]');
    buttons.forEach(button => {
        button.addEventListener('touchstart', function(e) {
            this.style.transform = 'scale(0.95)';
        }, { passive: true });
        
        button.addEventListener('touchend', function(e) {
            this.style.transform = '';
        }, { passive: true });
    });
};

// 📐 Responsive canvas sizing
const resizeCanvasForDevice = (canvas) => {
    if (!canvas) return;
    
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
};

// 🐻 Loading Bear Animation Script
(function () {
    const startLoading = () => {
        const progressFill = document.querySelector('.progress-fill');
        const bear = document.querySelector('.bear-gif');
        if (!progressFill || !bear) return;

        progressFill.style.animation = 'progress 2s infinite linear';
        bear.style.animation = 'walk 2s infinite linear';
    };

    const stopLoading = () => {
        const progressFill = document.querySelector('.progress-fill');
        const bear = document.querySelector('.bear-gif');
        if (!progressFill || !bear) return;

        progressFill.style.animation = 'none';
        bear.style.animation = 'none';
    };

    const setProgress = (percentage) => {
        const progressFill = document.querySelector('.progress-fill');
        const bear = document.querySelector('.bear-gif');
        const progressBar = document.querySelector('.progress-bar');

        if (!progressFill || !bear || !progressBar) return;

        progressFill.style.animation = 'none';
        progressFill.style.width = percentage + '%';

        const barWidth = progressBar.offsetWidth;
        const bearPosition = (barWidth * percentage / 100) - 30;
        bear.style.transform = `translateX(${bearPosition}px)`;
    };

    // 🌐 Expose bear controls globally
    window.loadingBear = {
        startLoading,
        stopLoading,
        setProgress
    };

    // 🧠 Blazor bridge function
    window.startBearLoadingAnimation = function () {
        window.loadingBear?.startLoading?.();
    };

    // 🚀 Start animation once DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        startLoading();
        addTouchSupport();

        setTimeout(() => {
            stopLoading();
            setProgress(100);
        }, 5000);
    });
})();

// 🎵 Auto-play music after first user interaction
(function () {
    const audio = new Audio('romantic.mp3');
    audio.loop = true;
    audio.volume = 0.3; // Lower volume for mobile

    let hasPlayed = false;

    const tryPlay = () => {
        if (hasPlayed) return;
        hasPlayed = true;

        // Mobile-friendly audio play
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(err => {
                console.warn("🎶 Music playback failed:", err);
            });
        }

        // Fade in volume
        audio.volume = 0;
        let vol = 0;
        const fadeIn = setInterval(() => {
            if (vol < 0.3) {
                vol += 0.01;
                audio.volume = vol;
            } else {
                clearInterval(fadeIn);
            }
        }, 100);

        // Remove listeners after first trigger
        document.removeEventListener('click', tryPlay, { passive: true });
        document.removeEventListener('keydown', tryPlay, { passive: true });
        document.removeEventListener('scroll', tryPlay, { passive: true });
        document.removeEventListener('touchstart', tryPlay, { passive: true });
    };

    // Listen for any gesture (including touch)
    document.addEventListener('click', tryPlay, { passive: true });
    document.addEventListener('keydown', tryPlay, { passive: true });
    document.addEventListener('scroll', tryPlay, { passive: true });
    document.addEventListener('touchstart', tryPlay, { passive: true });
})();

// 📱 Mobile-specific optimizations
(function() {
    // Prevent zoom on double tap
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);

    // Handle orientation changes
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            // Resize canvas if it exists
            const canvas = document.getElementById('animationCanvas');
            if (canvas) {
                resizeCanvasForDevice(canvas);
            }
            
            // Trigger resize event for responsive adjustments
            window.dispatchEvent(new Event('resize'));
        }, 100);
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        const canvas = document.getElementById('animationCanvas');
        if (canvas) {
            resizeCanvasForDevice(canvas);
        }
    });

    // Add mobile-specific CSS classes
    if (isMobile()) {
        document.body.classList.add('mobile-device');
    }

    // Optimize for mobile performance
    if (isMobile()) {
        // Reduce animation complexity on mobile
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 768px) {
                .bear-gif {
                    animation-duration: 3s !important;
                }
                .progress-fill {
                    animation-duration: 3s !important;
                }
            }
        `;
        document.head.appendChild(style);
    }
})();
