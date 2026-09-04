var gameOverReason = 'self';
window.gameOverReason = 'self';

/* ═══════════════════════════════════════════════════════════
   NEON SNAKE – Game Logic, Sound, Controls, Touch/Swipe, D-Pad
   Adaptive Input & Canvas Management Engine
   Localization (English / Arabic), Main Menu & Settings
   ═══════════════════════════════════════════════════════════ */

// Global Game Over State

// ── DOM References ──
const canvas           = document.getElementById('gameCanvas');
const ctx              = canvas.getContext('2d');
const gameHeader       = document.getElementById('game-header');
const gameFooter       = document.getElementById('game-footer');
const scoreEl          = document.getElementById('score');
const highScoreEl      = document.getElementById('high-score');
const finalScoreEl     = document.getElementById('final-score');
const finalHSEl        = document.getElementById('final-high-score');
const newHSBadge       = document.getElementById('new-high-score-badge');

// Overlays
const mainMenuScreen         = document.getElementById('main-menu-screen');
const modeSelectScreen       = document.getElementById('mode-select-screen');
const difficultySelectScreen = document.getElementById('difficulty-select-screen');
const settingsScreen         = document.getElementById('settings-screen');
const pauseScreen            = document.getElementById('pause-screen');
const gameOverScr            = document.getElementById('game-over-screen');
const resetHsModal           = document.getElementById('reset-hs-modal');
const playerNameModal        = document.getElementById('player-name-modal');
const playerNameInput        = document.getElementById('player-name-input');
const playerNameForm         = document.getElementById('player-name-form');
const nameErrorMsg           = document.getElementById('name-error-msg');
const playerNameDisplay      = document.getElementById('player-name-display');
const headerPlayerName       = document.getElementById('header-player-name');
const playerHeaderTag        = document.getElementById('player-header-tag');
const playerProfileBadge     = document.getElementById('player-profile-badge');
const editNameBtn            = document.getElementById('edit-name-btn');
const playerNameCloseBtn     = document.getElementById('player-name-close-btn');
const leaderboardScreen       = document.getElementById('leaderboard-screen');
const leaderboardTbody        = document.getElementById('leaderboard-tbody');
const menuLeaderboardBtn      = document.getElementById('menu-leaderboard-btn');
const gameoverLeaderboardBtn  = document.getElementById('gameover-leaderboard-btn');
const leaderboardCloseBtn     = document.getElementById('leaderboard-close-btn');

// Buttons
const menuPlayBtn          = document.getElementById('menu-play-btn');
const menuSettingsBtn      = document.getElementById('menu-settings-btn');
const modeSelectCloseBtn   = document.getElementById('mode-select-close-btn');
const modeClassicBtn       = document.getElementById('mode-classic-btn');
const difficultyCloseBtn   = document.getElementById('difficulty-close-btn');
const diffEasyBtn          = document.getElementById('diff-easy-btn');
const diffMediumBtn        = document.getElementById('diff-medium-btn');
const diffHardBtn          = document.getElementById('diff-hard-btn');
const settingsCloseBtn     = document.getElementById('settings-close-btn');
const restartBtn       = document.getElementById('restart-btn');
const resumeBtn        = document.getElementById('resume-btn');
const pauseMenuBtn     = document.getElementById('pause-menu-btn');
const gameoverMenuBtn  = document.getElementById('gameover-menu-btn');
const pauseBtn         = document.getElementById('pause-btn');
const homeBtn          = document.getElementById('home-btn');
const soundBtn         = document.getElementById('sound-btn');
const soundOnIcon      = document.getElementById('sound-on-icon');
const soundOffIcon     = document.getElementById('sound-off-icon');
const pauseIcon        = document.getElementById('pause-icon');
const playIcon         = document.getElementById('play-icon');

// Settings Elements
const settingSfxBtn      = document.getElementById('setting-sfx-btn');
const settingSfxText     = document.getElementById('setting-sfx-text');
const resetScoreEasy     = document.getElementById('reset-score-easy');
const resetScoreMedium   = document.getElementById('reset-score-medium');
const resetScoreHard     = document.getElementById('reset-score-hard');
const resetConfirmYes    = document.getElementById('reset-confirm-yes');
const resetConfirmNo     = document.getElementById('reset-confirm-no');

// Language Selector Buttons
const langBtnEn        = document.getElementById('lang-btn-en');
const langBtnAr        = document.getElementById('lang-btn-ar');

const burstEl          = document.getElementById('particle-burst');
const wrapper          = document.querySelector('.canvas-wrapper');
const dpadContainer    = document.getElementById('dpad-container');

// ── Constants, Difficulty Settings & Visual Themes ──
const DIFFICULTIES = {
    easy: {
        tiles: 16,      // Spacious, relaxed grid with larger cells
        initSpeed: 120, // fluid, smooth relaxed glide (no stutter or teleportation)
        minSpeed: 60,   // silky smooth progression
        speedStep: 1.5  // gentle progressive ramp-up
    },
    medium: {
        tiles: 20,      // Balanced standard grid
        initSpeed: 90,  // balanced, snappy synthwave pace
        minSpeed: 40,   // high-speed responsive max cap
        speedStep: 1.8  // moderate progressive ramp-up
    },
    hard: {
        tiles: 25,      // Tight, high-stakes grid with smaller cells
        initSpeed: 65,  // intense, razor-fast laser pace
        minSpeed: 28,   // extreme velocity, silky-smooth at 60/120fps
        speedStep: 2.2  // steep acceleration curve
    }
};

const THEMES = {
    easy: {
        snakeHeadGrad: ['#ffffff', '#00ff88'],
        snakeHeadGlow: '#00ff88',
        snakeBodyGrad: (alpha) => [`rgba(0, 255, 136, ${alpha})`, `rgba(0, 200, 110, ${alpha * 0.7})`],
        snakeBodyGlow: '#00ff88',
        foodGrad: ['#ffffff', '#a8ff00', '#00cc44'],
        foodGlow: '#a8ff00',
        particles: ['#00ff88', '#a8ff00', '#ffd700', '#38ef7d', '#ffffff']
    },
    medium: {
        snakeHeadGrad: ['#ffffff', '#00e5ff'],
        snakeHeadGlow: '#00f0ff',
        snakeBodyGrad: (alpha) => [`rgba(0, 240, 255, ${alpha})`, `rgba(0, 160, 255, ${alpha * 0.7})`],
        snakeBodyGlow: '#00f0ff',
        foodGrad: ['#ff8fa0', '#ff2d55', '#cc0033'],
        foodGlow: '#ff2d55',
        particles: ['#00f0ff', '#00ff88', '#ff2d55', '#ffd700', '#ffffff']
    },
    hard: {
        snakeHeadGrad: ['#ffffff', '#ff3b30'],
        snakeHeadGlow: '#ff2d55',
        snakeBodyGrad: (alpha) => [`rgba(255, 59, 48, ${alpha})`, `rgba(255, 149, 0, ${alpha * 0.7})`],
        snakeBodyGlow: '#ff3b30',
        foodGrad: ['#e0aaff', '#9d4edd', '#3a0ca3'],
        foodGlow: '#c77dff',
        particles: ['#ff3b30', '#ff9500', '#9d4edd', '#00d4ff', '#ffffff']
    }
};

let currentDifficulty = localStorage.getItem('snakeLastDifficulty') || 'medium';
if (!DIFFICULTIES[currentDifficulty]) currentDifficulty = 'medium';

