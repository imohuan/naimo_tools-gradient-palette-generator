/// <reference path="../typings/naimo.d.ts" />

import { contextBridge } from 'electron';

// ==================== 类型定义 ====================

/**
 * 生成随机十六进制颜色
 */
function generateRandomColor(): string {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

/**
 * 保存渐变配置到本地存储
 */
function saveGradient(name: string, colors: string[]): void {
  const gradients = JSON.parse(localStorage.getItem('gradients') || '[]');
  gradients.push({ name, colors, timestamp: Date.now() });
  localStorage.setItem('gradients', JSON.stringify(gradients));
}

/**
 * 获取保存的渐变配置
 */
function getSavedGradients(): any[] {
  return JSON.parse(localStorage.getItem('gradients') || '[]');
}

// ==================== 暴露插件 API ====================

const gradientAPI = {
  generateRandomColor,
  saveGradient,
  getSavedGradients
};

contextBridge.exposeInMainWorld('gradientAPI', gradientAPI);

// ==================== 功能处理器导出 ====================

/**
 * 导出功能处理器
 * 类型定义来自 naimo.d.ts
 */
const handlers = {
  gradient: {
    onEnter: async (params: any) => {
      console.log('渐变色生成器已启动');
      console.log('参数:', params);

      // 发送日志
      if (typeof window !== 'undefined' && (window as any).naimo) {
        (window as any).naimo.log.info('渐变色生成器已加载', { params });
      }
    }
  }
};

// 使用 CommonJS 导出（Electron 环境）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = handlers;
}

// ==================== 初始化 ====================

window.addEventListener('DOMContentLoaded', () => {
  console.log('渐变色生成器 Preload 脚本已初始化');
});

// ==================== 类型扩展 ====================

declare global {
  interface Window {
    gradientAPI: typeof gradientAPI;
  }
}

