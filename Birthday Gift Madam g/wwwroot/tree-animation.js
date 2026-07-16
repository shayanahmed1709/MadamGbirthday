// ❤️ Tree Animation Integration
// Combines love.js tree drawing with birthday celebration

(function(window) {
    function random(min, max) {
        return min + Math.floor(Math.random() * (max - min + 1));
    }

    function bezier(cp, t) {  
        var p1 = cp[0].mul((1 - t) * (1 - t));
        var p2 = cp[1].mul(2 * t * (1 - t));
        var p3 = cp[2].mul(t * t); 
        return p1.add(p2).add(p3);
    }  

    function inheart(x, y, r) {
        var z = ((x / r) * (x / r) + (y / r) * (y / r) - 1) * ((x / r) * (x / r) + (y / r) * (y / r) - 1) * ((x / r) * (x / r) + (y / r) * (y / r) - 1) - (x / r) * (x / r) * (y / r) * (y / r) * (y / r);
        return z < 0;
    }

    Point = function(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }
    Point.prototype = {
        clone: function() {
            return new Point(this.x, this.y);
        },
        add: function(o) {
            p = this.clone();
            p.x += o.x;
            p.y += o.y;
            return p;
        },
        sub: function(o) {
            p = this.clone();
            p.x -= o.x;
            p.y -= o.y;
            return p;
        },
        div: function(n) {
            p = this.clone();
            p.x /= n;
            p.y /= n;
            return p;
        },
        mul: function(n) {
            p = this.clone();
            p.x *= n;
            p.y *= n;
            return p;
        }
    }

    Heart = function() {
        var points = [], x, y, t;
        for (var i = 10; i < 30; i += 0.2) {
            t = i / Math.PI;
            x = 16 * Math.pow(Math.sin(t), 3);
            y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
            points.push(new Point(x, y));
        }
        this.points = points;
        this.length = points.length;
    }
    Heart.prototype = {
        get: function(i, scale) {
            return this.points[i].mul(scale || 1);
        }
    }

    Seed = function(tree, point, scale, color) {
        this.tree = tree;
        var scale = scale || 1
        var color = '#ff1493';
        this.heart = {
            point  : point,
            scale  : scale,
            color  : color,
            figure : new Heart(),
        }
        this.cirle = {
            point  : point,
            scale  : scale,
            color  : color,
            radius : 5,
        }
    }
    Seed.prototype = {
        draw: function() {
            this.drawHeart();
            this.drawText();
        },
        addPosition: function(x, y) {
            this.cirle.point = this.cirle.point.add(new Point(x, y));
        },
        canMove: function() {
            return this.cirle.point.y < (this.tree.height + 20); 
        },
        move: function(x, y) {
            this.clear();
            this.drawCirle();
            this.addPosition(x, y);
        },
        canScale: function() {
            return this.heart.scale > 0.2;
        },
        setHeartScale: function(scale) {
            this.heart.scale *= scale;
        },
        scale: function(scale) {
            this.clear();
            this.drawCirle();
            this.drawHeart();
            this.setHeartScale(scale);
        },
        drawHeart: function() {
            var ctx = this.tree.ctx, heart = this.heart;
            var point = heart.point, color = heart.color, 
                scale = heart.scale;
            ctx.save();
            ctx.fillStyle = color;
            ctx.translate(point.x, point.y);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            for (var i = 0; i < heart.figure.length; i++) {
                var p = heart.figure.get(i, scale);
                ctx.lineTo(p.x, -p.y);
            }
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        },
        drawCirle: function() {
            var ctx = this.tree.ctx, cirle = this.cirle;
            var point = cirle.point, color = cirle.color, 
                scale = cirle.scale, radius = cirle.radius;
            ctx.save();
            ctx.fillStyle = color;
            ctx.translate(point.x, point.y);
            ctx.scale(scale, scale);
            ctx.beginPath();
            ctx.moveTo(0, 0);
    	    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        },
        drawText: function() {
            var ctx = this.tree.ctx, heart = this.heart;
            var point = heart.point, color = heart.color, 
                scale = heart.scale;
            var isMobileDevice = window.innerWidth <= 768;
            var displayColor = isMobileDevice ? '#b21040' : color; // Darker deep rose-red on mobile for readability, deep pink on desktop
            var fontSize = isMobileDevice ? "bold 25px 'Dancing Script', cursive" : "bold 16px 'Dancing Script', 'Parisienne', cursive";
            
            ctx.save();
            ctx.strokeStyle = displayColor;
            ctx.fillStyle = displayColor;
            ctx.lineWidth = isMobileDevice ? 3.5 : 2.5; // Thicker line on mobile
            ctx.translate(point.x, point.y);
            ctx.scale(scale, scale);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(15, 15);
            ctx.lineTo(130, 15);
            ctx.stroke();

            ctx.moveTo(0, 0);
            ctx.scale(0.75, 0.75);
            ctx.font = fontSize;
            ctx.fillText("Click Me :) ", 30, -5);
            ctx.fillText("Birthday Queen !", 28, 10);
            ctx.restore();
        },
        clear: function() {
            var ctx = this.tree.ctx, cirle = this.cirle;
            var point = cirle.point, scale = cirle.scale, radius = 26;
            var w = h = (radius * scale);
            ctx.clearRect(point.x - w, point.y - h, 4 * w, 4 * h);
        },
        hover: function(x, y) {
            var ctx = this.tree.ctx;
            var pixel = ctx.getImageData(x, y, 1, 1);
            return pixel.data[3] == 255
        }
    }

    Footer = function(tree, width, height, speed) {
        this.tree = tree;
        this.point = new Point(tree.seed.heart.point.x, tree.height - height / 2);
        this.width = width;
        this.height = height;
        this.speed = speed || 2;
        this.length = 0;
    }
    Footer.prototype = {
        draw: function() {
            var ctx = this.tree.ctx, point = this.point;
            var len = this.length / 2;

            ctx.save();
            ctx.strokeStyle = '#FFF';
            ctx.lineWidth = this.height;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.translate(point.x, point.y);
            ctx.beginPath();
            ctx.moveTo(0, 0);
    	    ctx.lineTo(len, 0);
    	    ctx.lineTo(-len, 0);
            ctx.stroke();
            ctx.restore();

            if (this.length < this.width) {
                this.length += this.speed;
            }
        }
    }

    Tree = function(canvas, width, height, opt) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d', { willReadFrequently: true });
        this.width = width;
        this.height = height;
        this.opt = opt || {};
        this.record = {};
        this.initSeed();
        this.initFooter();
        this.initBranch();
        this.initBloom();
    }
    Tree.prototype = {
        initSeed: function() {
            var seed = this.opt.seed || {};
            var x = seed.x || this.width / 2;
            var y = seed.y || this.height / 2;
            var point = new Point(x, y);
            var color = seed.color || '#FF0000';
            var scale = seed.scale || 1;
            this.seed = new Seed(this, point, scale, color);
        },

        initFooter: function() {
            var footer = this.opt.footer || {};
            var width = footer.width || this.width;
            var height = footer.height || 5;
            var speed = footer.speed || 2;
            this.footer = new Footer(this, width, height, speed);
        },

        initBranch: function() {
            var branchs = this.opt.branch || []
            this.branchs = [];
            this.addBranchs(branchs);
        },

        initBloom: function() {
            var bloom = this.opt.bloom || {};
            var cache = [],
                num = bloom.num || 500, 
                width = bloom.width || this.width,
                height = bloom.height || this.height,
                figure = this.seed.heart.figure;
            var r = 240, x, y;
            for (var i = 0; i < num; i++) {
                cache.push(this.createBloom(width, height, r, figure));
            }
            this.blooms = [];
            this.bloomsCache = cache;
        },

        toDataURL: function(type) {
            return this.canvas.toDataURL(type);
        },

        draw: function(k) {
            var s = this, ctx = s.ctx;
            var rec = s.record[k];
            if (!rec) {
                return ;
            }
            var point = rec.point,
                image = rec.image;

            ctx.save();
            ctx.putImageData(image, point.x, point.y);
        	ctx.restore();
        },

        addBranch: function(branch) {
        	this.branchs.push(branch);
        },

        addBranchs: function(branchs){
            var s = this, b, p1, p2, p3, r, l, c;
        	for (var i = 0; i < branchs.length; i++) {
                b = branchs[i];
                p1 = new Point(b[0], b[1]);
                p2 = new Point(b[2], b[3]);
                p3 = new Point(b[4], b[5]);
                r = b[6];
                l = b[7];
                c = b[8]
                s.addBranch(new Branch(s, p1, p2, p3, r, l, c)); 
            }
        },

        removeBranch: function(branch) {
            var branchs = this.branchs;
        	for (var i = 0; i < branchs.length; i++) {
        		if (branchs[i] === branch) {
        			branchs.splice(i, 1);
                }
            }
        },

        canGrow: function() {
            return !!this.branchs.length;
        },
        grow: function() {
            var branchs = this.branchs;
        	for (var i = 0; i < branchs.length; i++) {
                var branch = branchs[i];
                if (branch) {
                    branch.grow();
                }
            }
        },

        addBloom: function (bloom) {
            this.blooms.push(bloom);
        },

        removeBloom: function (bloom) {
            var blooms = this.blooms;
            for (var i = 0; i < blooms.length; i++) {
                if (blooms[i] === bloom) {
                    blooms.splice(i, 1);
                }
            }
        },

        createBloom: function(width, height, radius, figure, color, alpha, angle, scale, place, speed) {
            var x, y;
            while (true) {
                x = random(20, width - 20);
                y = random(20, height - 20);
                if (inheart(x - width / 2, height - (height - 40) / 2 - y, radius)) {
                    return new Bloom(this, new Point(x, y), figure, color, alpha, angle, scale, place, speed);
                }
            }
        },
        
        canFlower: function() {
            return !!this.blooms.length;
        }, 
        flower: function(num) {
            var s = this, blooms = s.bloomsCache.splice(0, num);
            for (var i = 0; i < blooms.length; i++) {
                s.addBloom(blooms[i]);
            }
            blooms = s.blooms;
            for (var j = 0; j < blooms.length; j++) {
                blooms[j].flower();
            }
        },

        snapshot: function(k, x, y, width, height) {
            var ctx = this.ctx;
            var image = ctx.getImageData(x, y, width, height); 
            this.record[k] = {
                image: image,
                point: new Point(x, y),
                width: width,
                height: height
            }
        },
        setSpeed: function(k, speed) {
            this.record[k || "move"].speed = speed;
        },
        move: function(k, x, y) {
            var s = this, ctx = s.ctx;
            var rec = s.record[k || "move"];
            var point = rec.point,
                image = rec.image,
                speed = rec.speed || 10,
                width = rec.width,
                height = rec.height; 

            i = point.x + speed < x ? point.x + speed : x;
            j = point.y + speed < y ? point.y + speed : y; 

            ctx.save();
            ctx.clearRect(point.x, point.y, width, height);
            ctx.putImageData(image, i, j);
        	ctx.restore();

            rec.point = new Point(i, j);
            rec.speed = speed * 0.95;

            if (rec.speed < 2) {
                rec.speed = 2;
            }
            return i < x || j < y;
        },

        jump: function() {
            var s = this, blooms = s.blooms;
            if (blooms.length) {
                for (var i = 0; i < blooms.length; i++) {
                    blooms[i].jump();
                }
            } 
            if ((blooms.length && blooms.length < 3) || !blooms.length) {
                var bloom = this.opt.bloom || {},
                    width = bloom.width || this.width,
                    height = bloom.height || this.height,
                    figure = this.seed.heart.figure;
                var r = 240, x, y;
                for (var i = 0; i < random(1,2); i++) {
                    blooms.push(this.createBloom(width / 2 + width, height, r, figure, null, 1, null, 1, new Point(random(-100,600), 720), random(200,300)));
                }
            }
        }
    }

    Branch = function(tree, point1, point2, point3, radius, length, branchs) {
        this.tree = tree;
        this.point1 = point1;
        this.point2 = point2;
        this.point3 = point3;
        this.radius = radius;
        this.length = length || 100;    
        this.len = 0;
        this.t = 1 / (this.length - 1);   
        this.branchs = branchs || [];
    }

    Branch.prototype = {
        grow: function() {
            var s = this, p; 
            if (s.len <= s.length) {
                p = bezier([s.point1, s.point2, s.point3], s.len * s.t);
                s.draw(p);
                s.len += 1;
                s.radius *= 0.97;
            } else {
                s.tree.removeBranch(s);
                s.tree.addBranchs(s.branchs);
            }
        },
        draw: function(p) {
            var s = this;
            var ctx = s.tree.ctx;
            ctx.save();
        	ctx.beginPath();
        	ctx.fillStyle = '#FFC0CB';
            ctx.shadowBlur = 2;
        	ctx.moveTo(p.x, p.y);
        	ctx.arc(p.x, p.y, s.radius, 0, 2 * Math.PI);
        	ctx.closePath();
        	ctx.fill();
        }
    }

    Bloom = function(tree, point, figure, color, alpha, angle, scale, place, speed) {
        this.tree = tree;
        this.point = point;
        this.color = color || 'rgb(255,' + random(0, 255) + ',' + random(0, 255) + ')';
        this.alpha = alpha || random(0.3, 1);
        this.angle = angle || random(0, 360);
        this.scale = scale || 0.1;
        this.place = place;
        this.speed = speed;
        this.figure = figure;
    }
    Bloom.prototype = {
        setFigure: function(figure) {
            this.figure = figure;
        },
        flower: function() {
            var s = this;
            s.draw();
            s.scale += 0.1;
            if (s.scale > 1) {
                s.tree.removeBloom(s);
            }
        },
        draw: function() {
            var s = this, ctx = s.tree.ctx, figure = s.figure;

            ctx.save();
            ctx.fillStyle = s.color;
            ctx.globalAlpha = s.alpha;
            ctx.translate(s.point.x, s.point.y);
            ctx.scale(s.scale, s.scale);
            ctx.rotate(s.angle);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            for (var i = 0; i < figure.length; i++) {
                var p = figure.get(i);
                ctx.lineTo(p.x, -p.y);
            }
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        },
        jump: function() {
            var s = this, height = s.tree.height;

            if (s.point.x < -20 || s.point.y > height + 20) {
                s.tree.removeBloom(s);
            } else {
                s.draw();
                s.point = s.place.sub(s.point).div(s.speed).add(s.point);
                s.angle += 0.05;
                s.speed -= 1;
            }
        }
    }

    window.random = random;
    window.bezier = bezier;
    window.Point = Point;
    window.Tree = Tree;

})(window);

