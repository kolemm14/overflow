@echo off
setlocal

set "SOURCE=%~dp0."
set "TARGET=%APPDATA%\Adobe\CEP\extensions\com.kbsama.overflow.ae2018"

if not exist "%SOURCE%\CSXS\manifest.xml" (
    echo ERROR: CSXS\manifest.xml was not found beside this installer.
    pause
    exit /b 1
)

if not exist "%APPDATA%\Adobe\CEP\extensions" (
    mkdir "%APPDATA%\Adobe\CEP\extensions"
    if errorlevel 1 (
        echo ERROR: Could not create the Adobe CEP extensions folder.
        pause
        exit /b 1
    )
)

echo Installing OVER FLOW for After Effects CC 2018-2020...
robocopy "%SOURCE%" "%TARGET%" /E /R:2 /W:1 /XF INSTALL_OVERFLOW.cmd
set "COPY_RESULT=%ERRORLEVEL%"

if %COPY_RESULT% GEQ 8 (
    echo ERROR: Installation failed with robocopy code %COPY_RESULT%.
    pause
    exit /b %COPY_RESULT%
)

echo.
echo OVER FLOW is installed at:
echo %TARGET%
echo Restart After Effects, then open Window ^> Extensions ^> OVER FLOW.
pause
exit /b 0