# GitHub Pages 배포 가이드

이 문서는 SMS V.2.0 프로젝트를 GitHub Pages에 배포하는 방법을 설명합니다.

## 🚀 자동 배포 설정

### 1. GitHub Actions 워크플로우

`.github/workflows/deploy.yml` 파일이 자동 배포를 담당합니다:

- **트리거**: `main` 또는 `master` 브랜치에 push할 때
- **빌드**: Node.js 18, npm ci, npm run build
- **배포**: GitHub Pages에 자동 배포
- **도메인**: `https://sub.moonwave.kr`

### 2. 환경 변수 설정

GitHub 저장소 설정에서 다음 Secrets를 추가해야 합니다:

#### Repository Secrets 설정 방법:
1. GitHub 저장소 → Settings → Secrets and variables → Actions
2. 다음 secrets를 추가:

```
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmdXJoamdubmpnZmNhZmRyb3RrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2MDQ4NTIsImV4cCI6MjA2OTE4MDg1Mn0.mxP7V92XRdY8e_7r9GR3B04blukhVf1vu_teRguv20U
```

선택사항 (기본값이 설정되어 있음):
```
VITE_SUPABASE_URL=https://bfurhjgnnjgfcafdrotk.supabase.co
VITE_GOOGLE_CLIENT_ID=350164367455-h4c615pr0eqoaj218bi6stlvpiqab45k.apps.googleusercontent.com
```

## 🌐 GitHub Pages 설정

### 1. GitHub Pages 활성화

1. GitHub 저장소 → Settings → Pages
2. Source: "GitHub Actions" 선택
3. Custom domain: `sub.moonwave.kr` 입력
4. "Enforce HTTPS" 체크

### 2. 도메인 DNS 설정

`sub.moonwave.kr` 도메인에서 다음 DNS 레코드를 설정:

```
Type: CNAME
Name: sub
Value: [your-username].github.io
```

또는 A 레코드 사용:
```
Type: A
Name: sub
Value: 185.199.108.153
Value: 185.199.109.153
Value: 185.199.110.153
Value: 185.199.111.153
```

### 3. CNAME 파일

`public/CNAME` 파일이 커스텀 도메인을 설정합니다:
```
sub.moonwave.kr
```

## 🔧 배포 과정

### 자동 배포
1. 코드를 `main` 브랜치에 push
2. GitHub Actions가 자동으로 실행
3. 빌드 완료 후 GitHub Pages에 배포
4. `https://sub.moonwave.kr`에서 확인 가능

### 수동 배포 (선택사항)
```bash
# 로컬에서 빌드 테스트
npm run build
npm run preview

# GitHub Pages에 수동 배포 (gh-pages 패키지 필요시)
npm install -g gh-pages
npm run deploy
```

## 📋 체크리스트

배포 전 확인사항:

- [ ] GitHub repository secrets 설정 완료
- [ ] GitHub Pages 활성화 (Source: GitHub Actions)
- [ ] DNS 설정 완료 (`sub.moonwave.kr` → GitHub Pages)
- [ ] CNAME 파일 존재 (`public/CNAME`)
- [ ] 환경 변수가 프로덕션 환경에 맞게 설정
- [ ] Google OAuth 리다이렉트 URI에 프로덕션 도메인 추가

## 🔐 보안 설정

### Supabase 설정
1. Supabase Dashboard → Authentication → URL Configuration
2. Site URL: `https://sub.moonwave.kr`
3. Redirect URLs에 추가:
   ```
   https://sub.moonwave.kr/dashboard
   https://sub.moonwave.kr/auth/callback
   ```

### Google OAuth 설정
1. Google Cloud Console → APIs & Services → Credentials
2. OAuth 2.0 Client IDs에서 승인된 리디렉션 URI 추가:
   ```
   https://sub.moonwave.kr/dashboard
   https://bfurhjgnnjgfcafdrotk.supabase.co/auth/v1/callback
   ```

## 🛠️ 문제 해결

### 일반적인 문제들

1. **404 오류**: 
   - CNAME 파일 확인
   - DNS 전파 대기 (최대 24시간)

2. **환경 변수 오류**:
   - GitHub Secrets 설정 확인
   - 변수명 정확성 확인

3. **OAuth 리다이렉트 오류**:
   - Google Cloud Console 설정 확인
   - Supabase 리다이렉트 URL 설정 확인

4. **빌드 실패**:
   - package.json 의존성 확인
   - 로컬에서 `npm run build` 테스트

### 로그 확인
- GitHub Actions 탭에서 워크플로우 실행 로그 확인
- 빌드 오류 시 상세 로그 분석

## 📞 지원

문제가 지속되면 다음을 확인하세요:
1. GitHub Actions 워크플로우 로그
2. 브라우저 개발자 도구 콘솔
3. Supabase 프로젝트 로그