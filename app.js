/* ═══════════════════════════════════════════
   РАСПИСАНИЕ — загружается из schedule.json
   Редактируется через admin.html
═══════════════════════════════════════════ */
let SCHEDULE_EVENTS = [
];

// Загрузка из schedule.json (перезаписывает fallback)
(async function loadSchedule() {
    try {
        const res = await fetch('schedule.json?t=' + Date.now());
        if (res.ok) {
            const data = await res.json();
            if (data.events && data.events.length > 0) {
                SCHEDULE_EVENTS = data.events;
            }
        }
    } catch (e) {}
})();

/* ═══════════════════════════════════════════
   ИГРЫ / ДИСЦИПЛИНЫ
   Картинки из папки assets/ (800x1067 px)
═══════════════════════════════════════════ */
const GAMES_DATA = [
    {
        name: "Minecraft",
        genre: "Sandbox · Survival",
        desc: "Строим, выживаем и устраиваем безумие в мире блоков!",
        image: "assets/minecraft.png"
    },
    {
        name: "Brawl Stars",
        genre: "Mobile · Battle Royale",
        desc: "Динамичные 3v3 бои и королевские битвы на мобилках!",
        image: "assets/brawlstars.png"
    },
    {
        name: "Euro Truck Sim 2",
        genre: "Simulator · Driving",
        desc: "Дальнобойные маршруты по Европе под чиллоу-музыку.",
        image: "assets/ets2.png"
    },
    {
        name: "Counter-Strike 2",
        genre: "FPS · Competitive",
        desc: "Тактический шутер и напряжённые матчи на высоком уровне.",
        image: "assets/cs2.png"
    }
];



/* ═══════════════════════════════════════════
   CONFIG
═══════════════════════════════════════════ */
const CONFIG = {
    twitchChannel: 'dimakovboi'
};


/* ═══════════════════════════════════════════
   TWITCH FOLLOWERS
═══════════════════════════════════════════ */
(async function fetchTwitchFollowers() {
    const el = document.getElementById('followerCount');
    try {
        const res = await fetch(`https://decapi.me/twitch/followcount/${CONFIG.twitchChannel}`);
        if (res.ok) {
            const v = await res.text();
            if (!isNaN(parseInt(v))) {
                el.textContent = parseInt(v).toLocaleString('ru-RU');
                return;
            }
        }
    } catch (e) {}
    el.textContent = '—';
})();


