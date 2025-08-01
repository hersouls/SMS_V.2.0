// Google OAuth 설정 유틸리티

export interface OAuthConfig {
  clientId: string;
  redirectUri: string;
  scope: string;
  responseType: string;
}

// 현재 환경 감지
export const getCurrentEnvironment = () => {
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'development';
  }
  
  if (hostname.includes('moonwave.kr')) {
    return 'production';
  }
  
  return 'development';
};

// 현재 도메인 가져오기
export const getCurrentDomain = () => {
  return window.location.origin;
};

// Google OAuth 설정 가져오기
export const getGoogleOAuthConfig = (): OAuthConfig => {
  const environment = getCurrentEnvironment();
  const currentDomain = getCurrentDomain();
  
  // 개발 환경에서는 현재 도메인 사용, 프로덕션에서는 Supabase 콜백 사용
  let redirectUri: string;
  
  if (environment === 'development') {
    redirectUri = `${currentDomain}/dashboard`;
  } else {
    // 프로덕션에서는 Supabase Auth 콜백 사용
    redirectUri = 'https://bfurhjgnnjgfcafdrotk.supabase.co/auth/v1/callback';
  }
  
  const config: OAuthConfig = {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '350164367455-h4c615pr0eqoaj218bi6stlvpiqab45k.apps.googleusercontent.com',
    redirectUri,
    scope: 'email profile',
    responseType: 'code'
  };
  
  console.log('Google OAuth 설정:', {
    environment,
    currentDomain,
    redirectUri,
    config
  });
  
  return config;
};

// Google OAuth URL 생성
export const getGoogleOAuthUrl = () => {
  const config = getGoogleOAuthConfig();
  
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: config.scope,
    response_type: config.responseType,
    access_type: 'offline',
    prompt: 'consent'
  });
  
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

// Google OAuth 오류 메시지 해석
export const getOAuthErrorMessage = (error: string): string => {
  if (error.includes('redirect_uri_mismatch')) {
    return 'Google OAuth 설정 오류: 리다이렉트 URI가 일치하지 않습니다. 개발자에게 문의하세요.';
  }
  
  if (error.includes('invalid_client')) {
    return 'Google OAuth 설정 오류: 클라이언트 ID가 잘못되었습니다.';
  }
  
  if (error.includes('unauthorized_client')) {
    return 'Google OAuth 설정 오류: 승인되지 않은 클라이언트입니다.';
  }
  
  if (error.includes('access_denied')) {
    return 'Google OAuth 오류: 사용자가 로그인을 취소했습니다.';
  }
  
  if (error.includes('invalid_request')) {
    return 'Google OAuth 오류: 잘못된 요청입니다.';
  }
  
  return `Google OAuth 오류: ${error}`;
};

// Google OAuth 상태 확인
export const checkOAuthStatus = () => {
  const environment = getCurrentEnvironment();
  const currentDomain = getCurrentDomain();
  
  console.log('OAuth 상태 확인:', {
    environment,
    currentDomain,
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID ? '설정됨' : '설정되지 않음',
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL ? '설정됨' : '설정되지 않음'
  });
  
  return {
    environment,
    currentDomain,
    isConfigured: !!(import.meta.env.VITE_GOOGLE_CLIENT_ID && import.meta.env.VITE_SUPABASE_URL)
  };
}; 