/// <reference path="../typings/naimo.d.ts" />

import './style.css';
import chroma from 'chroma-js';

// ==================== 类型定义 ====================

interface GradientPreset {
  name: string;
  colors: string[];
}

type GradientMode = 'linear' | 'radial' | 'conic';

// ==================== 热重载 ====================
if (import.meta.hot) {
  import.meta.hot.on('preload-changed', async (data) => {
    console.log('📝 检测到 preload 变化:', data);
    console.log('🔨 正在触发 preload 构建...');
    try {
      const response = await fetch('/__preload_build');
      const result = await response.json();
      if (result.success) {
        console.log('✅ Preload 构建完成');
        await window.naimo.hot();
        console.log('🔄 Preload 热重载完成');
        location.reload();
      } else {
        console.error('❌ Preload 构建失败');
      }
    } catch (error) {
      console.error('❌ 触发 preload 构建失败:', error);
    }
  });
}

// ==================== 渐变生成器类 ====================

class GradientGenerator {
  private colors: string[] = [];
  private mode: GradientMode = 'linear';
  private presets: GradientPreset[] = [
    { name: '日落橙', colors: ['#FF6B6B', '#FFA07A', '#FFD700'] },
    { name: '海洋蓝', colors: ['#667eea', '#764ba2', '#f093fb'] },
    { name: '森林绿', colors: ['#56ab2f', '#a8e063'] },
    { name: '紫色梦境', colors: ['#c471f5', '#fa71cd'] },
    { name: '粉色泡泡', colors: ['#fbc2eb', '#a6c1ee'] },
    { name: '火焰红', colors: ['#f83600', '#f9d423'] },
    { name: '薄荷绿', colors: ['#00f260', '#0575e6'] },
    { name: '黑夜星空', colors: ['#0f2027', '#203a43', '#2c5364'] },
    { name: '彩虹色', colors: ['#FF0080', '#FF8C00', '#FFD700', '#00FF00', '#0000FF', '#8B00FF'] },
    { name: '樱花粉', colors: ['#ffecd2', '#fcb69f'] },
  ];

  constructor(initialCount: number = 3) {
    this.generateRandomColors(initialCount);
  }

  // 生成随机颜色
  generateRandomColors(count: number): void {
    this.colors = [];
    for (let i = 0; i < count; i++) {
      this.colors.push(chroma.random().hex());
    }
  }

  // 智能生成和谐的渐变色
  generateHarmoniousColors(count: number): void {
    const baseHue = Math.random() * 360;
    const saturation = 0.6 + Math.random() * 0.3;
    const lightness = 0.5 + Math.random() * 0.2;

    this.colors = [];
    for (let i = 0; i < count; i++) {
      const hue = (baseHue + (i * 360 / count)) % 360;
      const color = chroma.hsl(hue, saturation, lightness).hex();
      this.colors.push(color);
    }
  }

  // 更新颜色
  updateColor(index: number, color: string): void {
    if (index >= 0 && index < this.colors.length) {
      this.colors[index] = color;
    }
  }

  // 设置模式
  setMode(mode: GradientMode): void {
    this.mode = mode;
  }

  // 获取 CSS 渐变代码
  getCSSGradient(): string {
    const colorStops = this.colors.map((color, index) => {
      const position = (index / (this.colors.length - 1)) * 100;
      return `${color} ${position}%`;
    }).join(', ');

    switch (this.mode) {
      case 'linear':
        return `linear-gradient(90deg, ${colorStops})`;
      case 'radial':
        return `radial-gradient(circle, ${colorStops})`;
      case 'conic':
        return `conic-gradient(${colorStops})`;
      default:
        return `linear-gradient(90deg, ${colorStops})`;
    }
  }

  // 获取 SVG 渐变代码
  getSVGGradient(): string {
    const gradientId = 'gradient-' + Date.now();

    if (this.mode === 'linear') {
      const stops = this.colors.map((color, index) => {
        const offset = (index / (this.colors.length - 1)) * 100;
        return `  <stop offset="${offset}%" stop-color="${color}" />`;
      }).join('\n');

      return `<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="0%">
${stops}
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#${gradientId})" />
</svg>`;
    } else if (this.mode === 'radial') {
      const stops = this.colors.map((color, index) => {
        const offset = (index / (this.colors.length - 1)) * 100;
        return `  <stop offset="${offset}%" stop-color="${color}" />`;
      }).join('\n');

      return `<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="${gradientId}">
${stops}
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#${gradientId})" />
</svg>`;
    } else {
      return this.getSVGGradient(); // conic 暂时使用 linear
    }
  }

  // 应用预设
  applyPreset(preset: GradientPreset): void {
    this.colors = [...preset.colors];
  }

  // 获取当前颜色
  getColors(): string[] {
    return [...this.colors];
  }

  // 获取预设列表
  getPresets(): GradientPreset[] {
    return this.presets;
  }
}

// ==================== 应用初始化 ====================

let generator: GradientGenerator;

