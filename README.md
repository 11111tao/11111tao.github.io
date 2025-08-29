# Material Design 3 个人主页

一个使用 Material Design 3 设计语言构建的现代化个人主页。

## 特性

- 🎨 **Material Design 3** - 遵循最新的 Material Design 3 设计规范
- 🌙 **深色主题支持** - 支持浅色/深色主题切换
- 📱 **响应式设计** - 完美适配各种设备尺寸
- ⚡ **现代技术栈** - 使用 Material Web Components
- 🚀 **快速开发** - 基于 Vite 构建，开发体验优秀

## 技术栈

- **HTML5** - 语义化标记
- **CSS3** - 现代样式和动画
- **Material Web Components** - Google 官方 Material Design 组件库
- **Vite** - 快速的前端构建工具

## 项目结构

```
mdhp/
├── index.html          # 主页面
├── src/
│   ├── index.js        # JavaScript 入口文件
│   └── styles.css      # 样式文件
├── package.json        # 项目配置
└── README.md          # 项目说明
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

然后在浏览器中打开 `http://localhost:5173` 查看效果。

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 自定义指南

### 修改个人信息

1. 在 `index.html` 中修改个人信息：
   - 姓名：修改 `<div class="logo">张三</div>` 和 `<h1 class="hero-title">你好，我是张三</h1>`
   - 简介：修改 `.hero-subtitle` 中的内容
   - 关于我：修改 `.about-section` 中的描述

### 添加技能

在 `index.html` 的 `.skills-grid` 部分添加更多技能标签：

```html
<md-assist-chip>
    <md-icon slot="icon">code</md-icon>
    你的技能
</md-assist-chip>
```

### 添加项目

在 `.card-grid` 部分添加新的项目卡片：

```html
<md-outlined-card>
    <div style="padding: var(--spacing-xl);">
        <h3>项目名称</h3>
        <p>项目描述</p>
        <div class="skills-grid">
            <md-suggestion-chip>技术栈</md-suggestion-chip>
        </div>
        <md-filled-button>
            <md-icon slot="icon">launch</md-icon>
            查看项目
        </md-filled-button>
    </div>
</md-outlined-card>
```

### 自定义颜色主题

在 `src/styles.css` 的 `:root` 选择器中修改 CSS 变量来改变颜色主题：

```css
:root {
    --md-sys-color-primary: #你的主色;
    --md-sys-color-secondary: #你的次色;
    /* 更多颜色变量... */
}
```

## 使用的 Material Web Components

- `md-filled-button` - 填充按钮
- `md-outlined-button` - 轮廓按钮
- `md-text-button` - 文本按钮
- `md-icon-button` - 图标按钮
- `md-card` - 卡片
- `md-outlined-card` - 轮廓卡片
- `md-filled-text-field` - 填充文本字段
- `md-assist-chip` - 辅助标签
- `md-suggestion-chip` - 建议标签
- `md-icon` - 图标
- `md-checkbox` - 复选框

## 浏览器支持

- Chrome 67+
- Firefox 63+
- Safari 11.1+
- Edge 79+

## 许可证

ISC License

## 贡献

欢迎提交 Issue 和 Pull Request！

---

使用 ❤️ 和 Material Design 3 构建
