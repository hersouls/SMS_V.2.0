# 🌊 Moonwave v2.0 - 구독 관리 앱

> **Phase 4: 배포 및 최적화 완료** 🚀

Moonwave는 Netflix, Spotify, YouTube 등 모든 구독 서비스를 체계적으로 관리하는 현대적인 웹 애플리케이션입니다. PWA 지원, 오프라인 기능, 실시간 성능 모니터링을 통해 최고의 사용자 경험을 제공합니다.

## ✨ 주요 기능

### 🎯 핵심 기능
- **구독 관리**: 모든 구독 서비스의 통합 관리
- **결제 캘린더**: 월간/주간/일간 결제 일정 확인
- **환율 관리**: 실시간 환율 업데이트 및 통화 변환
- **알림 시스템**: 결제 예정, 가격 변동, 만료 알림
- **데이터 분석**: 월간/연간 지출 분석 및 리포트

### 🚀 Phase 4 고급 기능
- **PWA 지원**: 앱 설치, 오프라인 기능, 백그라운드 동기화
- **성능 최적화**: Core Web Vitals 최적화, 가상화, 코드 분할
- **실시간 모니터링**: 성능 메트릭, 오류 추적, 사용자 분석
- **보안 강화**: CSP, HTTPS, XSS/CSRF 보호
- **SEO 최적화**: 메타 태그, 구조화 데이터, 사이트맵

## 🛠 기술 스택

### Frontend
- **React 19** - 최신 React 기능 활용
- **TypeScript** - 타입 안전성 보장
- **Vite** - 빠른 개발 및 빌드 도구
- **Tailwind CSS** - 유틸리티 우선 CSS 프레임워크
- **React Router** - 클라이언트 사이드 라우팅

### Backend & Database
- **Supabase** - 실시간 데이터베이스 및 인증
- **PostgreSQL** - 관계형 데이터베이스
- **Row Level Security** - 사용자 데이터 격리

### 성능 & 모니터링
- **PWA** - Progressive Web App 기능
- **Service Worker** - 오프라인 캐싱 및 동기화
- **Lighthouse CI** - 성능 자동 테스트
- **Core Web Vitals** - 실시간 성능 모니터링

## 📦 설치 및 실행

### 필수 요구사항
- Node.js 20+
- npm 9+
- Git

### 로컬 개발 환경 설정

```bash
# 저장소 클론
git clone https://github.com/hersouls/SMS_V.2.0.git
cd SMS_V.2.0

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env.local
# .env.local 파일에 Supabase 설정 추가

# 개발 서버 실행
npm run dev
```

### 환경 변수 설정

```env
# .env.local
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🚀 배포

### 자동 배포 (GitHub Actions)

1. **GitHub Secrets 설정**
   - `VITE_SUPABASE_URL`: Supabase 프로젝트 URL
   - `VITE_SUPABASE_ANON_KEY`: Supabase 익명 키

2. **배포 트리거**
   - `main` 브랜치에 푸시하면 자동 배포
   - GitHub Actions에서 CI/CD 파이프라인 실행

### 수동 배포

```bash
# 전체 배포 (테스트 포함)
./scripts/deploy.sh

# 테스트 건너뛰고 배포
./scripts/deploy.sh --skip-tests

# 성능 테스트만 실행
./scripts/deploy.sh --dry-run
```

### 배포 확인

```bash
# 빌드 테스트
npm run build
npm run preview

# 성능 테스트
npm run lighthouse

# 모든 테스트 실행
npm run test:all
```

## 📊 성능 최적화

### Core Web Vitals 목표
- **LCP (Largest Contentful Paint)**: < 2.5초
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### 최적화 기법
- **코드 분할**: React.lazy를 통한 라우트별 분할
- **이미지 최적화**: WebP 포맷, 지연 로딩
- **캐싱 전략**: Service Worker를 통한 정적 자원 캐싱
- **번들 최적화**: Tree shaking, 압축, 청크 분할

## 🔧 개발 가이드

### 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── ui/             # 기본 UI 컴포넌트
│   ├── layout/         # 레이아웃 컴포넌트
│   └── features/       # 기능별 컴포넌트
├── pages/              # 페이지 컴포넌트
├── hooks/              # 커스텀 훅
├── contexts/           # React Context
├── lib/                # 유틸리티 라이브러리
├── types/              # TypeScript 타입 정의
└── utils/              # 헬퍼 함수
```

