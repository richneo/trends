// 설정
const CONFIG = {
    API_KEY: '0fd813c8b6174b2ab21232034e78ec86',
    BASE_URL: 'https://newsapi.org/v2/everything',
    PROXY_URL: 'https://api.allorigins.win/get',
    REFRESH_INTERVAL: 300000, // 5분
    MAX_KEYWORDS: 20,
    MIN_WORD_LENGTH: 3,
    CATEGORIES: ['AI', 'Technology', 'Business', 'Science'],
    EXCLUDED_WORDS: new Set(['the', 'and', 'for', 'that', 'this', 'with', 'has', 'are', 'will'])
};

class TrendAnalyzer {
    constructor() {
        // 기존 코드...

        this.currentCategory = 'AI';
        this.setupCategoryFilters();
    }

    setupCategoryFilters() {
        const filterContainer = document.createElement('div');
        filterContainer.className = 'category-filters';
        
        CONFIG.CATEGORIES.forEach(category => {
            const button = document.createElement('button');
            button.textContent = category;
            button.className = 'category-btn';
            button.addEventListener('click', () => {
                this.currentCategory = category;
                this.fetchTrends();
                this.updateActiveButton(button);
            });
            filterContainer.appendChild(button);
        });

        this.tagCloud.parentElement.insertBefore(filterContainer, this.tagCloud);
    }

    updateActiveButton(activeButton) {
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeButton.classList.add('active');
    }

    async fetchTrends() {
        try {
            this.showLoading();
            const queryParams = new URLSearchParams({
                q: `latest ${this.currentCategory.toLowerCase()}`,
                language: 'en',
                sortBy: 'publishedAt',
                apiKey: CONFIG.API_KEY
            });

            // 나머지 코드는 동일...
        } catch (error) {
            // 에러 처리...
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

        const maxCount = Math.max(...Object.values(keywordCount));
        const sortedKeywords = Object.entries(keywordCount)
            .sort(([, a], [, b]) => b - a)
            .slice(0, CONFIG.MAX_KEYWORDS)
            .map(([keyword, count]) => ({
                keyword,
                size: Math.max(1, Math.round((count / maxCount) * 3)),
                count
            }));

        this.displayTagCloud(sortedKeywords);
    }

    displayTagCloud(keywords) {
        this.tagCloud.innerHTML = keywords
            .map(({keyword, size, count}) => `
                <span 
                    class="keyword size-${size}"
                    onclick="window.open('https://www.google.com/search?q=${keyword}+${this.currentCategory}', '_blank')"
                    role="button"
                    tabindex="0"
                    onkeypress="if(event.key==='Enter') this.click()"
                    data-count="${count}"
                >${keyword}</span>
            `)
            .join('');

        // 키워드 애니메이션 효과 추가
        document.querySelectorAll('.keyword').forEach((el, index) => {
            el.style.animation = `fadeIn 0.5s ${index * 0.1}s both`;
            
            // 호버 효과를 위한 이벤트 리스너
            el.addEventListener('mouseover', () => {
                const count = el.getAttribute('data-count');
                el.setAttribute('title', `출현 횟수: ${count}회`);
            });
        });
    }
}
