/* ═══════════════════════════════════════════════════════════
   NEON SNAKE – Game Logic, Sound, Controls, Touch/Swipe, D-Pad
   Adaptive Input & Canvas Management Engine
   Localization (English / Arabic), Main Menu & Settings
   ═══════════════════════════════════════════════════════════ */

// ── DOM References ──
const canvas           = document.getElementById('gameCanvas');
const ctx              = canvas.getContext('2d');
const scoreEl          = document.getElementById('score');
const highScoreEl      = document.getElementById('high-score');
const finalScoreEl     = document.getElementById('final-score');
const finalHSEl        = document.getElementById('final-high-score');
const newHSBadge       = document.getElementById('new-high-score-badge');

// Overlays
const mainMenuScreen   = document.getElementById('main-menu-screen');
const modeSelectScreen = document.getElementById('mode-select-screen');
const settingsScreen   = document.getElementById('settings-screen');
const pauseScreen      = document.getElementById('pause-screen');
const gameOverScr      = document.getElementById('game-over-screen');
const resetHsModal     = document.getElementById('reset-hs-modal');

// Buttons
const menuPlayBtn        = document.getElementById('menu-play-btn');
const menuSettingsBtn    = document.getElementById('menu-settings-btn');
const modeSelectCloseBtn = document.getElementById('mode-select-close-btn');
const modeClassicBtn     = document.getElementById('mode-classic-btn');
const settingsCloseBtn   = document.getElementById('settings-close-btn');
const restartBtn       = document.getElementById('restart-btn');
const resumeBtn        = document.getElementById('resume-btn');
const pauseMenuBtn     = document.getElementById('pause-menu-btn');
const gameoverMenuBtn  = document.getElementById('gameover-menu-btn');
const pauseBtn         = document.getElementById('pause-btn');
const soundBtn         = document.getElementById('sound-btn');
const soundOnIcon      = document.getElementById('sound-on-icon');
const soundOffIcon     = document.getElementById('sound-off-icon');
const pauseIcon        = document.getElementById('pause-icon');
const playIcon         = document.getElementById('play-icon');
const volDownBtn       = document.getElementById('vol-down-btn');
const volUpBtn         = document.getElementById('vol-up-btn');
const volDisplay       = document.getElementById('vol-display');

// Settings Elements
const settingMusicBtn    = document.getElementById('setting-music-btn');
const settingMusicText   = document.getElementById('setting-music-text');
const settingSfxBtn      = document.getElementById('setting-sfx-btn');
const settingSfxText     = document.getElementById('setting-sfx-text');
const settingVolDownBtn  = document.getElementById('setting-vol-down-btn');
const settingVolUpBtn    = document.getElementById('setting-vol-up-btn');
const settingVolDisplay  = document.getElementById('setting-vol-display');
const settingResetHsBtn  = document.getElementById('setting-reset-hs-btn');
const resetConfirmYes    = document.getElementById('reset-confirm-yes');
const resetConfirmNo     = document.getElementById('reset-confirm-no');

// Language Selector Buttons
const langBtnEn        = document.getElementById('lang-btn-en');
const langBtnAr        = document.getElementById('lang-btn-ar');

const burstEl          = document.getElementById('particle-burst');
const wrapper          = document.querySelector('.canvas-wrapper');
const dpadContainer    = document.getElementById('dpad-container');

// ── Constants & Grid Calculation ──
const TILES    = 20;
const INIT_SPD = 100;
const MIN_SPD  = 50;
const SPD_STEP = 2;

let GRID = 30; // Dynamically computed CSS pixels per tile

/* ══════════════════════════════════════════════════════════
   TRANSLATION / LOCALIZATION (i18n)
   ══════════════════════════════════════════════════════════ */
