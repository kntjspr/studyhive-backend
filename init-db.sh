#!/bin/bash

# Install dependencies
echo "Installing dependencies..."
npm install

# Initialize database
echo "Initializing database..."
npm run init-db 