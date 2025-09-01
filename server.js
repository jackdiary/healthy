// Node.js 서버 파일 - 회원 데이터 JSON 파일 관리
require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const axios = require('axios');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const USERS_FILE = path.join(__dirname, 'users.json');
const POSTS_FILE = path.join(__dirname, 'posts.json');

// 카카오 API 설정
const KAKAO_CONFIG = {
    REST_API_KEY: process.env.KAKAO_REST_API_KEY,
    CLIENT_SECRET: process.env.KAKAO_CLIENT_SECRET,
    REDIRECT_URI: process.env.KAKAO_REDIRECT_URI
};

// 구글 API 설정
const GOOGLE_CONFIG = {
    CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI
};

// 미들웨어 설정
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname)); // 정적 파일 제공

// 사용자 데이터 로드 함수
function loadUsers() {
    try {
        if (fs.existsSync(USERS_FILE)) {
            const data = fs.readFileSync(USERS_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('사용자 데이터 로드 실패:', error);
    }
    return [];
}

// 사용자 데이터 저장 함수
function saveUsers(users) {
    try {
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('사용자 데이터 저장 실패:', error);
        return false;
    }
}

// 게시글 데이터 로드 함수
function loadPosts() {
    try {
        if (fs.existsSync(POSTS_FILE)) {
            const data = fs.readFileSync(POSTS_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('게시글 데이터 로드 실패:', error);
    }
    return [];
}

// 게시글 데이터 저장 함수
function savePosts(posts) {
    try {
        fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('게시글 데이터 저장 실패:', error);
        return false;
    }
}

// 회원가입 API
app.post('/api/signup', (req, res) => {
    try {
        const { name, email, password, phone, birth, agreeMarketing } = req.body;
        
        // 데이터 유효성 검사
        if (!name || !email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: '필수 정보가 누락되었습니다.' 
            });
        }
        
        const users = loadUsers();
        
        // 중복 이메일 체크
        if (users.find(user => user.email === email)) {
            return res.status(409).json({ 
                success: false, 
                message: '이미 가입된 이메일입니다.' 
            });
        }
        
        // 새 사용자 생성
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password, // 실제 운영 환경에서는 암호화 필요
            phone: phone || '',
            birth: birth || '',
            agreeMarketing: agreeMarketing || false,
            joinDate: new Date().toISOString()
        };
        
        users.push(newUser);
        
        if (saveUsers(users)) {
            // 비밀번호 제거하고 응답
            const { password: _, ...userResponse } = newUser;
            res.json({ 
                success: true, 
                message: '회원가입이 완료되었습니다.',
                user: userResponse 
            });
        } else {
            res.status(500).json({ 
                success: false, 
                message: '회원가입 처리 중 오류가 발생했습니다.' 
            });
        }
        
    } catch (error) {
        console.error('회원가입 처리 오류:', error);
        res.status(500).json({ 
            success: false, 
            message: '서버 오류가 발생했습니다.' 
        });
    }
});

// 로그인 API
app.post('/api/login', (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: '이메일과 비밀번호를 입력해주세요.' 
            });
        }
        
        const users = loadUsers();
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // 비밀번호 제거하고 응답
            const { password: _, ...userResponse } = user;
            res.json({ 
                success: true, 
                message: '로그인 성공',
                user: userResponse 
            });
        } else {
            res.status(401).json({ 
                success: false, 
                message: '이메일 또는 비밀번호가 올바르지 않습니다.' 
            });
        }
        
    } catch (error) {
        console.error('로그인 처리 오류:', error);
        res.status(500).json({ 
            success: false, 
            message: '서버 오류가 발생했습니다.' 
        });
    }
});

// 모든 사용자 조회 API (관리자용)
app.get('/api/users', (req, res) => {
    try {
        const users = loadUsers();
        // 비밀번호 제거
        const safeUsers = users.map(({ password, ...user }) => user);
        res.json({ 
            success: true, 
            users: safeUsers 
        });
    } catch (error) {
        console.error('사용자 목록 조회 오류:', error);
        res.status(500).json({ 
            success: false, 
            message: '서버 오류가 발생했습니다.' 
        });
    }
});

// 사용자 삭제 API (관리자용)
app.delete('/api/users/:id', (req, res) => {
    try {
        const { id } = req.params;
        const users = loadUsers();
        const filteredUsers = users.filter(user => user.id !== id);
        
        if (users.length === filteredUsers.length) {
            return res.status(404).json({ 
                success: false, 
                message: '사용자를 찾을 수 없습니다.' 
            });
        }
        
        if (saveUsers(filteredUsers)) {
            res.json({ 
                success: true, 
                message: '사용자가 삭제되었습니다.' 
            });
        } else {
            res.status(500).json({ 
                success: false, 
                message: '사용자 삭제 중 오류가 발생했습니다.' 
            });
        }
        
    } catch (error) {
        console.error('사용자 삭제 오류:', error);
        res.status(500).json({ 
            success: false, 
            message: '서버 오류가 발생했습니다.' 
        });
    }
});

