@echo off
echo Installing dependencies...
call npm install

echo Initializing database...
call npm run init-db

echo Building the application...
call npm run build

echo Starting the application...
call npm start

pause