async function initApp(): Promise<void> {
  console.log('渐变色生成器初始化...');

  // 初始化生成器
  generator = new GradientGenerator(3);

  // 获取 DOM 元素
  const colorCountSlider = document.getElementById('colorCount') as HTMLInputElement;
  const colorCountLabel = document.getElementById('colorCountLabel') as HTMLSpanElement;
  const randomBtn = document.getElementById('randomBtn') as HTMLButtonElement;
  const exportBtn = document.getElementById('exportBtn') as HTMLButtonElement;
  const modeBtns = document.querySelectorAll('.mode-btn');

  // 颜色数量控制
  colorCountSlider?.addEventListener('input', (e) => {
    const count = parseInt((e.target as HTMLInputElement).value);
    colorCountLabel.textContent = count.toString();
    generator.generateHarmoniousColors(count);
    updateUI();
  });

  // 随机生成
  randomBtn?.addEventListener('click', () => {
    const count = parseInt(colorCountSlider.value);
    generator.generateHarmoniousColors(count);
    updateUI();
    naimo.log.info('生成随机渐变色');
  });

  // 导出
  exportBtn?.addEventListener('click', () => {
    showExportModal();
  });

  // 模式切换
  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.getAttribute('data-mode') as GradientMode;
      generator.setMode(mode);
      updateUI();
    });
  });

  // 初始化 UI
  updateUI();
  renderPresets();

  naimo.log.info('渐变色生成器初始化完成');
}

// 更新 UI
function updateUI(): void {
  updateGradientPreview();
  updateColorList();
}

// 更新渐变预览
function updateGradientPreview(): void {
  const preview = document.getElementById('gradientPreview');
  const codeDisplay = document.getElementById('gradientCode');

  if (preview) {
    const gradient = generator.getCSSGradient();
    preview.style.background = gradient;
  }

  if (codeDisplay) {
    codeDisplay.textContent = generator.getCSSGradient();
  }
}

// 更新颜色列表
function updateColorList(): void {
  const colorList = document.getElementById('colorList');
  if (!colorList) return;

  const colors = generator.getColors();
  colorList.innerHTML = '';

  colors.forEach((color, index) => {
    const adjuster = document.createElement('div');
    adjuster.className = 'color-adjuster';

    const preview = document.createElement('div');
    preview.className = 'color-preview';
    preview.style.backgroundColor = color;

    const input = document.createElement('input');
    input.type = 'color';
    input.value = color;
    input.className = 'hidden';
    input.addEventListener('input', (e) => {
      const newColor = (e.target as HTMLInputElement).value;
      generator.updateColor(index, newColor);
      preview.style.backgroundColor = newColor;
      updateGradientPreview();
    });

    preview.addEventListener('click', () => input.click());

    const colorInfo = document.createElement('div');
    colorInfo.className = 'flex-1';
    colorInfo.innerHTML = `
      <div class="text-sm font-mono font-semibold">${color.toUpperCase()}</div>
      <div class="text-xs text-gray-500">RGB: ${chroma(color).rgb().join(', ')}</div>
    `;

    adjuster.appendChild(preview);
    adjuster.appendChild(input);
    adjuster.appendChild(colorInfo);
    colorList.appendChild(adjuster);
  });
}

// 渲染预设
function renderPresets(): void {
  const presetList = document.getElementById('presetList');
  if (!presetList) return;

  const presets = generator.getPresets();
  presetList.innerHTML = '';

  presets.forEach(preset => {
    const card = document.createElement('div');
    card.className = 'preset-card';

    const gradientDiv = document.createElement('div');
    gradientDiv.className = 'preset-gradient';
    const tempGen = new GradientGenerator();
    tempGen.applyPreset(preset);
    gradientDiv.style.background = tempGen.getCSSGradient();

    const name = document.createElement('div');
    name.className = 'preset-name';
    name.textContent = preset.name;

    card.appendChild(gradientDiv);
    card.appendChild(name);

    card.addEventListener('click', () => {
      generator.applyPreset(preset);
      const colorCountSlider = document.getElementById('colorCount') as HTMLInputElement;
      const colorCountLabel = document.getElementById('colorCountLabel') as HTMLSpanElement;
      colorCountSlider.value = preset.colors.length.toString();
      colorCountLabel.textContent = preset.colors.length.toString();
      updateUI();
      naimo.log.info(`应用预设: ${preset.name}`);
    });

    presetList.appendChild(card);
  });
}

// 显示导出模态框
function showExportModal(): void {
  const modal = document.getElementById('exportModal');
  const cssTextarea = document.getElementById('exportCSS') as HTMLTextAreaElement;
  const svgTextarea = document.getElementById('exportSVG') as HTMLTextAreaElement;
  const copyCSS = document.getElementById('copyCSS');
  const copySVG = document.getElementById('copySVG');
  const closeBtn = document.getElementById('closeExportModal');

  if (!modal) return;

  cssTextarea.value = `background: ${generator.getCSSGradient()};`;
  svgTextarea.value = generator.getSVGGradient();

  modal.classList.remove('hidden');

  copyCSS?.addEventListener('click', async () => {
    await navigator.clipboard.writeText(cssTextarea.value);
    await naimo.system.notify('CSS 代码已复制', '渐变色生成器');
  });

  copySVG?.addEventListener('click', async () => {
    await navigator.clipboard.writeText(svgTextarea.value);
    await naimo.system.notify('SVG 代码已复制', '渐变色生成器');
  });

  closeBtn?.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
    }
  });
}

// ==================== 入口 ====================

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

