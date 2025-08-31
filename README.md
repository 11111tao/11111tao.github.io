# 🌟 Material Design 3 个人站

一个功能完整的现代化个人主页，集成了内容管理系统、标签过滤和自动化部署流程。

## ✨ 核心特性

### 🎨 **设计与界面**
- **Material Design 3** - 遵循最新的 Google 设计规范
- **深色主题支持** - 智能主题切换，护眼模式
- **响应式设计** - 完美适配手机、平板、桌面设备
- **现代组件库** - 使用官方 Material Web Components

### 📝 **内容管理**
- **Markdown 支持** - 支持上传和展示 Markdown 格式的博客和笔记
- **智能标签系统** - 为内容添加标签，支持一键过滤查看
- **本地内容管理** - 开发环境支持文件上传，生产环境纯展示
- **实时预览** - 所见即所得的内容展示

### 🚀 **开发与部署**
- **一键启动** - `npm run dev:all` 同时启动前后端服务
- **自动化部署** - 双击 `.bat` 文件完成构建和文件准备
- **GitHub Pages** - 完美支持静态部署
- **快速构建** - 基于 Vite 的高性能构建系统

## 🛠 技术栈

**前端架构**
- **Vite** - 极速开发构建工具
- **Material Web Components** - Google 官方组件库
- **JavaScript ES6+** - 现代 JavaScript 特性
- **CSS3** - 响应式布局和动画

**后端服务**
- **Express.js** - 轻量级 Web 框架
- **Multer** - 文件上传处理
- **Node.js** - 高性能 JavaScript 运行时

**部署方案**
- **GitHub Pages** - 免费静态网站托管
- **localStorage** - 客户端数据持久化
- **环境检测** - 自动切换本地/生产模式

## 🚀 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 启动开发环境（推荐）
```bash
npm run dev:all
```
> 这个命令会同时启动：
> - 前端开发服务器 (Vite)
> - 后端上传服务器 (Express)
> - 支持热重载和完整功能

访问 `http://localhost:5174` 查看效果

### 3. 部署到 GitHub Pages

#### 方法一：使用自动化脚本（推荐）
1. 双击 `deploy.bat` 文件
2. 等待构建完成
3. 使用 GitHub Desktop 提交更改
4. 推送到 GitHub

#### 方法二：手动部署
```bash
# 构建生产版本
npm run build

# 复制文件到根目录
Copy-Item -Path "dist\*" -Destination "." -Recurse -Force

# 使用 Git 提交并推送
git add .
git commit -m "更新内容和标签"
git push origin main
```

## 📁 项目结构

```
个人站/
├── src/                    # 源码目录
│   ├── index.jsx          # 主应用逻辑
│   └── styles.css         # 样式文件
├── upload/                # 上传文件存储
│   ├── blog/              # 博客文章
│   └── note/              # 学习笔记
├── server.js              # 后端服务器
├── deploy.bat             # 一键部署脚本
├── vite.config.js         # Vite 配置
└── package.json           # 项目配置
```

## 🎯 功能使用指南

### 📝 内容管理
1. **本地开发时**：
   - 点击"上传博客"或"上传笔记"按钮
   - 选择 Markdown 文件
   - 添加相关标签（如：技术、生活、学习）
   - 确认上传

2. **标签过滤**：
   - 点击内容上方的标签筛选区域
   - 选择感兴趣的标签
   - 查看相关内容

### 🎨 个性化定制

#### 修改个人信息
编辑 `index.html` 文件：
```html
<!-- 修改姓名和介绍 -->
<h1 class="hero-title">你的姓名</h1>
<p class="hero-subtitle">你的介绍</p>
```

#### 自定义主题色彩
编辑 `src/styles.css` 文件：
```css
:root {
    --md-sys-color-primary: #你的主色;
    --md-sys-color-secondary: #你的辅色;
}
```

## 💡 开发命令

| 命令 | 功能 | 使用场景 |
|------|------|----------|
| `npm run dev:all` | 启动完整开发环境 | 日常开发，内容管理 |
| `npm run dev` | 仅启动前端 | 前端调试 |
| `npm start` | 仅启动后端 | 后端调试 |
| `npm run build` | 构建生产版本 | 部署前准备 |
| `npm run preview` | 预览生产版本 | 部署前测试 |

## 🌍 环境说明

### 本地开发环境
- ✅ 显示上传按钮
- ✅ 支持文件上传和管理
- ✅ 后端服务器运行
- ✅ 热重载开发

### 生产环境（GitHub Pages）
- ✅ 纯展示模式
- ✅ 静态文件服务
- ✅ 基于 localStorage 的数据持久化
- ✅ 完美的访问体验

## 🔧 常见问题

**Q: 端口被占用怎么办？**
A: 使用以下命令清理：
```powershell
Get-Process -Name *node* -ErrorAction SilentlyContinue | Stop-Process -Force
```

**Q: Material 组件不显示？**
A: 清除缓存并重新构建：
```bash
Remove-Item -Path "node_modules\.vite" -Recurse -Force
npm run build
```

**Q: 上传的文件在生产环境看不到？**
A: 确保运行了 `deploy.bat` 并推送了更改到 GitHub

## 📱 浏览器支持

- Chrome 67+
- Firefox 63+
- Safari 11.1+
- Edge 79+

## 📄 许可证

ISC License

---

💝 **使用 Material Design 3 和现代 Web 技术精心打造的个人站解决方案**

🔗 **特别适合：** 开发者、设计师、内容创作者、学生