let TILES = DIFFICULTIES[currentDifficulty].tiles;
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
        selectDifficulty: 'SELECT DIFFICULTY',
        diffEasy: 'EASY',
        diffEasyBadge: 'RELAXED',
        diffEasyDesc: 'Gentle speed & relaxed curve. Great for casual play.',
        diffMedium: 'MEDIUM',
        diffMediumBadge: 'BALANCED',
        diffMediumDesc: 'Standard neon pace with progressive acceleration.',
        diffHard: 'HARD',
        diffHardBadge: 'INTENSE',
        diffHardDesc: 'High initial velocity with steep, relentless acceleration.',
        difficulty: 'DIFFICULTY',
        settingsTitle: 'SETTINGS',
        sfx: 'SOUND EFFECTS',
        controls: 'CONTROLS',
        arrowsOrWasd: '↑↓←→ / WASD',
        swipeOrDpad: 'TOUCH / SWIPE',
        move: 'Move',
        pause: 'Pause',
        toggleSound: 'Sound',
        resetHighScore: '🗑 RESET BEST SCORE',
        resetEasy: 'Reset Easy',
        resetMedium: 'Reset Medium',
        resetHard: 'Reset Hard',
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
        off: 'OFF',
        enterNameTitle: 'ENTER YOUR NAME',
        namePlaceholder: 'Player Name (3-16 chars)...',
        continueBtn: 'CONTINUE ▶',
        nameError: 'Name must be 3 to 16 characters.',
        editName: 'Change Name',
        leaderboardTitle: 'GLOBAL LEADERBOARD',
        leaderboardBtn: '🏆 LEADERBOARD',
        lbTabAll: 'ALL',
        rank: 'RANK',
        player: 'PLAYER',
        date: 'DATE',
        loading: 'LOADING...',
        noScores: 'NO SCORES YET',
        errorLoading: 'FAILED TO LOAD'
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
        selectDifficulty: 'اختر مستوى الصعوبة',
        diffEasy: 'سهل',
        diffEasyBadge: 'هادئ',
        diffEasyDesc: 'سرعة هادئة وتدرج سلس. مناسب للعب المريح.',
        diffMedium: 'متوسط',
        diffMediumBadge: 'متوازن',
        diffMediumDesc: 'السرعة القياسية مع تسارع تدريجي ممتع.',
        diffHard: 'صعب',
        diffHardBadge: 'مكثف',
        diffHardDesc: 'سرعة أولية عالية مع تسارع حاد ومثير.',
        difficulty: 'مستوى الصعوبة',
        settingsTitle: 'الإعدادات',
        sfx: 'المؤثرات الصوتية',
        controls: 'أزرار التحكم',
        arrowsOrWasd: '↑↓←→ / WASD',
        swipeOrDpad: 'اللمس / السحب',
        move: 'تحريك',
        pause: 'إيقاف مؤقت',
        toggleSound: 'كتم الصوت',
        resetHighScore: '🗑 تصفير أفضل نتيجة',
        resetEasy: 'تصفير السهل',
        resetMedium: 'تصفير المتوسط',
        resetHard: 'تصفير الصعب',
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
        off: 'إيقاف',
        enterNameTitle: 'أدخل اسمك',
        namePlaceholder: 'اسم اللاعب (3-16 حرف)...',
        continueBtn: 'متابعة ◀',
        nameError: 'الاسم يجب أن يكون من 3 إلى 16 حرفاً.',
        editName: 'تغيير الاسم',
        leaderboardTitle: 'لوحة المتصدرين العالمية',
        leaderboardBtn: '🏆 لوحة المتصدرين',
        lbTabAll: 'الكل',
        rank: 'الترتيب',
        player: 'اللاعب',
        date: 'التاريخ',
        loading: 'جاري التحميل...',
        noScores: 'لا يوجد نتائج بعد',
        errorLoading: 'فشل التحميل'
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

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (i18n[lang] && i18n[lang][key]) {
            el.setAttribute('placeholder', i18n[lang][key]);
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
   GAME STATE (Continuous Interpolation & Responsive Input Queue)
   ══════════════════════════════════════════════════════════ */
const initCenter = Math.floor((TILES || 20) / 2);
let snake = [
    { x: initCenter, y: initCenter },
    { x: (initCenter - 1 + (TILES || 20)) % (TILES || 20), y: initCenter },
    { x: (initCenter - 2 + (TILES || 20)) % (TILES || 20), y: initCenter }
];
let prevSnake = snake.map(s => ({ x: s.x, y: s.y }));
let food = { x: (initCenter + 4) % (TILES || 20), y: initCenter };
let dx = 1, dy = 0, ndx = 1, ndy = 0;
let inputQueue = [];
let score = 0, highScore = 0;
let gameSpeed = 100;
let isGameOver = false, isPaused = false, gameStarted = false;
window.gameOverReason = '';
let foodPulse = 0;
let isNewHS   = false;
let lastTickTime = 0;
let moveAccumulator = 0;

/* ══════════════════════════════════════════════════════════
   SOUND SYSTEM
   ══════════════════════════════════════════════════════════ */
let audioCtx = null;
let soundEnabled = localStorage.getItem('snakeSoundEnabled') !== 'false';
let sfxEnabled   = localStorage.getItem('snakeSfxEnabled') !== 'false';

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

function playFrequencySweep(startFreq, endFreq, type, duration, gainVal, delay = 0) {
    if (!soundEnabled || !sfxEnabled) return;
    try {
        const ac = getAudioCtx();
        if (!ac) return;
        const osc = ac.createOscillator();
        const g   = ac.createGain();
        osc.connect(g);
        g.connect(ac.destination);
        osc.type = type;
        osc.frequency.setValueAtTime(startFreq, ac.currentTime + delay);
        osc.frequency.exponentialRampToValueAtTime(Math.max(10, endFreq), ac.currentTime + delay + duration);
        g.gain.setValueAtTime(gainVal, ac.currentTime + delay);
        g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + delay + duration);
        osc.start(ac.currentTime + delay);
        osc.stop(ac.currentTime + delay + duration);
    } catch (_) {}
}

const sounds = {
    eat() {
        if (currentDifficulty === 'easy') {
            // Soft, calm sine blips with gentle attack
            playTone(520, 'sine', 0.09, 0.16);
            playTone(780, 'sine', 0.11, 0.10, 0.04);
        } else if (currentDifficulty === 'hard') {
            // Fast sharp laser zap & sizzle
            playFrequencySweep(1400, 600, 'sawtooth', 0.06, 0.20);
            playTone(900, 'sawtooth', 0.04, 0.12, 0.03);
        } else {
            // Medium: Punchy synthwave chiptune
            playTone(600, 'triangle', 0.06, 0.22);
            playTone(920, 'square', 0.07, 0.08, 0.03);
        }
    },
    die() {
        if (currentDifficulty === 'easy') {
            // Gentle low rumble / warm sine decrescendo
            playTone(260, 'sine', 0.28, 0.20);
            playTone(180, 'sine', 0.32, 0.15, 0.15);
            playTone(120, 'sine', 0.40, 0.10, 0.30);
        } else if (currentDifficulty === 'hard') {
            // Aggressive distorted crunch drop
            playFrequencySweep(320, 45, 'sawtooth', 0.25, 0.30);
            playFrequencySweep(200, 30, 'sawtooth', 0.35, 0.25, 0.10);
            playTone(60, 'sawtooth', 0.45, 0.20, 0.20);
        } else {
            // Medium: Classic synthwave chiptune fall
            playTone(220, 'sawtooth', 0.20, 0.22);
            playTone(150, 'triangle', 0.25, 0.18, 0.18);
            playTone(100, 'sawtooth', 0.30, 0.12, 0.38);
        }
    },
    start() {
        if (currentDifficulty === 'easy') {
            [392, 494, 587, 784].forEach((f, i) => playTone(f, 'sine', 0.14, 0.12, i * 0.08));
        } else if (currentDifficulty === 'hard') {
            [440, 660, 880, 1320].forEach((f, i) => playTone(f, 'sawtooth', 0.08, 0.14, i * 0.06));
        } else {
            [440, 554, 659, 880].forEach((f, i) => playTone(f, 'triangle', 0.12, 0.16, i * 0.08));
        }
    },
    click() {
        if (currentDifficulty === 'hard') {
            playTone(1400, 'sawtooth', 0.03, 0.10);
        } else if (currentDifficulty === 'easy') {
            playTone(880, 'sine', 0.04, 0.10);
        } else {
            playTone(1000, 'sine', 0.04, 0.12);
        }
    },
    highScore() {
        if (currentDifficulty === 'easy') {
            [440, 554, 659, 880, 1108].forEach((f, i) => playTone(f, 'sine', 0.18, 0.12, i * 0.09));
        } else if (currentDifficulty === 'hard') {
            [523, 659, 784, 1046, 1318].forEach((f, i) => playTone(f, 'sawtooth', 0.12, 0.15, i * 0.07));
        } else {
            [523, 659, 784, 1047].forEach((f, i) => playTone(f, 'triangle', 0.15, 0.14, i * 0.09));
        }
    }
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
    applySoundUI();
});

// Settings Screen Controls

if (settingSfxBtn) {
    settingSfxBtn.addEventListener('click', () => {
        sounds.click();
        sfxEnabled = !sfxEnabled;
        localStorage.setItem('snakeSfxEnabled', sfxEnabled);
        updateSettingTogglesUI();
    });
}

let pendingResetDiff = null;

function handleResetClick(diff) {
    sounds.click();
    pendingResetDiff = diff;
    if (resetHsModal) {
        const diffKey = `reset${diff.charAt(0).toUpperCase() + diff.slice(1)}`;
        const diffName = currentLang === 'ar' ? i18n.ar[diffKey] : i18n.en[diffKey];
        const modalText = currentLang === 'ar' ? `هل تريد ${diffName}؟` : `${diffName} best score to 0?`;
        
        const resetConfirmText = document.querySelector('.confirm-text');
        if(resetConfirmText) resetConfirmText.textContent = modalText;

        resetHsModal.classList.remove('hidden');
        resetHsModal.style.setProperty('display', 'flex', 'important');
    }
}

