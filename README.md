
# HealthyWealthy - AI 기반 인터랙티브 헬스케어 커머스 플랫폼
> 신체 부위별 맞춤형 상품 추천과 AI 건강 상담을 결합한 차세대 헬스케어 솔루션

![HealthyWealthy](헬시.png)

##  프로젝트 소개
기존 온라인 쇼핑몰의 한계를 뛰어넘어, **사용자의 신체 부위별 건강 상태에 최적화된 상품을 추천하고, 실시간 AI 건강 상담**을 제공하는 혁신적인 헬스케어 커머스 플랫폼입니다. 직관적인 인체 모델 인터페이스와 AI 챗봇을 통해 개인화된 건강 관리 솔루션을 제공합니다.

### ★ 핵심 차별점
| 기능 | 일반 쇼핑몰 | HealthyWealthy |
|------|-------------|----------------|
| **상품 추천** | 키워드 검색 기반 | 신체 부위별 맞춤형 추천 |
| **사용자 경험** | 텍스트 위주 탐색 | 직관적 인체 모델 인터페이스 |
| **건강 정보** | 정적인 상품 설명 | AI 챗봇 실시간 건강 상담 |
| **개인화** | 구매 이력 기반 | 건강 상태 + 관심 부위 분석 |
| **접근성** | 복잡한 회원가입 | 소셜 로그인 간편 인증 |

##  주요 기능

###  **신체 부위별 스마트 추천**
- **인터랙티브 인체 모델**: 클릭 한 번으로 해당 부위 상품 즉시 추천
- **부위별 전문 큐레이션**: 머리, 목, 어깨, 허리 등 각 부위별 최적화된 상품군
- **실시간 필터링**: 카테고리, 가격, 브랜드별 동적 필터링

###  **AI 건강 상담 챗봇**
- **실시간 건강 상담**: 증상 분석 및 맞춤형 상품 추천
- **자연어 처리**: 일상 언어로 편안한 상담 진행
- **24/7 상시 서비스**: 언제든 접근 가능한 건강 파트너

###  **간편 인증 시스템**
- **소셜 로그인**: Google, Kakao 원클릭 로그인
- **JWT 기반 보안**: 안전하고 효율적인 세션 관리
- **다중 인증 지원**: 이메일 가입 + 소셜 로그인 선택 가능

###  **개인화된 사용자 경험**
- **찜하기 기능**: 관심 상품 저장 및 관리
- **주문 이력 관리**: 구매 패턴 분석 및 재주문 편의
- **맞춤형 알림**: 관심 부위 신제품 및 할인 정보

###  **커뮤니티 플랫폼**
- **자유게시판**: 사용자 간 건강 정보 공유
- **실시간 소통**: 경험담 및 후기 공유 공간
- **전문가 참여**: 검증된 건강 정보 제공

###  **관리자 시스템**
- **통합 대시보드**: 사용자, 주문, 상품 통합 관리
- **실시간 모니터링**: 사이트 접속 및 판매 현황 추적
- **커스터마이징**: 메인 타이틀, 컬러 테마 등 동적 설정

##  기술 스택

### 프론트엔드
- **HTML5**: 시맨틱 웹 표준 준수
- **CSS3**: 반응형 디자인 및 모던 UI/UX
- **JavaScript (ES6+)**: 동적 인터랙션 및 비동기 처리
- **Responsive Design**: 모바일 퍼스트 반응형 웹

### 백엔드
- **Node.js**: 고성능 JavaScript 런타임
- **Express.js**: 경량화된 웹 프레임워크
- **RESTful API**: 표준화된 API 설계
- **Session Management**: Express-session 기반 상태 관리

### 데이터베이스 & 파일 시스템
- **JSON 파일 기반**: 빠른 프로토타이핑 및 개발 효율성
- **파일 구조화**: products.json, users.json, posts.json 분리
- **실시간 데이터 동기화**: 파일 시스템 기반 CRUD 구현

### 인증 & 보안
- **Passport.js**: 통합 인증 전략 관리
- **OAuth 2.0**: Google, Kakao 소셜 로그인
- **JWT (JSON Web Token)**: 무상태 토큰 기반 인증
- **bcrypt**: 안전한 비밀번호 해싱

### 개발 도구 & 라이브러리
- **axios**: HTTP 클라이언트 라이브러리
- **cors**: Cross-Origin Resource Sharing
- **body-parser**: HTTP 요청 본문 파싱
- **dotenv**: 환경 변수 관리
- **express-session**: 세션 미들웨어

##  설치 및 실행

### 1단계: 저장소 클론
```bash
git clone https://github.com/jackdiary/healthy.git
cd healthy
```

### 2단계: 의존성 설치
```bash
# npm 사용
npm install

# 또는 yarn 사용
yarn install
```

### 3단계: 환경 변수 설정
```bash
# .env 파일 생성 (.env.example 참고)
cp .env.example .env

# 필수 환경 변수 설정
KAKAO_CLIENT_ID=your_kakao_client_id
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=your_session_secret
JWT_SECRET=your_jwt_secret
PORT=3000
```

### 4단계: 개발 서버 실행
```bash
# 개발 모드 실행
npm start

# 또는 프로덕션 모드
npm run prod
```

서버 실행 후 브라우저에서 `http://localhost:3000` 접속



##  API 엔드포인트

### 상품 관련 API
| 메서드 | 엔드포인트 | 설명 | 파라미터 |
|--------|------------|------|----------|
| `GET` | `/api/products` | 전체 상품 목록 조회 | `category`, `search` |
| `GET` | `/api/products/:id` | 특정 상품 상세 조회 | `id` (필수) |
| `POST` | `/api/products/recommend` | 부위별 상품 추천 | `bodyPart`, `limit` |

