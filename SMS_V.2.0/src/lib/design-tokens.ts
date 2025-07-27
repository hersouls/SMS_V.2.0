// Moonwave Design System v2.0 - 공통 디자인 토큰
// 디자인 가이드와 Footer 디자인 가이드 100% 준수

export const DESIGN_TOKENS = {
  // 버튼 패턴
  BUTTON_BASE: "font-sans antialiased tracking-ko-normal font-semibold px-4 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
  
  // 카드 패턴
  CARD_BASE: "font-sans antialiased bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-200",
  
  // 한글 텍스트
  KOREAN_TEXT_BASE: "font-sans antialiased tracking-ko-normal break-keep-ko",
  
  // 컨테이너 반응형
  CONTAINER_RESPONSIVE: "@container @lg:flex-row @lg:gap-6 @lg:items-center flex flex-col gap-4",
  
  // 그라디언트
  GRADIENT_PRIMARY: "bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900",
  GRADIENT_ACCENT: "bg-gradient-to-br from-purple-500 to-blue-500",
  
  // 글래스 버튼
  GLASS_BUTTON: "p-3 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all duration-200 transform active:scale-95",
  
  // 플로팅 액션 버튼
  FAB_BASE: "w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 transform active:scale-95 font-sans font-semibold",
  
  // 레이아웃 관련 토큰
  LAYOUT_CENTER: "flex items-center justify-center",
  LAYOUT_CENTER_HORIZONTAL: "flex justify-center",
  LAYOUT_CENTER_VERTICAL: "flex items-center",
  LAYOUT_SPACED: "flex items-center justify-between",
  
  // 간격 관련 토큰
  GAP_SM: "gap-2",
  GAP_MD: "gap-4",
  GAP_LG: "gap-6",
  GAP_XL: "gap-8",
  
  // 버튼 그룹 토큰
  BUTTON_GROUP: "flex items-center gap-2 @sm:gap-3 @lg:gap-4",
  BUTTON_GROUP_VERTICAL: "flex flex-col items-center gap-2 @sm:gap-3 @lg:gap-4",
  BUTTON_GROUP_CENTERED: "flex items-center justify-center gap-2 @sm:gap-3 @lg:gap-4",
  
  // 입력 필드
  INPUT_BASE: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans tracking-ko-normal",
  
  // 모달
  MODAL_BASE: "relative transform overflow-hidden rounded-2xl bg-white/90 backdrop-blur-md px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 border border-white/20",
  
  // 슬라이더
  SLIDER_BASE: "h-1 bg-white/20 rounded-lg appearance-none cursor-pointer",
  
  // 프로그레스 바
  PROGRESS_BASE: "w-full h-1 bg-white/20 rounded-full cursor-pointer",
  PROGRESS_FILL: "h-full bg-gradient-to-r from-purple-400 to-blue-400 rounded-full transition-all duration-100"
};

// 색상 시스템
export const COLORS = {
  moonwave: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    secondary: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',
      600: '#9333ea',
      700: '#7e22ce',
      800: '#6b21a8',
      900: '#581c87',
    },
  },
  semantic: {
    success: {
      light: '#d1fae5',
      DEFAULT: '#10b981',
      dark: '#065f46',
    },
    warning: {
      light: '#fed7aa',
      DEFAULT: '#f59e0b',
      dark: '#92400e',
    },
    error: {
      light: '#fee2e2',
      DEFAULT: '#ef4444',
      dark: '#991b1b',
    },
    info: {
      light: '#dbeafe',
      DEFAULT: '#3b82f6',
      dark: '#1e40af',
    },
  }
};

// 간격 시스템
export const SPACING = {
  0: '0px',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
};

// 그림자 시스템
export const SHADOWS = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  soft: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  glow: '0 0 20px rgba(59, 130, 246, 0.3)',
  premium: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
};

// 아이콘 크기
export const ICON_SIZES = {
  xs: 'w-3 h-3',    // 12px
  sm: 'w-4 h-4',    // 16px
  md: 'w-5 h-5',    // 20px (기본)
  lg: 'w-6 h-6',    // 24px
  xl: 'w-8 h-8',    // 32px
};

// Z-index 계층 구조
export const Z_INDEX = {
  mainFooter: 10,
  musicPlayerFooter: 30,
  floatingActions: 40,
  globalNotifications: 50,
  modal: 60,
  tooltip: 70,
};

// 애니메이션 지속 시간
export const TRANSITIONS = {
  fast: 'duration-150',
  normal: 'duration-200',
  slow: 'duration-300',
  slower: 'duration-500',
};

// 반응형 브레이크포인트
export const BREAKPOINTS = {
  mobile: '@sm:',
  tablet: '@md:',
  desktop: '@lg:',
  wide: '@xl:',
  ultra: '@2xl:',
};

// 접근성 관련
export const ACCESSIBILITY = {
  focusRing: 'focus:outline-none focus:ring-2 focus:ring-offset-2',
  screenReaderOnly: 'sr-only',
  ariaLive: 'aria-live="polite"',
  ariaAtomic: 'aria-atomic="true"',
};

// 한글 최적화
export const KOREAN_OPTIMIZATION = {
  textBase: 'font-sans antialiased tracking-ko-normal break-keep-ko',
  textTight: 'font-sans antialiased tracking-ko-tight break-keep-ko',
  textWide: 'font-sans antialiased tracking-ko-wide break-keep-ko',
  numeric: 'font-variant-numeric tabular-nums font-feature-settings: "tnum"',
};

// 유틸리티 함수
export const createClassName = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ');
};

export const combineTokens = (...tokens: string[]) => {
  return tokens.join(' ');
};