// 🤝 Register Blazor loader reference for redirect callbacks
window.registerLoaderRef = function (ref) {
    window.blazorLoaderRef = ref;
};

// 🎁 Initialize and run tree animation on Loader Page
window.initTreeAnimationOnLoader = function() {
    var canvas = $('#canvas');
    if (!canvas[0] || !canvas[0].getContext) {
        console.error("⚠️ Canvas not found or unsupported.");
        return;
    }

    var width = 1100;
    var height = 680;        
    canvas.attr("width", width);
    canvas.attr("height", height);

    // Setup scaling for responsiveness
    function resizeWrap() {
        const wrap = document.getElementById('wrap');
        if (!wrap) return;
        const isMobile = window.innerWidth <= 768;
        const scaleX = window.innerWidth / 1100;
        const scaleY = window.innerHeight / 680;
        const scaleFactor = isMobile ? 1.15 : 0.85; // Bolder and larger scale factor on mobile devices
        const scale = Math.min(scaleX * scaleFactor, scaleY * scaleFactor, scaleFactor);
        wrap.style.transform = `translate(-50%, -50%) scale(${scale})`;
    }
    window.addEventListener('resize', resizeWrap);
    resizeWrap();

    // Floating Hearts Logic
    function createHeart() {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.innerHTML = '❤️';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = Math.random() * 3 + 3 + 's';
        heart.style.opacity = Math.random() * 0.5 + 0.2;
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 6000);
    }
    let heartInterval;

    var opts = {
        seed: { x: width / 2 - 20, color: "rgb(190, 26, 37)", scale: 2 },
        branch: [
            [535, 680, 570, 250, 500, 200, 30, 100, [
                [540, 500, 455, 417, 340, 400, 13, 100, [
                    [450, 435, 434, 430, 394, 395, 2, 40]
                ]],
                [550, 445, 600, 356, 680, 345, 12, 100, [
                    [578, 400, 648, 409, 661, 426, 3, 80]
                ]],
                [539, 281, 537, 248, 534, 217, 3, 40],
                [546, 397, 413, 247, 328, 244, 9, 80, [
                    [427, 286, 383, 253, 371, 205, 2, 40],
                    [498, 345, 435, 315, 395, 330, 4, 60]
                ]],
                [546, 357, 608, 252, 678, 221, 6, 100, [
                    [590, 293, 646, 277, 648, 271, 2, 80]
                ]]
            ]] 
        ],
        bloom: { num: 700, width: 1080, height: 650 },
        footer: { width: 1200, height: 5, speed: 10 }
    };

    var tree = new Tree(canvas[0], width, height, opts);
    var seed = tree.seed;
    var foot = tree.footer;
    var hold = 1;

    canvas.click(function(e) {
        var rect = canvas[0].getBoundingClientRect();
        var physicalX = e.clientX - rect.left;
        var physicalY = e.clientY - rect.top;
        var x = (physicalX / rect.width) * 1100;
        var y = (physicalY / rect.height) * 680;
        
        var dx = x - seed.heart.point.x;
        var dy = y - seed.heart.point.y;
        var distance = Math.sqrt(dx * dx + dy * dy);
        
        var clickRadius = (window.innerWidth <= 768) ? 100 : 70;
        
        if (distance < clickRadius || seed.hover(x, y)) {
            hold = 0; 
            canvas.unbind("click");
            canvas.unbind("mousemove");
            canvas.removeClass('hand');
            
            // Start background music playback
            window.playBackgroundMusic?.();
            
            // Start releasing balloons
            window.releaseBalloons?.(5);

            // Start floating hearts
            heartInterval = setInterval(createHeart, 300);
        }
    }).mousemove(function(e) {
        var rect = canvas[0].getBoundingClientRect();
        var physicalX = e.clientX - rect.left;
        var physicalY = e.clientY - rect.top;
        var x = (physicalX / rect.width) * 1100;
        var y = (physicalY / rect.height) * 680;
        
        var dx = x - seed.heart.point.x;
        var dy = y - seed.heart.point.y;
        var distance = Math.sqrt(dx * dx + dy * dy);
        
        var hoverRadius = (window.innerWidth <= 768) ? 100 : 70;
        canvas.toggleClass('hand', distance < hoverRadius || seed.hover(x, y));
    });

    var seedAnimate = eval(Jscex.compile("async", function () {
        seed.draw();
        while (hold) { $await(Jscex.Async.sleep(10)); }
        
        // Completely clear the canvas once to erase the initial text, line, and large heart
        var ctx = seed.tree.ctx;
        ctx.clearRect(0, 0, seed.tree.width, seed.tree.height);
        
        while (seed.canScale()) { seed.scale(0.95); $await(Jscex.Async.sleep(10)); }
        while (seed.canMove()) { seed.move(0, 2); foot.draw(); $await(Jscex.Async.sleep(10)); }
    }));

    var growAnimate = eval(Jscex.compile("async", function () {
        do { tree.grow(); $await(Jscex.Async.sleep(10)); } while (tree.canGrow());
    }));

    var flowAnimate = eval(Jscex.compile("async", function () {
        do { tree.flower(2); $await(Jscex.Async.sleep(10)); } while (tree.canFlower());
    }));

    var moveAnimate = eval(Jscex.compile("async", function () {
        tree.snapshot("p1", 240, 0, 610, 680);
        while (tree.move("p1", 500, 0)) { foot.draw(); $await(Jscex.Async.sleep(10)); }
        foot.draw();
        tree.snapshot("p2", 500, 0, 610, 680);
        
        // Save the finished state
        window.finishedTreeImage = canvas[0].toDataURL('image/png');
        
        canvas.parent().css("background", "url(" + window.finishedTreeImage + ")");
        canvas.css("background", "transparent");
        $await(Jscex.Async.sleep(300));
        canvas.css("background", "none");
    }));

    var runAsync = eval(Jscex.compile("async", function () {
        $await(seedAnimate());
        $await(growAnimate());
        $await(flowAnimate());
        $await(moveAnimate());
        
        // Cleanup hearts and listeners
        if (heartInterval) clearInterval(heartInterval);
        window.removeEventListener('resize', resizeWrap);

        // Redirect to Home page
        if (window.blazorLoaderRef) {
            window.blazorLoaderRef.invokeMethodAsync('OnTreeAnimationComplete');
        }
    }));

    runAsync().start();
};