const i18n = {
    en: {
        subtitle: 'CYBERPUNK EDITION',
        score: 'SCORE',
        best: 'BEST',
        play: '▶ PLAY',
        settings: '⚙ SETTINGS',
        selectMode: 'SELECT MODE',
        modeClassic: 'CLASSIC',
        modeClassicDesc: 'The original Neon Snake experience.',
        modeComingSoon: '🔒 COMING SOON',
        modeComingSoonDesc: 'More game modes under development.',
        modeReady: 'PLAY',
        settingsTitle: 'SETTINGS',
        music: 'MUSIC',
        sfx: 'SOUND EFFECTS',
        volume: 'MUSIC VOLUME',
        controls: 'CONTROLS',
        arrowsOrWasd: '↑↓←→ / WASD',
        swipeOrDpad: 'SWIPE / D-PAD',
        move: 'Move',
        pause: 'Pause',
        toggleSound: 'Sound',
        resetHighScore: '🗑 RESET BEST SCORE',
        resetConfirmText: 'Reset best score to 0?',
        confirmYes: 'YES, RESET',
        confirmCancel: 'CANCEL',
        back: '◀ BACK',
        paused: 'PAUSED',
        resume: '▶ RESUME',
        mainMenu: '🏠 MAIN MENU',
        gameOver: 'GAME OVER',
        newBest: '🏆 NEW BEST!',
        playAgain: '↺ PLAY AGAIN',
        on: 'ON',
        off: 'OFF'
    },
    ar: {
        subtitle: 'نسخة السايبربانك',
        score: 'النقاط',
        best: 'الأفضل',
        play: '▶ بدء اللعب',
        settings: '⚙ الإعدادات',
        selectMode: 'اختر النمط',
        modeClassic: 'كلاسيك',
        modeClassicDesc: 'تجربة Neon Snake الأصلية.',
        modeComingSoon: '🔒 قريبًا',
        modeComingSoonDesc: 'المزيد من أنماط اللعب قيد التطوير.',
        modeReady: 'لعب',
        settingsTitle: 'الإعدادات',
        music: 'الموسيقى',
        sfx: 'المؤثرات الصوتية',
        volume: 'مستوى صوت الموسيقى',
        controls: 'أزرار التحكم',
        arrowsOrWasd: '↑↓←→ / WASD',
        swipeOrDpad: 'السحب / الأسهم',
        move: 'تحريك',
        pause: 'إيقاف مؤقت',
        toggleSound: 'كتم الصوت',
        resetHighScore: '🗑 تصفير أفضل نتيجة',
        resetConfirmText: 'هل تريد تصفير أفضل نتيجة؟',
        confirmYes: 'نعم، تصفير',
        confirmCancel: 'إلغاء',
        back: '◀ رجوع',
        paused: 'موقفة مؤقتاً',
        resume: '▶ متابعة',
        mainMenu: '🏠 القائمة الرئيسية',
        gameOver: 'انتهت اللعبة',
        newBest: '🏆 رقم قياسي جديد!',
        playAgain: '↺ العب مجدداً',
        on: 'تشغيل',
        off: 'إيقاف'
    }
};

let currentLang = localStorage.getItem('snakeLanguage') || 'en';

function setLanguage(lang) {
    if (!i18n[lang]) lang = 'en';
    currentLang = lang;
    localStorage.setItem('snakeLanguage', lang);

    document.documentElement.lang = lang;
    document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (i18n[lang] && i18n[lang][key]) {
            el.textContent = i18n[lang][key];
        }
    });

    if (langBtnEn && langBtnAr) {
        langBtnEn.classList.toggle('active', lang === 'en');
        langBtnAr.classList.toggle('active', lang === 'ar');
    }

    updateSettingTogglesUI();
}

langBtnEn.addEventListener('click', () => {
    sounds.click();
    setLanguage('en');
});

langBtnAr.addEventListener('click', () => {
    sounds.click();
    setLanguage('ar');
});

/* ══════════════════════════════════════════════════════════
   CANVAS AUTO-SCALING & RESIZE ENGINE
   High-DPI aware (devicePixelRatio):
   All rendering occurs in CSS pixel units, backing buffer is crisp.
   ══════════════════════════════════════════════════════════ */
