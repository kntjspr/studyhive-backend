@echo off
echo Installing dependencies...
call npm install

echo Initializing database...
call npm run init-db

echo Starting the application in development mode...
call npm run dev

pause 