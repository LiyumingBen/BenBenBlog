---
title: v-watermark自定义指令
date: 2023-07-17 10:12:59
permalink: /pages/9cbeeeb482705/
categories:
  - 前端技术
tags:
  - 自定义指令
---
<!--
 * @Author: LYM
 * @Date: 2023-07-17 10:12:59
 * @LastEditors: LYM
 * @LastEditTime: 2023-07-17 10:27:53
 * @Description: 自定义指令v-watermark
-->
# 自定义指令v-watermark

## 封装

```ts
const globalCanvas = null;
const globalWaterMark = null;

// watermark 样式
let style = `
display: block;
overflow: hidden;
position: absolute;
left: 0;
top: 0;
width: 100%;
height: 100%;
background-repeat: repeat;
pointer-events: none;`;

const getDataUrl = ({
  font,
  fillStyle,
  textAlign,
  textBaseline,
  text,
  rotate = -20,
}) => {
  font = font || "16px normal";
  fillStyle = fillStyle || "rgba(180, 180, 180, 0.2)";
  text = text || "";
  const canvas = globalCanvas || document.createElement("canvas");
  const ctx = canvas.getContext("2d"); // 获取画布上下文
  ctx.rotate((rotate * Math.PI) / 180);
  ctx.font = font;
  ctx.fillStyle = fillStyle;
  ctx.textAlign = textAlign || "left";
  ctx.textBaseline = textBaseline || "middle";
  ctx.fillText(text, canvas.width / 10, canvas.height / 2);

  return canvas.toDataURL("image/png", 1); // 第二个参数为质量
};

const setWaterMark = (el, binding) => {
  const parentElement = el.parentElement;

  // 获取对应的 canvas 画布相关的 base64 url
  const url = getDataUrl(binding);
  // 创建 waterMark 父元素
  const waterMark = globalWaterMark || document.createElement("div");
  waterMark.className = "water-mark"; // 方便自定义展示结果
  style = `${style}background-image: url(${url});`;
  waterMark.setAttribute("style", style);

  // 将对应图片的父容器作为定位元素
  parentElement.setAttribute("style", "position: relative;");

  // 将图片元素移动到 waterMark 中
  parentElement.appendChild(waterMark);
};

// 监听 DOM 变化
const createObserver = (el, binding) => {
  const waterMarkEl = el.parentElement.querySelector(".water-mark");

  const observer = new MutationObserver((mutationsList) => {
    if (mutationsList.length) {
      const { removedNodes, type, target } = mutationsList[0];
      const currStyle = waterMarkEl?.getAttribute("style");
      // 证明被删除了
      if (removedNodes[0] === waterMarkEl) {
        observer.disconnect();
        // 重新添加水印，dom监听
        init(el, { value: binding });
      } else if (
        type === "attributes" &&
        target === waterMarkEl &&
        currStyle !== style
      ) {
        waterMarkEl.setAttribute("style", style);
      }
    }
  });

  observer.observe(el.parentElement, {
    childList: true,
    attributes: true,
    subtree: true,
  });
};

// 初始化
const init = (el, binding) => {
  // 设置水印
  setWaterMark(el, binding.value);
  // 启动监控
  createObserver(el, binding.value);
};

// 定义指令配置项
const directives = {
  inserted(el, binding) {
    init(el, binding);
  },
};

export default {
  name: "watermark",
  directives,
};

```

## 使用

# 1、引入

```ts
main.js
import waterMark from './directives/waterMark.js'
Vue.directive('watermark', waterMark.directives)
```

## 2、使用

```vue
<div id="app" v-watermark="{ text: '绝密资料，请勿外传' }">
  <router-view />
</div>
```

```ts
// 禁止打开控制台
const prohibitOpenConsole = () => {
    // 阻止f12调试、window ctr + shift + i 、 mac option +  command + i
    document.addEventListener('keydown', (e) => {
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'i') || (e.metaKey && e.altKey && e.key === 'i')) {
        e.preventDefault()
        // IE
        e.returnValue = false
      }
    })

    // 阻止菜单右键
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault()
      e.returnValue = false
    })
}
```
