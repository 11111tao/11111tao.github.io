# 11111tao.github.io

个人主页 / 博客。Hugo + [hugo-bearblog](https://github.com/janraasch/hugo-bearblog) 主题，
托管在 GitHub Pages。

## 本地开发

需要 [Hugo Extended](https://gohugo.io/installation/)（≥ 0.124）：

```bash
brew install hugo
hugo server -D
# → http://localhost:1313
```

## 写新文章

```bash
hugo new blog/my-new-post.md
# 改完 push 即可
git add content/blog/my-new-post.md
git commit -m "post: my new post"
git push
```

推送到 `main` 后，GitHub Actions 会自动 build 并部署到 Pages。

## 目录结构

```
.
├── content/
│   ├── _index.md        # 首页
│   ├── about.md         # 关于页
│   └── blog/            # 博客文章
├── themes/
│   └── hugo-bearblog/   # Bear 风格主题
├── static/              # 静态资源（头像、favicon）
├── hugo.toml            # 站点配置
└── .github/workflows/
    └── deploy-pages.yml # 自动部署到 GitHub Pages
```

## 旧版

`legacy/` 目录里是之前 Vite + Material Design 3 版本的代码，仅作归档保留。
