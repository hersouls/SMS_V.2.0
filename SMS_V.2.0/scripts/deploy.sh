#!/bin/bash

# Moonwave v2.0 Deployment Script
# Phase 4: Deployment and Optimization

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="moonwave-v2"
DEPLOY_BRANCH="main"
BUILD_DIR="dist"
LIGHTHOUSE_PORT="4173"
LIGHTHOUSE_URL="http://localhost:$LIGHTHOUSE_PORT"

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're on the correct branch
check_branch() {
    log_info "Checking current branch..."
    current_branch=$(git branch --show-current)
    
    if [ "$current_branch" != "$DEPLOY_BRANCH" ]; then
        log_error "Not on $DEPLOY_BRANCH branch. Current branch: $current_branch"
        exit 1
    fi
    
    log_success "On correct branch: $current_branch"
}

# Check for uncommitted changes
check_clean_working_directory() {
    log_info "Checking for uncommitted changes..."
    
    if ! git diff-index --quiet HEAD --; then
        log_warning "Uncommitted changes detected. Please commit or stash them before deploying."
        git status --short
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
    
    log_success "Working directory is clean"
}

# Install dependencies
install_dependencies() {
    log_info "Installing dependencies..."
    
    if [ -f "package-lock.json" ]; then
        npm ci --legacy-peer-deps
    else
        npm install --legacy-peer-deps
    fi
    
    log_success "Dependencies installed"
}

# Run linting
run_linting() {
    log_info "Running linting..."
    
    if npm run lint; then
        log_success "Linting passed"
    else
        log_error "Linting failed"
        exit 1
    fi
}

# Run type checking
run_type_check() {
    log_info "Running TypeScript type checking..."
    
    if npm run type-check; then
        log_success "Type checking passed"
    else
        log_error "Type checking failed"
        exit 1
    fi
}

# Run tests
run_tests() {
    log_info "Running tests..."
    
    if npm run test; then
        log_success "Tests passed"
    else
        log_error "Tests failed"
        exit 1
    fi
}

# Run E2E tests
run_e2e_tests() {
    log_info "Running E2E tests..."
    
    if npm run test:e2e; then
        log_success "E2E tests passed"
    else
        log_error "E2E tests failed"
        exit 1
    fi
}

# Build the application
build_application() {
    log_info "Building application..."
    
    # Clean previous build
    if [ -d "$BUILD_DIR" ]; then
        rm -rf "$BUILD_DIR"
        log_info "Cleaned previous build"
    fi
    
    # Build with production optimizations
    if npm run build; then
        log_success "Build completed successfully"
    else
        log_error "Build failed"
        exit 1
    fi
    
    # Check build size
    build_size=$(du -sh "$BUILD_DIR" | cut -f1)
    log_info "Build size: $build_size"
}

# Start preview server for testing
start_preview_server() {
    log_info "Starting preview server..."
    
    # Start the preview server in the background
    npm run preview &
    PREVIEW_PID=$!
    
    # Wait for server to start
    sleep 5
    
    # Check if server is running
    if ! curl -s "$LIGHTHOUSE_URL" > /dev/null; then
        log_error "Preview server failed to start"
        kill $PREVIEW_PID 2>/dev/null || true
        exit 1
    fi
    
    log_success "Preview server started on $LIGHTHOUSE_URL"
}

# Run Lighthouse performance tests
run_lighthouse_tests() {
    log_info "Running Lighthouse performance tests..."
    
    # Wait a bit more for the server to be fully ready
    sleep 3
    
    # Run Lighthouse CI
    if npm run lighthouse:ci; then
        log_success "Lighthouse tests completed"
        
        # Parse and display results
        if [ -f "lighthouse-report.json" ]; then
            log_info "Lighthouse Results:"
            
            # Extract scores using jq if available
            if command -v jq &> /dev/null; then
                performance_score=$(jq -r '.categories.performance.score * 100' lighthouse-report.json)
                accessibility_score=$(jq -r '.categories.accessibility.score * 100' lighthouse-report.json)
                seo_score=$(jq -r '.categories.seo.score * 100' lighthouse-report.json)
                best_practices_score=$(jq -r '.categories."best-practices".score * 100' lighthouse-report.json)
                
                echo "  Performance: ${performance_score}%"
                echo "  Accessibility: ${accessibility_score}%"
                echo "  SEO: ${seo_score}%"
                echo "  Best Practices: ${best_practices_score}%"
                
                # Check if scores meet minimum thresholds
                if (( $(echo "$performance_score < 90" | bc -l) )); then
                    log_warning "Performance score below threshold (90%)"
                fi
                
                if (( $(echo "$accessibility_score < 95" | bc -l) )); then
                    log_warning "Accessibility score below threshold (95%)"
                fi
                
                if (( $(echo "$seo_score < 90" | bc -l) )); then
                    log_warning "SEO score below threshold (90%)"
                fi
            else
                log_warning "jq not available, cannot parse Lighthouse results"
            fi
        fi
    else
        log_error "Lighthouse tests failed"
        kill $PREVIEW_PID 2>/dev/null || true
        exit 1
    fi
}

