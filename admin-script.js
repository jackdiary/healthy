document.addEventListener('DOMContentLoaded', () => {
    const mainTitleInput = document.getElementById('mainTitle');
    const backgroundColorInput = document.getElementById('backgroundColor');
    const saveSettingsButton = document.getElementById('saveSettings');

    // Load existing settings when the page loads
    const savedMainTitle = localStorage.getItem('mainTitle');
    const savedBackgroundColor = localStorage.getItem('backgroundColor');

    if (savedMainTitle) {
        mainTitleInput.value = savedMainTitle;
    }
    if (savedBackgroundColor) {
        backgroundColorInput.value = savedBackgroundColor;
    }

    saveSettingsButton.addEventListener('click', () => {
        const newMainTitle = mainTitleInput.value;
        const newBackgroundColor = backgroundColorInput.value;

        localStorage.setItem('mainTitle', newMainTitle);
        localStorage.setItem('backgroundColor', newBackgroundColor);

        alert('설정이 저장되었습니다!');
    });
});

// 전역 변수
let currentTab = 'dashboard';
let productsData = [];
let usersData = [];
let chatbotData = {};
let siteSettings = {};

// 페이지 초기화
document.addEventListener('DOMContentLoaded', function() {
    initializeAdmin();
    loadAllData();
    updateDashboard();
});

// ========== 초기화 함수 ==========
function initializeAdmin() {
    console.log('관리자 페이지 초기화 중...');

    // siteSettings 로드 (로컬 스토리지에서)
    const savedSiteSettings = localStorage.getItem('siteSettings');
    if (savedSiteSettings) {
        siteSettings = JSON.parse(savedSiteSettings);
    } else {
        // 기본 데이터 설정
        siteSettings = {
            siteTitle: '헬스케어',
            siteDescription: '당신의 건강한 라이프스타일을 위한 맞춤형 솔루션',
            heroTitle: '빠르고 정확한 헬스케어 정보',
            heroSubtitle: '어디가 불편하신가요? 신체 부위를 선택해주세요.',
            primaryColor: '#667eea',
            secondaryColor: '#764ba2',
            backgroundColor: '#f8faff',
            textColor: '#2c3e50'
        };
    }

    // 사용자 데이터 로드 (로컬 스토리지에서)
            const savedUsersData = localStorage.getItem('usersData');
            if (savedUsersData) {
                usersData = JSON.parse(savedUsersData);
            } else {
                // 기본 샘플 사용자 데이터
                usersData = [
                    { id: 1, name: '김건강', email: 'kim@example.com', joinDate: '2025-01-15', status: '활성' },
                    { id: 2, name: '이웰빙', email: 'lee@example.com', joinDate: '2025-01-20', status: '활성' },
                    { id: 3, name: '박라이프', email: 'park@example.com', joinDate: '2025-02-01', status: '비활성' },
                    { id: 4, name: '최케어', email: 'choi@example.com', joinDate: '2025-02-10', status: '활성' },
                    { id: 5, name: '정스타일', email: 'jung@example.com', joinDate: '2025-02-15', status: '활성' }
                ];
            }
}

// ========== 데이터 로드 ==========
async function loadAllData() {
    try {
        // products.json 파일 로드
        await loadProductsData();

        // 챗봇 데이터 로드 (로컬 스토리지에서)
        loadChatbotData();

        console.log('모든 데이터 로드 완료');
    } catch (error) {
        console.error('데이터 로드 실패:', error);
    }
}

async function loadProductsData() {
    try {
        const response = await fetch('./products.json');
        productsData = await response.json();
        console.log('상품 데이터 로드 완료:', productsData.length, '개');

        // 상품 테이블 업데이트
        updateProductsTable();
    } catch (error) {
        console.error('상품 데이터 로드 실패:', error);
        // 샘플 데이터로 대체
        productsData = [
            {
                id: 'sample-1',
                title: '샘플 상품 1',
                brand: '샘플 브랜드',
                category: '마사지기',
                price: '100000',
                part: '어깨'
            },
            {
                id: 'sample-2',
                title: '샘플 상품 2',
                brand: '샘플 브랜드',
                category: '건강보조식품',
                price: '50000',
                part: '무릎'
            }
        ];
        updateProductsTable();
    }
}