// ==================== 게시판 API ====================

// 게시글 목록 조회 API
app.get('/api/posts', (req, res) => {
    try {
        const posts = loadPosts();
        // 최신순으로 정렬
        const sortedPosts = posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        res.json({ 
            success: true, 
            posts: sortedPosts 
        });
    } catch (error) {
        console.error('게시글 목록 조회 오류:', error);
        res.status(500).json({ 
            success: false, 
            message: '서버 오류가 발생했습니다.' 
        });
    }
});

// 게시글 작성 API (로그인 사용자만)
app.post('/api/posts', (req, res) => {
    try {
        const { title, content, author } = req.body;
        
        // 데이터 유효성 검사
        if (!title || !content || !author) {
            return res.status(400).json({ 
                success: false, 
                message: '제목, 내용, 작성자 정보가 필요합니다.' 
            });
        }
        
        // 작성자가 실제 가입된 사용자인지 확인
        const users = loadUsers();
        const userExists = users.find(user => user.name === author || user.email === author);
        
        if (!userExists) {
            return res.status(401).json({ 
                success: false, 
                message: '로그인한 사용자만 글을 작성할 수 있습니다.' 
            });
        }
        
        const posts = loadPosts();
        
        // 새 게시글 생성
        const newPost = {
            id: Date.now().toString(),
            title,
            content,
            author: userExists.name,
            authorId: userExists.id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            views: 0
        };
        
        posts.push(newPost);
        
        if (savePosts(posts)) {
            res.json({ 
                success: true, 
                message: '게시글이 작성되었습니다.',
                post: newPost 
            });
        } else {
            res.status(500).json({ 
                success: false, 
                message: '게시글 저장 중 오류가 발생했습니다.' 
            });
        }
        
    } catch (error) {
        console.error('게시글 작성 오류:', error);
        res.status(500).json({ 
            success: false, 
            message: '서버 오류가 발생했습니다.' 
        });
    }
});

// 게시글 상세 조회 API
app.get('/api/posts/:id', (req, res) => {
    try {
        const { id } = req.params;
        const posts = loadPosts();
        const post = posts.find(p => p.id === id);
        
        if (!post) {
            return res.status(404).json({ 
                success: false, 
                message: '게시글을 찾을 수 없습니다.' 
            });
        }
        
        // 조회수 증가
        post.views = (post.views || 0) + 1;
        savePosts(posts);
        
        res.json({ 
            success: true, 
            post 
        });
        
    } catch (error) {
        console.error('게시글 조회 오류:', error);
        res.status(500).json({ 
            success: false, 
            message: '서버 오류가 발생했습니다.' 
        });
    }
});

// 게시글 삭제 API (작성자만)
app.delete('/api/posts/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { authorId } = req.body;
        
        if (!authorId) {
            return res.status(401).json({ 
                success: false, 
                message: '권한이 없습니다.' 
            });
        }
        
        const posts = loadPosts();
        const postIndex = posts.findIndex(p => p.id === id);
        
        if (postIndex === -1) {
            return res.status(404).json({ 
                success: false, 
                message: '게시글을 찾을 수 없습니다.' 
            });
        }
        
        const post = posts[postIndex];
        
        // 작성자 본인만 삭제 가능
        if (post.authorId !== authorId) {
            return res.status(403).json({ 
                success: false, 
                message: '작성자만 삭제할 수 있습니다.' 
            });
        }
        
        posts.splice(postIndex, 1);
        
        if (savePosts(posts)) {
            res.json({ 
                success: true, 
                message: '게시글이 삭제되었습니다.' 
            });
        } else {
            res.status(500).json({ 
                success: false, 
                message: '게시글 삭제 중 오류가 발생했습니다.' 
            });
        }
        
    } catch (error) {
        console.error('게시글 삭제 오류:', error);
        res.status(500).json({ 
            success: false, 
            message: '서버 오류가 발생했습니다.' 
        });
    }
});

// ==================== 카카오 로그인 API ====================

