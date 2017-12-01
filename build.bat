@echo off

:: for colored error message
for /F "tokens=1,2 delims=#" %%a in ('"prompt #$H#$E# & echo on & for %%b in (1) do rem"') do (
  set "DEL=%%a"
)

echo Check NPM version
call npm -v 2> Nul
if "%errorlevel%" == "1" (
    call :ColorText 0C "YOU HAVE NOT NPM binary" && exit /b
)
for /f "delims=" %%i in ('npm -v') do set Version=%%i
REM parse version numbers
for /F "tokens=1,2,3 delims=." %%a in ("%Version%") do (
   set Major=%%a
   set Minor=%%b
   set Revision=%%c
)
if %Major% LSS 3 (
	call :ColorText 0C "YOUR HAVE NOT REQUIRED VERSION NPM (Higher or equal 3.10.10)" && exit /b
)
::del %test_script%

echo Check Node version
call node -v 2> Nul
if "%errorlevel%" == "1" (
    call :ColorText 0C "YOU HAVE NOT NodeJS binary" && exit /b
)
for /f "delims=" %%i in ('node -v') do set Version=%%i
REM get version number
for /F "tokens=1 delims=v" %%a in ("%Version%") do (
   set VersionNumber=%%a
)
REM parse version numbers
for /F "tokens=1,2,3 delims=." %%a in ("%VersionNumber%") do (
   set Major=%%a
   set Minor=%%b
   set Revision=%%c
)
if %Major% LSS 6 (
	call :ColorText 0C "YOUR HAVE NOT REQUIRED VERSION NodeJS (Higher or equal 6.10.0)" && exit /b
)

echo Check Python version
call python -V 2> Nul
if "%errorlevel%" == "1" (
    call :ColorText 0C "YOU HAVE NOT Python binary" && exit /b
)
set test_script=.pyexe.py
echo from __future__ import print_function; import sys; print(sys.version) > %test_script%
for /f "delims=" %%i in ('python %test_script%') do set Version=%%i
echo %Version%
REM get version number
for /F "delims= " %%a in ("%Version%") do (
   set VersionNumberPython=%%a
)
REM parse version numbers
for /F "tokens=1,2,3 delims=." %%a in ("%VersionNumberPython%") do (
   set Major=%%a
   set Minor=%%b
   set Revision=%%c
)
if %Major% NEQ 2 (
	call :ColorText 0C "YOUR HAVE NOT REQUIRED VERSION '==2.7.3' Python. Incorrect Major version" && exit /b
)
if %Minor% NEQ 7 (
    call :ColorText 0C "YOUR HAVE NOT REQUIRED VERSION '==2.7.3' Python. Incorrect Minor version" && exit /b
)

echo Started build process

echo Deleting old versions app...
if exist .\build call rmdir /s /q .\build || echo ERROR in delete old build folder && exit /b

echo Deleting old versions bundles...
if exist .\dist call rmdir /s /q .\dist || echo ERROR in delete old bundle folder && exit /b

echo Started install server packages...
call npm install || echo ERROR in npm install server && exit /b
cd client

echo Started install front packages...
call npm install || echo ERROR in npm install front && exit /b
cd ..

echo Replaced library file contents
set "search=object"
set "replace=Object"
set "source=%cd%\client\node_modules\handsontable\handsontable.d.ts"
set "temp=%cd%\client\node_modules\handsontable\temp.d.ts"
(for /f "delims=" %%i in (%source%) do (
    set "line=%%i"
    setlocal enabledelayedexpansion
    set "line=!line:%search%=%replace%!"
    echo(!line!
    endlocal
))>"%temp%"
xcopy /y %temp% %source%
del %temp%

echo Started bundle all
call npm run bundle || echo ERROR in bundle github && exit /b
echo Creating binary file...
call npm run package || echo ERROR in build-packaging electron && exit /b
echo Finished !!!


:: for colored error message
goto :eof
:ColorText
<nul set /p ".=%DEL%" > "%~2"
findstr /v /a:%1 /R "^$" "%~2" nul
del "%~2" > nul 2>&1
goto :eof


