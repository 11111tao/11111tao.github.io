## 个人主页（Material Design 3）

简洁、响应式的个人站点。开发用 Vite，自动部署到 GitHub Pages。

### 开发
```bash
npm install
npm run dev:all  # http://localhost:5173
```

### 部署（GitHub Actions）
- 已配置工作流：`.github/workflows/deploy-pages.yml`
- 在仓库 Settings → Pages 将 Source 设为 “GitHub Actions”
- 推送到 `main` 即自动构建并发布到 Pages（包含 `CNAME`）

### 目录
```
src/         # 前端源码（入口：index.jsx；样式：styles.css）
server.js    # 本地上传与列表接口（开发用）
upload/      # 本地上传存储（开发用）
vite.config.js
```

### 说明
- 生产环境（GitHub Pages）仅展示内容，上传仅在本地开发模式可用
- 构建产物 `dist/` 与 `node_modules/` 已由 `.gitignore` 忽略