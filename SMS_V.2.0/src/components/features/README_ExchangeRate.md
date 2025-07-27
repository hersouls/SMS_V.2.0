# Exchange Rate System

이 문서는 SMS V.2.0의 환율 시스템 구현에 대한 상세한 설명입니다.

## 📋 개요

환율 시스템은 USD 대비 KRW 환율을 관리하고, 실시간 업데이트와 통화 변환 기능을 제공합니다.

## 🏗️ 아키텍처

### 1. ExchangeRateContext (`src/contexts/ExchangeRateContext.tsx`)
- **역할**: 앱 전체에서 환율 상태를 관리하는 Context
- **기능**:
  - 실시간 Supabase 구독
  - 환율 데이터 CRUD 작업
  - 통화 변환 유틸리티
  - 에러 처리 및 로딩 상태 관리

### 2. useExchangeRate Hook (`src/hooks/useExchangeRate.ts`)
- **역할**: Context의 래퍼 (하위 호환성)
- **기능**: 기존 코드와의 호환성을 위한 인터페이스 제공

### 3. ExchangeRateModal (`src/components/features/ExchangeRateModal.tsx`)
- **역할**: 환율 설정을 위한 모달 컴포넌트
- **기능**:
  - Tailwind UI Premium 모달 패턴
  - 실시간 API 통합
  - 입력 검증 (양수만 허용)
  - Supabase 저장
  - Glass morphism 디자인

### 4. ExchangeRateDisplay (`src/components/features/ExchangeRateDisplay.tsx`)
- **역할**: 대시보드용 환율 표시 컴포넌트
- **기능**:
  - 클릭 가능한 환율 표시
  - 현재 환율 및 마지막 업데이트 시간
  - 호버 효과 및 편집 기능
  - 반응형 디자인 (Container Queries)
  - 접근성 기능 (ARIA 라벨, 키보드 지원)

### 5. ExchangeRateExample (`src/components/features/ExchangeRateExample.tsx`)
- **역할**: 환율 변환기 예제 컴포넌트
- **기능**:
  - 실시간 통화 변환
  - 양방향 변환 (USD ↔ KRW)
  - 시각적 피드백

## 🚀 사용법

### 1. Context 사용

```tsx
import { useExchangeRateContext } from '../contexts/ExchangeRateContext';

const MyComponent = () => {
  const {
    rate,
    isLoading,
    error,
    updateExchangeRate,
    convertCurrency,
    getFormattedRate
  } = useExchangeRateContext();

  return (
    <div>
      <p>현재 환율: {getFormattedRate()}</p>
      <p>10 USD = {convertCurrency(10, 'USD', 'KRW')} KRW</p>
    </div>
  );
};
```

### 2. 모달 사용

```tsx
import { ExchangeRateModal } from '../components/features/ExchangeRateModal';

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>
        환율 설정
      </button>
      
      <ExchangeRateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
```

### 3. 환율 표시

```tsx
import { ExchangeRateDisplay } from '../components/features/ExchangeRateDisplay';

const Dashboard = () => {
  const handleEditClick = () => {
    // 모달 열기 로직
  };

  return (
    <ExchangeRateDisplay
      onEditClick={handleEditClick}
      showRefreshButton={true}
    />
  );
};
```

## 🔧 설정

### 1. App.tsx에 Provider 추가

```tsx
import { ExchangeRateProvider } from './contexts/ExchangeRateContext';

function App() {
  return (
    <AuthProvider>
      <ExchangeRateProvider>
        {/* 앱 컴포넌트들 */}
      </ExchangeRateProvider>
    </AuthProvider>
  );
}
```

### 2. Supabase 테이블 스키마

```sql
CREATE TABLE exchange_rates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  usd_krw DECIMAL(10,2) NOT NULL CHECK (usd_krw > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 실시간 구독을 위한 RLS 정책
ALTER TABLE exchange_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own exchange rates"
  ON exchange_rates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own exchange rates"
  ON exchange_rates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own exchange rates"
  ON exchange_rates FOR UPDATE
  USING (auth.uid() = user_id);
```

## 🎨 디자인 시스템

### Glass Morphism
- `bg-white/80 backdrop-blur-md`: 반투명 배경과 블러 효과
- `border border-white/20`: 미묘한 테두리
- `hover:bg-white/90`: 호버 시 투명도 변화

