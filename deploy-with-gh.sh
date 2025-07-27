#!/bin/bash

# Deploy script using GitHub CLI
# This bypasses the GitHub Actions ownership restrictions

set -e

echo "🚀 Starting deployment with GitHub CLI..."

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ Error: GitHub CLI (gh) is not installed."
    echo "Please install it from: https://cli.github.com/"
    exit 1
fi

# Check if we're authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ Error: Not authenticated with GitHub CLI."
    echo "Please run: gh auth login"
    exit 1
fi

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

echo "🚀 Deploying to GitHub Pages..."
gh pages deploy dist/ --branch gh-pages --clean

echo "✅ Deployment completed!"
echo "Your site should be available at: https://[username].github.io/[repository-name]/"