async function loadChatbotData() {
    try {
        const response = await fetch('./chatbot-responses.json');
        if (response.ok) {
            chatbotData = await response.json();
            console.log('챗봇 데이터 로드 완료 (from file)');
            return;
        }
    } catch (error) {
        console.warn('챗봇 파일 로드 실패, 로컬 스토리지 시도:', error);
    }

    const savedData = localStorage.getItem('chatbotData');
    if (savedData) {
        chatbotData = JSON.parse(savedData);
        console.log('챗봇 데이터 로드 완료 (from localStorage)');
    } else {
        // 기본 챗봇 데이터
        chatbotData = {
            "머리": {
                keywords: ["머리", "두피", "탈모", "모발"],
                response: "머리와 두피 건강에 대한 조언입니다.",
                products: ["breo-Scalp3", "LG-pralel-medi-hair"]
            },
            "어깨": {
                keywords: ["어깨", "목", "승모근"],
                response: "어깨와 목 건강에 대한 조언입니다.",
                products: ["HV-F311", "mini-shoulder-bodyfriend"]
            }
        };
        console.log('챗봇 데이터 로드 완료 (default)');
    }
}

// ========== 탭 관리 ==========
function showTab(tabName) {
    // 모든 탭 숨기기
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));

    // 모든 네비게이션 아이템 비활성화
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));

    // 선택된 탭 표시
    const selectedTab = document.getElementById(tabName + '-tab');
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    // 선택된 네비게이션 아이템 활성화
    const selectedNav = document.querySelector(`[onclick="showTab('${tabName}')"]`);
    if (selectedNav) {
        selectedNav.classList.add('active');
    }

    // 페이지 제목 업데이트
    const titles = {
        'dashboard': '대시보드',
        'products': '상품 관리',
        'users': '사용자 관리',
        'chatbot': '챗봇 관리',
        'site': '사이트 설정',
        'analytics': '분석'
    };

    document.getElementById('page-title').textContent = titles[tabName] || '관리자';
    currentTab = tabName;

    // 탭별 데이터 업데이트
    switch(tabName) {
        case 'dashboard':
            updateDashboard();
            break;
        case 'products':
            updateProductsTable();
            break;
        case 'users':
            updateUsersTable();
            break;
        case 'chatbot':
            updateChatbotTab();
            break;
        case 'site':
            updateSiteTab();
            break;
    }
}

// ========== 대시보드 업데이트 ==========
function updateDashboard() {
    // 통계 업데이트
    document.getElementById('total-products').textContent = productsData.length;
    document.getElementById('total-users').textContent = usersData.length;
    document.getElementById('chatbot-interactions').textContent = Math.floor(Math.random() * 1000) + 500; // 챗봇 상호작용은 임시 랜덤 값
    
    // 사이트 방문자 수 (localStorage에서 가져옴)
    const siteVisits = localStorage.getItem('site_visitor_count') || 0;
    document.getElementById('site-visits').textContent = parseInt(siteVisits).toLocaleString();

    // 최근 활동 업데이트 (실제로는 서버에서 가져와야 함)
    updateRecentActivity();
}

function updateRecentActivity() {
    const activities = [
        { time: '방금 전', text: '새로운 상품이 추가되었습니다.' },
        { time: '5분 전', text: '사용자가 회원가입했습니다.' },
        { time: '10분 전', text: '챗봇 응답이 업데이트되었습니다.' },
        { time: '15분 전', text: '상품 정보가 수정되었습니다.' },
        { time: '30분 전', text: '새로운 주문이 접수되었습니다.' }
    ];

    const activityList = document.getElementById('recent-activity');
    activityList.innerHTML = '';

    activities.forEach(activity => {
        const item = document.createElement('div');
        item.className = 'activity-item';
        item.innerHTML = `
            <span class="activity-time">${activity.time}</span>
            <span class="activity-text">${activity.text}</span>
        `;
        activityList.appendChild(item);
    });
}

