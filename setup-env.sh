#!/bin/bash

# Setup script for environment variables

echo "Setting up environment variables for Cloudflare Workers..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "📄 Please create a .env file with your Google OAuth credentials:"
    echo "   GOOGLE_CLIENT_ID=your-client-id"
    echo "   GOOGLE_CLIENT_SECRET=your-client-secret"
    exit 1
fi

# Source the .env file
source .env

# Check if variables are set
if [ -z "$GOOGLE_CLIENT_ID" ] || [ -z "$GOOGLE_CLIENT_SECRET" ]; then
    echo "❌ Missing Google OAuth credentials in .env file"
    echo "📄 Please ensure your .env file contains:"
    echo "   GOOGLE_CLIENT_ID=your-client-id"
    echo "   GOOGLE_CLIENT_SECRET=your-client-secret"
    exit 1
fi

# For local development, set them as environment variables for wrangler
export GOOGLE_CLIENT_ID
export GOOGLE_CLIENT_SECRET

echo "✅ Environment variables loaded successfully!"
echo "🚀 Run 'npm run dev:worker' to start the worker with environment variables"

# Start wrangler dev with environment variables
npx wrangler dev --local --var GOOGLE_CLIENT_ID:"$GOOGLE_CLIENT_ID" --var GOOGLE_CLIENT_SECRET:"$GOOGLE_CLIENT_SECRET"