/* ═══════════════════════════════════════════
   ANIMATED BACKGROUND — ДИНАМИЧНЫЙ
   Больше частиц, движение, мерцание
═══════════════════════════════════════════ */
(function initBackground() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas || !canvas.getContext) {
        document.body.classList.add('no-canvas');
        return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        document.body.classList.add('no-canvas');
        return;
    }

    let w, h;

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }

    // === Светлячки (маленькие яркие точки) ===
    class Firefly {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.size = 1.5 + Math.random() * 3;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.alpha = 0.6 + Math.random() * 0.4;
            this.glow = 15 + Math.random() * 25;
            this.pulse = Math.random() * Math.PI * 2;
            this.pulseSpeed = 0.02 + Math.random() * 0.04;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.pulse += this.pulseSpeed;
            if (this.x < -20) this.x = w + 20;
            if (this.x > w + 20) this.x = -20;
            if (this.y < -20) this.y = h + 20;
            if (this.y > h + 20) this.y = -20;
        }
        draw(ctx) {
            const a = this.alpha * (0.5 + Math.sin(this.pulse) * 0.5);
            ctx.save();
            ctx.globalAlpha = a;
            ctx.shadowBlur = this.glow;
            ctx.shadowColor = 'rgba(0, 255, 102, 0.8)';
            ctx.fillStyle = '#00ff66';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // === Орбы (крупные световые пятна) ===
    class Orb {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.radius = 200 + Math.random() * 200;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.hue = 140 + Math.random() * 30;
            this.alpha = 0.06 + Math.random() * 0.09;
            this.pulse = Math.random() * Math.PI * 2;
            this.pulseSpeed = 0.006 + Math.random() * 0.012;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.pulse += this.pulseSpeed;
            if (this.x < -this.radius) this.x = w + this.radius;
            if (this.x > w + this.radius) this.x = -this.radius;
            if (this.y < -this.radius) this.y = h + this.radius;
            if (this.y > h + this.radius) this.y = -this.radius;
        }
        draw(ctx) {
            const a = this.alpha + Math.sin(this.pulse) * 0.03;
            const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
            grad.addColorStop(0, `hsla(${this.hue}, 100%, 50%, ${a})`);
            grad.addColorStop(0.5, `hsla(${this.hue}, 100%, 50%, ${a * 0.4})`);
            grad.addColorStop(1, `hsla(${this.hue}, 100%, 50%, 0)`);
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // === Частицы (мелкие мерцающие точки) ===
    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.size = 1 + Math.random() * 2;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.alpha = 0.3 + Math.random() * 0.7;
            this.twinkle = Math.random() * Math.PI * 2;
            this.twinkleSpeed = 0.02 + Math.random() * 0.05;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.twinkle += this.twinkleSpeed;
            if (this.x < 0) this.x = w;
            if (this.x > w) this.x = 0;
            if (this.y < 0) this.y = h;
            if (this.y > h) this.y = 0;
        }
        draw(ctx) {
            const a = this.alpha * (0.4 + Math.sin(this.twinkle) * 0.6);
            ctx.fillStyle = `rgba(0, 255, 102, ${a})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // === Линии связи ===
    function drawLines(particles) {
        const maxDist = 150;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < maxDist) {
                    const a = (1 - dist / maxDist) * 0.3;
                    ctx.strokeStyle = `rgba(0, 255, 102, ${a})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    let fireflies = [];
    let orbs = [];
    let particles = [];

    function drawGrid() {
        const gridSize = 60;
        ctx.strokeStyle = 'rgba(0, 255, 102, 0.04)';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        for (let x = 0; x <= w; x += gridSize) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
        }
        for (let y = 0; y <= h; y += gridSize) {
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
        }
        ctx.stroke();
    }

    function animate() {
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = '#08090c';
        ctx.fillRect(0, 0, w, h);

        drawGrid();

        orbs.forEach(o => { o.update(); o.draw(ctx); });
        fireflies.forEach(f => { f.update(); f.draw(ctx); });
        particles.forEach(p => { p.update(); p.draw(ctx); });
        drawLines(particles);
        drawLines(particles);

        requestAnimationFrame(animate);
    }

    function init() {
        resize();
        fireflies = [];
        orbs = [];
        particles = [];
        for (let i = 0; i < 30; i++) fireflies.push(new Firefly());
        for (let i = 0; i < 5; i++) orbs.push(new Orb());
        for (let i = 0; i < 40; i++) particles.push(new Particle());
        animate();
    }

    window.addEventListener('resize', resize);
    init();
})();


/* ═══════════════════════════════════════════
   RENDER: GAME CARDS
═══════════════════════════════════════════ */
(function renderGames() {
    const grid = document.getElementById('gamesGrid');
    GAMES_DATA.forEach(game => {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.innerHTML = `
            <div class="game-card-bg" style="background-image: url('${game.image}')"></div>
            <div class="game-card-overlay"></div>
            <div class="game-card-content">
                <div class="game-card-genre">${game.genre}</div>
                <div class="game-card-name">${game.name}</div>
                <div class="game-card-desc">${game.desc}</div>
            </div>
            <div class="game-card-glow"></div>
        `;
        grid.appendChild(card);
    });
})();


/* ═══════════════════════════════════════════
   CALENDAR
═══════════════════════════════════════════ */
(function initMonthlyCalendar() {
    let currentDate = new Date();

    const monthNames = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];

    const monthDisplay = document.getElementById('monthDisplay');
    const monthGrid = document.getElementById('monthGrid');
    const prevBtn = document.getElementById('prevMonthBtn');
    const nextBtn = document.getElementById('nextMonthBtn');

    function renderMonth() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        monthDisplay.textContent = `${monthNames[month]} ${year}`;
        monthGrid.innerHTML = '';

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        let firstDayOfWeek = firstDay.getDay() - 1;
        if (firstDayOfWeek === -1) firstDayOfWeek = 6;
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        const today = new Date();

        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
            const cell = document.createElement('div');
            cell.className = 'calendar-cell other-month';
            cell.innerHTML = `<span class="cell-date-num">${prevMonthLastDay - i}</span>`;
            monthGrid.appendChild(cell);
        }

        for (let day = 1; day <= lastDay.getDate(); day++) {
            const cell = document.createElement('div');
            const m = String(month + 1).padStart(2, '0');
            const d = String(day).padStart(2, '0');
            const dateKey = `${year}-${m}-${d}`;
            const events = SCHEDULE_EVENTS.filter(e => e.date === dateKey);
            const hasEvents = events.length > 0;
            const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
            cell.className = `calendar-cell${hasEvents ? ' has-events' : ''}${isToday ? ' today' : ''}`;

            let eventsHTML = '';
            events.forEach(e => {
                const icon = e.type === 'stream' ? '🟧' : '🟩';
                eventsHTML += `<div class="schedule-event ${e.type}"><span class="schedule-event-time">${icon} ${e.time}</span><span class="schedule-event-title">${e.title}</span></div>`;
            });

            cell.innerHTML = `<span class="cell-date-num">${day}</span>${eventsHTML}`;
            monthGrid.appendChild(cell);
        }

        const totalCells = monthGrid.children.length;
        const remaining = (7 - (totalCells % 7)) % 7;
        for (let i = 1; i <= remaining; i++) {
            const cell = document.createElement('div');
            cell.className = 'calendar-cell other-month';
            cell.innerHTML = `<span class="cell-date-num">${i}</span>`;
            monthGrid.appendChild(cell);
        }
    }

    prevBtn.addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() - 1); renderMonth(); });
    nextBtn.addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() + 1); renderMonth(); });
    renderMonth();
})();