if (resetScoreEasy) resetScoreEasy.addEventListener('click', () => handleResetClick('easy'));
if (resetScoreMedium) resetScoreMedium.addEventListener('click', () => handleResetClick('medium'));
if (resetScoreHard) resetScoreHard.addEventListener('click', () => handleResetClick('hard'));

if (resetConfirmNo) {
    resetConfirmNo.addEventListener('click', () => {
        sounds.click();
        if (resetHsModal) {
            resetHsModal.classList.add('hidden');
            resetHsModal.style.setProperty('display', 'none', 'important');
        }
        pendingResetDiff = null;
    });
}

// High Score Persistence Helpers per Difficulty
function getHighScore(diff = currentDifficulty) {
    const key = `neonSnake_high_${diff}`;
    const stored = localStorage.getItem(key);
    if (stored !== null) {
        return parseInt(stored, 10) || 0;
    }
    // Fallback for existing legacy high score when difficulty is medium
    if (diff === 'medium') {
        const legacy = localStorage.getItem('snakeHighScore');
        if (legacy !== null) {
            const val = parseInt(legacy, 10) || 0;
            localStorage.setItem(key, val.toString());
            return val;
        }
    }
    return 0;
}

function saveHighScore(score, diff = currentDifficulty) {
    const key = `neonSnake_high_${diff}`;
    localStorage.setItem(key, score.toString());
    if (diff === 'medium') {
        localStorage.setItem('snakeHighScore', score.toString());
    }
}

function updateHighScoreDisplay() {
    highScore = getHighScore(currentDifficulty);
    highScoreEl.textContent = highScore;
    if (finalHSEl) finalHSEl.textContent = highScore;
}

if (resetConfirmYes) {
    resetConfirmYes.addEventListener('click', () => {
        if (!pendingResetDiff) return;
        sounds.click();
        
        const d = pendingResetDiff;
        
        // 1. Reset Best Scores locally for targeted difficulty
        localStorage.removeItem(`neonSnake_high_${d}`);
        if (typeof bestScores !== 'undefined') bestScores[d] = 0;
        
        if (currentDifficulty === d) {
            saveHighScore(0, d);
            localStorage.removeItem('snakeHighScore');
            highScore = 0;
            highScoreEl.textContent = '0';
            if (finalHSEl) finalHSEl.textContent = '0';
            updateHighScoreDisplay();
        }

        // 2. Remove player records from targeted difficulty list in Leaderboard (Firebase)
        if (typeof db !== 'undefined' && db && typeof getPlayerId === 'function') {
            const pid = getPlayerId();
            db.collection('leaderboard').doc(`${pid}_${d}`).delete().catch(e => console.log('LB Delete Error:', e));
            // Re-render UI if leaderboard is open
            if (typeof leaderboardScreen !== 'undefined' && leaderboardScreen && !leaderboardScreen.classList.contains('hidden') && typeof loadLeaderboard === 'function') {
                loadLeaderboard();
            }
        }

        // 3. Close Modal
        if (resetHsModal) {
            resetHsModal.classList.add('hidden');
            resetHsModal.style.setProperty('display', 'none', 'important');
        }

        // 4. Show confirmation toast
        const toast = document.createElement('div');
        const diffNameEn = d.charAt(0).toUpperCase() + d.slice(1);
        const diffNameAr = d === 'easy' ? 'السهل' : (d === 'medium' ? 'المتوسط' : 'الصعب');
        toast.textContent = currentLang === 'ar' ? `تم تصفير سكور المستوى ${diffNameAr} بنجاح` : `${diffNameEn} score reset successfully`;
        toast.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);background:rgba(0,255,204,0.15);border:1px solid #00ffcc;color:#00ffcc;padding:12px 24px;border-radius:8px;z-index:9999;font-weight:bold;text-shadow:0 0 10px rgba(0,255,204,0.8);backdrop-filter:blur(10px);pointer-events:none;animation:container-in 0.3s ease-out;';
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.4s ease';
            setTimeout(() => toast.remove(), 400);
        }, 3000);
        
        pendingResetDiff = null;
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
   NAVIGATION & SCREEN MANAGEMENT (Centralized Overlay Manager)
   ══════════════════════════════════════════════════════════ */
const allOverlays = [
    mainMenuScreen,
    modeSelectScreen,
    difficultySelectScreen,
    settingsScreen,
    pauseScreen,
    gameOverScr,
    playerNameModal,
    leaderboardScreen
];

function hideAllOverlays() {
    allOverlays.forEach(overlay => {
        if (overlay) {
            overlay.classList.add('hidden');
            overlay.setAttribute('aria-hidden', 'true');
            overlay.style.setProperty('display', 'none', 'important');
        }
    });
    if (resetHsModal) {
        resetHsModal.classList.add('hidden');
        resetHsModal.style.setProperty('display', 'none', 'important');
    }
}

function showScreen(screenEl) {
    hideAllOverlays();
    if (dpadContainer) {
        dpadContainer.classList.add('hidden');
    }
    if (screenEl) {
        screenEl.classList.remove('hidden');
        screenEl.setAttribute('aria-hidden', 'false');
        screenEl.style.removeProperty('display');
    }
}

function showMainMenu() {

    isPaused    = false;
    isGameOver  = false;
    gameStarted = false;
    
    document.body.classList.remove('game-over-active');
    
    if (dpadContainer) {
        dpadContainer.classList.add('hidden');
    }
    
    document.body.classList.remove('game-active');
    
    applyPauseUI(false);
    showScreen(mainMenuScreen);
    
    initState();
    placeFood();
    drawFrame();
}

function showModeSelect() {
    sounds.click();
    showScreen(modeSelectScreen);
}

function hideModeSelect() {
    sounds.click();
    showScreen(mainMenuScreen);
}

function showDifficultySelect() {
    sounds.click();
    showScreen(difficultySelectScreen);
}

function hideDifficultySelect() {
    sounds.click();
    showScreen(modeSelectScreen);
}

function showSettings() {
    sounds.click();
    updateSettingTogglesUI();
    showScreen(settingsScreen);
}

function hideSettings() {
    sounds.click();
    showScreen(mainMenuScreen);
}

function applyTheme() {
    if (!wrapper) return;
    wrapper.classList.remove('theme-easy', 'theme-medium', 'theme-hard');
    wrapper.classList.add(`theme-${currentDifficulty}`);
}

function setDifficulty(diff) {
    if (!DIFFICULTIES[diff]) diff = 'medium';
    currentDifficulty = diff;
    TILES = DIFFICULTIES[diff].tiles;
    localStorage.setItem('snakeLastDifficulty', diff);
    applyTheme();
    updateHighScoreDisplay();
    resizeCanvas();
}

function selectDifficultyAndStart(diff) {
    if (!DIFFICULTIES[diff]) diff = 'medium';
    currentDifficulty = diff;
    localStorage.setItem('snakeLastDifficulty', diff);
    sounds.click();
    hideAllOverlays();
    startGame();
}

menuPlayBtn.addEventListener('click', () => {
    if (!getPlayerName()) {
        localStorage.setItem('snakePlayerName', 'Player');
        updatePlayerNameUI('Player');
        if (typeof hideNameModal === 'function') hideNameModal();
    }
    showModeSelect();
});
if (modeSelectCloseBtn) modeSelectCloseBtn.addEventListener('click', hideModeSelect);
if (modeClassicBtn) {
    modeClassicBtn.addEventListener('click', () => {
        sounds.click();
        showDifficultySelect();
    });
}

if (difficultyCloseBtn) difficultyCloseBtn.addEventListener('click', hideDifficultySelect);

[
    { btn: diffEasyBtn, diff: 'easy' },
    { btn: diffMediumBtn, diff: 'medium' },
    { btn: diffHardBtn, diff: 'hard' }
].forEach(({ btn, diff }) => {
    if (!btn) return;
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        selectDifficultyAndStart(diff);
    });
});

menuSettingsBtn.addEventListener('click', showSettings);
if (settingsCloseBtn) settingsCloseBtn.addEventListener('click', hideSettings);
if (menuLeaderboardBtn) menuLeaderboardBtn.addEventListener('click', showLeaderboard);
if (gameoverLeaderboardBtn) gameoverLeaderboardBtn.addEventListener('click', showLeaderboard);
if (leaderboardCloseBtn) leaderboardCloseBtn.addEventListener('click', hideLeaderboard);
pauseMenuBtn.addEventListener('click', () => { sounds.click(); showMainMenu(); });
gameoverMenuBtn.addEventListener('click', () => { sounds.click(); showMainMenu(); });

