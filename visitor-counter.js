// 접속자 수 카운터 전용 JavaScript 파일
console.log('접속자 카운터 스크립트 로드됨');

// 즉시 실행 함수로 전역 스코프 오염 방지
(function() {
    const STORAGE_KEY = 'site_visitor_count';
    let visitorCount = parseInt(localStorage.getItem(STORAGE_KEY)) || 0;

    // 페이지 로드 시마다 방문자 수 증가
    visitorCount++;
    localStorage.setItem(STORAGE_KEY, visitorCount);

    function updateCount() {
        // 이 부분은 실제 방문자 수 증가 로직이 아니라,
        // 페이지에 표시되는 숫자를 동적으로 보이게 하기 위한 부분입니다.
        // 실제 누적 방문자 수는 visitorCount 변수에 저장됩니다.
        const element = document.getElementById('visitor-count');
        if (element) {
            element.textContent = visitorCount.toLocaleString();
            console.log('접속자 수 업데이트:', visitorCount.toLocaleString());
        } else {
            // console.log('visitor-count 요소를 찾을 수 없음'); // 이 로그는 너무 자주 나와서 주석 처리
        }
    }

    function startCounter() {
        console.log('접속자 카운터 시작');
        updateCount(); // 즉시 실행
        // setInterval(updateCount, 1000); // 1초마다 업데이트는 너무 빈번하여 제거
    }

    // DOM이 준비되면 시작
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startCounter);
    } else {
        startCounter();
    }

    // 추가 안전장치
    window.addEventListener('load', function() {
        setTimeout(startCounter, 500);
    });
})();