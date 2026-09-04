import os

filepath = 'c:/Users/user/OneDrive/Desktop/Test/style.css'
with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_content = ''.join(lines[:3418])

append_content = '''  }
}

/* Clean reset for any child spans */
.hero-title span, .game-title span, .hero-char, .char {
  animation: none !important;
  display: inline !important;
  color: inherit !important;
  -webkit-text-fill-color: inherit !important;
  background: none !important;
}

/* FORCE VIBRANT FLOATING & PULSE ANIMATION ON NEW HTML CLASS */
.hero-title.glow-cyan, 
.overlay-title.hero-title,
.hero-title {
  display: block !important;
  text-align: center !important;
  font-family: 'Rajdhani', 'Orbitron', sans-serif !important;
  font-weight: 800 !important;
  white-space: nowrap !important;
  color: #00f2fe !important;
  -webkit-text-fill-color: #00f2fe !important;
  
  /* HARDWARE ACCELERATED INFINITE MOTION */
  animation: neonFloatPulse 2s ease-in-out infinite alternate !important;
}

@keyframes neonFloatPulse {
  0% {
    transform: translateY(0px) scale(1);
    text-shadow: 
      0 0 8px #00f2fe,
      0 0 16px rgba(0, 242, 254, 0.5);
  }
  100% {
    transform: translateY(-12px) scale(1.04);
    color: #ffffff !important;
    -webkit-text-fill-color: #ffffff !important;
    text-shadow: 
      0 0 12px #00f2fe,
      0 0 25px #00f2fe,
      0 0 45px rgba(0, 242, 254, 0.8);
  }
}

/* DESKTOP HUD BASE STYLES */
#game-header .hud-title-wrap {
  position: absolute !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
}
#game-header .hud-title-wrap,
#game-header .snake-title,
#game-header .in-game-title,
#game-header .snake-title span {
  font-size: 1.85rem !important;
  letter-spacing: 2px !important;
}

.score-box {
  width: 68px !important;
  height: 58px !important;
  min-width: 68px !important;
  border-radius: 12px !important;
  padding: 4px 6px !important;
  box-sizing: border-box !important;
}
#game-header .hud-right button {
  width: 46px !important;
  height: 46px !important;
  border-radius: 12px !important;
}

/* MOBILE HUD RESPONSIVE OVERRIDES */
@media (max-width: 800px) {
  #game-header {
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    position: relative !important;
  }

  /* Reset absolute positioning on EVERY possible title selector */
  #game-header h1,
  #game-header h2,
  #game-header .hud-title-wrap,
  #game-header .snake-title,
  #game-header .in-game-title,
  #game-header [class*="title"] {
    position: relative !important;
    left: auto !important;
    transform: none !important;
    margin: 0 2px !important;
    flex: 1 1 auto !important;
    text-align: center !important;
    white-space: nowrap !important;
    font-size: 0.72rem !important;
  }

  #game-header h1 *,
  #game-header h2 *,
  #game-header .hud-title-wrap *,
  #game-header .snake-title *,
  #game-header .in-game-title *,
  #game-header [class*="title"] * {
    font-size: 0.72rem !important;
    letter-spacing: 0px !important;
  }

  /* Ensure score boxes and buttons don't push it out */
  .score-box {
    width: 40px !important;
    height: 40px !important;
    min-width: 40px !important;
    flex-shrink: 0 !important;
  }

  #game-header .hud-right {
    flex-shrink: 0 !important;
  }
}
'''

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(new_content + append_content)
