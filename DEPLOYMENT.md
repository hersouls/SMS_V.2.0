# 🚀 GitHub Pages 배포 가이드

## ✅ 완료된 설정

### 1. Workflow 파일 위치 수정
- ❌ 이전: `SMS_V.2.0/.github/workflows/deploy.yml`
- ✅ 현재: `.github/workflows/deploy.yml` (repository 루트)

### 2. Working Directory 설정
- `working-directory: SMS_V.2.0` 설정으로 올바른 디렉토리에서 작업
- npm ci 및 build 명령어가 SMS_V.2.0 폴더에서 실행됨

### 3. GitHub Pages 설정
- GitHub Pages 배포를 위한 workflow 구성 완료
- 환경 변수 설정 포함 (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)

## 🔧 Workflow 구성

### 주요 설정
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

env:
  NODE_VERSION: '20'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    permissions:
      contents: read
      pages: write
      id-token: write
    
    concurrency:
      group: "pages"
      cancel-in-progress: false
```

### 빌드 단계
1. **Checkout**: 코드 체크아웃
2. **Setup Node.js**: Node.js 20 설정 및 npm 캐시
3. **Install dependencies**: `SMS_V.2.0` 디렉토리에서 `npm ci` 실행
4. **Build application**: 환경 변수와 함께 `npm run build` 실행
5. **Setup Pages**: GitHub Pages 설정
6. **Upload artifact**: `SMS_V.2.0/dist` 디렉토리를 아티팩트로 업로드
7. **Deploy to GitHub Pages**: GitHub Pages에 배포

## 🔑 필요한 환경 변수

GitHub Repository Settings > Secrets and variables > Actions에서 다음 환경 변수를 설정해야 합니다:

- `VITE_SUPABASE_URL`: Supabase 프로젝트 URL
- `VITE_SUPABASE_ANON_KEY`: Supabase 익명 키

## 📋 GitHub Pages 활성화 단계

1. **Repository Settings 접속**
   - GitHub repository 페이지에서 Settings 탭 클릭

2. **Pages 설정**
   - 왼쪽 메뉴에서 "Pages" 클릭

3. **Source 설정**
   - Source: "GitHub Actions" 선택

4. **배포 확인**
   - main 브랜치에 push하면 자동으로 배포됨
   - Actions 탭에서 배포 진행 상황 확인 가능

## 🎯 배포 확인

배포가 완료되면 다음 URL에서 접근 가능:
- `https://[username].github.io/[repository-name]/`

## 🔍 문제 해결

### Workflow가 실행되지 않는 경우
1. `.github/workflows/deploy.yml` 파일이 repository 루트에 있는지 확인
2. main 브랜치에 push했는지 확인
3. GitHub Actions 탭에서 workflow 상태 확인

### 빌드 실패하는 경우
1. 환경 변수가 올바르게 설정되었는지 확인
2. `SMS_V.2.0/package.json`의 build 스크립트 확인
3. Actions 로그에서 구체적인 오류 메시지 확인

### 페이지가 404 오류인 경우
1. `SMS_V.2.0/public/_redirects` 파일이 있는지 확인
2. GitHub Pages 설정에서 올바른 브랜치가 선택되었는지 확인

## 📝 추가 참고사항

- SPA 라우팅을 위해 `_redirects` 파일이 포함됨
- 빌드 결과물은 `SMS_V.2.0/dist` 디렉토리에 생성됨
- GitHub Pages는 정적 파일만 서빙하므로 서버 사이드 기능은 사용 불가