// 🎨 Draw fully grown tree on Home page
window.drawFinishedTree = function() {
    const canvas = document.getElementById('treeCanvas');
    if (!canvas) return;

    canvas.width = 1100;
    canvas.height = 680;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 1100, 680);

    if (window.finishedTreeImage) {
        const img = new Image();
        img.onload = function() {
            ctx.drawImage(img, 0, 0);
        };
        img.src = window.finishedTreeImage;
    }

    function resizeWrapHome() {
        const wrap = document.getElementById('wrap');
        if (!wrap) return;
        const isMobile = window.innerWidth <= 768;
        const scaleX = window.innerWidth / 1100;
        const scaleY = window.innerHeight / 680;
        const scaleFactor = isMobile ? 1.15 : 0.85;
        const scale = Math.min(scaleX * scaleFactor, scaleY * scaleFactor, scaleFactor);
        wrap.style.transform = `translate(-50%, -50%) scale(${scale})`;
    }
    window.addEventListener('resize', resizeWrapHome);
    resizeWrapHome();
};

// 🎉 Show celebration message
window.showCelebrationMessage = function() {
    const box = document.getElementById('messageBox');
    if (box) {
        box.style.display = 'flex';
        setTimeout(() => {
            box.classList.add('show');
            window.typewriterMessages();
        }, 100);
    }
};