// ========== 상품 관리 ==========
function updateProductsTable() {
    const tbody = document.getElementById('products-tbody');
    tbody.innerHTML = '';

    productsData.forEach((product, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.title}</td>
            <td>${product.brand}</td>
            <td>${product.category}</td>
            <td>${parseInt(product.price).toLocaleString()}원</td>
            <td>${product.part}</td>
            <td class="table-actions">
                <button class="btn btn-small btn-secondary" onclick="editProduct(${index})">수정</button>
                <button class="btn btn-small btn-danger" onclick="deleteProduct(${index})">삭제</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function addNewProduct() {
    showModal('새 상품 추가', `
        <div class="form-grid">
            <div class="form-group">
                <label>상품 ID</label>
                <input type="text" id="product-id" placeholder="고유한 상품 ID">
            </div>
            <div class="form-group">
                <label>상품명</label>
                <input type="text" id="product-title" placeholder="상품명을 입력하세요">
            </div>
            <div class="form-group">
                <label>브랜드</label>
                <input type="text" id="product-brand" placeholder="브랜드명">
            </div>
            <div class="form-group">
                <label>카테고리</label>
                <select id="product-category">
                    <option value="마사지기">마사지기</option>
                    <option value="건강보조식품">건강보조식품</option>
                </select>
            </div>
            <div class="form-group">
                <label>가격</label>
                <input type="number" id="product-price" placeholder="가격 (원)">
            </div>
            <div class="form-group">
                <label>신체 부위</label>
                <select id="product-part">
                    <option value="머리">머리</option>
                    <option value="어깨">어깨</option>
                    <option value="가슴">가슴</option>
                    <option value="복부">복부</option>
                    <option value="손">손</option>
                    <option value="허벅지">허벅지</option>
                    <option value="무릎">무릎</option>
                    <option value="발">발</option>
                </select>
            </div>
            <div class="form-group full-width">
                <label>상품 설명</label>
                <textarea id="product-description" placeholder="상품 설명을 입력하세요"></textarea>
            </div>
            <div class="form-group full-width">
                <label>이미지 URL</label>
                <input type="url" id="product-image" placeholder="https://example.com/image.jpg">
            </div>
            <div class="form-group full-width">
                <label>구매 링크</label>
                <input type="url" id="product-link" placeholder="https://example.com/product">
            </div>
        </div>
    `, 'saveNewProduct');
}

function editProduct(index) {
    const product = productsData[index];
    showModal('상품 수정', `
        <div class="form-grid">
            <input type="hidden" id="edit-product-index" value="${index}">
            <div class="form-group">
                <label>상품 ID</label>
                <input type="text" id="product-id" value="${product.id}">
            </div>
            <div class="form-group">
                <label>상품명</label>
                <input type="text" id="product-title" value="${product.title}">
            </div>
            <div class="form-group">
                <label>브랜드</label>
                <input type="text" id="product-brand" value="${product.brand}">
            </div>
            <div class="form-group">
                <label>카테고리</label>
                <select id="product-category">
                    <option value="마사지기" ${product.category === '마사지기' ? 'selected' : ''}>마사지기</option>
                    <option value="건강보조식품" ${product.category === '건강보조식품' ? 'selected' : ''}>건강보조식품</option>
                </select>
            </div>
            <div class="form-group">
                <label>가격</label>
                <input type="number" id="product-price" value="${product.price}">
            </div>
            <div class="form-group">
                <label>신체 부위</label>
                <select id="product-part">
                    <option value="머리" ${product.part === '머리' ? 'selected' : ''}>머리</option>
                    <option value="어깨" ${product.part === '어깨' ? 'selected' : ''}>어깨</option>
                    <option value="가슴" ${product.part === '가슴' ? 'selected' : ''}>가슴</option>
                    <option value="복부" ${product.part === '복부' ? 'selected' : ''}>복부</option>
                    <option value="손" ${product.part === '손' ? 'selected' : ''}>손</option>
                    <option value="허벅지" ${product.part === '허벅지' ? 'selected' : ''}>허벅지</option>
                    <option value="무릎" ${product.part === '무릎' ? 'selected' : ''}>무릎</option>
                    <option value="발" ${product.part === '발' ? 'selected' : ''}>발</option>
                </select>
            </div>
            <div class="form-group full-width">
                <label>상품 설명</label>
                <textarea id="product-description">${product.description || ''}</textarea>
            </div>
            <div class="form-group full-width">
                <label>이미지 URL</label>
                <input type="url" id="product-image" value="${product.image || ''}">
            </div>
            <div class="form-group full-width">
                <label>구매 링크</label>
                <input type="url" id="product-link" value="${product.link || ''}">
            </div>
        </div>
    `, 'saveEditProduct');
}

function deleteProduct(index) {
    if (confirm('정말로 이 상품을 삭제하시겠습니까?')) {
        productsData.splice(index, 1);
        updateProductsTable();
        showNotification('상품이 삭제되었습니다.', 'success');
    }
}

function saveNewProduct() {
    const newProduct = {
        id: document.getElementById('product-id').value,
        title: document.getElementById('product-title').value,
        brand: document.getElementById('product-brand').value,
        category: document.getElementById('product-category').value,
        price: document.getElementById('product-price').value,
        part: document.getElementById('product-part').value,
        description: document.getElementById('product-description').value,
        image: document.getElementById('product-image').value,
        link: document.getElementById('product-link').value,
        colors: []
    };

    if (!newProduct.id || !newProduct.title) {
        alert('상품 ID와 상품명은 필수입니다.');
        return;
    }

    productsData.push(newProduct);
    updateProductsTable();
    closeModal();
    showNotification('새 상품이 추가되었습니다.', 'success');
}

function saveEditProduct() {
    const index = document.getElementById('edit-product-index').value;
    const editedProduct = {
        id: document.getElementById('product-id').value,
        title: document.getElementById('product-title').value,
        brand: document.getElementById('product-brand').value,
        category: document.getElementById('product-category').value,
        price: document.getElementById('product-price').value,
        part: document.getElementById('product-part').value,
        description: document.getElementById('product-description').value,
        image: document.getElementById('product-image').value,
        link: document.getElementById('product-link').value,
        colors: productsData[index].colors || []
    };

    if (!editedProduct.id || !editedProduct.title) {
        alert('상품 ID와 상품명은 필수입니다.');
        return;
    }

    productsData[index] = editedProduct;
    updateProductsTable();
    closeModal();
    showNotification('상품이 수정되었습니다.', 'success');
}

// ========== 사용자 관리 ==========
function updateUsersTable() {
    const tbody = document.getElementById('users-tbody');
    tbody.innerHTML = '';

    usersData.forEach((user, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.joinDate}</td>
            <td>
                <span class="status ${user.status === '활성' ? 'active' : 'inactive'}">${user.status}</span>
            </td>
            <td class="table-actions">
                <button class="btn btn-small btn-secondary" onclick="editUser(${index})">수정</button>
                <button class="btn btn-small btn-danger" onclick="deleteUser(${index})">삭제</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function addNewUser() {
    showModal('새 사용자 추가', `
        <div class="form-grid">
            <div class="form-group">
                <label>이름</label>
                <input type="text" id="user-name" placeholder="사용자 이름">
            </div>
            <div class="form-group">
                <label>이메일</label>
                <input type="email" id="user-email" placeholder="user@example.com">
            </div>
            <div class="form-group">
                <label>상태</label>
                <select id="user-status">
                    <option value="활성">활성</option>
                    <option value="비활성">비활성</option>
                </select>
            </div>
        </div>
    `, 'saveNewUser');
}

function saveNewUser() {
    const newUser = {
        id: usersData.length + 1,
        name: document.getElementById('user-name').value,
        email: document.getElementById('user-email').value,
        joinDate: new Date().toISOString().split('T')[0],
        status: document.getElementById('user-status').value
    };

    if (!newUser.name || !newUser.email) {
        alert('이름과 이메일은 필수입니다.');
        return;
    }

    usersData.push(newUser);
    saveUsersDataToLocalStorage(); // Save to localStorage
    updateUsersTable();
    closeModal();
    showNotification('새 사용자가 추가되었습니다.', 'success');
}

function deleteUser(index) {
    if (confirm('정말로 이 사용자를 삭제하시겠습니까?')) {
        usersData.splice(index, 1);
        saveUsersDataToLocalStorage(); // Save to localStorage
        updateUsersTable();
        showNotification('사용자가 삭제되었습니다.', 'success');
    }
}

function saveEditUser() {
    const index = document.getElementById('edit-user-index').value;
    const editedUser = {
        id: usersData[index].id, // Assuming ID is not editable
        name: document.getElementById('user-name').value,
        email: document.getElementById('user-email').value,
        joinDate: usersData[index].joinDate, // Assuming joinDate is not editable
        status: document.getElementById('user-status').value
    };

    if (!editedUser.name || !editedUser.email) {
        alert('이름과 이메일은 필수입니다.');
        return;
    }

    usersData[index] = editedUser;
    saveUsersDataToLocalStorage(); // Save to localStorage
    updateUsersTable();
    closeModal();
    showNotification('사용자 정보가 수정되었습니다.', 'success');
}

// ========== 챗봇 관리 ==========
function updateChatbotTab() {
    // 챗봇 데이터 폼 초기화
    document.getElementById('body-part-select').value = '';
    document.getElementById('chatbot-keywords').value = '';
    document.getElementById('chatbot-response').value = '';
    document.getElementById('chatbot-products').value = '';
}

function loadBodyPartResponse() {
    const selectedPart = document.getElementById('body-part-select').value;
    if (selectedPart && chatbotData[selectedPart]) {
        const data = chatbotData[selectedPart];
        document.getElementById('chatbot-keywords').value = data.keywords.join(', ');
        document.getElementById('chatbot-response').value = data.response;
        document.getElementById('chatbot-products').value = data.products.join(', ');
    }
}

function saveChatbotResponse() {
    const selectedPart = document.getElementById('body-part-select').value;
    if (!selectedPart) {
        alert('신체 부위를 선택해주세요.');
        return;
    }

    const keywords = document.getElementById('chatbot-keywords').value.split(',').map(k => k.trim());
    const response = document.getElementById('chatbot-response').value;
    const products = document.getElementById('chatbot-products').value.split(',').map(p => p.trim());

    chatbotData[selectedPart] = {
        keywords: keywords,
        response: response,
        products: products
    };

    // 로컬 스토리지에 저장
    localStorage.setItem('chatbotData', JSON.stringify(chatbotData));

    showNotification('챗봇 응답이 저장되었습니다.', 'success');
}

// ========== 사이트 설정 ==========
function updateSiteTab() {
    document.getElementById('site-title').value = siteSettings.title;
    document.getElementById('site-description').value = siteSettings.description;
    document.getElementById('hero-title').value = siteSettings.heroTitle;
    document.getElementById('hero-subtitle').value = siteSettings.heroSubtitle;
    document.getElementById('primary-color').value = siteSettings.primaryColor;
    document.getElementById('secondary-color').value = siteSettings.secondaryColor;
    document.getElementById('background-color').value = siteSettings.backgroundColor;
    document.getElementById('text-color').value = siteSettings.textColor;
}

function saveSiteSettings() {
    siteSettings = {
        title: document.getElementById('site-title').value,
        description: document.getElementById('site-description').value,
        heroTitle: document.getElementById('hero-title').value,
        heroSubtitle: document.getElementById('hero-subtitle').value,
        primaryColor: document.getElementById('primary-color').value,
        secondaryColor: document.getElementById('secondary-color').value,
        backgroundColor: document.getElementById('background-color').value,
        textColor: document.getElementById('text-color').value
    };

    // 로컬 스토리지에 저장
    localStorage.setItem('siteSettings', JSON.stringify(siteSettings));

    showNotification('사이트 설정이 저장되었습니다.', 'success');
}

// ========== 모달 관리 ==========
function showModal(title, content, saveAction = null) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = content;

    const saveBtn = document.getElementById('modal-save-btn');
    if (saveAction) {
        saveBtn.style.display = 'block';
        saveBtn.onclick = function() {
            if (typeof window[saveAction] === 'function') {
                window[saveAction]();
            }
        };
    } else {
        saveBtn.style.display = 'none';
    }

    document.getElementById('modal-overlay').classList.add('active');
}

function closeModal() {
    document.getElementById('modal-overlay').classList.remove('active');
}

function saveModal() {
    // 현재 모달의 저장 액션 실행
    // 이 함수는 showModal에서 동적으로 설정됨
}

// ========== 유틸리티 함수 ==========
function showNotification(message, type = 'info') {
    // 간단한 알림 표시
    alert(message);
}

function saveAllChanges() {
    // 모든 변경사항을 JSON 파일로 다운로드
    downloadJSON(productsData, 'products.json');
    downloadJSON(chatbotData, 'chatbot-responses.json');
    // siteSettings는 이미 localStorage에 저장됨

    showNotification('모든 변경사항이 JSON 파일로 다운로드되었습니다. 웹사이트에 반영하려면 해당 파일을 서버에 수동으로 업로드해야 합니다.', 'success');
}

function downloadJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function previewSite() {
    // 새 창에서 메인 사이트 열기
    window.open('./healthy.html', '_blank');
}

function exportProducts() {
    downloadJSON(productsData, 'products_backup.json');
    showNotification('상품 데이터가 내보내졌습니다.', 'success');
}

function exportUsers() {
    downloadJSON(usersData, 'users_backup.json');
    showNotification('사용자 데이터가 내보내졌습니다.', 'success');
}

function importProducts() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const importedData = JSON.parse(e.target.result);
                    productsData = importedData;
                    updateProductsTable();
                    showNotification('상품 데이터가 가져와졌습니다.', 'success');
                } catch (error) {
                    alert('파일 형식이 올바르지 않습니다.');
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

// ========== 사용자 데이터 로컬 스토리지 저장 ==========
function saveUsersDataToLocalStorage() {
    localStorage.setItem('usersData', JSON.stringify(usersData));
    console.log('사용자 데이터가 로컬 스토리지에 저장되었습니다.');
}

// 클릭 이벤트 등록
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-overlay')) {
        closeModal();
    }
});
