// Simulation of data fetching and management for the Agri-Status Dashboard

const MOCK_DATA = [
    { region: "gyeongbuk", title: "2026년 청년창업농 지원사업 추가 모집 공고", category: "지원사업", date: "2026-02-18", link: "#" },
    { region: "jeonnam", title: "스마트팜 혁신밸리 입주기업 모집 안내", category: "스마트팜", date: "2026-02-18", link: "#" },
    { region: "chungnam", title: "가축전염병 예방을 위한 방역 조치 강화", category: "축산", date: "2026-02-17", link: "#" },
    { region: "gyeonggi", title: "친환경 농산물 인증비 지원 신청", category: "친환경", date: "2026-02-17", link: "#" },
    { region: "jeju", title: "제주 감귤 수출 물류비 지원 사업 공고", category: "수출", date: "2026-02-16", link: "#" },
    { region: "gangwon", title: "고랭지 배추 병해충 방제 긴급 지원", category: "재해대책", date: "2026-02-16", link: "#" },
    { region: "jeonbuk", title: "농기계 임대사업소 주말 운영 확대", category: "농기계", date: "2026-02-15", link: "#" },
    { region: "chungbuk", title: "귀농귀촌인을 위한 농업기술 교육생 모집", category: "교육", date: "2026-02-15", link: "#" },
    { region: "gyeongnam", title: "시설원예 에너지 절감시설 지원사업", category: "시설원예", date: "2026-02-14", link: "#" },
    { region: "gyeongbuk", title: "경북 농특산물 쇼핑몰 '사이소' 입점 업체 모집", category: "유통", date: "2026-02-14", link: "#" },
    { region: "jeonnam", title: "유기농업 자재 지원 사업 신청 안내", category: "친환경", date: "2026-02-13", link: "#" },
    { region: "chungnam", title: "여성농업인 행복바우처 카드 발급 안내", category: "복지", date: "2026-02-13", link: "#" },
    { region: "jeju", title: "탄소중립 실현을 위한 저탄소 농업기술 보급", category: "환경", date: "2026-02-12", link: "#" },
    { region: "gangwon", title: "산불 예방을 위한 영농부산물 파쇄 지원", category: "안전", date: "2026-02-12", link: "#" },
    { region: "gyeonggi", title: "경기도 로컬푸드 직매장 설치 지원 사업", category: "유통", date: "2026-02-11", link: "#" },
    { region: "jeonbuk", title: "청년 농업인 영농정착지원금 대상자 선정 결과", category: "청년농", date: "2026-02-11", link: "#" },
    { region: "chungbuk", title: "과수 화상병 예방 약제 공급 계획 알림", category: "방역", date: "2026-02-10", link: "#" },
    { region: "gyeongnam", title: "농업인 안전재해보험 가입비 지원", category: "보험", date: "2026-02-10", link: "#" },
    { region: "jeonnam", title: "벼 재배면적 감축 협약 신청 접수", category: "정책", date: "2026-02-09", link: "#" },
    { region: "gyeongbuk", title: "축산 악취 개선 사업 대상자 선정", category: "축산", date: "2026-02-09", link: "#" },
];