// ✍️ Sequential Typewriter effect for wishes
window.typewriterMessages = function() {
    const box = document.getElementById('messageBox');
    if (!box) return;

    const lines = box.querySelectorAll('.message-text');
    if (lines.length === 0) return;

    const blowButton = box.querySelector('button');
    if (blowButton) {
        blowButton.style.opacity = '0';
        blowButton.style.pointerEvents = 'none';
    }

    // Capture wishes
    const texts = [];
    lines.forEach((line) => {
        texts.push(line.innerHTML);
        line.innerHTML = '';
        line.style.display = 'none';
    });

    let currentLineIdx = 0;

    function typeLine() {
        if (currentLineIdx >= lines.length) {
            if (blowButton) {
                blowButton.style.opacity = '1';
                blowButton.style.pointerEvents = 'auto';
            }
            return;
        }

        const line = lines[currentLineIdx];
        line.style.display = 'block';
        const fullText = texts[currentLineIdx];
        let progress = 0;

        const timer = setInterval(() => {
            var current = fullText.substr(progress, 1);
            if (current === '<') {
                progress = fullText.indexOf('>', progress) + 1;
            } else {
                progress++;
            }

            line.innerHTML = fullText.substring(0, progress) + (progress & 1 ? '_' : '');

            if (progress >= fullText.length) {
                clearInterval(timer);
                line.innerHTML = fullText;
                currentLineIdx++;
                setTimeout(typeLine, 500);
            }
        }, 75);
    }

    typeLine();
};

