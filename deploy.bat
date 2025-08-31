@echo off
echo Building project for deployment...
call npm run build

echo Copying built files to root...
xcopy /E /Y dist\* .

echo Built files copied successfully!
echo Ready to commit and push to GitHub.

echo.
echo Next steps:
echo 1. git add .
echo 2. git commit -m "Deploy production build with tag functionality"
echo 3. git push origin main
echo.
echo Your website will update at http://84143476.xyz/ in a few minutes!
pause
