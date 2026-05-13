// 工具函数和基础管理器

// 音效管理器
const SoundManager = {
  SOUND_KEY: 'go_sound_enabled',
  sounds: {},
  enabled: true,

  init() {
    this.enabled = localStorage.getItem(this.SOUND_KEY) !== 'false';
    this.loadSounds();
  },

  loadSounds() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
  },

  isEnabled() {
    return this.enabled;
  },

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem(this.SOUND_KEY, this.enabled);
    return this.enabled;
  },

  playPlaceStone() {
    if (!this.enabled || !this.audioContext) return;
    this.playTone(800, 0.05, 'square', 0.1);
  },

  playCapture(count = 1) {
    if (!this.enabled || !this.audioContext) return;
    for (let i = 0; i < Math.min(count, 5); i++) {
      setTimeout(() => {
        this.playTone(600 + i * 100, 0.03, 'sawtooth', 0.08);
      }, i * 50);
    }
  },

  playVictory() {
    if (!this.enabled || !this.audioContext) return;
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.15, 'sine', 0.15), i * 120);
    });
  },

  playError() {
    if (!this.enabled || !this.audioContext) return;
    this.playTone(200, 0.1, 'sawtooth', 0.1);
  },

  playTone(frequency, duration, type = 'sine', volume = 0.1) {
    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;
      gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (e) {
      // 音频上下文可能被浏览器阻止
    }
  }
};

// 主题管理
const ThemeManager = {
  THEME_KEY: 'go_theme',

  init() {
    const savedTheme = this.getTheme();
    if (savedTheme) {
      this.setTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(prefersDark ? 'dark' : 'light');
    }
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(this.THEME_KEY)) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  },

  getTheme() {
    return localStorage.getItem(this.THEME_KEY);
  },

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.THEME_KEY, theme);
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.textContent = theme === 'dark' ? '☀️' : '🌙';
    });
  },

  toggle() {
    const current = this.getTheme();
    this.setTheme(current === 'dark' ? 'light' : 'dark');
  }
};

// Toast 提示
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer') || createToastContainer();
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

function createToastContainer() {
  const container = document.createElement('div');
  container.id = 'toastContainer';
  container.className = 'toast-container';
  document.body.appendChild(container);
  return container;
}

// 防抖函数
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// 错误边界 - 显示全屏错误遮罩
function showErrorBoundary(message) {
  let boundary = document.getElementById('errorBoundary');
  if (!boundary) {
    boundary = document.createElement('div');
    boundary.id = 'errorBoundary';
    boundary.className = 'error-boundary';
    boundary.innerHTML = `
      <div class="error-boundary-icon">⚠️</div>
      <div class="error-boundary-title">出错了</div>
      <div class="error-boundary-message" id="errorBoundaryMsg"></div>
      <button class="error-boundary-btn" onclick="window.location.reload()">刷新页面</button>
    `;
    document.body.appendChild(boundary);
  }
  document.getElementById('errorBoundaryMsg').textContent = message;
  boundary.classList.add('active');
}

// 全局错误处理
window.addEventListener('error', (e) => {
  console.error('全局错误:', e.error);
  showToast('发生错误，请刷新页面重试', 'error');
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('未处理的Promise错误:', e.reason);
  showToast('操作失败，请重试', 'error');
});