// ✍️ Sequential Typewriter effect for celebration box
window.typewriterCelebration = function() {
    const box = document.getElementById('celebrationBox');
    if (!box) return;

    const lines = box.querySelectorAll('.celebration-text');
    if (lines.length === 0) return;

    const surpriseButton = box.querySelector('button');
    if (surpriseButton) {
        surpriseButton.style.opacity = '0';
        surpriseButton.style.pointerEvents = 'none';
    }

    // Capture texts
    const texts = [];
    lines.forEach((line) => {
        texts.push(line.innerHTML);
        line.innerHTML = '';
        line.style.display = 'none';
    });

    let currentLineIdx = 0;

    function typeLine() {
        if (currentLineIdx >= lines.length) {
            if (surpriseButton) {
                surpriseButton.style.opacity = '1';
                surpriseButton.style.pointerEvents = 'auto';
            }
            return;
        }

        const line = lines[currentLineIdx];
        line.style.display = 'block';
        const fullText = texts[currentLineIdx];
        let progress = 0;

        const timer = setInterval(() => {
            var current = fullText.substr(progress, 1);
            if (current === '<') {
                progress = fullText.indexOf('>', progress) + 1;
            } else {
                progress++;
            }

            line.innerHTML = fullText.substring(0, progress) + (progress & 1 ? '_' : '');

            if (progress >= fullText.length) {
                clearInterval(timer);
                line.innerHTML = fullText;
                currentLineIdx++;
                setTimeout(typeLine, 500);
            }
        }, 75);
    }

    typeLine();
};