/* ══════════════════════════════════════════════════════════
   INIT / RESET
   ══════════════════════════════════════════════════════════ */
function initState() {
    const diffConfig = DIFFICULTIES[currentDifficulty] || DIFFICULTIES.medium;
    TILES = diffConfig.tiles;
    const startPos = Math.floor(TILES / 2);
    snake = [
        { x: startPos, y: startPos },
        { x: (startPos - 1 + TILES) % TILES, y: startPos },
        { x: (startPos - 2 + TILES) % TILES, y: startPos }
    ];
    prevSnake   = snake.map(s => ({ x: s.x, y: s.y }));
    inputQueue  = [];
    dx = 1; dy = 0; ndx = 1; ndy = 0;
    score       = 0;
    gameSpeed   = diffConfig.initSpeed;
    isGameOver  = false;
    document.body.classList.remove('game-over-active');
    isPaused    = false;
    window.gameOverReason = '';
    isNewHS     = false;
    moveAccumulator = 0;
    scoreEl.textContent = 0;
    updateHighScoreDisplay();
    applyTheme();
    applyPauseUI(false);
    placeFood();
    resizeCanvas();
}

updateHighScoreDisplay();
applyTheme();

let playerName = localStorage.getItem('snakePlayerName') || '';
window.playerName = playerName;

function updatePlayerNameDisplay(name) {
    const finalName = name && name.trim() ? name.trim() : 'Player';
    if (playerNameDisplay) playerNameDisplay.textContent = finalName;
    if (headerPlayerName) headerPlayerName.textContent = finalName;
}

function checkAndPromptPlayerName() {
    const storedName = localStorage.getItem('snakePlayerName');
    if (storedName && storedName.trim()) {
        window.playerName = storedName.trim();
        updatePlayerNameDisplay(window.playerName);
    } else {
        showPlayerNameModal(false);
    }
}

function showPlayerNameModal(isEdit = false) {
    if (!playerNameModal) return;
    if (nameErrorMsg) nameErrorMsg.classList.add('hidden');
    if (playerNameInput) {
        playerNameInput.classList.remove('input-error');
        playerNameInput.value = isEdit ? (window.playerName || '') : '';
    }

    if (playerNameCloseBtn) {
        if (isEdit) {
            playerNameCloseBtn.classList.remove('hidden');
        } else {
            playerNameCloseBtn.classList.add('hidden');
        }
    }

    showScreen(playerNameModal);
    setTimeout(() => {
        if (playerNameInput) playerNameInput.focus();
    }, 150);
}

const PROFANITY_LIST_EN = ['fuck', 'shit', 'bitch', 'ass', 'cunt', 'dick', 'cock', 'faggot', 'nigger', 'nigga', 'slut', 'whore', 'bastard', 'pussy', 'porn'];
const PROFANITY_LIST_AR = ['كس', 'قحب', 'منيوك', 'شرموط', 'عير', 'طيز', 'عرص', 'زب', 'خول', 'كلب', 'حمار', 'لعن', 'سكس', 'نيك'];

function checkProfanity(name) {
    let norm = name.toLowerCase()
                     .replace(/5/g, 's').replace(/1/g, 'i').replace(/3/g, 'e').replace(/4/g, 'a')
                     .replace(/0/g, 'o').replace(/[@]/g, 'a').replace(/[!]/g, 'i').replace(/[\*\$]/g, '')
                     .replace(/[\u064B-\u0652]/g, '') 
                     .replace(/ـ/g, '')
                     .replace(/[أإآ]/g, 'ا')
                     .replace(/ى/g, 'ي')
                     .replace(/ة/g, 'ه');
    
    // Collapse repeated Arabic characters (e.g., 'كسسس' -> 'كس') using unicode flag
    norm = norm.replace(/(.)\1+/gu, '$1');
    
    for (const w of PROFANITY_LIST_EN) {
        // For short English words like 'ass', we want to be careful, but basic inclusion is requested
        if (norm.includes(w)) return true;
    }
    for (const w of PROFANITY_LIST_AR) {
        if (norm.includes(w)) return true;
    }
    return false;
}

function savePlayerName(e) {
    if (e) e.preventDefault();
    if (!playerNameInput) return;

    const val = playerNameInput.value.trim();
    if (val.length < 3 || val.length > 16) {
        if (nameErrorMsg) {
            nameErrorMsg.textContent = i18n[currentLang]?.nameError || 'Name must be 3 to 16 characters.';
            nameErrorMsg.classList.remove('hidden');
        }
        playerNameInput.classList.add('input-error');
        return;
    }

    if (checkProfanity(val)) {
        if (nameErrorMsg) {
            nameErrorMsg.textContent = currentLang === 'ar' ? 'اسم غير لائق' : 'Inappropriate name';
            nameErrorMsg.classList.remove('hidden');
        }
        playerNameInput.classList.add('input-error');
        sounds.die();
        return;
    }

    if (nameErrorMsg) nameErrorMsg.classList.add('hidden');
    playerNameInput.classList.remove('input-error');

    localStorage.setItem('snakePlayerName', val);
    window.playerName = val;
    updatePlayerNameDisplay(val);
    sounds.click();
    showScreen(mainMenuScreen);
}

if (playerNameForm) {
    playerNameForm.addEventListener('submit', savePlayerName);
}
if (editNameBtn) {
    editNameBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        sounds.click();
        showPlayerNameModal(true);
    });
}
if (playerProfileBadge) {
    playerProfileBadge.addEventListener('click', () => {
        sounds.click();
        showPlayerNameModal(true);
    });
}
if (playerNameCloseBtn) {
    playerNameCloseBtn.addEventListener('click', () => {
        sounds.click();
        showScreen(mainMenuScreen);
    });
}

setLanguage(currentLang);
applySoundUI();
initState();
placeFood();
resizeCanvas();
if (dpadContainer) {
    dpadContainer.classList.add('hidden');
}
checkAndPromptPlayerName();
requestAnimationFrame(() => { resizeCanvas(); drawFrame(1); });

/* ══════════════════════════════════════════════════════════
   START / RESTART / PAUSE
   ══════════════════════════════════════════════════════════ */
function startGame() {
    getAudioCtx();
    sounds.start();
    hideAllOverlays();
    if (dpadContainer) {
        dpadContainer.classList.remove('hidden');
    }
    
    document.body.classList.add('game-active');
    
    initState();
    placeFood();
    lastTickTime = performance.now();
    moveAccumulator = 0;
    inputQueue = [];
    gameStarted = true;
    isPaused = false;
    isGameOver = false;
    drawFrame(1);
}

function togglePause() {
    if (!gameStarted || isGameOver) return;
    if (isPaused) {
        isPaused = false;
        hideAllOverlays();
        if (dpadContainer) {
            dpadContainer.classList.remove('hidden');
        }
        applyPauseUI(false);
        lastTickTime = performance.now();
        moveAccumulator = 0;
    } else {
        isPaused = true;
        showScreen(pauseScreen);
        applyPauseUI(true);
        if (dpadContainer) {
            dpadContainer.classList.add('hidden');
        }
    }
}

/* ══════════════════════════════════════════════════════════
   GAME TICK LOGIC
   ══════════════════════════════════════════════════════════ */
function gameTick() {
    if (isPaused || isGameOver) return;

    if (inputQueue.length > 0) {
        const nextDir = inputQueue.shift();
        ndx = nextDir.x;
        ndy = nextDir.y;
    }
    dx = ndx;
    dy = ndy;

    prevSnake = snake.map(s => ({ x: s.x, y: s.y }));
    moveSnake();
    if (checkCollision()) {
        triggerGameOver('self');
        return;
    }
}

/* ── Continuous 60+ FPS Interpolation Loop ── */
function animLoop(ts) {
    if (!lastTickTime) lastTickTime = ts;
    const dt = Math.min(ts - lastTickTime, 100);
    lastTickTime = ts;
    foodPulse = ts;

    if (gameStarted && !isGameOver && !isPaused) {
        moveAccumulator += dt;
        while (moveAccumulator >= gameSpeed) {
            moveAccumulator -= gameSpeed;
            gameTick();
            if (isGameOver) break;
        }

        const progress = isGameOver ? 1 : Math.min(moveAccumulator / gameSpeed, 1);
        drawFrame(progress);
    } else {
        moveAccumulator = 0;
        drawFrame(1);
    }

    requestAnimationFrame(animLoop);
}
requestAnimationFrame(animLoop);

/* ══════════════════════════════════════════════════════════
   DRAWING ROUTINES (Sub-tick Interpolated & Defensive)
   ══════════════════════════════════════════════════════════ */
