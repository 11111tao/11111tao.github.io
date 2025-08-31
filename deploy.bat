@echo off
echo 正在构建生产版本...
call npm run build

echo 正在复制文件到根目录...
Copy-Item -Path "dist\*" -Destination "." -Recurse -Force

echo ✅ 构建完成！
echo.
echo 下一步：
echo 1. 打开 GitHub Desktop
echo 2. 提交更改（建议消息：更新内容和标签）
echo 3. 推送到 main 分支
echo 4. 等待 2-3 分钟查看域名更新
echo.
pause