### 색상 팔레트
- **Primary**: Blue 계열 (`blue-500`, `blue-600`)
- **Secondary**: Purple 계열 (`purple-500`, `purple-600`)
- **Gray**: 텍스트 및 배경 (`gray-50` ~ `gray-900`)

### 타이포그래피
- **Font**: Pretendard Variable
- **Korean Text**: `font-pretendard` 클래스 사용
- **Letter Spacing**: `tracking-ko-normal` (한국어 최적화)

## 🔄 실시간 기능

### 1. Supabase 실시간 구독
```tsx
const subscription = supabase
  .channel('exchange_rates_changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'exchange_rates',
      filter: `user_id=eq.${user.id}`
    },
    (payload) => {
      // 실시간 업데이트 처리
    }
  )
  .subscribe();
```

### 2. 실시간 API 통합
```tsx
const fetchLatestRateFromAPI = async (): Promise<number | null> => {
  try {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const data = await response.json();
    return data.rates.KRW;
  } catch (err) {
    console.error('실시간 환율 API 호출 실패:', err);
    return null;
  }
};
```

## 🛡️ 에러 처리

### 1. 입력 검증
- 양수만 허용 (0 초과)
- 최대값 제한 (10,000 이하)
- 실시간 검증 및 에러 메시지

### 2. 네트워크 에러
- API 호출 실패 시 기본값 사용
- 사용자 친화적 에러 메시지
- 재시도 로직

### 3. 로딩 상태
- 스피너 애니메이션
- 비활성화 상태 관리
- 사용자 피드백

## ♿ 접근성

### 1. ARIA 라벨
```tsx
aria-label="환율 설정을 편집하려면 클릭하세요"
aria-describedby="exchange-rate-error"
```

### 2. 키보드 지원
```tsx
onKeyDown={(e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    onEditClick();
  }
}}
```

### 3. 스크린 리더 지원
```tsx
<div className="sr-only">
  <p>현재 USD 대비 KRW 환율은 {rate.toLocaleString()}원입니다.</p>
</div>
```

## 📱 반응형 디자인

### Container Queries
```tsx
<div className="@container">
  <div className="@lg:grid @lg:grid-cols-2">
    {/* 반응형 레이아웃 */}
  </div>
</div>
```

### 모바일 최적화
- 터치 친화적 버튼 크기
- 적절한 터치 타겟 간격
- 모바일 우선 디자인

## 🔧 개발 가이드

### 1. 새로운 컴포넌트 추가
```tsx
import { useExchangeRateContext } from '../../contexts/ExchangeRateContext';

const NewComponent = () => {
  const { rate, convertCurrency } = useExchangeRateContext();
  // 컴포넌트 로직
};
```

### 2. 테스트 작성
```tsx
import { render, screen } from '@testing-library/react';
import { ExchangeRateProvider } from '../contexts/ExchangeRateContext';

const TestWrapper = ({ children }) => (
  <ExchangeRateProvider>
    {children}
  </ExchangeRateProvider>
);

test('환율 표시 테스트', () => {
  render(
    <TestWrapper>
      <ExchangeRateDisplay />
    </TestWrapper>
  );
  
  expect(screen.getByText(/USD.*KRW/)).toBeInTheDocument();
});
```

## 📊 성능 최적화

### 1. 메모이제이션
- Context 값의 불필요한 리렌더링 방지
- useMemo와 useCallback 활용

### 2. 코드 스플리팅
- Lazy loading으로 초기 번들 크기 감소
- 필요시에만 컴포넌트 로드

### 3. 실시간 구독 최적화
- 사용자별 필터링으로 불필요한 업데이트 방지
- 컴포넌트 언마운트 시 구독 해제

## 🔮 향후 개선사항

1. **다중 통화 지원**: EUR, JPY 등 추가 통화
2. **히스토리 차트**: 환율 변화 그래프
3. **알림 기능**: 환율 변동 알림
4. **API 캐싱**: Redis를 통한 성능 최적화
5. **오프라인 지원**: Service Worker 활용

## 📝 라이센스

이 프로젝트는 MIT 라이센스 하에 배포됩니다.