function resizeCanvas() {
    if (!wrapper) return;
    const rect = wrapper.getBoundingClientRect();
    const cssSize = Math.floor(rect.width);
    if (cssSize <= 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    const backing = Math.round(cssSize * dpr);

    if (canvas.width !== backing || canvas.height !== backing) {
        canvas.width  = backing;
        canvas.height = backing;
    }

    GRID = cssSize / TILES;

    const gridCss = cssSize / TILES;
    wrapper.style.setProperty('--grid-css', `${gridCss}px`);
    canvas.style.backgroundSize = `${gridCss}px ${gridCss}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawFrame();
}

let resizeDebounce = null;
window.addEventListener('resize', () => {
    resizeCanvas();
    if (resizeDebounce) clearTimeout(resizeDebounce);
    resizeDebounce = setTimeout(resizeCanvas, 100);
});

window.addEventListener('orientationchange', () => {
    setTimeout(resizeCanvas, 150);
});

/* ══════════════════════════════════════════════════════════
   ADAPTIVE INPUT DETECTION (Touch, Mouse, Keyboard, Hybrid)
   ══════════════════════════════════════════════════════════ */
function initInputAdaptation() {
    const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const hasTouchSupport  = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    if (hasCoarsePointer || hasTouchSupport) {
        document.body.classList.add('touch-active');
    }

    window.addEventListener('touchstart', () => {
        document.body.classList.add('touch-active');
    }, { passive: true, once: true });
}
initInputAdaptation();

/* ══════════════════════════════════════════════════════════
   GAME STATE
   ══════════════════════════════════════════════════════════ */
let snake, food, dx, dy, ndx, ndy;
let score, highScore;
let gameSpeed, gameLoopInterval;
let isGameOver, isPaused, gameStarted;
let foodPulse = 0;
let isNewHS   = false;

/* ══════════════════════════════════════════════════════════
   SOUND & MUSIC SYSTEM
   ══════════════════════════════════════════════════════════ */
let audioCtx = null;
let bgMusic = null;
let soundEnabled = localStorage.getItem('snakeSoundEnabled') !== 'false';
let musicEnabled = localStorage.getItem('snakeMusicEnabled') !== 'false';
let sfxEnabled   = localStorage.getItem('snakeSfxEnabled') !== 'false';
let bgmVolumePercent = parseInt(localStorage.getItem('snakeBgmVolume'), 10);
if (isNaN(bgmVolumePercent)) bgmVolumePercent = 2;

function applyVolumeUI() {
    volDisplay.textContent = bgmVolumePercent + '%';
    if (settingVolDisplay) settingVolDisplay.textContent = bgmVolumePercent + '%';
    if (bgMusic) {
        bgMusic.volume = (soundEnabled && musicEnabled) ? bgmVolumePercent / 100 : 0;
    }
}

function getAudioCtx() {
    if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) audioCtx = new AudioContextClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

function playTone(freq, type, duration, gainVal, delay = 0) {
    if (!soundEnabled || !sfxEnabled) return;
    try {
        const ac = getAudioCtx();
        if (!ac) return;
        const osc = ac.createOscillator();
        const g   = ac.createGain();
        osc.connect(g);
        g.connect(ac.destination);
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ac.currentTime + delay);
        g.gain.setValueAtTime(gainVal, ac.currentTime + delay);
        g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + delay + duration);
        osc.start(ac.currentTime + delay);
        osc.stop(ac.currentTime + delay + duration);
    } catch (_) {}
}

const sounds = {
    eat()       { playTone(600, 'sine', 0.06, 0.18); playTone(900, 'sine', 0.06, 0.10, 0.04); },
    die()       { playTone(220, 'sawtooth', 0.20, 0.22); playTone(150, 'sawtooth', 0.25, 0.18, 0.18); playTone(100, 'sawtooth', 0.30, 0.12, 0.38); },
    start()     { [440, 554, 659, 880].forEach((f, i) => playTone(f, 'sine', 0.12, 0.15, i * 0.08)); },
    click()     { playTone(1000, 'sine', 0.04, 0.12); },
    highScore() { [523, 659, 784, 1047].forEach((f, i) => playTone(f, 'sine', 0.15, 0.13, i * 0.09)); }
};

function applySoundUI() {
    if (soundEnabled) {
        soundOnIcon.classList.remove('hidden-icon');
        soundOffIcon.classList.add('hidden-icon');
        soundBtn.classList.add('active');
    } else {
        soundOnIcon.classList.add('hidden-icon');
        soundOffIcon.classList.remove('hidden-icon');
        soundBtn.classList.remove('active');
    }
}

function updateSettingTogglesUI() {
    const onText  = i18n[currentLang] ? i18n[currentLang].on : 'ON';
    const offText = i18n[currentLang] ? i18n[currentLang].off : 'OFF';

    if (settingMusicBtn && settingMusicText) {
        settingMusicBtn.classList.toggle('active', musicEnabled);
        settingMusicText.textContent = musicEnabled ? onText : offText;
    }
    if (settingSfxBtn && settingSfxText) {
        settingSfxBtn.classList.toggle('active', sfxEnabled);
        settingSfxText.textContent = sfxEnabled ? onText : offText;
    }
}

// Master Mute Button Listener
soundBtn.addEventListener('click', () => {
    sounds.click();
    soundEnabled = !soundEnabled;
    localStorage.setItem('snakeSoundEnabled', soundEnabled);
    if (bgMusic) {
        bgMusic.volume = (soundEnabled && musicEnabled) ? bgmVolumePercent / 100 : 0;
    }
    applySoundUI();
});

// Header Volume Steppers
volDownBtn.addEventListener('click', () => {
    sounds.click();
    if (bgmVolumePercent > 0) {
        bgmVolumePercent -= 1;
        localStorage.setItem('snakeBgmVolume', bgmVolumePercent);
        applyVolumeUI();
    }
});

volUpBtn.addEventListener('click', () => {
    sounds.click();
    if (bgmVolumePercent < 20) {
        bgmVolumePercent += 1;
        localStorage.setItem('snakeBgmVolume', bgmVolumePercent);
        applyVolumeUI();
    }
});

// Settings Screen Controls
if (settingMusicBtn) {
    settingMusicBtn.addEventListener('click', () => {
        sounds.click();
        musicEnabled = !musicEnabled;
        localStorage.setItem('snakeMusicEnabled', musicEnabled);
        updateSettingTogglesUI();
        applyVolumeUI();
    });
}

if (settingSfxBtn) {
    settingSfxBtn.addEventListener('click', () => {
        sounds.click();
        sfxEnabled = !sfxEnabled;
        localStorage.setItem('snakeSfxEnabled', sfxEnabled);
        updateSettingTogglesUI();
    });
}

if (settingVolDownBtn) {
    settingVolDownBtn.addEventListener('click', () => {
        sounds.click();
        if (bgmVolumePercent > 0) {
            bgmVolumePercent -= 1;
            localStorage.setItem('snakeBgmVolume', bgmVolumePercent);
            applyVolumeUI();
        }
    });
}

if (settingVolUpBtn) {
    settingVolUpBtn.addEventListener('click', () => {
        sounds.click();
        if (bgmVolumePercent < 20) {
            bgmVolumePercent += 1;
            localStorage.setItem('snakeBgmVolume', bgmVolumePercent);
            applyVolumeUI();
        }
    });
}

// Reset High Score Modal
if (settingResetHsBtn) {
    settingResetHsBtn.addEventListener('click', () => {
        sounds.click();
        resetHsModal.classList.remove('hidden');
    });
}

if (resetConfirmNo) {
    resetConfirmNo.addEventListener('click', () => {
        sounds.click();
        resetHsModal.classList.add('hidden');
    });
}

if (resetConfirmYes) {
    resetConfirmYes.addEventListener('click', () => {
        sounds.click();
        highScore = 0;
        localStorage.setItem('snakeHighScore', '0');
        highScoreEl.textContent = 0;
        finalHSEl.textContent    = 0;
        resetHsModal.classList.add('hidden');
    });
}

function applyPauseUI(paused) {
    if (paused) {
        pauseIcon.classList.add('hidden-icon');
        playIcon.classList.remove('hidden-icon');
        pauseBtn.classList.add('active');
    } else {
        pauseIcon.classList.remove('hidden-icon');
        playIcon.classList.add('hidden-icon');
        pauseBtn.classList.remove('active');
    }
}

/* ══════════════════════════════════════════════════════════
   NAVIGATION & SCREEN MANAGEMENT
   ══════════════════════════════════════════════════════════ */
function showMainMenu() {
    if (gameLoopInterval) clearInterval(gameLoopInterval);
    if (bgMusic) bgMusic.pause();
    
    isPaused    = false;
    isGameOver  = false;
    gameStarted = false;
    
    applyPauseUI(false);
    
    // Hide in-game overlays
    pauseScreen.classList.add('hidden');
    gameOverScr.classList.add('hidden');
    settingsScreen.classList.add('hidden');
    if (modeSelectScreen) modeSelectScreen.classList.add('hidden');
    if (resetHsModal) resetHsModal.classList.add('hidden');
    
    // Show Main Menu
    mainMenuScreen.classList.remove('hidden');
    
    initState();
    placeFood();
    drawFrame();
}

function showModeSelect() {
    sounds.click();
    if (modeSelectScreen) modeSelectScreen.classList.remove('hidden');
}

function hideModeSelect() {
    sounds.click();
    if (modeSelectScreen) modeSelectScreen.classList.add('hidden');
}

function showSettings() {
    sounds.click();
    updateSettingTogglesUI();
    applyVolumeUI();
    settingsScreen.classList.remove('hidden');
}

function hideSettings() {
    sounds.click();
    settingsScreen.classList.add('hidden');
}

menuPlayBtn.addEventListener('click', showModeSelect);
if (modeSelectCloseBtn) modeSelectCloseBtn.addEventListener('click', hideModeSelect);
if (modeClassicBtn) {
    modeClassicBtn.addEventListener('click', () => {
        sounds.click();
        if (modeSelectScreen) modeSelectScreen.classList.add('hidden');
        startGame();
    });
}

menuSettingsBtn.addEventListener('click', showSettings);
if (settingsCloseBtn) settingsCloseBtn.addEventListener('click', hideSettings);
pauseMenuBtn.addEventListener('click', () => { sounds.click(); showMainMenu(); });
gameoverMenuBtn.addEventListener('click', () => { sounds.click(); showMainMenu(); });

/* ══════════════════════════════════════════════════════════
   INIT / RESET
   ══════════════════════════════════════════════════════════ */
function initState() {
    snake       = [{ x: 10, y: 10 }];
    dx = 0; dy = 0; ndx = 0; ndy = 0;
    score       = 0;
    gameSpeed   = INIT_SPD;
    isGameOver  = false;
    isPaused    = false;
    gameStarted = false;
    isNewHS     = false;
    scoreEl.textContent = 0;
    applyPauseUI(false);
}

highScore = parseInt(localStorage.getItem('snakeHighScore') || '0', 10);
highScoreEl.textContent = highScore;

setLanguage(currentLang);
applySoundUI();
applyVolumeUI();
initState();
placeFood();
resizeCanvas();
requestAnimationFrame(() => { resizeCanvas(); drawFrame(); });

/* ══════════════════════════════════════════════════════════
   START / RESTART / PAUSE
   ══════════════════════════════════════════════════════════ */
function startGame() {
    getAudioCtx();
    if (!bgMusic) {
        bgMusic = new Audio('assets/music/4 Solar Wind Lullaby LOOP.ogg');
        bgMusic.loop = true;
        bgMusic.volume = (soundEnabled && musicEnabled) ? bgmVolumePercent / 100 : 0;
        bgMusic.play().catch(e => console.log('Audio play failed:', e));
    } else if (bgMusic.paused && soundEnabled && musicEnabled) {
        bgMusic.play().catch(e => console.log('Audio play failed:', e));
    }
    sounds.start();
    initState();
    placeFood();
    mainMenuScreen.classList.add('hidden');
    if (modeSelectScreen) modeSelectScreen.classList.add('hidden');
    settingsScreen.classList.add('hidden');
    gameOverScr.classList.add('hidden');
    pauseScreen.classList.add('hidden');
    if (gameLoopInterval) clearInterval(gameLoopInterval);
    gameLoopInterval = setInterval(gameLoop, gameSpeed);
    gameStarted = true;
}

function togglePause() {
    if (!gameStarted || isGameOver) return;
    if (isPaused) {
        isPaused = false;
        pauseScreen.classList.add('hidden');
        applyPauseUI(false);
        if (bgMusic && soundEnabled && musicEnabled) {
            bgMusic.play().catch(e => console.log('Audio play failed:', e));
        }
        if (gameLoopInterval) clearInterval(gameLoopInterval);
        gameLoopInterval = setInterval(gameLoop, gameSpeed);
    } else {
        isPaused = true;
        pauseScreen.classList.remove('hidden');
        applyPauseUI(true);
        if (bgMusic) {
            bgMusic.pause();
        }
        clearInterval(gameLoopInterval);
    }
}

/* ══════════════════════════════════════════════════════════
   GAME LOOP
   ══════════════════════════════════════════════════════════ */
function gameLoop() {
    if (isPaused || isGameOver) return;
    dx = ndx; dy = ndy;
    moveSnake();
    if (checkCollision()) { triggerGameOver(); return; }
    drawFrame();
}

/* ── Continuous Animation for Idle & Paused Pulse ── */
function animLoop(ts) {
    foodPulse = ts;
    if (!gameStarted || isPaused) {
        const sz = TILES * GRID;
        ctx.clearRect(0, 0, sz, sz);
        drawFood();
        if (isPaused) drawSnake();
    }
    requestAnimationFrame(animLoop);
}
requestAnimationFrame(animLoop);

/* ══════════════════════════════════════════════════════════
   DRAWING ROUTINES
   ══════════════════════════════════════════════════════════ */
function drawFrame() {
    const sz = TILES * GRID;
    ctx.clearRect(0, 0, sz, sz);
    drawFood();
    drawSnake();
}

function drawSnake() {
    snake.forEach((seg, i) => {
        const x      = seg.x * GRID;
        const y      = seg.y * GRID;
        const isHead = i === 0;
        const pad    = isHead ? 0 : Math.max(1, GRID * 0.08);
        const r      = isHead ? GRID * 0.22 : GRID * 0.18;
        const t      = Math.min(i / (snake.length + 1), 1);
        const alpha  = 1 - t * 0.4;

        ctx.shadowBlur  = isHead ? GRID * 0.6 : GRID * 0.28;
        ctx.shadowColor = isHead ? '#00f0ff' : '#00ff88';

        ctx.beginPath();
        roundRect(ctx, x + pad, y + pad, GRID - pad * 2, GRID - pad * 2, r);
        const grad = ctx.createLinearGradient(x, y, x + GRID, y + GRID);
        if (isHead) {
            grad.addColorStop(0, '#ffffff');
            grad.addColorStop(1, '#00e5ff');
        } else {
            grad.addColorStop(0, `rgba(0, 255, 136, ${alpha})`);
            grad.addColorStop(1, `rgba(0, 200, 100, ${alpha * 0.7})`);
        }
        ctx.fillStyle = grad;
        ctx.fill();

        if (isHead) {
            ctx.shadowBlur = 0;
            ctx.fillStyle  = '#080c18';
            const ew = Math.max(1.5, GRID * 0.12);
            const ea = GRID * 0.22;
            const eb = GRID * 0.62;
            const em = GRID * 0.40;
            let ex1, ey1, ex2, ey2;
            const fd = (ndx !== 0 || ndy !== 0) ? { x: ndx, y: ndy } : { x: dx, y: dy };
            if      (fd.y === -1) { ex1 = x + ea; ey1 = y + ea; ex2 = x + eb; ey2 = y + ea; }
            else if (fd.y ===  1) { ex1 = x + ea; ey1 = y + eb; ex2 = x + eb; ey2 = y + eb; }
            else if (fd.x === -1) { ex1 = x + ea; ey1 = y + ea; ex2 = x + ea; ey2 = y + eb; }
            else if (fd.x ===  1) { ex1 = x + eb; ey1 = y + ea; ex2 = x + eb; ey2 = y + eb; }
            else                  { ex1 = x + ea; ey1 = y + em; ex2 = x + eb; ey2 = y + em; }
            ctx.beginPath(); ctx.arc(ex1, ey1, ew, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(ex2, ey2, ew, 0, Math.PI * 2); ctx.fill();
        }
        ctx.shadowBlur = 0;
    });
}

function drawFood() {
    const cx    = food.x * GRID + GRID / 2;
    const cy    = food.y * GRID + GRID / 2;
    const pAmp  = GRID * 0.06;
    const pulse = Math.sin(foodPulse * 0.003) * pAmp;
    const r     = Math.max(2, GRID / 2 - GRID * 0.12 + pulse);

    ctx.shadowBlur  = GRID * 0.65 + pulse * 2;
    ctx.shadowColor = '#ff2d55';

    const grad = ctx.createRadialGradient(cx - GRID * 0.08, cy - GRID * 0.08, 1, cx, cy, r);
    grad.addColorStop(0, '#ff8fa0');
    grad.addColorStop(0.5, '#ff2d55');
    grad.addColorStop(1, '#cc0033');
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.fillStyle  = 'rgba(255, 255, 255, 0.55)';
    ctx.beginPath();
    ctx.arc(cx - r * 0.3, cy - r * 0.3, r * 0.22, 0, Math.PI * 2);
    ctx.fill();
}

function roundRect(c, x, y, w, h, r) {
    c.beginPath();
    c.moveTo(x + r, y);
    c.lineTo(x + w - r, y);
    c.quadraticCurveTo(x + w, y,     x + w, y + r);
    c.lineTo(x + w, y + h - r);
    c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    c.lineTo(x + r, y + h);
    c.quadraticCurveTo(x,     y + h, x,     y + h - r);
    c.lineTo(x, y + r);
    c.quadraticCurveTo(x,     y,     x + r, y);
    c.closePath();
}

/* ══════════════════════════════════════════════════════════
   SNAKE MOVEMENT & COLLISIONS (Classic Screen Wrap)
   ══════════════════════════════════════════════════════════ */
function moveSnake() {
    if (dx === 0 && dy === 0) return;
    const head = { 
        x: (snake[0].x + dx + TILES) % TILES, 
        y: (snake[0].y + dy + TILES) % TILES 
    };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreEl.textContent = score;
        animateScorePop();

        if (score > highScore) {
            isNewHS   = true;
            highScore = score;
            highScoreEl.textContent = highScore;
            localStorage.setItem('snakeHighScore', highScore);
            sounds.highScore();
        } else {
            sounds.eat();
        }

        spawnBurst(food.x * GRID + GRID / 2, food.y * GRID + GRID / 2);
        flashWrapper('flash-eat');
        placeFood();

        if (gameSpeed > MIN_SPD) {
            clearInterval(gameLoopInterval);
            gameSpeed -= SPD_STEP;
            gameLoopInterval = setInterval(gameLoop, gameSpeed);
        }
    } else {
        snake.pop();
    }
}

function placeFood() {
    food = { x: Math.floor(Math.random() * TILES), y: Math.floor(Math.random() * TILES) };
    if (snake.some(s => s.x === food.x && s.y === food.y)) placeFood();
}

function checkCollision() {
    const h = snake[0];
    for (let i = 1; i < snake.length; i++) {
        if (h.x === snake[i].x && h.y === snake[i].y) return true;
    }
    return false;
}

function triggerGameOver() {
    isGameOver = true;
    clearInterval(gameLoopInterval);
    sounds.die();
    flashWrapper('flash-die');
    finalScoreEl.textContent = score;
    finalHSEl.textContent    = highScore;
    newHSBadge.classList.toggle('hidden', !isNewHS);
    setTimeout(() => gameOverScr.classList.remove('hidden'), 450);
}

/* ══════════════════════════════════════════════════════════
   VISUAL EFFECTS
   ══════════════════════════════════════════════════════════ */
function animateScorePop() {
    scoreEl.classList.remove('score-pop');
    void scoreEl.offsetWidth;
    scoreEl.classList.add('score-pop');
    scoreEl.addEventListener('animationend', () => scoreEl.classList.remove('score-pop'), { once: true });
}

function flashWrapper(cls) {
    wrapper.classList.remove('flash-eat', 'flash-die');
    void wrapper.offsetWidth;
    wrapper.classList.add(cls);
    wrapper.addEventListener('animationend', () => wrapper.classList.remove(cls), { once: true });
}

function spawnBurst(cx, cy) {
    const dist0  = GRID * 1.4;
    const colors = ['#00f0ff', '#00ff88', '#ff2d55', '#ffd700', '#ffffff'];
    for (let i = 0; i < 12; i++) {
        const dot = document.createElement('div');
        dot.className = 'burst-dot';
        const angle = (i / 12) * Math.PI * 2;
        const dist  = dist0 + Math.random() * dist0 * 0.8;
        dot.style.left = `${cx - 3}px`;
        dot.style.top  = `${cy - 3}px`;
        dot.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
        dot.style.setProperty('--ty', `${Math.sin(angle) * dist}px`);
        dot.style.background = colors[i % colors.length];
        dot.style.boxShadow  = `0 0 6px ${colors[i % colors.length]}`;
        burstEl.appendChild(dot);
        dot.addEventListener('animationend', () => dot.remove(), { once: true });
    }
}

/* ══════════════════════════════════════════════════════════
   UNIFIED DIRECTION CONTROL (Keyboard, Swipe, D-Pad)
   ══════════════════════════════════════════════════════════ */
function handleDir(dir) {
    if (!gameStarted || isGameOver || isPaused) return;
    const goingUp    = dy === -1;
    const goingDown  = dy ===  1;
    const goingRight = dx ===  1;
    const goingLeft  = dx === -1;

    if (dir === 'up'    && !goingDown)  { ndx = 0;  ndy = -1; }
    if (dir === 'down'  && !goingUp)    { ndx = 0;  ndy =  1; }
    if (dir === 'left'  && !goingRight) { ndx = -1; ndy =  0; }
    if (dir === 'right' && !goingLeft)  { ndx =  1; ndy =  0; }
}

/* ══════════════════════════════════════════════════════════
   KEYBOARD INPUT HANDLER
   ══════════════════════════════════════════════════════════ */
document.addEventListener('keydown', e => {
    const prevent = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'];
    if (prevent.includes(e.code)) e.preventDefault();

    if (e.code === 'KeyM') { soundBtn.click(); return; }

    if ((e.code === 'KeyP' || e.code === 'Space') && gameStarted && !isGameOver) {
        togglePause();
        return;
    }

    if (!gameStarted || isGameOver || isPaused) return;

    if (e.code === 'ArrowUp'    || e.code === 'KeyW') handleDir('up');
    if (e.code === 'ArrowDown'  || e.code === 'KeyS') handleDir('down');
    if (e.code === 'ArrowLeft'  || e.code === 'KeyA') handleDir('left');
    if (e.code === 'ArrowRight' || e.code === 'KeyD') handleDir('right');
});

/* ══════════════════════════════════════════════════════════
   TOUCH SWIPE ON BOARD
   ══════════════════════════════════════════════════════════ */
const MIN_SWIPE = 16;
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}, { passive: true });

canvas.addEventListener('touchend', e => {
    const swipeDx = e.changedTouches[0].clientX - touchStartX;
    const swipeDy = e.changedTouches[0].clientY - touchStartY;
    const absDx   = Math.abs(swipeDx);
    const absDy   = Math.abs(swipeDy);

    if (Math.max(absDx, absDy) < MIN_SWIPE) return;

    if (absDx > absDy) {
        handleDir(swipeDx > 0 ? 'right' : 'left');
    } else {
        handleDir(swipeDy > 0 ? 'down' : 'up');
    }
}, { passive: true });

/* ══════════════════════════════════════════════════════════
   D-PAD CONTROLS (Pointer Events for Touch & Mouse)
   ══════════════════════════════════════════════════════════ */
const dpadMap = {
    'dpad-up':    'up',
    'dpad-down':  'down',
    'dpad-left':  'left',
    'dpad-right': 'right'
};

Object.entries(dpadMap).forEach(([btnId, dir]) => {
    const btn = document.getElementById(btnId);
    if (!btn) return;

    btn.addEventListener('pointerdown', e => {
        e.preventDefault();
        btn.classList.add('pressed');
        handleDir(dir);
    });

    btn.addEventListener('pointerup',     () => btn.classList.remove('pressed'));
    btn.addEventListener('pointerleave',  () => btn.classList.remove('pressed'));
    btn.addEventListener('pointercancel', () => btn.classList.remove('pressed'));
    btn.addEventListener('contextmenu',   e => e.preventDefault());
});

/* ══════════════════════════════════════════════════════════
   BUTTON WIRING
   ══════════════════════════════════════════════════════════ */
restartBtn.addEventListener('click', () => { sounds.click(); startGame(); });
resumeBtn.addEventListener('click',  () => { sounds.click(); togglePause(); });
pauseBtn.addEventListener('click',   () => { sounds.click(); togglePause(); });