function drawFrame(progress = 1) {
    const sz = TILES * GRID;
    ctx.clearRect(0, 0, sz, sz);
    drawFood();
    drawSnake(progress);
}

function drawSnake(progress = 1) {
    if (!Array.isArray(snake) || snake.length === 0) return;
    const theme = THEMES[currentDifficulty] || THEMES.medium;
    const sz    = TILES * GRID;

    // Render from tail to head
    for (let i = snake.length - 1; i >= 0; i--) {
        const curr = snake[i];
        if (!curr || typeof curr.x !== 'number' || typeof curr.y !== 'number') continue;
        const prev = (prevSnake && prevSnake[i]) ? prevSnake[i] : curr;

        // Modular shortest-distance interpolation for wrap-around
        let diffX = curr.x - prev.x;
        if (diffX > TILES / 2) diffX -= TILES;
        else if (diffX < -TILES / 2) diffX += TILES;
        let interpX = prev.x + diffX * progress;
        interpX = (interpX + TILES) % TILES;

        let diffY = curr.y - prev.y;
        if (diffY > TILES / 2) diffY -= TILES;
        else if (diffY < -TILES / 2) diffY += TILES;
        let interpY = prev.y + diffY * progress;
        interpY = (interpY + TILES) % TILES;

        const isHead = i === 0;
        const pad    = isHead ? 0 : Math.max(1, GRID * 0.08);
        const r      = isHead ? GRID * 0.22 : GRID * 0.18;
        const t      = Math.min(i / (snake.length + 1), 1);
        const alpha  = 1 - t * 0.4;

        const drawSegmentAt = (px, py) => {
            ctx.shadowBlur  = isHead ? GRID * 0.6 : GRID * 0.28;
            ctx.shadowColor = isHead ? theme.snakeHeadGlow : theme.snakeBodyGlow;

            ctx.beginPath();
            roundRect(ctx, px + pad, py + pad, GRID - pad * 2, GRID - pad * 2, r);
            const grad = ctx.createLinearGradient(px, py, px + GRID, py + GRID);
            if (isHead) {
                grad.addColorStop(0, theme.snakeHeadGrad[0]);
                grad.addColorStop(1, theme.snakeHeadGrad[1]);
            } else {
                const bodyColors = theme.snakeBodyGrad(alpha);
                grad.addColorStop(0, bodyColors[0]);
                grad.addColorStop(1, bodyColors[1]);
            }
            ctx.fillStyle = grad;
            ctx.fill();

            if (isHead) {
                ctx.shadowBlur = 0;
                ctx.fillStyle  = (currentDifficulty === 'hard') ? '#1a0408' : (currentDifficulty === 'easy' ? '#03120a' : '#080c18');
                const ew = Math.max(1.5, GRID * 0.12);
                const ea = GRID * 0.22;
                const eb = GRID * 0.62;
                const em = GRID * 0.40;
                let ex1, ey1, ex2, ey2;
                const fd = (inputQueue.length > 0) ? inputQueue[0] : ((ndx !== 0 || ndy !== 0) ? { x: ndx, y: ndy } : { x: dx || 1, y: dy || 0 });
                if      (fd.y === -1) { ex1 = px + ea; ey1 = py + ea; ex2 = px + eb; ey2 = py + ea; }
                else if (fd.y ===  1) { ex1 = px + ea; ey1 = py + eb; ex2 = px + eb; ey2 = py + eb; }
                else if (fd.x === -1) { ex1 = px + ea; ey1 = py + ea; ex2 = px + ea; ey2 = py + eb; }
                else if (fd.x ===  1) { ex1 = px + eb; ey1 = py + ea; ex2 = px + eb; ey2 = py + eb; }
                else                  { ex1 = px + ea; ey1 = py + em; ex2 = px + eb; ey2 = py + em; }
                ctx.beginPath(); ctx.arc(ex1, ey1, ew, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(ex2, ey2, ew, 0, Math.PI * 2); ctx.fill();
            }
            ctx.shadowBlur = 0;
        };

        const baseX = interpX * GRID;
        const baseY = interpY * GRID;
        drawSegmentAt(baseX, baseY);

        // Seamless wrap ghost rendering
        if (baseX + GRID > sz) drawSegmentAt(baseX - sz, baseY);
        if (baseX < 0)         drawSegmentAt(baseX + sz, baseY);
        if (baseY + GRID > sz) drawSegmentAt(baseX, baseY - sz);
        if (baseY < 0)         drawSegmentAt(baseX, baseY + sz);
    }
}

function drawFood() {
    if (!food || typeof food.x !== 'number' || typeof food.y !== 'number') return;
    const theme = THEMES[currentDifficulty] || THEMES.medium;
    const cx    = food.x * GRID + GRID / 2;
    const cy    = food.y * GRID + GRID / 2;
    const pAmp  = GRID * 0.06;
    const pulse = Math.sin(foodPulse * 0.003) * pAmp;
    const r     = Math.max(2, GRID / 2 - GRID * 0.12 + pulse);

    ctx.shadowBlur  = GRID * 0.65 + pulse * 2;
    ctx.shadowColor = theme.foodGlow;

    const grad = ctx.createRadialGradient(cx - GRID * 0.08, cy - GRID * 0.08, 1, cx, cy, r);
    grad.addColorStop(0, theme.foodGrad[0]);
    grad.addColorStop(0.5, theme.foodGrad[1]);
    grad.addColorStop(1, theme.foodGrad[2]);
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.fillStyle  = 'rgba(255, 255, 255, 0.65)';
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
    if (!Array.isArray(snake) || snake.length === 0 || !snake[0]) return;
    if (dx === 0 && dy === 0) return;
    const head = { 
        x: (snake[0].x + dx + TILES) % TILES, 
        y: (snake[0].y + dy + TILES) % TILES 
    };
    snake.unshift(head);

    const diffConfig = DIFFICULTIES[currentDifficulty] || DIFFICULTIES.medium;

    if (food && typeof food.x === 'number' && typeof food.y === 'number' && head.x === food.x && head.y === food.y) {
        score += 10;
        scoreEl.textContent = score;
        animateScorePop();

        const currentBest = getHighScore(currentDifficulty);
        if (score > currentBest) {
            isNewHS   = true;
            highScore = score;
            highScoreEl.textContent = highScore;
            saveHighScore(highScore, currentDifficulty);
            sounds.highScore();
        } else {
            sounds.eat();
        }

        spawnBurst(food.x * GRID + GRID / 2, food.y * GRID + GRID / 2);
        flashWrapper('flash-eat');
        placeFood();

        if (gameSpeed > diffConfig.minSpeed) {
            gameSpeed = Math.max(diffConfig.minSpeed, gameSpeed - diffConfig.speedStep);
        }
    } else {
        snake.pop();
    }
}

function placeFood() {
    if (!Array.isArray(snake) || snake.length === 0) {
        const center = Math.floor(TILES / 2);
        food = { x: (center + 3) % TILES, y: center };
        return;
    }
    food = { x: Math.floor(Math.random() * TILES), y: Math.floor(Math.random() * TILES) };
    if (snake.some(s => s && s.x === food.x && s.y === food.y)) placeFood();
}

function checkCollision() {
    if (!Array.isArray(snake) || snake.length < 2 || !snake[0]) return false;
    const h = snake[0];
    for (let i = 1; i < snake.length; i++) {
        if (snake[i] && h.x === snake[i].x && h.y === snake[i].y) return true;
    }
    return false;
}

function triggerGameOver(reasonArg = 'self') {
    const reason = window.gameOverReason || 'self';
    isGameOver = true;
    document.body.classList.add('game-over-active');
    const resolvedReason = (typeof reasonArg === 'string' && reasonArg) ? reasonArg : reason;
    if (typeof window !== 'undefined') {
        window.gameOverReason = resolvedReason;
    }
    sounds.die();
    flashWrapper('flash-die');
    finalScoreEl.textContent = score;
    finalHSEl.textContent    = getHighScore(currentDifficulty);
    newHSBadge.classList.toggle('hidden', !isNewHS);
    saveLeaderboardScore(score, currentDifficulty);
    setTimeout(() => showScreen(gameOverScr), 450);
}
if (typeof window !== 'undefined') {
    window.triggerGameOver = triggerGameOver;
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
    const theme = THEMES[currentDifficulty] || THEMES.medium;
    const dist0  = GRID * 1.4;
    const colors = theme.particles;
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
   UNIFIED DIRECTION CONTROL (Keyboard, Swipe, D-Pad with Input Queue)
   ══════════════════════════════════════════════════════════ */
function handleDir(dir) {
    if (!gameStarted || isGameOver || isPaused) return;

    let target = null;
    if (dir === 'up')    target = { x: 0, y: -1 };
    if (dir === 'down')  target = { x: 0, y: 1 };
    if (dir === 'left')  target = { x: -1, y: 0 };
    if (dir === 'right') target = { x: 1, y: 0 };
    if (!target) return;

    const lastDir = inputQueue.length > 0 ? inputQueue[inputQueue.length - 1] : { x: dx, y: dy };

    // Prevent immediate 180-degree self-collision reversal
    if (target.x === -lastDir.x && target.y === -lastDir.y) return;
    // Prevent duplicate consecutive input
    if (target.x === lastDir.x && target.y === lastDir.y) return;

    // Queue up to 2 responsive moves for crisp multi-direction turns
    if (inputQueue.length < 2) {
        inputQueue.push(target);
    }
}

/* ══════════════════════════════════════════════════════════
   KEYBOARD INPUT HANDLER
   ══════════════════════════════════════════════════════════ */
document.addEventListener('keydown', e => {
    const prevent = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'];
    if (prevent.includes(e.code)) e.preventDefault();

    if (e.code === 'KeyM') { soundBtn.click(); return; }

    // Escape key modal dismiss navigation
    if (e.code === 'Escape') {
        if (difficultySelectScreen && !difficultySelectScreen.classList.contains('hidden')) {
            hideDifficultySelect();
            return;
        }
        if (modeSelectScreen && !modeSelectScreen.classList.contains('hidden')) {
            hideModeSelect();
            return;
        }
        if (settingsScreen && !settingsScreen.classList.contains('hidden')) {
            hideSettings();
            return;
        }
        if (resetHsModal && !resetHsModal.classList.contains('hidden')) {
            resetHsModal.classList.add('hidden');
            return;
        }
    }

    if ((e.code === 'KeyP' || e.code === 'Space') && gameStarted && !isGameOver) {
        togglePause();
        return;
    }

    if ((e.code === 'Space' || e.code === 'Enter') && isGameOver) {
        restartBtn.click();
        return;
    }

    if (!gameStarted || isGameOver || isPaused) return;

    if (e.code === 'ArrowUp'    || e.code === 'KeyW') handleDir('up');
    if (e.code === 'ArrowDown'  || e.code === 'KeyS') handleDir('down');
    if (e.code === 'ArrowLeft'  || e.code === 'KeyA') handleDir('left');
    if (e.code === 'ArrowRight' || e.code === 'KeyD') handleDir('right');
});

/* ══════════════════════════════════════════════════════════
   TOUCH SWIPE ON BOARD (Low-latency, Multi-directional)
   ══════════════════════════════════════════════════════════ */
const SWIPE_THRESHOLD = 22;
let touchStartX = 0;
let touchStartY = 0;
let touchActive = false;
let touchSwiped = false;

function handleTouchStart(e) {
    if (e.touches.length > 1) return;
    const t = e.touches[0];
    touchStartX = t.clientX;
    touchStartY = t.clientY;
    touchActive = true;
    touchSwiped = false;
}

function handleTouchMove(e) {
    if (!touchActive || e.touches.length > 1) return;

    // Prevent mobile page scroll/rubber-banding while interacting with board
    if (e.cancelable) {
        e.preventDefault();
    }

    if (touchStartX === 0 && touchStartY === 0) return;

    const t = e.touches[0];
    const dx = t.clientX - touchStartX;
    const dy = t.clientY - touchStartY;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (Math.max(absDx, absDy) >= SWIPE_THRESHOLD) {
        if (absDx > absDy) {
            handleDir(dx > 0 ? 'right' : 'left');
        } else {
            handleDir(dy > 0 ? 'down' : 'up');
        }
        // Continuous steering: update anchor point to current position
        touchStartX = t.clientX;
        touchStartY = t.clientY;
        touchSwiped = true;
    }
}

function handleTouchEnd(e) {
    if (!touchActive) return;

    if (!touchSwiped && e.changedTouches && e.changedTouches.length > 0) {
        const t = e.changedTouches[0];
        const dx = t.clientX - touchStartX;
        const dy = t.clientY - touchStartY;
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);

        // Allow slightly lower threshold for quick flick releases
        if (Math.max(absDx, absDy) >= (SWIPE_THRESHOLD * 0.75)) {
            if (absDx > absDy) {
                handleDir(dx > 0 ? 'right' : 'left');
            } else {
                handleDir(dy > 0 ? 'down' : 'up');
            }
        }
    }

    touchActive = false;
    touchStartX = 0;
    touchStartY = 0;
    touchSwiped = false;
}

function handleTouchCancel() {
    touchActive = false;
    touchStartX = 0;
    touchStartY = 0;
    touchSwiped = false;
}

// Bind swipe gestures on canvas with non-passive listeners for preventDefault
canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
canvas.addEventListener('touchmove',  handleTouchMove,  { passive: false });
canvas.addEventListener('touchend',    handleTouchEnd,    { passive: false });
canvas.addEventListener('touchcancel', handleTouchCancel, { passive: false });

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
if (homeBtn) homeBtn.addEventListener('click', () => { sounds.click(); showMainMenu(); });

/* ══════════════════════════════════════════════════════════
   FIREBASE CLOUD FIRESTORE LEADERBOARD & UNIQUE PLAYER IDENTITY
   ══════════════════════════════════════════════════════════ */
const firebaseConfig = {
  apiKey: "AIzaSyCetc8ROJlBGg3tb1BSazkZV_zClpGfMgc",
  authDomain: "neon-snake-6c079.firebaseapp.com",
  databaseURL: "https://neon-snake-6c079-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "neon-snake-6c079",
  storageBucket: "neon-snake-6c079.firebasestorage.app",
  messagingSenderId: "204093303034",
  appId: "1:204093303034:web:3e268f37a2b99a42c04143",
  measurementId: "G-TQPCQ33S3T"
};

let db = null;
if (typeof firebase !== 'undefined') {
    try {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        db = firebase.firestore();
        const rtdb = firebase.database();
        
        // Presence logic
        const connectedRef = rtdb.ref(".info/connected");
        const onlineUsersRef = rtdb.ref("status/onlineUsers");

        connectedRef.on("value", (snap) => {
            if (snap.val() === true) {
                const userSessionRef = onlineUsersRef.push();
                userSessionRef.onDisconnect().remove();
                userSessionRef.set(true);
            }
        });

        onlineUsersRef.on("value", (snap) => {
            const count = snap.numChildren() || 1;
            const badge = document.querySelector(".live-indicator");
            if (badge) {
                badge.innerHTML = `<span class="pulse-dot"></span> ${count} PLAYING`;
            }
        });

    } catch (e) {
        console.warn('Firebase initialization warning:', e);
    }
}

function getPlayerId() {
    let pid = localStorage.getItem('neon_snake_player_id');
    if (!pid) {
        pid = (typeof crypto !== 'undefined' && crypto.randomUUID)
            ? crypto.randomUUID()
            : 'runner_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
        localStorage.setItem('neon_snake_player_id', pid);
    }
    return pid;
}

function getPlayerName() {
    return localStorage.getItem('snakePlayerName') || '';
}

function updatePlayerNameUI(name) {
    const displayName = name || 'CyberRunner';
    if (playerNameDisplay) playerNameDisplay.textContent = displayName;
    if (headerPlayerName) headerPlayerName.textContent = displayName;
    if (playerNameInput) playerNameInput.value = name || '';
}

function showNameModal(canCancel = true) {
    if (playerNameModal) {
        if (playerNameCloseBtn) {
            playerNameCloseBtn.classList.toggle('hidden', !canCancel);
        }
        const currentName = getPlayerName();
        if (playerNameInput) playerNameInput.value = currentName;
        playerNameModal.classList.remove('hidden');
        playerNameModal.style.setProperty('display', 'flex', 'important');
    }
}

function hideNameModal() {
    if (playerNameModal) {
        playerNameModal.classList.add('hidden');
        playerNameModal.style.setProperty('display', 'none', 'important');
    }
}

async function handleNameSave(e) {
    if (e) e.preventDefault();
    const rawVal = playerNameInput ? playerNameInput.value.trim() : '';
    if (rawVal.length < 3 || rawVal.length > 16) {
        if (nameErrorMsg) {
            nameErrorMsg.textContent = i18n[currentLang]?.nameError || 'Name must be 3 to 16 characters.';
            nameErrorMsg.classList.remove('hidden');
        }
        if (playerNameInput) playerNameInput.classList.add('input-error');
        sounds.die();
        return;
    }

    if (checkProfanity(rawVal)) {
        if (nameErrorMsg) {
            nameErrorMsg.textContent = currentLang === 'ar' ? 'اسم غير لائق' : 'Inappropriate name';
            nameErrorMsg.classList.remove('hidden');
        }
        if (playerNameInput) playerNameInput.classList.add('input-error');
        sounds.die();
        return;
    }
    
    if (nameErrorMsg) nameErrorMsg.classList.add('hidden');
    if (playerNameInput) playerNameInput.classList.remove('input-error');

    localStorage.setItem('snakePlayerName', rawVal);
    updatePlayerNameUI(rawVal);
    sounds.click();
    hideNameModal();

    await updatePlayerNameInFirestore(rawVal);
}

async function updatePlayerNameInFirestore(newName) {
    if (!db) return;
    const pid = getPlayerId();
    const diffs = ['easy', 'medium', 'hard'];
    const batch = db.batch();
    diffs.forEach(diff => {
        const ref = db.collection('leaderboard').doc(`${pid}_${diff}`);
        batch.set(ref, { name: newName }, { merge: true });
    });
    try {
        await batch.commit();
        if (leaderboardScreen && !leaderboardScreen.classList.contains('hidden')) {
            loadLeaderboard();
        }
    } catch (err) {
        console.warn('Error updating name in Firestore:', err);
    }
}

// Bind Player Profile Badge & Name Modal Events
if (editNameBtn) editNameBtn.addEventListener('click', () => showNameModal(true));
if (playerProfileBadge) playerProfileBadge.addEventListener('click', (e) => {
    e.stopPropagation();
    showNameModal(true);
});
if (playerHeaderTag) playerHeaderTag.addEventListener('click', () => showNameModal(true));
if (playerNameCloseBtn) playerNameCloseBtn.addEventListener('click', hideNameModal);
if (playerNameForm) playerNameForm.addEventListener('submit', handleNameSave);

// Check if Player Name exists on load
window.addEventListener('DOMContentLoaded', () => {
    const existingName = getPlayerName();
    if (existingName) {
        updatePlayerNameUI(existingName);
    }
});

// Immediate init fallback
const initPlayerName = getPlayerName();
if (initPlayerName) {
    updatePlayerNameUI(initPlayerName);
}

async function saveLeaderboardScore(scoreVal, diffVal) {
    if (!db || typeof scoreVal !== 'number' || scoreVal <= 0) return;
    try {
        const pid = getPlayerId();
        const playerName = getPlayerName() || 'CyberRunner';
        const diff = diffVal || currentDifficulty || 'medium';
        const docId = `${pid}_${diff}`;
        const docRef = db.collection('leaderboard').doc(docId);

        const docSnap = await docRef.get();
        if (!docSnap.exists) {
            await docRef.set({
                playerId: pid,
                name: playerName,
                score: scoreVal,
                difficulty: diff,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
        } else {
            const existingData = docSnap.data();
            if (existingData.banned) {
                console.warn('Player is banned, score rejected.');
                return;
            }
            const existingScore = existingData.score || 0;
            if (scoreVal > existingScore) {
                await docRef.set({
                    playerId: pid,
                    name: playerName,
                    score: scoreVal,
                    difficulty: diff,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                }, { merge: true });
            } else if (existingData.name !== playerName) {
                await docRef.set({ name: playerName }, { merge: true });
            }
        }
    } catch (err) {
        console.error('Error saving score to leaderboard:', err);
    }
}

let currentLbFilter = 'all';

// Tab Click Events
document.querySelectorAll('.lb-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
        sounds.click();
        document.querySelectorAll('.lb-tab').forEach(t => t.classList.remove('active'));
        e.currentTarget.classList.add('active');
        currentLbFilter = e.currentTarget.getAttribute('data-diff') || 'all';
        loadLeaderboard();
    });
});

