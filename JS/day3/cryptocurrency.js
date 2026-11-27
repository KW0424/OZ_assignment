const API_URL = 'https://api4.binance.com/api/v3/ticker/24hr';
const STORAGE_KEY = 'favoriteCryptos';

const cryptoList = document.getElementById('cryptoList');
const searchInput = document.getElementById('searchInput');
const loading = document.getElementById('loading');
const emptyMessage = document.getElementById('emptyMessage');
const cryptoTable = document.getElementById('cryptoTable');
const allTab = document.getElementById('allTab');
const favoritesTab = document.getElementById('favoritesTab');
const lastUpdated = document.getElementById('lastUpdated');

let allCryptoData = [];
let favorites = loadFavorites();
let currentTab = 'all'; // 'all' | 'favorites'
let isFetching = false;

// LocalStorage에서 관심항목 불러오기
function loadFavorites() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return Array.isArray(saved) ? saved : [];
    } catch (error) {
        console.error('관심항목 불러오기 오류:', error);
        return [];
    }
}

// LocalStorage에 관심항목 저장하기
function saveFavorites() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

// 현재 시각 포맷팅 (HH:MM:SS)
function formatCurrentTime() {
    const now = new Date();
    return now.toTimeString().split(' ')[0];
}

// 가격 숫자 포맷팅
function formatPrice(value) {
    const num = parseFloat(value);
    if (Number.isNaN(num)) return '-';
    return num.toLocaleString('en-US', { maximumFractionDigits: 8 });
}

// Binance API에서 데이터 조회
async function fetchCryptoData() {
    if (isFetching) return;
    isFetching = true;

    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP 오류: ${response.status}`);
        }

        const data = await response.json();

        // USDT 마켓만 필터링하고 현재가가 0인 항목 제외
        allCryptoData = data.filter(
            (item) =>
                typeof item.symbol === 'string' &&
                item.symbol.endsWith('USDT') &&
                parseFloat(item.lastPrice) !== 0
        );

        lastUpdated.textContent = `업데이트 시각: ${formatCurrentTime()}`;
        loading.classList.add('hidden');
        filterAndRender();
    } catch (error) {
        console.error('데이터 조회 실패:', error);
        loading.classList.remove('hidden');
        loading.textContent = '데이터를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도합니다.';
    } finally {
        isFetching = false;
    }
}

// 탭 및 검색어 기준 필터링
function filterAndRender() {
    const searchTerm = searchInput.value.trim().toUpperCase();

    let filtered = allCryptoData.filter((item) => item.symbol.includes(searchTerm));

    if (currentTab === 'favorites') {
        filtered = filtered.filter((item) => favorites.includes(item.symbol));
    }

    renderTable(filtered);
}

// 테이블 렌더링
function renderTable(data) {
    if (data.length === 0) {
        cryptoTable.classList.add('hidden');
        emptyMessage.classList.remove('hidden');
        emptyMessage.textContent =
            currentTab === 'favorites'
                ? '등록된 관심항목이 없습니다. 별표(☆)를 눌러 추가해 보세요.'
                : '검색 조건에 맞는 암호화폐가 없습니다.';
        cryptoList.innerHTML = '';
        return;
    }

    emptyMessage.classList.add('hidden');
    cryptoTable.classList.remove('hidden');

    const fragment = document.createDocumentFragment();

    data.forEach((item) => {
        const tr = document.createElement('tr');

        const priceChange = parseFloat(item.priceChangePercent);
        const isUp = priceChange >= 0;
        const changeClass = isUp ? 'up' : 'down';
        const sign = isUp ? '+' : '';
        const isFavorite = favorites.includes(item.symbol);

        // 관심 버튼 셀
        const favTd = document.createElement('td');
        const favBtn = document.createElement('button');
        favBtn.type = 'button';
        favBtn.className = `fav-btn ${isFavorite ? 'active' : ''}`;
        favBtn.textContent = isFavorite ? '★' : '☆';
        favBtn.title = isFavorite ? '관심항목 해제' : '관심항목 추가';
        favBtn.addEventListener('click', () => toggleFavorite(item.symbol));
        favTd.appendChild(favBtn);

        // 심볼 셀
        const symbolTd = document.createElement('td');
        symbolTd.className = 'symbol';
        symbolTd.textContent = item.symbol;

        // 현재가 셀
        const lastPriceTd = document.createElement('td');
        lastPriceTd.textContent = formatPrice(item.lastPrice);

        // 24시간 변동률 셀
        const changeTd = document.createElement('td');
        changeTd.className = changeClass;
        changeTd.textContent = `${sign}${priceChange.toFixed(2)}%`;

        // 최고가 셀
        const highTd = document.createElement('td');
        highTd.textContent = formatPrice(item.highPrice);

        // 최저가 셀
        const lowTd = document.createElement('td');
        lowTd.textContent = formatPrice(item.lowPrice);

        tr.append(favTd, symbolTd, lastPriceTd, changeTd, highTd, lowTd);
        fragment.appendChild(tr);
    });

    cryptoList.replaceChildren(fragment);
}

// 관심항목 토글
function toggleFavorite(symbol) {
    const idx = favorites.indexOf(symbol);
    if (idx > -1) {
        favorites.splice(idx, 1);
    } else {
        favorites.push(symbol);
    }
    saveFavorites();
    filterAndRender();
}

// 이벤트 리스너 등록
searchInput.addEventListener('input', filterAndRender);

allTab.addEventListener('click', () => {
    currentTab = 'all';
    allTab.classList.add('active');
    favoritesTab.classList.remove('active');
    filterAndRender();
});

favoritesTab.addEventListener('click', () => {
    currentTab = 'favorites';
    favoritesTab.classList.add('active');
    allTab.classList.remove('active');
    filterAndRender();
});

// 초기 실행 및 1초 간격 갱신
fetchCryptoData();
setInterval(fetchCryptoData, 1000);