
@echo off
where adb >nul 2>&1
if %errorlevel% neq 0 (
    echo ADB is not installed or not in PATH. Skipping Android device setup.
    exit /b 0
)

echo Disconnecting old connections...
adb disconnect 2>nul
echo Setting up connected device...
adb tcpip 5555 2>nul
echo Waiting for device to initialize...
ping 127.0.0.1 -n 4 >nul
FOR /F "tokens=2" %%G IN ('adb shell ip addr show wlan0 2^>nul ^| find "inet "') DO set ipfull=%%G
if defined ipfull (
    FOR /F "tokens=1 delims=/" %%G in ("%ipfull%") DO set ip=%%G
    echo Connecting to device with IP %ip%...
    adb connect %ip% 2>nul
)

