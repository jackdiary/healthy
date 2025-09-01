<<<<<<< HEAD
# HealthyWealthy - 맞춤형 헬스케어 커머스 플랫폼

<br>

<p align="center">
  <img src="./image/34.png" alt="HealthyWealthy Logo" width="150">
</p>

<p align="center">
  <strong>당신의 건강한 라이프스타일을 위한 가장 빠르고 정확한 솔루션</strong>
</p>
<p align="center">
  HealthyWealthy는 사용자의 신체 부위별 건강 상태에 최적화된 상품을 추천하고, 유용한 건강 정보를 공유하는 AI 기반의 인터랙티브 헬스케어 커머스 플랫폼입니다.
</p>

<br>

---

## 🌟 주요 기능 (Key Features)

### 1. 사용자 중심 기능
- **회원 시스템**: 일반 이메일 가입 및 소셜 로그인(Google, Kakao)을 지원합니다.
- **마이페이지**: 주문 내역, 찜 목록 등 개인화된 정보를 제공합니다. (구현 중)
- **상품 검색**: 원하는 상품을 키워드로 빠르게 찾을 수 있는 검색 기능을 제공합니다.
- **찜하기**: 관심 있는 상품을 찜 목록에 저장하여 쉽게 다시 찾아볼 수 있습니다.

### 2. 인터랙티브 UI/UX
- **신체 부위별 상품 추천**: 사용자가 화면의 인체 모델에서 특정 부위를 클릭하면, 해당 부위와 관련된 상품 목록을 즉시 추천합니다.
- **AI 건강 상담 챗봇**: 건강 관련 질문에 실시간으로 답변하고, 관련 상품을 추천하는 AI 챗봇을 통해 사용자 경험을 극대화합니다.
- **동적 필터링 및 페이지네이션**: 추천 상품 목록을 카테고리별로 필터링하고, 페이지네이션을 통해 효율적으로 탐색할 수 있습니다.

### 3. 커뮤니티 및 관리
- **자유게시판**: 사용자들이 자유롭게 소통하고 정보를 공유할 수 있는 커뮤니티 공간을 제공합니다.
- **관리자 대시보드**: 사이트의 주요 설정(메인 타이틀, 컬러 등)과 사용자 정보를 관리할 수 있는 별도의 관리자 페이지를 제공합니다.

---

## 🛠️ 기술 스택 (Tech Stack)

| Category      | Technology                                                                                             |
|---------------|--------------------------------------------------------------------------------------------------------|
| **Frontend**  | `HTML5`, `CSS3`, `JavaScript (ES6+)`                                                                   |
| **Backend**   | `Node.js`, `Express.js`                                                                                |
| **Data**      | `JSON` 파일을 활용한 파일 기반 데이터베이스                                                              |
| **Authentication** | `Passport.js` (`Google OAuth 2.0`, `Kakao Strategy`), `JSON Web Token (JWT)`, `Express Session` |
| **Libraries** | `axios`, `cors`, `body-parser`, `dotenv`                                                               |

---

## 🚀 시작하기 (Getting Started)

### 1. 사전 준비 (Prerequisites)
- [Node.js](https://nodejs.org/) (LTS 버전 권장)
- `npm` 또는 `yarn` 패키지 매니저

### 2. 설치 및 설정 (Installation & Setup)

1. **프로젝트 클론**
   ```bash
   git clone https://github.com/your-username/HealthyWealthy.git
   cd HealthyWealthy
   ```

2. **필요한 모듈 설치**
   ```bash
   npm install
   ```

3. **환경 변수 설정**
   - `.env.example` 파일을 복사하여 `.env` 파일을 생성합니다.
   - 소셜 로그인을 위한 `Client ID`와 `Client Secret` 등 필요한 환경 변수 값을 채워넣습니다.
     ```
     # .env
     KAKAO_CLIENT_ID=your_kakao_client_id
     GOOGLE_CLIENT_ID=your_google_client_id
     GOOGLE_CLIENT_SECRET=your_google_client_secret
     SESSION_SECRET=your_session_secret
     JWT_SECRET=your_jwt_secret
     ```

### 3. 애플리케이션 실행 (Running the Application)
   ```bash
   npm start
   ```
   서버가 시작되면, 웹 브라우저에서 `http://localhost:3000` (또는 `server.js`에 설정된 포트)으로 접속할 수 있습니다.

---

## 📁 프로젝트 구조 (Project Structure)

```
.
├── image/              # 로고, 상품 이미지 등 에셋
├── node_modules/       # npm 패키지
├── .env                # 환경 변수 설정 파일
├── .env.example        # 환경 변수 예시 파일
├── admin.html          # 관리자 페이지
├── admin-script.js     # 관리자 페이지 스크립트
├── healthy.html        # 메인 페이지
├── package.json        # 프로젝트 정보 및 의존성
├── posts.json          # 게시판 데이터
├── products.json       # 상품 데이터
├── README.md           # 프로젝트 소개
├── script.js           # 메인 페이지 스크립트
├── server.js           # Express 백엔드 서버
├── style.css           # 공통 스타일시트
├── users.json          # 사용자 데이터
└── wealthy.html        # 상품 상세 페이지 (구현 중)
```

---

## 🌐 API 엔드포인트 (API Endpoints)

- `GET /api/products`: 모든 상품 목록 조회
- `GET /api/products/:id`: 특정 상품 상세 정보 조회
- `GET /api/posts`: 모든 게시글 목록 조회
- `POST /api/posts`: 새 게시글 작성
- `GET /api/posts/:id`: 특정 게시글 상세 정보 조회
- `DELETE /api/posts/:id`: 특정 게시글 삭제
- `POST /api/login`: 로컬 로그인
- `POST /api/signup`: 로컬 회원가입
- `GET /auth/google`: Google 소셜 로그인 요청
- `GET /auth/kakao`: Kakao 소셜 로그인 요청
- `GET /admin/users`: (관리자) 모든 사용자 정보 조회
- `POST /admin/settings`: (관리자) 사이트 설정 업데이트