### 코드 스타일

```bash
# 린팅
npm run lint

# 타입 체크
npm run type-check

# 포맷팅
npm run format
```

### 테스트

```bash
# 단위 테스트
npm run test

# E2E 테스트
npm run test:e2e

# 성능 테스트
npm run lighthouse

# 모든 테스트
npm run test:all
```

## 📱 PWA 기능

### 설치 방법
1. 브라우저에서 앱 접속
2. 주소창 옆 설치 아이콘 클릭
3. "설치" 선택

### 오프라인 기능
- 캐시된 구독 목록 보기
- 기본 설정 확인
- 오프라인 모드에서 데이터 입력
- 연결 복구 시 자동 동기화

## 🔍 모니터링 및 분석

### 성능 모니터링
- **Core Web Vitals** 실시간 추적
- **메모리 사용량** 모니터링
- **네트워크 상태** 감지
- **번들 크기** 분석

### 오류 추적
- **Error Boundary**를 통한 오류 캐치
- **자동 오류 보고** 시스템
- **사용자 컨텍스트** 포함
- **개발자 친화적** 오류 메시지

### 사용자 분석
- **페이지 뷰** 추적
- **사용자 행동** 분석
- **성능 메트릭** 수집
- **A/B 테스트** 지원

## 🛡 보안

### 구현된 보안 기능
- **Content Security Policy (CSP)**
- **HTTPS 강제 적용**
- **XSS 보호**
- **CSRF 보호**
- **입력 검증 및 살균**

### 데이터 보호
- **Row Level Security (RLS)**
- **사용자 데이터 격리**
- **암호화된 통신**
- **정기 보안 감사**

## 📈 SEO 최적화

### 구현된 SEO 기능
- **메타 태그** 최적화
- **Open Graph** 데이터
- **구조화 데이터 (JSON-LD)**
- **사이트맵** 자동 생성
- **robots.txt** 설정

### 성능 최적화
- **이미지 최적화** (alt 태그, WebP)
- **시맨틱 HTML** 구조
- **페이지 속도** 최적화
- **모바일 우선** 인덱싱

## 🤝 기여하기

### 개발 환경 설정

```bash
# 포크 및 클론
git clone https://github.com/your-username/SMS_V.2.0.git
cd SMS_V.2.0

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

### 기여 가이드라인
1. **브랜치 생성**: `feature/기능명` 또는 `fix/버그명`
2. **코드 작성**: TypeScript, ESLint 규칙 준수
3. **테스트 작성**: 단위 테스트 및 E2E 테스트
4. **PR 생성**: 상세한 설명과 스크린샷 포함

## 📄 라이선스

MIT License - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🆘 지원

### 문제 해결

**일반적인 문제들:**

1. **빌드 실패**
   ```bash
   npm run clean
   npm install
   npm run build
   ```

2. **성능 문제**
   ```bash
   npm run lighthouse
   # 결과를 확인하고 최적화 적용
   ```

3. **PWA 설치 실패**
   - HTTPS 환경에서만 작동
   - Service Worker 등록 확인
   - Manifest 파일 유효성 검사

### 연락처
- **이슈 리포트**: [GitHub Issues](https://github.com/hersouls/SMS_V.2.0/issues)
- **기능 요청**: [GitHub Discussions](https://github.com/hersouls/SMS_V.2.0/discussions)

## 🎯 로드맵

### v2.1 계획
- [ ] 다크 모드 지원
- [ ] 다국어 지원 (영어, 일본어)
- [ ] 고급 분석 대시보드
- [ ] API 연동 확장

### v2.2 계획
- [ ] 모바일 앱 (React Native)
- [ ] 팀 협업 기능
- [ ] 고급 알림 시스템
- [ ] 데이터 내보내기/가져오기

---

**Moonwave v2.0** - 구독 관리를 더 스마트하게 🌊

*Phase 4 배포 및 최적화 완료 - 2024년 12월*
