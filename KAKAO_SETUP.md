# 소셜 로그인 설정 가이드 (카카오 + 구글)

> 이 문서는 카카오 로그인 설정에 대한 가이드입니다.  
> 구글 로그인 설정은 [GOOGLE_SETUP.md](./GOOGLE_SETUP.md) 파일을 참조하세요.

## 🚀 카카오 개발자 콘솔 설정

### 1. 카카오 개발자 계정 생성
1. [카카오 개발자 콘솔](https://developers.kakao.com/console/app)에 접속
2. 카카오 계정으로 로그인
3. "내 애플리케이션" 메뉴에서 "애플리케이션 추가하기" 클릭

### 2. 애플리케이션 생성
1. **앱 이름**: HealthyWealthy (또는 원하는 이름)
2. **사업자명**: 개인 또는 회사명
3. 생성 완료 후 **앱 키** 확인 가능

### 3. 플랫폼 설정
1. 생성한 앱 선택 → **플랫폼** 탭
2. **Web 플랫폼 등록** 클릭
3. **사이트 도메인** 입력:
   - 개발용: `http://localhost:3000`
   - 배포용: `https://yourdomain.com`

### 4. 카카오 로그인 활성화
1. **제품 설정** → **카카오 로그인** 메뉴
2. **활성화 설정** ON
3. **OpenID Connect** 활성화 (선택사항)

### 5. Redirect URI 설정
1. **제품 설정** → **카카오 로그인** → **Redirect URI**
2. **Redirect URI 등록** 클릭
3. URI 입력: `http://localhost:3000/auth/kakao/callback`
4. 배포시: `https://yourdomain.com/auth/kakao/callback`

### 6. 동의항목 설정
1. **제품 설정** → **카카오 로그인** → **동의항목**
2. 필요한 정보 선택:
   - ✅ **닉네임** (필수)
   - ✅ **프로필 사진** (선택)
   - ✅ **카카오계정(이메일)** (선택)
   - ⚠️ **전화번호** (선택 - 사업자등록증 필요할 수 있음)

### 7. 앱 키 확인
- **REST API 키**: `your_kakao_rest_api_key_here`
- **JavaScript 키**: `your_kakao_javascript_key_here`
- **Admin 키**: 관리 작업용 (선택사항)

## ⚙️ 환경변수 설정

### 1. .env 파일 수정
```bash
# 카카오에서 발급받은 실제 키로 변경
KAKAO_REST_API_KEY=발급받은_REST_API_키
KAKAO_CLIENT_SECRET=발급받은_Client_Secret (선택사항)
KAKAO_REDIRECT_URI=http://localhost:3000/auth/kakao/callback

# JWT 보안키 (32자 이상 권장)
JWT_SECRET=매우_긴_보안키_32자_이상으로_설정하세요

# 서버 설정
PORT=3000
NODE_ENV=development
```

### 2. Client Secret 설정 (선택사항)
1. **보안** → **Client Secret** 메뉴
2. **코드 생성** 클릭
3. 생성된 코드를 `.env` 파일에 추가

## 📦 의존성 설치

```bash
# 프로젝트 디렉토리로 이동
cd /path/to/healthywealthy

# 의존성 설치
npm install

# 개발 모드로 서버 실행
npm run dev
```

## 🧪 테스트 방법

### 1. 서버 실행
```bash
npm start
```

### 2. 브라우저 테스트
1. `http://localhost:3000/healthy.html` 접속
2. "카카오 로그인" 버튼 클릭
3. 카카오 계정으로 로그인
4. 리다이렉트 후 자동 로그인 확인

### 3. 디버깅
- 브라우저 개발자 도구 → 콘솔 확인
- 서버 로그 확인
- 네트워크 탭에서 API 호출 상태 확인

## 🔧 문제 해결

### 자주 발생하는 오류들

#### 1. "앱 키가 유효하지 않습니다"
- `.env` 파일의 `KAKAO_REST_API_KEY` 확인
- 공백이나 특수문자 확인

#### 2. "Redirect URI 불일치"
- 카카오 콘솔의 Redirect URI와 `.env` 파일 일치 확인
- 프로토콜(http/https) 정확성 확인

#### 3. "동의 항목 오류"
- 카카오 콘솔에서 필요한 동의항목 활성화
- 앱 검수 상태 확인

#### 4. "CORS 오류"
- 카카오 콘솔의 플랫폼 도메인 설정 확인
- 서버 CORS 설정 확인

### 로그 확인 방법
```bash
# 서버 로그 확인
npm run dev

# 상세 로그 보기
LOG_LEVEL=debug npm run dev
```

## 🚀 배포시 추가 설정

### 1. 환경변수 업데이트
```bash
KAKAO_REDIRECT_URI=https://yourdomain.com/auth/kakao/callback
NODE_ENV=production
```

### 2. 카카오 콘솔 설정 업데이트
- 플랫폼에 배포 도메인 추가
- Redirect URI에 배포 URL 추가

### 3. HTTPS 적용 필수
- 카카오 로그인은 HTTPS에서만 정상 작동
- SSL 인증서 적용 필요

## 📝 추가 기능

### JWT 토큰 사용
```javascript
// 프론트엔드에서 토큰 사용 예시
const token = localStorage.getItem('authToken');

fetch('/api/protected-route', {
    headers: {
        'Authorization': `Bearer ${token}`
    }
});
```

### 사용자 정보 확장
서버의 사용자 데이터 구조:
```json
{
    "id": "kakao_123456789",
    "name": "홍길동",
    "email": "user@example.com",
    "provider": "kakao",
    "kakaoId": "123456789",
    "profileImage": "https://k.kakaocdn.net/...",
    "joinDate": "2025-01-01T00:00:00.000Z"
}
```

## 🔐 보안 고려사항

1. **Client Secret 사용**: 추가 보안을 위해 설정 권장
2. **JWT 토큰**: 안전한 키 사용 및 만료 시간 설정
3. **HTTPS 적용**: 배포시 필수
4. **환경변수 보안**: `.env` 파일 절대 공개 금지
5. **토큰 저장**: localStorage 대신 httpOnly 쿠키 고려

## 📞 지원

문제 발생시:
1. [카카오 개발자 문서](https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api) 확인
2. 개발자 콘솔의 오류 로그 확인
3. GitHub Issues에 문제 보고