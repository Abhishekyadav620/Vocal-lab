@echo off
title J.A.R.V.I.S AI Assistant
echo Starting J.A.R.V.I.S...
cd /d "%~dp0"
if exist venv_jarvis\Scripts\python.exe (
    venv_jarvis\Scripts\python.exe run.py
) else (
    python run.py
)
pause
