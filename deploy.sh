#!/bin/bash

# Deploy script for SMS_V.2.0
# This script can be used as an alternative to GitHub Actions

set -e

echo "🚀 Starting deployment process..."

# Check if we're in the right directory
if [ ! -f "SMS_V.2.0/package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Navigate to the project directory
cd SMS_V.2.0

    echo "📦 Installing dependencies..."
    npm ci --legacy-peer-deps

echo "🔨 Building the application..."
npm run build

echo "✅ Build completed successfully!"

# Check if dist directory exists
if [ ! -d "dist" ]; then
    echo "❌ Error: dist directory not found after build."
    exit 1
fi

echo "📁 Build files are ready in SMS_V.2.0/dist/"
echo ""
echo "To deploy to GitHub Pages manually:"
echo "1. Go to your repository settings"
echo "2. Navigate to Pages section"
echo "3. Set source to 'Deploy from a branch'"
echo "4. Select 'gh-pages' branch or create one"
echo "5. Push the contents of SMS_V.2.0/dist/ to that branch"
echo ""
echo "Or use GitHub CLI:"
echo "gh pages deploy SMS_V.2.0/dist/ --branch gh-pages"