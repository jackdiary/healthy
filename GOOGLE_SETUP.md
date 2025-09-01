# 구글 로그인 설정 가이드

## 🚀 Google Cloud Console 설정

### 1. Google Cloud Console 접속
1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 구글 계정으로 로그인
3. 새 프로젝트 생성 또는 기존 프로젝트 선택

### 2. 프로젝트 생성
1. 상단의 **프로젝트 선택** 드롭다운 클릭
2. **새 프로젝트** 선택
3. **프로젝트 이름**: HealthyWealthy (또는 원하는 이름)
4. **조직**: 선택사항
5. **만들기** 클릭

### 3. Google+ API 활성화
1. **API 및 서비스** → **라이브러리** 메뉴
2. "Google+ API" 또는 "People API" 검색
3. **Google+ API** 선택 및 **사용** 클릭

### 4. OAuth 동의 화면 설정
1. **API 및 서비스** → **OAuth 동의 화면**
2. **외부** 선택 후 **만들기** 클릭
3. 필수 정보 입력:
   - **앱 이름**: HealthyWealthy
   - **사용자 지원 이메일**: 본인 이메일
   - **앱 도메인** (선택사항):
     - 홈페이지: `http://localhost:3000`
     - 개인정보처리방침: `http://localhost:3000/privacy`
     - 서비스 약관: `http://localhost:3000/terms`
   - **승인된 도메인**: `localhost`
   - **개발자 연락처**: 본인 이메일

### 5. 범위(Scopes) 설정
1. **범위 추가 또는 삭제** 클릭
2. 다음 범위 선택:
   - `../auth/userinfo.email`
   - `../auth/userinfo.profile`
   - `openid`
3. **업데이트** 클릭

### 6. 테스트 사용자 추가 (개발 중)
1. **테스트 사용자** 섹션
2. **사용자 추가** 클릭
3. 테스트할 구글 계정 이메일 추가

### 7. 사용자 인증 정보 생성
1. **API 및 서비스** → **사용자 인증 정보**
2. **사용자 인증 정보 만들기** → **OAuth 클라이언트 ID**
3. **애플리케이션 유형**: 웹 애플리케이션
4. **이름**: HealthyWealthy Web Client
5. **승인된 자바스크립트 원본**:
   - `http://localhost:3000`
   - 배포시: `https://yourdomain.com`
6. **승인된 리디렉션 URI**:
   - `http://localhost:3000/auth/google/callback`
   - 배포시: `https://yourdomain.com/auth/google/callback`
7. **만들기** 클릭

### 8. 클라이언트 ID 및 보안 비밀번호 확인
- **클라이언트 ID**: `123456789-abcdef.apps.googleusercontent.com`
- **클라이언트 보안 비밀번호**: `GOCSPX-abcdefghijk`

## ⚙️ 환경변수 설정

### .env 파일 수정
```bash
# 구글에서 발급받은 실제 키로 변경
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback

# 기타 설정
JWT_SECRET=매우_긴_보안키_32자_이상으로_설정하세요
PORT=3000
NODE_ENV=development
```

## 🧪 테스트 방법

### 1. 서버 실행
```bash
# 의존성 설치 (처음만)
npm install

# 서버 시작
npm start
```

### 2. 브라우저 테스트
1. `http://localhost:3000/healthy.html` 접속
2. "구글 로그인" 버튼 클릭
3. 구글 계정 선택 및 로그인
4. 권한 동의 화면에서 "허용" 클릭
5. 리다이렉트 후 자동 로그인 확인

### 3. 디버깅
- 브라우저 개발자 도구 → 콘솔 확인
- 서버 로그 확인
- 네트워크 탭에서 OAuth 흐름 확인

## 🔧 문제 해결

### 자주 발생하는 오류들

#### 1. "클라이언트 ID가 유효하지 않습니다"
- `.env` 파일의 `GOOGLE_CLIENT_ID` 확인
- Google Cloud Console의 클라이언트 ID와 일치 확인

