@echo off
chcp 65001 >nul
echo.
echo ========================================
echo    iFlytek星火智能面试系统启动脚本
echo ========================================
echo.

echo [1/4] 检查Node.js环境...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误：未检测到Node.js，请先安装Node.js
    echo 下载地址：https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js环境检查通过

echo.
echo [2/4] 检查项目依赖...
if not exist "node_modules" (
    echo 📦 正在安装项目依赖...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ 依赖安装失败，请检查网络连接
        pause
        exit /b 1
    )
) else (
    echo ✅ 项目依赖已存在
)

echo.
echo [3/4] 检查端口占用...
netstat -an | find "8080" >nul
if %errorlevel% equ 0 (
    echo ⚠️  警告：端口8080已被占用，将尝试使用其他端口
)

echo.
echo [4/4] 启动开发服务器...
echo 🚀 正在启动iFlytek面试系统...
echo.
echo 📍 访问地址：
echo    - 主页：http://localhost:8080
echo    - 系统测试：http://localhost:8080/system-test
echo    - 面试页面：http://localhost:8080/text-interview
echo    - 报告中心：http://localhost:8080/report-center
echo.
echo 💡 提示：
echo    - 按 Ctrl+C 停止服务器
echo    - 修改代码后会自动热重载
echo    - 如遇问题请查看控制台错误信息
echo.

npm run dev

echo.
echo 服务器已停止
pause