// 🤝 Start the celebration flow from the greeting container
window.startCelebrationFlowJS = function() {
    // Reset cake image back to unlit candles GIF
    const cake = document.getElementById('cakeImage');
    if (cake) {
        cake.src = 'cake_candles_off.gif';
        cake.classList.remove('cake-lit');
        cake.classList.add('cake-unlit');
    }

    // Hide greeting container with fade out
    const greeting = document.getElementById('greetingContainer');
    if (greeting) {
        greeting.style.opacity = '0';
        setTimeout(() => {
            greeting.style.display = 'none';
        }, 500);
    }
    
    // Hide tree canvas from behind the message box
    const wrap = document.getElementById('wrap');
    if (wrap) {
        wrap.style.opacity = '0';
        setTimeout(() => {
            wrap.style.display = 'none';
        }, 500);
    }
    
    // Show wishes popup with sequential typewriter effect
    window.showCelebrationMessage();
};

// ✍️ Typewriter effect for main heading
window.typewriterHeading = function() {
    const heading = document.getElementById('greetingHeading');
    const button = document.querySelector('.celebrate-btn');
    if (!heading) return;
    
    const text = "Happy Birthday Madam G";
    heading.innerHTML = '';
    
    if (button) {
        button.style.opacity = '0';
        button.style.pointerEvents = 'none';
    }
    
    let progress = 0;
    const timer = setInterval(() => {
        heading.innerHTML = text.substring(0, progress) + (progress & 1 ? '_' : '');
        progress++;
        if (progress > text.length) {
            clearInterval(timer);
            heading.innerHTML = text;
            
            // Fade in start button once typing is finished
            if (button) {
                button.style.opacity = '1';
                button.style.pointerEvents = 'auto';
            }
        }
    }, 90);
};

// 🤝 Restore greeting and tree canvas when popups close
window.restoreGreetingAndTree = function() {
    const greeting = document.getElementById('greetingContainer');
    if (greeting) {
        greeting.style.display = 'flex';
        setTimeout(() => {
            greeting.style.opacity = '1';
        }, 50);
    }
    const wrap = document.getElementById('wrap');
    if (wrap) {
        wrap.style.display = 'block';
        setTimeout(() => {
            if (window.innerWidth <= 768) {
                wrap.style.opacity = '0.35';
            } else {
                wrap.style.opacity = '1';
            }
        }, 50);
    }
};
