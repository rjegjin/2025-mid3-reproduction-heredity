@echo off
chcp 65001 > nul

:: PowerShell을 이용해 GUI 입력 상자를 띄우고, 입력된 메시지를 변수에 저장
set "commitMessage="
for /f "usebackq delims=" %%i in (`powershell -Command "$commitMessage = [Microsoft.VisualBasic.Interaction]::InputBox('Enter your commit message:', 'Commit Message'); Write-Output $commitMessage"`) do set "commitMessage=%%i"

:: 사용자가 취소했거나 아무것도 입력하지 않았으면 스크립트 종료
if not defined commitMessage (
    echo Commit canceled.
    goto :eof
)

:: Git 자동화 명령어 순차 실행
echo.
echo [1/4] Running git pull...
git pull origin main || goto :error

echo.
echo [2/4] Running git add...
git add . || goto :error

echo.
echo [3/4] Running git commit...
git commit -m "%commitMessage%" || goto :error

echo.
echo [4/4] Running git push...
git push origin main || goto :error

echo.
echo =================================
echo  Process completed successfully!
echo =================================
goto :eof

:error
echo.
echo *********************************
echo  An error occurred.
echo  Please check the messages above.
echo *********************************

pause