/* ═══════════════════════════════════════════
   3D TILT
═══════════════════════════════════════════ */
(function init3DTilt() {
    document.querySelectorAll('.game-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            card.style.transform = `perspective(1000px) rotateX(${((y - cy) / cy) * -10}deg) rotateY(${((x - cx) / cx) * 10}deg) scale3d(1.03,1.03,1.03)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)';
        });
    });
})();


/* ═══════════════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════════════ */
(function initScrollReveal() {
    let idx = 0;
    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), idx * 80);
                idx++;
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();


/* ═══════════════════════════════════════════
   HEADER SCROLL
═══════════════════════════════════════════ */
(function initHeaderScroll() {
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.pageYOffset > 80);
    });
})();


/* ═══════════════════════════════════════════
   MOBILE MENU
═══════════════════════════════════════════ */
(function initMobileMenu() {
    const toggle = document.getElementById('mobileToggle');
    const nav = document.getElementById('mainNav');
    toggle.addEventListener('click', () => {
        nav.classList.toggle('open');
        toggle.classList.toggle('active');
    });
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('open');
            toggle.classList.remove('active');
        });
    });
})();


/* ═══════════════════════════════════════════
   SMOOTH SCROLL
═══════════════════════════════════════════ */
(function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
})();


/* ═══════════════════════════════════════════
   TWITCH EMBED — AUTO DOMAIN
═══════════════════════════════════════════ */
(function fixTwitchEmbed() {
    const iframe = document.querySelector('.stream-player iframe');
    if (iframe) {
        const parent = window.location.hostname || 'localhost';
        iframe.src = `https://player.twitch.tv/?channel=${CONFIG.twitchChannel}&parent=${parent}&muted=true`;
    }
})();


/* ═══════════════════════════════════════════
   PARALLAX — фон движется медленнее контента
═══════════════════════════════════════════ */
(function initParallax() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    window.addEventListener('scroll', () => {
        const scroll = window.pageYOffset;
        canvas.style.transform = `translateY(${scroll * 0.3}px)`;
    });
})();


/* ═══════════════════════════════════════════
   COUNTDOWN — таймер до следующего стрима
═══════════════════════════════════════════ */
(function initCountdown() {
    const el = document.getElementById('countdown');
    if (!el) return;

    function getNextStream() {
        const now = new Date();
        const streams = SCHEDULE_EVENTS
            .filter(e => e.type === 'stream')
            .map(e => {
                const [y, m, d] = e.date.split('-').map(Number);
                const [hh, mm] = e.time.split(':').map(Number);
                return { date: new Date(y, m - 1, d, hh, mm), title: e.title };
            })
            .filter(s => s.date > now)
            .sort((a, b) => a.date - b.date);
        return streams[0] || null;
    }

    function update() {
        const next = getNextStream();
        if (!next) {
            el.innerHTML = '<div class="countdown-label">Ближайший стрим скоро!</div>';
            return;
        }

        const diff = next.date - new Date();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);

        el.innerHTML = `
            <div class="countdown-title">Следующий стрим: ${next.title}</div>
            <div class="countdown-boxes">
                <div class="countdown-box"><span class="countdown-num">${String(days).padStart(2,'0')}</span><span class="countdown-label">Дней</span></div>
                <div class="countdown-sep">:</div>
                <div class="countdown-box"><span class="countdown-num">${String(hours).padStart(2,'0')}</span><span class="countdown-label">Часов</span></div>
                <div class="countdown-sep">:</div>
                <div class="countdown-box"><span class="countdown-num">${String(mins).padStart(2,'0')}</span><span class="countdown-label">Минут</span></div>
                <div class="countdown-sep">:</div>
                <div class="countdown-box"><span class="countdown-num">${String(secs).padStart(2,'0')}</span><span class="countdown-label">Секунд</span></div>
            </div>
        `;
    }

    update();
    setInterval(update, 1000);
})();
