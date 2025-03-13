@echo off
echo Installing dependencies...
call npm install

echo Initializing database...
call npm run init-db

pause 