#### 2. "redirect_uri_mismatch" 오류
- Google Cloud Console의 승인된 리디렉션 URI 확인
- `.env` 파일의 `GOOGLE_REDIRECT_URI`와 일치 확인
- 프로토콜(http/https) 정확성 확인

#### 3. "access_blocked" 오류
- OAuth 동의 화면 설정 완료 확인
- 테스트 사용자에 본인 이메일 추가 확인
- 앱 게시 상태 확인 (개발 중이면 테스트 사용자만 로그인 가능)

#### 4. "invalid_scope" 오류
- OAuth 동의 화면의 범위 설정 확인
- 필요한 스코프가 모두 추가되었는지 확인

#### 5. "API가 활성화되지 않음" 오류
- Google Cloud Console에서 Google+ API 또는 People API 활성화 확인

### 개발 중 주의사항

#### 앱 게시 상태
- **테스트** 상태: 최대 100명의 테스트 사용자만 로그인 가능
- **프로덕션** 상태: 모든 구글 사용자 로그인 가능 (검토 과정 필요)

#### 도메인 등록
- `localhost`는 개발용으로만 사용
- 배포시 실제 도메인 등록 필요

## 🚀 배포시 추가 설정

### 1. 환경변수 업데이트
```bash
GOOGLE_REDIRECT_URI=https://yourdomain.com/auth/google/callback
NODE_ENV=production
```

### 2. Google Cloud Console 설정 업데이트
- **승인된 자바스크립트 원본**에 배포 도메인 추가
- **승인된 리디렉션 URI**에 배포 URL 추가
- **OAuth 동의 화면**의 도메인 정보 업데이트

### 3. 앱 게시 (프로덕션용)
1. **OAuth 동의 화면** → **앱 게시**
2. Google의 검토 과정 진행 (민감한 범위 사용시)
3. 승인 완료 후 모든 사용자 로그인 가능

### 4. HTTPS 적용 필수
- 구글 로그인은 HTTPS에서만 정상 작동
- SSL 인증서 적용 필요

## 📊 사용자 데이터 구조

서버에 저장되는 구글 로그인 사용자 데이터:
```json
{
    "id": "google_123456789",
    "name": "홍길동",
    "email": "user@gmail.com",
    "provider": "google",
    "googleId": "123456789",
    "profileImage": "https://lh3.googleusercontent.com/...",
    "joinDate": "2025-01-01T00:00:00.000Z"
}
```

## 🔐 보안 고려사항

### 1. 클라이언트 보안 비밀번호
- 절대 클라이언트 코드에 노출 금지
- 서버에서만 사용
- 정기적 갱신 권장

### 2. 범위 최소화
- 필요한 권한만 요청
- 과도한 권한 요청 피하기

### 3. 토큰 관리
- 액세스 토큰 안전한 저장
- 만료 시간 확인 및 갱신
- 로그아웃시 토큰 폐기

### 4. 도메인 검증
- 승인된 도메인만 등록
- 개발/스테이징/프로덕션 환경 분리

## 📚 추가 리소스

### Google 공식 문서
- [OAuth 2.0 설정](https://developers.google.com/identity/protocols/oauth2)
- [Google+ API](https://developers.google.com/+/web/api/rest/)
- [People API](https://developers.google.com/people/)

### 구글 로그인 라이브러리
- [Google Sign-In JavaScript](https://developers.google.com/identity/sign-in/web/)
- [Google Identity Services](https://developers.google.com/identity/gsi/web/)

## 🔄 업그레이드 안내

### Google Identity Services 마이그레이션
Google+가 종료됨에 따라 새로운 [Google Identity Services](https://developers.google.com/identity/gsi/web/)로의 마이그레이션을 권장합니다.

## 📞 지원

문제 발생시:
1. [Google Cloud Console 지원](https://cloud.google.com/support) 확인
2. [Stack Overflow](https://stackoverflow.com/questions/tagged/google-oauth) 검색
3. GitHub Issues에 문제 보고