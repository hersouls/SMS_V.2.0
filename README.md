# SMS V.2.0 - Subscription Management System

[![Deploy to GitHub Pages](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/deploy.yml/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/deploy.yml)
[![CI](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/ci.yml)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Active-brightgreen)](https://sub.moonwave.kr)
[![Version](https://img.shields.io/badge/Version-2.0.0-blue)](https://github.com/YOUR_USERNAME/YOUR_REPO/releases)

구독 관리 시스템 (SMS V.2.0)은 개인 및 팀의 구독 서비스를 효율적으로 관리할 수 있는 웹 애플리케이션입니다.

## 🚀 주요 기능

### 📊 핵심 기능
- **구독 관리**: 다양한 구독 서비스의 등록, 수정, 삭제
- **결제 캘린더**: 결제일 캘린더 뷰 및 알림 관리
- **비용 분석**: 월별/연간 구독 비용 분석 및 시각화
- **환율 설정**: 다국가 구독 비용 관리 (KRW/USD)
- **알림 시스템**: 결제일 알림 및 맞춤형 알림 설정
- **Google OAuth**: Google 계정으로 간편 로그인

### 📈 고급 기능
- **통계 대시보드**: 실시간 구독 통계 및 트렌드 분석
- **성능 모니터링**: Lighthouse 성능 측정 및 최적화
- **PWA 지원**: 모바일 앱처럼 설치 가능
- **음악 플레이어**: 백그라운드 음악 지원
- **웨이브 배경**: 동적 배경 애니메이션
- **다크 모드**: 라이트/다크 테마 전환

### 🔧 개발자 도구
- **자동화된 테스트**: Playwright를 활용한 E2E, 통합, API 테스트
- **데이터베이스 마이그레이션**: 자동화된 DB 스키마 관리
- **OAuth 디버거**: OAuth 연동 문제 해결 도구
- **중복 데이터 정리**: 자동화된 데이터 정리 스크립트

## 🛠️ 기술 스택

### Frontend
- **Framework**: React 18, TypeScript, Vite
- **UI Library**: Shadcn/ui, Radix UI
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Charts**: Nivo Charts, Recharts
- **Routing**: React Router v6

### Backend
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth, Google OAuth
- **API**: Supabase Edge Functions
- **Storage**: Supabase Storage

### Development & Testing
- **Testing**: Playwright (E2E, Integration, API)
- **Performance**: Lighthouse
- **Build Tool**: Vite
- **Linting**: ESLint, TypeScript
- **Deployment**: Vercel, Netlify

## 📦 설치 및 실행

### 1. 저장소 클론
```bash
git clone https://github.com/hersouls/SMS_V.2.0.git
cd SMS_V.2.0
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정
`.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://bfurhjgnnjgfcafdrotk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmdXJoamdubmpnZmNhZmRyb3RrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2MDQ4NTIsImV4cCI6MjA2OTE4MDg1Mn0.mxP7V92XRdY8e_7r9GR3B04blukhVf1vu_teRguv20U

# Google OAuth
VITE_GOOGLE_CLIENT_ID=350164367455-h4c615pr0eqoaj218bi6stlvpiqab45k.apps.googleusercontent.com

# Application Configuration
VITE_APP_URL=https://sub.moonwave.kr
VITE_APP_NAME=SMS V.2.0
VITE_APP_VERSION=2.0.0

# Development Configuration
VITE_DEV_MODE=true
VITE_ENABLE_DEBUG=true

# Allowed Origins for CORS
VITE_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3003,https://sub.moonwave.kr,https://www.sub.moonwave.kr
```

### 4. 개발 서버 실행
```bash
npm run dev
```

애플리케이션이 `http://localhost:3003`에서 실행됩니다.

## 🔧 유용한 스크립트

### 개발 도구
```bash
# 환경 설정 자동화
npm run setup-env

# Google OAuth 설정
npm run setup-google-oauth

# 데이터베이스 마이그레이션
npm run migrate-db

# 중복 데이터 정리
npm run clean-duplicates
```

### 테스트
```bash
# 모든 테스트 실행
npm run test:all

# 특정 테스트 실행
npm run test:integration  # 통합 테스트
npm run test:e2e         # E2E 테스트
npm run test:api         # API 테스트

# 테스트 리포트 확인
npm run test:report

# 테스트 환경 설정
npm run test:setup       # 테스트 계정 생성
npm run test:verify      # 테스트 환경 검증
npm run test:cleanup     # 테스트 데이터 정리
```

### 빌드 및 배포
```bash
# 프로덕션 빌드
npm run build

# 미리보기
npm run preview

# 타입 체크
npm run type-check

# 린팅
npm run lint
```

## 🌐 배포 도메인 설정

### 개발 환경
- `http://localhost:3003` (기본 개발 서버)
- `http://localhost:5173` (Vite 기본 포트)

### 프로덕션 도메인
- `https://sub.moonwave.kr` (메인 도메인)
- `https://www.sub.moonwave.kr` (서브 도메인)

## 🔧 Supabase 설정

### 프로젝트 정보
- **프로젝트 ID**: `bfurhjgnnjgfcafdrotk`
- **URL**: `https://bfurhjgnnjgfcafdrotk.supabase.co`

### 데이터베이스 스키마
- `subscriptions` - 구독 정보
- `exchange_rates` - 환율 정보
- `subscription_alarms` - 알림 설정
- `statistics` - 통계 데이터
- `kv_store_7a0e61a7` - 키-값 저장소

### CORS 설정
Supabase Edge Functions에서 다음 도메인들이 허용됩니다:
- 개발: `http://localhost:5173`, `http://localhost:3003`
- 프로덕션: `https://sub.moonwave.kr`, `https://www.sub.moonwave.kr`

## 🔐 Google OAuth 설정

### Google Cloud Console 설정

1. **OAuth 2.0 클라이언트 ID 생성**
   - Client ID: `350164367455-h4c615pr0eqoaj218bi6stlvpiqab45k.apps.googleusercontent.com`

2. **승인된 JavaScript 원본**
   ```
   http://localhost:3003
   http://localhost:5173
   https://sub.moonwave.kr
   ```

3. **승인된 리다이렉트 URI**
   ```
   http://localhost:3003/dashboard
   http://localhost:5173/dashboard
   https://sub.moonwave.kr/dashboard
   https://bfurhjgnnjgfcafdrotk.supabase.co/auth/v1/callback
   ```

### Supabase Auth 설정
1. Authentication > Providers에서 Google 제공업체 활성화
2. Site URL: `https://sub.moonwave.kr`
3. Redirect URLs에 모든 필요한 경로 추가

자세한 설정 방법은 [Google OAuth 설정 가이드](docs/Google-OAuth-Setup.md)를 참조하세요.

## 📁 프로젝트 구조

```
SMS_V.2.0/
├── src/
│   ├── main.tsx           # 애플리케이션 진입점
│   └── vite-env.d.ts      # Vite 타입 정의
├── components/            # React 컴포넌트
│   ├── ui/               # Shadcn/ui 컴포넌트
│   ├── Dashboard.tsx     # 메인 대시보드
│   ├── Statistics.tsx    # 통계 대시보드
│   ├── PaymentCalendar.tsx # 결제 캘린더
│   ├── Settings.tsx      # 설정 페이지
│   └── ...
├── utils/                # 유틸리티 함수
│   ├── supabase/        # Supabase 설정
│   ├── api.ts           # API 서비스
│   ├── statistics.ts    # 통계 관련 유틸리티
│   └── oauth.ts         # OAuth 유틸리티
├── supabase/            # Supabase 설정
│   ├── functions/       # Edge Functions
│   ├── database-schema.sql
│   └── statistics-schema.sql
├── tests/               # 테스트 파일
│   ├── integration.spec.ts
│   ├── functional.spec.ts
│   ├── api.spec.ts
│   └── ui-ux.spec.ts
├── scripts/             # 자동화 스크립트
│   ├── setup-google-oauth.js
│   ├── migrate-to-database.js
│   └── clean-duplicate-subscriptions.js
├── docs/                # 문서
│   ├── 개발체크리스트.md
│   ├── 데이터베이스스키마.md
│   ├── 통계시스템가이드.md
│   └── 테스트계획-*.md
└── styles/              # 글로벌 스타일
```

## 📊 성능 최적화

### 빌드 최적화
- **코드 분할**: React.lazy를 활용한 컴포넌트 지연 로딩
- **번들 최적화**: Vite의 수동 청킹으로 라이브러리별 분리
- **압축**: Terser를 통한 강력한 코드 압축
- **트리 셰이킹**: 사용하지 않는 코드 자동 제거

### 런타임 최적화
- **이미지 최적화**: WebP 형식 지원
- **캐싱**: Supabase 클라이언트 캐싱
- **지연 로딩**: 컴포넌트 및 라우트 지연 로딩

## 🧪 테스트 시스템

### 테스트 유형
- **통합 테스트**: 컴포넌트 간 상호작용 테스트
- **E2E 테스트**: 사용자 시나리오 테스트
- **API 테스트**: Supabase API 엔드포인트 테스트
- **UI/UX 테스트**: 사용자 인터페이스 테스트
- **성능 테스트**: Lighthouse 성능 측정

### 테스트 환경 관리
- 자동화된 테스트 계정 생성/삭제
- 테스트 데이터 격리
- CI/CD 통합

## 🔐 인증 및 보안

### 인증 방식
- **Supabase Auth**: 이메일/비밀번호 인증
- **Google OAuth**: 소셜 로그인
- **세션 관리**: JWT 토큰 기반 인증

### 보안 기능
- **RLS(Row Level Security)**: 데이터베이스 수준 권한 제어
- **CORS 설정**: 허용된 도메인만 접근
- **환경 변수**: 민감한 정보 보호

## 🚀 배포

### GitHub Pages 배포 (자동)
```bash
# main 브랜치에 push하면 자동 배포
git push origin main
```

배포 도메인: `https://sub.moonwave.kr`

자세한 설정 방법은 [GitHub Pages 배포 가이드](docs/GitHub-Pages-배포가이드.md)를 참조하세요.

### Vercel 배포
```bash
npm run build
vercel --prod
```

### Netlify 배포
```bash
npm run build
netlify deploy --prod --dir=dist
```

### 환경별 설정
- **개발**: `localhost` 도메인 허용
- **프로덕션**: `sub.moonwave.kr` 도메인만 허용

## 📚 문서화

### 개발 문서
- [개발 체크리스트](docs/개발체크리스트.md)
- [데이터베이스 스키마](docs/데이터베이스스키마.md)
- [통계 시스템 가이드](docs/통계시스템가이드.md)
- [마이그레이션 가이드](docs/마이그레이션가이드.md)

### 테스트 문서
- [테스트 환경 설정](docs/테스트-환경-설정.md)
- [통합 테스트 체크리스트](docs/통합테스트-체크리스트.md)
- [테스트 계획 문서](docs/) - 기능/성능/보안/UI-UX 테스트

### 설정 가이드
- [Google OAuth 설정](docs/Google-OAuth-Setup.md)

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 개발 가이드라인
- TypeScript 사용 필수
- ESLint 규칙 준수
- 테스트 코드 작성
- 문서화 업데이트

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 문의 및 지원

- **GitHub Issues**: 버그 리포트 및 기능 요청
- **프로젝트 URL**: https://github.com/hersouls/SMS_V.2.0
- **라이브 데모**: https://sub.moonwave.kr

---

## 🔄 최근 업데이트 (v2.0.0)

### 새로운 기능
- 📊 고급 통계 대시보드 및 데이터 시각화
- 🧪 포괄적인 테스트 시스템 (Playwright)
- 🎵 백그라운드 음악 플레이어
- 🌊 동적 웨이브 배경 애니메이션
- 📱 PWA 지원 및 모바일 최적화
- 🔧 OAuth 디버깅 도구

### 성능 개선
- ⚡ Vite 기반 빌드 시스템
- 📦 코드 분할 및 지연 로딩
- 🗜️ 향상된 번들 압축
- 🏃‍♂️ 개선된 초기 로딩 속도

### 개발자 경험 향상
- 🤖 자동화된 스크립트 및 도구
- 📋 포괄적인 테스트 커버리지
- 📚 개선된 문서화
- 🔍 향상된 디버깅 도구 