function showLeaderboard() {
    sounds.click();
    showScreen(leaderboardScreen);
    loadLeaderboard();
}

function hideLeaderboard() {
    sounds.click();
    showScreen(mainMenuScreen);
}

function loadLeaderboard() {
    if (!leaderboardTbody) return;
    
    const loadingText = i18n[currentLang]?.loading || 'LOADING...';
    leaderboardTbody.innerHTML = `<tr><td colspan="4" class="lb-loading">${loadingText}</td></tr>`;

    if (!db) {
        const errText = i18n[currentLang]?.errorLoading || 'FAILED TO LOAD';
        leaderboardTbody.innerHTML = `<tr><td colspan="4" class="lb-empty">${errText}</td></tr>`;
        return;
    }

    db.collection('leaderboard')
         .orderBy('score', 'desc')
         .limit(150)
         .get()
         .then((querySnapshot) => {
             if (querySnapshot.empty) {
                 const noScoresText = i18n[currentLang]?.noScores || 'NO SCORES YET';
                 leaderboardTbody.innerHTML = `<tr><td colspan="4" class="lb-empty">${noScoresText}</td></tr>`;
                 return;
             }

             let html = '';
             let rank = 1;
             const seenPlayers = new Set();
             let count = 0;

             querySnapshot.forEach((doc) => {
                 if (count >= 50) return;
                 const data = doc.data();
                 const diff = (data.difficulty || 'medium').toLowerCase();
                 const pid = data.playerId || doc.id;
                 
                 // Filter by difficulty in-memory
                 if (currentLbFilter !== 'all' && diff !== currentLbFilter) {
                     return;
                 }

                 // Deduplicate by player ID
                 if (seenPlayers.has(pid)) {
                     return;
                 }
                 seenPlayers.add(pid);
                 count++;

                 const name = data.name || 'Anonymous';
                 const scoreNum = data.score || 0;

                 let rankBadge = `${rank}`;
                 let rankClass = 'rank-normal';
                 if (rank === 1) { rankBadge = '🥇 1'; rankClass = 'rank-1'; }
                 else if (rank === 2) { rankBadge = '🥈 2'; rankClass = 'rank-2'; }
                 else if (rank === 3) { rankBadge = '🥉 3'; rankClass = 'rank-3'; }

                 const diffKey = `diff${diff.charAt(0).toUpperCase() + diff.slice(1)}`;
                 const diffBadgeText = i18n[currentLang]?.[diffKey] || diff.toUpperCase();

                 html += `
                     <tr class="lb-row ${rankClass}">
                         <td class="lb-rank"><span class="rank-pill">${rankBadge}</span></td>
                         <td class="lb-name">${escapeHtml(name)}</td>
                         <td class="lb-score">${scoreNum}</td>
                         <td class="lb-diff"><span class="diff-badge-sm diff-sm-${diff}">${diffBadgeText}</span></td>
                     </tr>
                 `;
                 rank++;
             });
             
             if (html === '') {
                 const noScoresText = i18n[currentLang]?.noScores || 'NO SCORES YET';
                 leaderboardTbody.innerHTML = `<tr><td colspan="4" class="lb-empty">${noScoresText}</td></tr>`;
             } else {
                 leaderboardTbody.innerHTML = html;
             }
         })
         .catch((error) => {
             console.error('Error getting leaderboard:', error);
             const errText = i18n[currentLang]?.errorLoading || 'FAILED TO LOAD';
             leaderboardTbody.innerHTML = `<tr><td colspan="4" class="lb-empty">${errText}</td></tr>`;
         });
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/* ══════════════════════════════════════════════════════════
   ADMIN SECRETS & DASHBOARD
   ══════════════════════════════════════════════════════════ */
const ADMIN_PIN = "1337";
const adminDashboardModal = document.getElementById('admin-dashboard-modal');
const adminAuthModal = document.getElementById('admin-auth-modal');
const adminPinInput = document.getElementById('admin-pin-input');
const adminAuthSubmitBtn = document.getElementById('admin-auth-submit-btn');
const adminAuthError = document.getElementById('admin-auth-error');
const adminAuthCloseBtn = document.getElementById('admin-auth-close-btn');
const adminDashCloseBtn = document.getElementById('admin-dash-close-btn');
const adminTbody = document.getElementById('admin-tbody');
const adminSearchInput = document.getElementById('admin-search-input');

document.addEventListener('keydown', (e) => {
    // Check for '*' or Shift + '8'
    if (e.key === '*' || (e.shiftKey && (e.key === '*' || e.code === 'Digit8' || e.code === 'NumpadMultiply'))) {
        e.preventDefault();
        showAdminAuth();
    }
});

function showAdminAuth() {
    adminAuthModal.classList.remove('hidden');
    adminAuthModal.style.setProperty('display', 'flex', 'important');
    adminPinInput.value = '';
    adminAuthError.classList.add('hidden');
    adminPinInput.classList.remove('input-error', 'shake-error');
    setTimeout(() => adminPinInput.focus(), 100);
}

if (adminAuthCloseBtn) {
    adminAuthCloseBtn.addEventListener('click', () => {
        adminAuthModal.classList.add('hidden');
        adminAuthModal.style.setProperty('display', 'none', 'important');
    });
}

if (adminDashCloseBtn) {
    adminDashCloseBtn.addEventListener('click', () => {
        adminDashboardModal.classList.add('hidden');
        adminDashboardModal.style.setProperty('display', 'none', 'important');
    });
}

if (adminAuthSubmitBtn) {
    adminAuthSubmitBtn.addEventListener('click', handleAdminAuth);
}
if (adminPinInput) {
    adminPinInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAdminAuth();
    });
}

