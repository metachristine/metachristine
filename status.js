// Simulation of data fetching and management for the Agri-Status Dashboard

const MOCK_DATA = [
    { region: "chungnam", title: "2026년 농촌자원복합산업화 지원사업 공고", category: "지원사업", date: "2026-02-19", link: "https://www.bizinfo.go.kr/saw/saw/selectGrantMain.do", source: "비즈인포" },
    { region: "all", title: "2026년 청년농업인 영농정착지원사업 시행지침 안내", category: "청년농", date: "2026-02-18", link: "https://www.mafra.go.kr/mafra/293/subview.do", source: "농림축산식품부" },
    { region: "all", title: "2026년 농식품 벤처육성 지원사업(창업기업) 모집 공고", category: "벤처육성", date: "2026-02-18", link: "https://www.gg.go.kr/bbs/boardView.do?bsIdx=464&bIdx=102345", source: "경기도청" },
    { region: "all", title: "2026년 「농업기술 산학협력지원사업」 공고", category: "기술개발", date: "2026-02-17", link: "https://www.rda.go.kr/board/board.do?boardId=farmprmninfo", source: "농촌진흥청" },
    { region: "gyeonggi", title: "2025년 하반기 귀농 농업창업 및 주택구입 지원사업 신청 안내", category: "귀농지원", date: "2026-02-17", link: "https://www.yw.go.kr/www/selectBbsNttView.do?key=522&bbsNo=31&nttNo=154321", source: "양평군청" },
    { region: "jeonnam", title: "스마트팜 혁신밸리 입주기업 모집 안내", category: "스마트팜", date: "2026-02-16", link: "https://www.jeonnam.go.kr/M7124/boardView.do?seq=2001", source: "전남도청" },
    { region: "gyeongbuk", title: "경북 농특산물 쇼핑몰 '사이소' 입점 업체 모집", category: "유통", date: "2026-02-15", link: "https://www.cyso.co.kr/", source: "경상북도" },
    { region: "jeju", title: "제주 감귤 수출 물류비 지원 사업 공고", category: "수출", date: "2026-02-14", link: "https://www.jeju.go.kr/news/news/law/law.htm", source: "제주도청" },
    { region: "chungbuk", title: "과수 화상병 예방 약제 공급 계획 알림", category: "방역", date: "2026-02-13", link: "https://www.cheongju.go.kr/www/selectBbsNttView.do?key=279&bbsNo=40&nttNo=234567", source: "청주시청" },
    { region: "gyeongnam", title: "농업인 안전재해보험 가입비 지원 안내", category: "보험", date: "2026-02-12", link: "https://www.gyeongnam.go.kr/board/view.do?boardId=BBS_0000001", source: "경남도청" }
];

const REGION_NAMES = {
    "all": "전국", "gyeonggi": "경기", "gangwon": "강원", "chungbuk": "충북",
    "chungnam": "충남", "jeonbuk": "전북", "jeonnam": "전남",
    "gyeongbuk": "경북", "gyeongnam": "경남", "jeju": "제주"
};

const SOURCE_MAP = {
    "bizinfo": { name: "비즈인포", link: "https://www.bizinfo.go.kr/saw/saw/selectGrantMain.do" },
    "mafra": { name: "농림축산식품부", link: "https://www.mafra.go.kr/mafra/293/subview.do" },
    "rda": { name: "농촌진흥청", link: "https://www.rda.go.kr/board/board.do?boardId=farmprmninfo" },
    "gg": { name: "경기도청", link: "https://www.gg.go.kr/bbs/board.do?bsIdx=464&menuId=2483" },
    "jeonnam": { name: "전남도청", link: "https://www.jeonnam.go.kr/M7124/boardList.do" },
    "gyeongnam": { name: "경남도청", link: "https://www.gyeongnam.go.kr/board/list.do?boardId=BBS_0000001" },
    "jeju": { name: "제주도청", link: "https://www.jeju.go.kr/news/news/law/law.htm" }
};

