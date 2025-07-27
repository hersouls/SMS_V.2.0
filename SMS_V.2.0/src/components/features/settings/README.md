# Settings Components

이 디렉토리는 설정 페이지와 관련된 컴포넌트들을 포함합니다.

## Components

### Settings.tsx (Main Page)
- **위치**: `src/pages/Settings.tsx`
- **기능**: 메인 설정 페이지
- **주요 섹션**:
  - 프로필 정보 (이메일, 가입일)
  - 환율 설정 (기존 ExchangeRateModal 통합)
  - 알림 설정 (NotificationSettings 컴포넌트)
  - 계정 관리 (로그아웃, 계정 삭제)

### NotificationSettings.tsx
- **위치**: `src/components/features/settings/NotificationSettings.tsx`
- **기능**: 알림 설정 관리
- **특징**:
  - 실시간 Supabase 저장
  - 시각적 피드백 (저장 상태 표시)
  - 접근성 기능 (ARIA 라벨, 키보드 네비게이션)
  - 한국어 텍스트 최적화

### AccountDeletionModal.tsx
- **위치**: `src/components/features/settings/AccountDeletionModal.tsx`
- **기능**: 계정 삭제 확인 모달
- **특징**:
  - 3단계 확인 프로세스 (경고 → 확인 → 삭제)
  - 데이터 삭제 설명
  - Supabase 인증 삭제 통합
  - Headless UI 모달 패턴
  - 접근성 기능

## Database Schema

### user_notification_preferences 테이블
```sql
CREATE TABLE user_notification_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  payment_reminders BOOLEAN DEFAULT true,
  renewal_alerts BOOLEAN DEFAULT true,
  price_changes BOOLEAN DEFAULT true,
  monthly_summary BOOLEAN DEFAULT true,
  system_updates BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Features

### Glass Morphism Design
- `backdrop-blur-sm bg-white/80 border border-white/20` 클래스 사용
- 반투명 배경과 블러 효과
- 현대적인 UI 디자인

### Container Queries
- `@container` 클래스 사용
- 반응형 레이아웃 지원
- 다양한 화면 크기에 최적화

### Korean Text Optimization
- `break-keep-ko` 클래스로 한국어 단어 분리 최적화
- Pretendard 폰트 지원
- 한국어 사용자 경험 개선

### Accessibility
- ARIA 라벨 및 역할
- 키보드 네비게이션 지원
- 스크린 리더 호환성
- 포커스 관리

## Usage

### Settings 페이지 사용
```tsx
import Settings from '../pages/Settings';

// 라우터에 추가
<Route path="/settings" element={<Settings />} />
```

### 알림 설정 컴포넌트 사용
```tsx
import NotificationSettings from '../components/features/settings/NotificationSettings';

<NotificationSettings />
```

### 계정 삭제 모달 사용
```tsx
import AccountDeletionModal from '../components/features/settings/AccountDeletionModal';

const [isModalOpen, setIsModalOpen] = useState(false);

<AccountDeletionModal 
  isOpen={isModalOpen} 
  onClose={() => setIsModalOpen(false)} 
/>
```

## Dependencies

- `@headlessui/react`: 모달 및 접근성 컴포넌트
- `@heroicons/react`: 아이콘
- `lucide-react`: 아이콘
- `@supabase/supabase-js`: 데이터베이스 연동
- `tailwindcss`: 스타일링

## Setup

1. 데이터베이스 스키마 적용:
```bash
# Supabase SQL 편집기에서 실행
\i scripts/add-notification-preferences.sql
```

2. 타입 정의 확인:
- `src/types/database.types.ts`에 `UserNotificationPreferences` 인터페이스 추가됨

3. 컴포넌트 import 확인:
- 모든 필요한 UI 컴포넌트가 `src/components/ui/index.ts`에서 export됨

## Notes

- 계정 삭제 기능은 현재 Supabase의 제한으로 인해 완전한 삭제가 어려울 수 있습니다.
- 프로덕션 환경에서는 서버 사이드 함수를 사용하여 계정 삭제를 구현하는 것을 권장합니다.
- 알림 설정은 실시간으로 저장되며, 사용자 경험을 위해 즉시 피드백을 제공합니다.