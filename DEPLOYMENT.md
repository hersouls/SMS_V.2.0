# Deployment Guide

## Issue: GitHub Actions Ownership Restriction

You're encountering this error because GitHub Actions requires the repository to be owned by the "hersouls" organization to use certain actions like:
- `actions/checkout@v4`
- `actions/setup-node@v4`
- `actions/configure-pages@v4`
- `actions/upload-pages-artifact@v3`
- `actions/deploy-pages@v4`

## Solutions

### Solution 1: Transfer Repository Ownership (Recommended)
Transfer your repository to the "hersouls" organization:
1. Go to your repository settings
2. Scroll down to "Danger Zone"
3. Click "Transfer ownership"
4. Enter "hersouls" as the new owner
5. Confirm the transfer

### Solution 2: Use GitHub CLI Deployment (Alternative)

If you can't transfer ownership, use GitHub CLI to deploy:

#### Prerequisites
1. Install GitHub CLI: https://cli.github.com/
2. Authenticate: `gh auth login`

#### Deploy using npm script
```bash
cd SMS_V.2.0
npm run deploy
```

#### Deploy using the provided script
```bash
./deploy-with-gh.sh
```

### Solution 3: Manual Deployment

1. Build the project:
```bash
cd SMS_V.2.0
npm run build
```

2. Create a gh-pages branch:
```bash
git checkout -b gh-pages
```

3. Copy build files to root:
```bash
cp -r dist/* .
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages
```

4. Configure GitHub Pages:
   - Go to repository settings
   - Navigate to Pages section
   - Set source to "Deploy from a branch"
   - Select "gh-pages" branch
   - Save

### Solution 4: Use Netlify/Vercel (Alternative Hosting)

If GitHub Pages restrictions persist, consider using alternative hosting:

#### Netlify
1. Connect your repository to Netlify
2. Set build command: `cd SMS_V.2.0 && npm run build`
3. Set publish directory: `SMS_V.2.0/dist`

#### Vercel
1. Connect your repository to Vercel
2. Set root directory to `SMS_V.2.0`
3. Deploy automatically

## Current Workflow Files

The following workflow files are currently disabled due to ownership restrictions:
- `.github/workflows/ci.yml` - CI/CD pipeline
- `.github/workflows/pages.yml` - GitHub Pages deployment
- `.github/workflows/release.yml` - Release management
- `.github/workflows/security.yml` - Security scanning

## Quick Start

For immediate deployment without GitHub Actions:

```bash
# Option 1: Use the deployment script
./deploy-with-gh.sh

# Option 2: Use npm script (if GitHub CLI is installed)
cd SMS_V.2.0
npm run deploy

# Option 3: Manual build
cd SMS_V.2.0
npm run build
# Then manually upload dist/ contents to GitHub Pages
```

## Troubleshooting

### GitHub CLI not found
```bash
# Install on Ubuntu/Debian
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh

# Install on macOS
brew install gh
```

### Authentication issues
```bash
gh auth login
# Follow the prompts to authenticate
```

### Build errors
```bash
cd SMS_V.2.0
npm ci
npm run build
```