// 카카오 로그인 URL 생성
app.get('/auth/kakao', (req, res) => {
    try {
        const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_CONFIG.REST_API_KEY}&redirect_uri=${encodeURIComponent(KAKAO_CONFIG.REDIRECT_URI)}`;
        
        res.redirect(kakaoAuthURL);
    } catch (error) {
        console.error('카카오 로그인 URL 생성 오류:', error);
        res.status(500).json({ 
            success: false, 
            message: '카카오 로그인 초기화 실패' 
        });
    }
});

// 카카오 로그인 콜백 처리
app.get('/auth/kakao/callback', async (req, res) => {
    try {
        const { code, error } = req.query;
        
        if (error) {
            console.error('카카오 인증 오류:', error);
            return res.redirect('/healthy.html?error=kakao_auth_failed');
        }
        
        if (!code) {
            return res.redirect('/healthy.html?error=no_auth_code');
        }
        
        // 1. 인증 코드로 액세스 토큰 요청
        const tokenResponse = await axios.post('https://kauth.kakao.com/oauth/token', {
            grant_type: 'authorization_code',
            client_id: KAKAO_CONFIG.REST_API_KEY,
            client_secret: KAKAO_CONFIG.CLIENT_SECRET,
            redirect_uri: KAKAO_CONFIG.REDIRECT_URI,
            code: code
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        
        const { access_token } = tokenResponse.data;
        
        // 2. 액세스 토큰으로 사용자 정보 요청
        const userResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        });
        
        const kakaoUser = userResponse.data;
        const { id, kakao_account } = kakaoUser;
        
        // 3. 사용자 정보 처리
        const userData = {
            id: `kakao_${id}`,
            name: kakao_account?.profile?.nickname || `카카오사용자${id}`,
            email: kakao_account?.email || `kakao_${id}@kakao.local`,
            phone: kakao_account?.phone_number || '',
            birth: '',
            agreeMarketing: false,
            joinDate: new Date().toISOString(),
            provider: 'kakao',
            kakaoId: id,
            profileImage: kakao_account?.profile?.profile_image_url || ''
        };
        
        // 4. 기존 사용자 확인 및 저장
        const users = loadUsers();
        let existingUser = users.find(user => user.kakaoId === id);
        
        if (!existingUser) {
            // 새 사용자 등록
            users.push(userData);
            if (!saveUsers(users)) {
                throw new Error('사용자 데이터 저장 실패');
            }
            existingUser = userData;
        } else {
            // 기존 사용자 정보 업데이트
            existingUser.name = userData.name;
            existingUser.profileImage = userData.profileImage;
            existingUser.lastLoginDate = new Date().toISOString();
            
            if (!saveUsers(users)) {
                throw new Error('사용자 데이터 업데이트 실패');
            }
        }
        
        // 5. JWT 토큰 생성 (선택사항)
        let token = null;
        if (process.env.JWT_SECRET) {
            token = jwt.sign(
                { 
                    userId: existingUser.id, 
                    provider: 'kakao' 
                }, 
                process.env.JWT_SECRET, 
                { expiresIn: '7d' }
            );
        }
        
        // 6. 프론트엔드로 리다이렉트 (사용자 정보 포함)
        const { password, ...safeUserData } = existingUser;
        const userData64 = Buffer.from(JSON.stringify(safeUserData)).toString('base64');
        const redirectURL = `/healthy.html?kakao_login=success&user=${encodeURIComponent(userData64)}${token ? `&token=${token}` : ''}`;
        
        res.redirect(redirectURL);
        
    } catch (error) {
        console.error('카카오 로그인 콜백 처리 오류:', error);
        res.redirect('/healthy.html?error=kakao_login_failed');
    }
});

// 카카오 로그아웃
app.post('/auth/kakao/logout', async (req, res) => {
    try {
        const { access_token } = req.body;
        
        if (access_token) {
            // 카카오 로그아웃 API 호출
            await axios.post('https://kapi.kakao.com/v1/user/logout', {}, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            });
        }
        
        res.json({ 
            success: true, 
            message: '카카오 로그아웃 성공' 
        });
        
    } catch (error) {
        console.error('카카오 로그아웃 오류:', error);
        res.json({ 
            success: true, 
            message: '로그아웃 완료 (카카오 API 오류 무시)' 
        });
    }
});

// ==================== 구글 로그인 API ====================

// 구글 로그인 URL 생성
app.get('/auth/google', (req, res) => {
    try {
        const scope = 'openid profile email';
        const googleAuthURL = `https://accounts.google.com/oauth2/auth?response_type=code&client_id=${GOOGLE_CONFIG.CLIENT_ID}&redirect_uri=${encodeURIComponent(GOOGLE_CONFIG.REDIRECT_URI)}&scope=${encodeURIComponent(scope)}&access_type=offline`;
        
        res.redirect(googleAuthURL);
    } catch (error) {
        console.error('구글 로그인 URL 생성 오류:', error);
        res.status(500).json({ 
            success: false, 
            message: '구글 로그인 초기화 실패' 
        });
    }
});