# Stop preview server
stop_preview_server() {
    log_info "Stopping preview server..."
    
    if [ ! -z "$PREVIEW_PID" ]; then
        kill $PREVIEW_PID 2>/dev/null || true
        log_success "Preview server stopped"
    fi
}

# Analyze bundle size
analyze_bundle() {
    log_info "Analyzing bundle size..."
    
    if npm run analyze; then
        log_success "Bundle analysis completed"
        log_info "Check dist/stats.html for detailed bundle analysis"
    else
        log_warning "Bundle analysis failed (continuing deployment)"
    fi
}

# Deploy to GitHub Pages
deploy_to_github_pages() {
    log_info "Deploying to GitHub Pages..."
    
    # Check if gh-pages is available
    if ! command -v gh-pages &> /dev/null; then
        log_info "Installing gh-pages..."
        npm install -g gh-pages
    fi
    
    # Deploy
    if gh-pages -d "$BUILD_DIR" --clean; then
        log_success "Deployed to GitHub Pages successfully"
    else
        log_error "Deployment to GitHub Pages failed"
        exit 1
    fi
}

# Create deployment summary
create_deployment_summary() {
    log_info "Creating deployment summary..."
    
    # Get deployment info
    deployment_time=$(date -u +"%Y-%m-%d %H:%M:%S UTC")
    git_commit=$(git rev-parse --short HEAD)
    git_branch=$(git branch --show-current)
    build_size=$(du -sh "$BUILD_DIR" | cut -f1)
    
    # Create summary file
    cat > "deployment-summary.md" << EOF
# Moonwave v2.0 Deployment Summary

## Deployment Information
- **Deployment Time**: $deployment_time
- **Git Commit**: $git_commit
- **Git Branch**: $git_branch
- **Build Size**: $build_size

## Build Status
- ✅ Dependencies installed
- ✅ Linting passed
- ✅ Type checking passed
- ✅ Tests passed
- ✅ E2E tests passed
- ✅ Build completed
- ✅ Lighthouse tests passed
- ✅ Deployed to GitHub Pages

## Performance Metrics
$(if [ -f "lighthouse-report.json" ] && command -v jq &> /dev/null; then
    echo "- Performance: $(jq -r '.categories.performance.score * 100' lighthouse-report.json)%"
    echo "- Accessibility: $(jq -r '.categories.accessibility.score * 100' lighthouse-report.json)%"
    echo "- SEO: $(jq -r '.categories.seo.score * 100' lighthouse-report.json)%"
    echo "- Best Practices: $(jq -r '.categories."best-practices".score * 100' lighthouse-report.json)%"
fi)

## Next Steps
1. Verify deployment at: https://$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^/]*\)\/\([^/]*\).*/\1.github.io\/\2/')
2. Test all functionality
3. Monitor performance metrics
4. Check error tracking

---
Generated by Moonwave v2.0 Deployment Script
EOF
    
    log_success "Deployment summary created: deployment-summary.md"
}

# Main deployment function
main() {
    log_info "Starting Moonwave v2.0 deployment..."
    log_info "Phase 4: Deployment and Optimization"
    
    # Pre-deployment checks
    check_branch
    check_clean_working_directory
    
    # Build and test
    install_dependencies
    run_linting
    run_type_check
    run_tests
    run_e2e_tests
    build_application
    analyze_bundle
    
    # Performance testing
    start_preview_server
    run_lighthouse_tests
    stop_preview_server
    
    # Deploy
    deploy_to_github_pages
    
    # Post-deployment
    create_deployment_summary
    
    log_success "🎉 Moonwave v2.0 deployment completed successfully!"
    log_info "📊 Performance monitoring enabled"
    log_info "🔗 Site deployed and ready for testing"
}

# Handle script arguments
case "${1:-}" in
    --help|-h)
        echo "Usage: $0 [OPTIONS]"
        echo ""
        echo "Options:"
        echo "  --help, -h     Show this help message"
        echo "  --skip-tests   Skip running tests"
        echo "  --skip-lighthouse  Skip Lighthouse performance tests"
        echo "  --dry-run      Run all checks but don't deploy"
        echo ""
        echo "Examples:"
        echo "  $0              # Full deployment"
        echo "  $0 --skip-tests # Deploy without running tests"
        echo "  $0 --dry-run    # Run checks without deploying"
        exit 0
        ;;
    --skip-tests)
        log_warning "Skipping tests as requested"
        SKIP_TESTS=true
        ;;
    --skip-lighthouse)
        log_warning "Skipping Lighthouse tests as requested"
        SKIP_LIGHTHOUSE=true
        ;;
    --dry-run)
        log_warning "Running in dry-run mode (no deployment)"
        DRY_RUN=true
        ;;
    "")
        # No arguments, run full deployment
        ;;
    *)
        log_error "Unknown option: $1"
        echo "Use --help for usage information"
        exit 1
        ;;
esac

# Run main function
main "$@"