let analysisChart = null;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial Data Load
    let archive = loadArchive();
    
    // Check if current archive has source field, if not, reset for the new structure
    if (archive.length > 0 && !archive[0].source) {
        archive = [];
    }

    if (archive.length === 0) {
        archive = MOCK_DATA;
        saveArchive(archive);
    }
    
    renderFeed(archive);
    updateStats(archive);
    initAnalysisChart(archive);

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
            updateAnalysisChart(archive);
            
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
    applyThemeStatus(currentTheme);
    
    // Theme Toggle Logic
    const themeBtn = document.getElementById('btnTheme');
    themeBtn.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyThemeStatus(theme);
        localStorage.setItem('theme', theme);
    });
});

function applyThemeStatus(theme) {
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.getElementById('btnTheme').textContent = '☀️';
    } else {
        document.documentElement.removeAttribute('data-theme');
        document.getElementById('btnTheme').textContent = '🌙';
    }
    // Update chart colors if it exists
    if (analysisChart) {
        updateChartTheme(theme);
    }
}

function initAnalysisChart(data) {
    const ctx = document.getElementById('analysisChart').getContext('2d');
    const counts = getSmartFarmCounts(data);
    const theme = localStorage.getItem('theme') || 'light';
    const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
    const textColor = theme === 'dark' ? '#f8fafc' : '#333333';

    analysisChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: counts.labels,
            datasets: [{
                label: '스마트팜 관련 사업 수',
                data: counts.values,
                backgroundColor: 'rgba(0, 102, 255, 0.7)',
                borderColor: 'rgba(0, 102, 255, 1)',
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        color: textColor
                    },
                    grid: {
                        color: gridColor
                    }
                },
                x: {
                    ticks: {
                        color: textColor
                    },
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function updateAnalysisChart(data) {
    if (!analysisChart) return;
    const counts = getSmartFarmCounts(data);
    analysisChart.data.labels = counts.labels;
    analysisChart.data.datasets[0].data = counts.values;
    analysisChart.update();
}

function updateChartTheme(theme) {
    const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
    const textColor = theme === 'dark' ? '#f8fafc' : '#333333';
    
    analysisChart.options.scales.y.ticks.color = textColor;
    analysisChart.options.scales.y.grid.color = gridColor;
    analysisChart.options.scales.x.ticks.color = textColor;
    analysisChart.update();
}

function getSmartFarmCounts(data) {
    // Count items where category is "스마트팜" per region
    const counts = {};
    // Only use regional governments (not 'all')
    const regionalKeys = Object.keys(REGION_NAMES).filter(k => k !== 'all');
    
    regionalKeys.forEach(k => counts[k] = 0);
    
    data.forEach(item => {
        if (item.category === '스마트팜' && counts[item.region] !== undefined) {
            counts[item.region]++;
        }
    });

    return {
        labels: regionalKeys.map(k => REGION_NAMES[k]),
        values: regionalKeys.map(k => counts[k])
    };
}

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
                <span class="source">출처: <a href="${item.link}" target="_blank" rel="noopener noreferrer">${item.source}</a></span>
                <span class="date">${item.date}</span>
            </div>
            <h3 class="feed-title"><a href="${item.link}" target="_blank" rel="noopener noreferrer">${item.title}</a></h3>
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
            item.category.toLowerCase().includes(keyword) ||
            item.source.toLowerCase().includes(keyword)
        );
    }
    
    renderFeed(filtered);
}

function updateStats(data) {
    const total = data.length;
    const today = Math.floor(Math.random() * 5) + 1; 
    
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
    
    const sourceKeys = Object.keys(SOURCE_MAP);
    const sKey = sourceKeys[Math.floor(Math.random() * sourceKeys.length)];
    const source = SOURCE_MAP[sKey];

    const r = regions[Math.floor(Math.random() * regions.length)];
    const c = categories[Math.floor(Math.random() * categories.length)];
    const t = titles[Math.floor(Math.random() * titles.length)];
    
    const today = new Date().toISOString().split('T')[0];

    return {
        region: r,
        title: `[${REGION_NAMES[r]}] ${t}`,
        category: c,
        date: today,
        link: source.link,
        source: source.name
    };
}
