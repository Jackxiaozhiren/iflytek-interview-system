@echo off
cd /d "%~dp0"
echo Starting iFlytek Interview System Development Server...
echo Current directory: %CD%
npm run dev
pause