function handleAdminAuth() {
    const pin = adminPinInput.value;
    if (pin === ADMIN_PIN) {
        adminAuthModal.classList.add('hidden');
        adminAuthModal.style.setProperty('display', 'none', 'important');
        showAdminDashboard();
    } else {
        adminAuthError.classList.remove('hidden');
        adminPinInput.classList.remove('shake-error');
        void adminPinInput.offsetWidth; // trigger reflow
        adminPinInput.classList.add('shake-error', 'input-error');
        if (typeof sounds !== 'undefined' && sounds.die) sounds.die();
    }
}

function showAdminDashboard() {
    adminDashboardModal.classList.remove('hidden');
    adminDashboardModal.style.setProperty('display', 'flex', 'important');
    loadAdminData();
}

let allAdminDocs = [];

function loadAdminData() {
    if (!db) return;
    adminTbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px; color: #00f3ff;">LOADING DATA...</td></tr>';
    
    db.collection('leaderboard').orderBy('score', 'desc').limit(300).get()
        .then(snapshot => {
            if (snapshot.empty) {
                adminTbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px;">NO DATA</td></tr>';
                return;
            }
            
            allAdminDocs = [];
            snapshot.forEach(doc => {
                allAdminDocs.push({ id: doc.id, ...doc.data() });
            });
            renderAdminTable(allAdminDocs);
        })
        .catch(err => {
            console.error('Error loading admin data:', err);
            adminTbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: red;">ERROR LOADING DATA</td></tr>';
        });
}

