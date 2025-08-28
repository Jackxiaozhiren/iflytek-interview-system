@echo off
chcp 65001
echo ========================================
echo iFlytek 职位管理系统开发服务器启动脚本
echo ========================================
echo.

echo 正在检查Node.js环境...
node --version
if %errorlevel% neq 0 (
    echo 错误：Node.js未安装或未添加到PATH环境变量
    echo 请安装Node.js 16+版本
    pause
    exit /b 1
)

echo 正在检查npm...
npm --version
if %errorlevel% neq 0 (
    echo 错误：npm未找到
    pause
    exit /b 1
)

echo.
echo 正在进入项目目录...
cd /d "%~dp0"
echo 当前目录：%cd%

echo.
echo 正在检查package.json...
if not exist package.json (
    echo 错误：package.json文件不存在
    pause
    exit /b 1
)

echo.
echo 正在检查node_modules...
if not exist node_modules (
    echo node_modules不存在，正在安装依赖...
    npm install
    if %errorlevel% neq 0 (
        echo 错误：依赖安装失败
        pause
        exit /b 1
    )
)

echo.
echo 正在启动开发服务器...
echo 服务器将在 http://localhost:5173 启动
echo 按 Ctrl+C 可以停止服务器
echo.

npm run dev

echo.
echo 服务器已停止
pause
