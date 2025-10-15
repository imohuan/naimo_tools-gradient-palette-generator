"use strict";
const electron = require("electron");
function generateRandomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
}
function saveGradient(name, colors) {
  const gradients = JSON.parse(localStorage.getItem("gradients") || "[]");
  gradients.push({ name, colors, timestamp: Date.now() });
  localStorage.setItem("gradients", JSON.stringify(gradients));
}
function getSavedGradients() {
  return JSON.parse(localStorage.getItem("gradients") || "[]");
}
const gradientAPI = {
  generateRandomColor,
  saveGradient,
  getSavedGradients
};
electron.contextBridge.exposeInMainWorld("gradientAPI", gradientAPI);
const handlers = {
  gradient: {
    onEnter: async (params) => {
      console.log("渐变色生成器已启动");
      console.log("参数:", params);
      if (typeof window !== "undefined" && window.naimo) {
        window.naimo.log.info("渐变色生成器已加载", { params });
      }
    }
  }
};
if (typeof module !== "undefined" && module.exports) {
  module.exports = handlers;
}
window.addEventListener("DOMContentLoaded", () => {
  console.log("渐变色生成器 Preload 脚本已初始化");
});
