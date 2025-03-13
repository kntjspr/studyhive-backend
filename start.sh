#!/bin/bash

# Install dependencies
echo "Installing dependencies..."
npm install

# Initialize database
echo "Initializing database..."
npm run init-db

# Build the application
echo "Building the application..."
npm run build

# Start the application
echo "Starting the application..."
npm start 