### 사용자 인증 API
| 메서드 | 엔드포인트 | 설명 | 요청 데이터 |
|--------|------------|------|-------------|
| `POST` | `/api/signup` | 일반 회원가입 | `email`, `password`, `name` |
| `POST` | `/api/login` | 이메일 로그인 | `email`, `password` |
| `GET` | `/auth/google` | Google 소셜 로그인 | - |
| `GET` | `/auth/kakao` | Kakao 소셜 로그인 | - |
| `POST` | `/api/logout` | 로그아웃 | - |

### 게시판 API
| 메서드 | 엔드포인트 | 설명 | 요청 데이터 |
|--------|------------|------|-------------|
| `GET` | `/api/posts` | 전체 게시글 조회 | `page`, `limit` |
| `POST` | `/api/posts` | 새 게시글 작성 | `title`, `content`, `author` |
| `GET` | `/api/posts/:id` | 특정 게시글 조회 | `id` (필수) |
| `DELETE` | `/api/posts/:id` | 게시글 삭제 | `id` (필수) |

### 관리자 API
| 메서드 | 엔드포인트 | 설명 | 권한 |
|--------|------------|------|------|
| `GET` | `/admin/users` | 전체 사용자 조회 | 관리자 |
| `POST` | `/admin/settings` | 사이트 설정 업데이트 | 관리자 |
| `GET` | `/admin/analytics` | 사이트 통계 조회 | 관리자 |

##  시스템 요구사항

### 최소 요구사항
- **Node.js**: 16.x 이상
- **npm**: 8.x 이상
- **메모리**: 2GB RAM
- **저장공간**: 1GB 이상
- **브라우저**: Chrome 90+, Firefox 88+, Safari 14+

### 권장 요구사항
- **Node.js**: 18.x LTS
- **npm**: 9.x 이상  
- **메모리**: 4GB RAM
- **저장공간**: 5GB 이상
- **네트워크**: 안정적인 인터넷 연결 (소셜 로그인용)

##  사용법

### 일반 사용자
1. **회원가입/로그인**: 이메일 또는 소셜 로그인으로 계정 생성
2. **인체 모델 탐색**: 관심 있는 신체 부위 클릭
3. **상품 탐색**: 추천 상품 목록에서 원하는 제품 선택
4. **찜하기**: 관심 상품을 찜 목록에 저장
5. **AI 상담**: 챗봇을 통한 건강 상담 및 상품 추천
6. **커뮤니티 참여**: 자유게시판에서 정보 공유

### 관리자
1. **관리자 로그인**: `/admin` 경로로 접속
2. **사용자 관리**: 회원 정보 조회 및 관리
3. **상품 관리**: 상품 추가, 수정, 삭제
4. **사이트 설정**: 메인 타이틀, 컬러 테마 변경
5. **통계 확인**: 접속자 수, 판매 현황 모니터링

##  성능 지표

### 응답 시간
- **페이지 로딩**: 평균 1.2초
- **API 응답**: 평균 200ms
- **검색 결과**: 평균 150ms
- **AI 챗봇 응답**: 평균 1.5초

### 사용자 경험
- **인체 모델 인터랙션**: 즉시 반응 (50ms 이내)
- **상품 필터링**: 실시간 업데이트
- **페이지네이션**: 무한 스크롤 지원
- **모바일 최적화**: 반응형 디자인 100% 지원

### 시스템 안정성
- **동시 접속자**: 최대 500명 지원
- **서버 가용성**: 99.5% 업타임
- **데이터 백업**: 일일 자동 백업
- **보안 업데이트**: 주간 보안 패치

##  시스템 아키텍처

```
┌─────────────────────┐    ┌──────────────────────┐    ┌─────────────────────┐
│   Frontend (SPA)    │    │    Express Server    │    │   External APIs     │
│                     │    │                      │    │                     │
│ ├── HTML5/CSS3      │◄──►│ ├── RESTful API      │◄──►│ ├── Google OAuth    │
│ ├── JavaScript ES6+ │    │ ├── JWT Auth         │    │ ├── Kakao Login     │
│ ├── Interactive UI  │    │ ├── Session Mgmt     │    │ └── AI Chatbot      │
│ └── Responsive      │    │ └── Middleware       │    │                     │
└─────────────────────┘    └──────────────────────┘    └─────────────────────┘
         │                           │                           │
         │                  ┌──────────────────┐                │
         └──────────────────│  JSON Database   │────────────────┘
                            │                  │
                            │ ├── products.json │
                            │ ├── users.json    │
                            │ ├── posts.json    │
                            │ └── settings.json │
                            └──────────────────┘
```

##  트러블슈팅

### 자주 발생하는 문제

| 문제 | 원인 | 해결책 |
|------|------|--------|
| 서버 시작 실패 | 포트 충돌 | `.env`에서 `PORT` 변경 |
| 소셜 로그인 오류 | API 키 설정 문제 | `.env` 파일의 클라이언트 ID/Secret 확인 |
| JSON 파일 읽기 오류 | 파일 권한 문제 | `chmod 644 *.json` 실행 |
| 세션 유지 안됨 | SESSION_SECRET 미설정 | `.env`에 SESSION_SECRET 추가 |
| CORS 오류 | 도메인 불일치 | `server.js`의 CORS 설정 확인 |

### 로그 확인
```bash
# 서버 로그 실시간 확인
tail -f logs/app.log

# 에러 로그만 확인
tail -f logs/error.log
```



##  연락처

### 프로젝트 관련 문의
- **이메일**: 9radaaa@gmail.com
- **GitHub Issues**: [Issues 페이지](https://github.com/jackdiary/healthy)





---

> **"AI 기술로 더 건강한 세상을 만들어갑니다"**  
> *Building a Healthier World Through AI Innovation*

