const CACHE_NAME = 'moonwave-subscription-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/moonwave.png',
  '/moonwave-192.png',
  '/moonwave-144.png',
  '/moonwave-96.png',
  '/moonwave-72.png',
  '/moonwave-48.png'
];

// 서비스 워커 설치
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('캐시가 열렸습니다');
        return cache.addAll(urlsToCache);
      })
  );
});

// 서비스 워커 활성화
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('이전 캐시를 삭제합니다:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 네트워크 요청 가로채기
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 캐시에서 찾으면 반환
        if (response) {
          return response;
        }
        
        // 캐시에 없으면 네트워크에서 가져오기
        return fetch(event.request)
          .then((response) => {
            // 유효한 응답이 아니면 그대로 반환
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // 응답을 복제하여 캐시에 저장
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
                  .catch(() => {
          // 네트워크 오류 시 오프라인 페이지 반환
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
          
          // API 요청 실패 시 오프라인 응답
          if (event.request.url.includes('/api/')) {
            return new Response(JSON.stringify({
              error: '오프라인 상태입니다. 인터넷 연결을 확인해주세요.',
              offline: true
            }), {
              status: 503,
              headers: {
                'Content-Type': 'application/json'
              }
            });
          }
        });
      })
  );
});

// 백그라운드 동기화 (선택사항)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // 백그라운드에서 동기화할 작업들
  console.log('백그라운드 동기화 실행');
  return Promise.resolve();
}

// 푸시 알림 처리 (선택사항)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : '새로운 알림이 있습니다',
    icon: '/moonwave.png',
    badge: '/moonwave.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: '확인하기',
        icon: '/moonwave.png'
      },
      {
        action: 'close',
        title: '닫기',
        icon: '/moonwave.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('구독관리', options)
  );
});

// 알림 클릭 처리
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // 알림 태그에서 구독 ID 추출
  const tag = event.notification.tag;
  let targetUrl = '/';

  if (tag && tag.startsWith('payment-')) {
    const subscriptionId = tag.split('-')[1];
    targetUrl = `/subscription/${subscriptionId}`;
  }

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow(targetUrl)
    );
  } else {
    // 기본 클릭 동작
    event.waitUntil(
      clients.openWindow(targetUrl)
    );
  }
}); 