const REGION_NAMES = {
    "gyeonggi": "경기", "gangwon": "강원", "chungbuk": "충북",
    "chungnam": "충남", "jeonbuk": "전북", "jeonnam": "전남",
    "gyeongbuk": "경북", "gyeongnam": "경남", "jeju": "제주",
    "all": "전국"
};

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial Data Load
    let archive = loadArchive();
    if (archive.length === 0) {
        archive = MOCK_DATA;
        saveArchive(archive);
    }
    
    renderFeed(archive);
    updateStats(archive);

    // 2. Region Filter Logic
    const filters = document.querySelectorAll('#regionFilter li');
    filters.forEach(li => {
        li.addEventListener('click', () => {
            filters.forEach(f => f.classList.remove('active'));
            li.classList.add('active');
            const region = li.getAttribute('data-region');
            filterFeed(region);
        });
    });

    // 3. Search Logic
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        const keyword = e.target.value.toLowerCase();
        const region = document.querySelector('#regionFilter li.active').getAttribute('data-region');
        filterFeed(region, keyword);
    });

    // 4. Sync Simulation
    const btnSync = document.getElementById('btnSync');
    btnSync.addEventListener('click', () => {
        btnSync.disabled = true;
        btnSync.textContent = "수집 중...";
        
        // Simulate network delay
        setTimeout(() => {
            const newItem = generateMockItem();
            archive.unshift(newItem);
            saveArchive(archive);
            
            // Re-render
            const region = document.querySelector('#regionFilter li.active').getAttribute('data-region');
            const keyword = searchInput.value.toLowerCase();
            filterFeed(region, keyword);
            updateStats(archive);
            
            btnSync.disabled = false;
            btnSync.textContent = "🔄 데이터 동기화";
            
            // Show toast/notification (using Quokka speech bubble briefly)
            const bubble = document.querySelector('.speech-bubble');
            const originalText = bubble.textContent;
            bubble.textContent = "새로운 데이터 1건 수집 완료!";
            bubble.style.opacity = '1';
            bubble.style.visibility = 'visible';
            setTimeout(() => {
                bubble.textContent = originalText;
                bubble.style.opacity = '';
                bubble.style.visibility = '';
            }, 3000);
            
        }, 1500);
    });

    // 5. Theme Sync (if user toggles theme on other page)
    const currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.getElementById('btnTheme').textContent = '☀️';
    }
    
    // Theme Toggle Logic (copied from main.js for consistency)
    const themeBtn = document.getElementById('btnTheme');
    themeBtn.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeBtn.textContent = '🌙';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeBtn.textContent = '☀️';
        }
    });
});

function loadArchive() {
    try {
        return JSON.parse(localStorage.getItem('agri_archive') || '[]');
    } catch (e) {
        return [];
    }
}

function saveArchive(data) {
    localStorage.setItem('agri_archive', JSON.stringify(data));
}

function renderFeed(data) {
    const list = document.getElementById('feedList');
    list.innerHTML = '';

    if (data.length === 0) {
        list.innerHTML = '<div class="empty-state">해당하는 데이터가 없습니다.</div>';
        return;
    }

    data.forEach(item => {
        const el = document.createElement('div');
        el.className = 'feed-item fade-in';
        el.innerHTML = `
            <div class="feed-meta">
                <span class="badge ${item.region}">${REGION_NAMES[item.region] || item.region}</span>
                <span class="category">${item.category}</span>
                <span class="date">${item.date}</span>
            </div>
            <h3 class="feed-title"><a href="${item.link}">${item.title}</a></h3>
        `;
        list.appendChild(el);
    });
}

function filterFeed(region, keyword = "") {
    let archive = loadArchive();
    
    let filtered = archive;
    
    if (region !== 'all') {
        filtered = filtered.filter(item => item.region === region);
    }
    
    if (keyword) {
        filtered = filtered.filter(item => 
            item.title.toLowerCase().includes(keyword) || 
            item.category.toLowerCase().includes(keyword)
        );
    }
    
    renderFeed(filtered);
}

function updateStats(data) {
    // Simple logic: "Today" is just a random number based on total length for demo
    // In a real app, filtering by date would happen here.
    const total = data.length;
    const today = Math.floor(Math.random() * 5) + 1; // Fake "new today" count
    
    document.getElementById('totalCount').textContent = total.toLocaleString();
    document.getElementById('todayCount').textContent = today;
}

function generateMockItem() {
    const regions = Object.keys(REGION_NAMES).filter(k => k !== 'all');
    const categories = ["지원사업", "스마트팜", "교육", "방역", "유통", "복지", "재해대책"];
    const titles = [
        "농업인 수당 지급 계획 공고",
        "가뭄 대비 관정 개발 지원",
        "청년 후계농 영농 정착 지원금 추가",
        "친환경 농자재 지원 사업 신청",
        "농산물 꾸러미 지원 사업 대상자 모집",
        "축사 시설 현대화 자금 융자 지원",
        "귀농인의 집 입주자 모집 공고"
    ];

    const r = regions[Math.floor(Math.random() * regions.length)];
    const c = categories[Math.floor(Math.random() * categories.length)];
    const t = titles[Math.floor(Math.random() * titles.length)];
    
    const today = new Date().toISOString().split('T')[0];

    return {
        region: r,
        title: `[${REGION_NAMES[r]}] ${t}`,
        category: c,
        date: today,
        link: "#"
    };
}