// 구글 로그인 콜백 처리
app.get('/auth/google/callback', async (req, res) => {
    try {
        const { code, error } = req.query;
        
        if (error) {
            console.error('구글 인증 오류:', error);
            return res.redirect('/healthy.html?error=google_auth_failed');
        }
        
        if (!code) {
            return res.redirect('/healthy.html?error=no_auth_code');
        }
        
        // 1. 인증 코드로 액세스 토큰 요청
        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
            grant_type: 'authorization_code',
            client_id: GOOGLE_CONFIG.CLIENT_ID,
            client_secret: GOOGLE_CONFIG.CLIENT_SECRET,
            redirect_uri: GOOGLE_CONFIG.REDIRECT_URI,
            code: code
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        
        const { access_token, id_token } = tokenResponse.data;
        
        // 2. 액세스 토큰으로 사용자 정보 요청
        const userResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        });
        
        const googleUser = userResponse.data;
        const { id, name, email, picture, given_name, family_name } = googleUser;
        
        // 3. 사용자 정보 처리
        const userData = {
            id: `google_${id}`,
            name: name || `${given_name || ''} ${family_name || ''}`.trim() || `구글사용자${id}`,
            email: email || `google_${id}@gmail.local`,
            phone: '',
            birth: '',
            agreeMarketing: false,
            joinDate: new Date().toISOString(),
            provider: 'google',
            googleId: id,
            profileImage: picture || ''
        };
        
        // 4. 기존 사용자 확인 및 저장
        const users = loadUsers();
        let existingUser = users.find(user => user.googleId === id);
        
        if (!existingUser) {
            // 새 사용자 등록
            users.push(userData);
            if (!saveUsers(users)) {
                throw new Error('사용자 데이터 저장 실패');
            }
            existingUser = userData;
        } else {
            // 기존 사용자 정보 업데이트
            existingUser.name = userData.name;
            existingUser.profileImage = userData.profileImage;
            existingUser.lastLoginDate = new Date().toISOString();
            
            if (!saveUsers(users)) {
                throw new Error('사용자 데이터 업데이트 실패');
            }
        }
        
        // 5. JWT 토큰 생성 (선택사항)
        let token = null;
        if (process.env.JWT_SECRET) {
            token = jwt.sign(
                { 
                    userId: existingUser.id, 
                    provider: 'google' 
                }, 
                process.env.JWT_SECRET, 
                { expiresIn: '7d' }
            );
        }
        
        // 6. 프론트엔드로 리다이렉트 (사용자 정보 포함)
        const { password, ...safeUserData } = existingUser;
        const userData64 = Buffer.from(JSON.stringify(safeUserData)).toString('base64');
        const redirectURL = `/healthy.html?google_login=success&user=${encodeURIComponent(userData64)}${token ? `&token=${token}` : ''}`;
        
        res.redirect(redirectURL);
        
    } catch (error) {
        console.error('구글 로그인 콜백 처리 오류:', error);
        res.redirect('/healthy.html?error=google_login_failed');
    }
});

// 구글 로그아웃
app.post('/auth/google/logout', async (req, res) => {
    try {
        const { access_token } = req.body;
        
        if (access_token) {
            // 구글 토큰 폐기 API 호출
            await axios.post(`https://oauth2.googleapis.com/revoke?token=${access_token}`, {}, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
        }
        
        res.json({ 
            success: true, 
            message: '구글 로그아웃 성공' 
        });
        
    } catch (error) {
        console.error('구글 로그아웃 오류:', error);
        res.json({ 
            success: true, 
            message: '로그아웃 완료 (구글 API 오류 무시)' 
        });
    }
});

// 토큰 검증 미들웨어
function verifyToken(req, res, next) {
    const token = req.headers['authorization']?.replace('Bearer ', '');
    
    if (!token || !process.env.JWT_SECRET) {
        return next();
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ 
            success: false, 
            message: '유효하지 않은 토큰' 
        });
    }
}

// 서버 시작
app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
    console.log(`회원 데이터는 ${USERS_FILE} 파일에 저장됩니다.`);
    
    // 환경변수 검증
    if (!KAKAO_CONFIG.REST_API_KEY || KAKAO_CONFIG.REST_API_KEY === 'your_kakao_rest_api_key_here') {
        console.warn('⚠️  카카오 REST API 키가 설정되지 않았습니다. .env 파일을 확인하세요.');
    }
    
    if (!GOOGLE_CONFIG.CLIENT_ID || GOOGLE_CONFIG.CLIENT_ID === 'your_google_client_id_here') {
        console.warn('⚠️  구글 Client ID가 설정되지 않았습니다. .env 파일을 확인하세요.');
    }
    
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your_jwt_secret_key_here') {
        console.warn('⚠️  JWT_SECRET이 설정되지 않았습니다. 보안을 위해 설정을 권장합니다.');
    }
});

module.exports = app;