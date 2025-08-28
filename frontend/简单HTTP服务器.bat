@echo off
chcp 65001
echo ========================================
echo iFlytek 简单HTTP服务器启动脚本
echo ========================================
echo.

echo 正在进入项目目录...
cd /d "%~dp0"
echo 当前目录：%cd%

echo.
echo 正在检查Python环境...
python --version
if %errorlevel% neq 0 (
    echo Python未找到，尝试使用py命令...
    py --version
    if %errorlevel% neq 0 (
        echo 错误：Python未安装
        echo 请安装Python 3.x版本
        pause
        exit /b 1
    )
    set PYTHON_CMD=py
) else (
    set PYTHON_CMD=python
)

echo.
echo 正在启动HTTP服务器...
echo 服务器将在 http://localhost:8080 启动
echo 您可以访问以下页面：
echo   - http://localhost:8080/ui-fixes-demo.html （修复演示）
echo   - http://localhost:8080/test-ui-fixes.html （测试报告）
echo   - http://localhost:8080/index.html （主页面）
echo.
echo 按 Ctrl+C 可以停止服务器
echo.

%PYTHON_CMD% -m http.server 8080

echo.
echo 服务器已停止
pause
