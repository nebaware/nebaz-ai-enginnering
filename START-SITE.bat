@echo off
title Nebaz AI Academy
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0serve-local.ps1"
if errorlevel 1 pause