function renderAdminTable(dataArray) {
    if (dataArray.length === 0) {
        adminTbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px;">NO RESULTS</td></tr>';
        return;
    }
    let html = '';
    dataArray.forEach(d => {
        const statusBadge = d.banned ? '<span class="status-badge status-banned">BANNED</span>' : '<span class="status-badge status-active">ACTIVE</span>';
        
        html += `
            <tr>
                <td style="width: 25%; text-align: left; padding-left: 20px;">
                    <span class="admin-player-name" style="cursor:pointer; font-size:1.05rem; font-weight:600;" onclick="adminEditName('${d.id}', '${escapeHtml(d.name || 'Anonymous').replace(/'/g, "\\'")}')">${escapeHtml(d.name || 'Anonymous')}</span>
                </td>
                <td style="width: 15%; text-align: center;">
                    <span class="admin-player-score" style="cursor:pointer; font-size:1.15rem; font-weight:800; color:var(--cyan);" onclick="adminEditScore('${d.id}', ${d.score || 0})">${d.score || 0}</span>
                </td>
                <td style="width: 15%; text-align: center;">
                    <span class="diff-badge-sm diff-sm-${d.difficulty || 'medium'}">${d.difficulty || 'medium'}</span>
                </td>
                <td style="width: 15%; text-align: center;">
                    <span class="status-badge ${d.banned ? 'status-banned' : 'status-active'}">${d.banned ? 'BANNED' : 'ACTIVE'}</span>
                </td>
                <td style="width: 30%; text-align: center;">
                    <div class="admin-actions-wrap">
                        <button class="admin-action-icon" style="font-size: 1.25rem;" onclick="adminEditName('${d.id}', '${escapeHtml(d.name || 'Anonymous').replace(/'/g, "\\'")}')" title="Edit Name">🏷️</button>
                        <button class="admin-action-icon" style="font-size: 1.25rem;" onclick="adminEditScore('${d.id}', ${d.score || 0})" title="Edit Score">✏️</button>
                        <button class="admin-action-icon" style="font-size: 1.25rem;" onclick="adminBanPlayer('${d.id}', ${!d.banned})" title="${d.banned ? 'Unban' : 'Ban'}">🚫</button>
                        <button class="admin-action-icon" style="font-size: 1.25rem;" onclick="adminDeleteScore('${d.id}')" title="Delete Entry">🗑️</button>
                    </div>
                </td>
            </tr>
        `;
    });
    adminTbody.innerHTML = html;
}

let currentAdminFilter = 'all';

function filterAdminData() {
    const q = adminSearchInput ? adminSearchInput.value.toLowerCase() : '';
    let filtered = allAdminDocs;
    
    if (currentAdminFilter !== 'all') {
        filtered = filtered.filter(d => (d.difficulty || 'medium') === currentAdminFilter);
    }
    
    if (q) {
        filtered = filtered.filter(d => (d.name || '').toLowerCase().includes(q));
    }
    
    renderAdminTable(filtered);
}

if (adminSearchInput) {
    adminSearchInput.addEventListener('input', filterAdminData);
}

document.querySelectorAll('#admin-filters .lb-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
        document.querySelectorAll('#admin-filters .lb-tab').forEach(t => t.classList.remove('active'));
        e.currentTarget.classList.add('active');
        currentAdminFilter = e.currentTarget.getAttribute('data-diff') || 'all';
        filterAdminData();
    });
});

window.adminEditScore = async function(docId, currentScore) {
    const rawNewScore = prompt('Enter new score for player:', currentScore);
    if (rawNewScore === null) return; // user cancelled
    
    const newScore = parseInt(rawNewScore, 10);
    if (isNaN(newScore) || newScore < 0) {
        alert('Invalid score. Please enter a positive number.');
        return;
    }
    
    try {
        await db.collection('leaderboard').doc(docId).update({ score: newScore });
        loadAdminData();
    } catch (e) {
        console.error(e);
        alert('Failed to edit score.');
    }
};

window.adminEditName = async function(docId, currentName) {
    const rawNewName = prompt('Enter new name for player:', currentName);
    if (rawNewName === null) return;
    
    const newName = rawNewName.trim();
    if (newName.length < 3 || newName.length > 16) {
        alert('Invalid name. Must be between 3 and 16 characters.');
        return;
    }
    
    if (checkProfanity(newName)) {
        alert(currentLang === 'ar' ? 'اسم غير لائق' : 'Inappropriate name');
        return;
    }
    
    try {
        await db.collection('leaderboard').doc(docId).update({ name: newName });
        loadAdminData();
    } catch (e) {
        console.error(e);
        alert('Failed to edit name.');
    }
};

window.adminDeleteScore = async function(docId) {
    if (confirm('Are you sure you want to permanently delete this score?')) {
        try {
            await db.collection('leaderboard').doc(docId).delete();
            loadAdminData();
        } catch (e) {
            console.error(e);
            alert('Failed to delete score.');
        }
    }
};

window.adminBanPlayer = async function(docId, banState) {
    if (confirm(`Are you sure you want to ${banState ? 'ban' : 'unban'} this player?`)) {
        try {
            await db.collection('leaderboard').doc(docId).update({ banned: banState });
            loadAdminData();
        } catch (e) {
            console.error(e);
            alert('Failed to update ban status.');
        }
    }
};

document.getElementById('admin-wipe-easy-btn')?.addEventListener('click', () => adminWipeByDifficulty('easy'));
document.getElementById('admin-wipe-medium-btn')?.addEventListener('click', () => adminWipeByDifficulty('medium'));
document.getElementById('admin-wipe-hard-btn')?.addEventListener('click', () => adminWipeByDifficulty('hard'));
document.getElementById('admin-reset-all-btn')?.addEventListener('click', () => adminWipeByDifficulty('all'));

async function adminWipeByDifficulty(diff) {
    const msg = diff === 'all' 
        ? '⚠️ WARNING: YOU ARE ABOUT TO WIPE THE ENTIRE LEADERBOARD! PROCEED?'
        : `Are you sure you want to wipe all ${diff.toUpperCase()} scores?`;
        
    if (!confirm(msg)) return;
    
    try {
        let query = db.collection('leaderboard');
        if (diff !== 'all') {
            query = query.where('difficulty', '==', diff);
        }
        
        const snapshot = await query.get();
        if (snapshot.empty) {
            alert(`No scores found for ${diff}.`);
            return;
        }
        
        const batch = db.batch();
        snapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });
        
        await batch.commit();
        alert(`Successfully wiped ${snapshot.size} scores.`);
        loadAdminData();
    } catch (e) {
        console.error(e);
        alert('Failed to wipe scores.');
    }
}
