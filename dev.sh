#!/bin/bash

# Install dependencies
echo "Installing dependencies..."
npm install

# Initialize database
echo "Initializing database..."
npm run init-db

# Start the application in development mode
echo "Starting the application in development mode..."
npm run dev 