// 설정
const CONFIG = {
    API_KEY: '0fd813c8b6174b2ab21232034e78ec86',
    BASE_URL: 'https://newsapi.org/v2/everything',
    PROXY_URL: 'https://api.allorigins.win/get',
    REFRESH_INTERVAL: 300000, // 5분
    MAX_KEYWORDS: 20,
    MIN_WORD_LENGTH: 3,
    EXCLUDED_WORDS: new Set(['the', 'and', 'for', 'that', 'this', 'with', 'has', 'are', 'will'])
};

class TrendAnalyzer {
    constructor() {
        this.tagCloud = document.getElementById('tagCloud');
        this.lastUpdate = document.getElementById('lastUpdate');
        this.refreshBtn = document.getElementById('refreshBtn');
        this.setupEventListeners();
        this.startAutoRefresh();
    }

    setupEventListeners() {
        this.refreshBtn.addEventListener('click', () => this.fetchTrends());
    }

    startAutoRefresh() {
        this.fetchTrends();
        setInterval(() => this.fetchTrends(), CONFIG.REFRESH_INTERVAL);
    }

    async fetchTrends() {
        try {
            this.showLoading();
            const queryParams = new URLSearchParams({
                q: 'latest artificial intelligence',
                language: 'en',
                sortBy: 'publishedAt',
                apiKey: CONFIG.API_KEY
            });

            const url = `${CONFIG.PROXY_URL}?url=${encodeURIComponent(`${CONFIG.BASE_URL}?${queryParams}`)}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data && data.contents) {
                const articlesData = JSON.parse(data.contents);
                if (articlesData.status === 'ok') {
                    this.processKeywords(articlesData.articles);
                    this.updateLastFetchTime();
                } else {
                    throw new Error('API returned error status');
                }
            }
        } catch (error) {
            console.error('Error fetching trends:', error);
            this.showError('Failed to load trends. Please try again later.');
        }
    }

    processKeywords(articles) {
        const keywordCount = {};
        
        articles.forEach(article => {
            if (!article?.title && !article?.description) return;
            
            const text = `${article.title || ''} ${article.description || ''}`;
            const words = text.toLowerCase()
                            .replace(/[^\w\s]/g, '')
                            .split(/\s+/)
                            .filter(word => 
                                word.length >= CONFIG.MIN_WORD_LENGTH && 
                                !CONFIG.EXCLUDED_WORDS.has(word)
                            );

            words.forEach(word => {
                keywordCount[word] = (keywordCount[word] || 0) + 1;
            });
        });

        const sortedKeywords = Object.entries(keywordCount)
            .sort(([, a], [, b]) => b - a)
            .slice(0, CONFIG.MAX_KEYWORDS)
            .map(([keyword]) => keyword);

        this.displayTagCloud(sortedKeywords);
    }

    displayTagCloud(keywords) {
        this.tagCloud.innerHTML = keywords
            .map(keyword => `
                <span 
                    class="keyword" 
                    onclick="window.open('https://www.google.com/search?q=${keyword}+ai', '_blank')"
                    role="button"
                    tabindex="0"
                    onkeypress="if(event.key==='Enter') this.click()"
                >${keyword}</span>
            `)
            .join('');
    }

    showLoading() {
        this.tagCloud.innerHTML = '<div class="loading-spinner"></div>';
    }

    showError(message) {
        this.tagCloud.innerHTML = `<div class="error">${message}</div>`;
    }

    updateLastFetchTime() {
        const now = new Date();
        this.lastUpdate.textContent = `Last updated: ${now.toLocaleTimeString()}`;
    }
}

// 앱 초기화
new TrendAnalyzer();
