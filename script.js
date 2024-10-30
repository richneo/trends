// 설정: News API를 이용해 AI 관련 트렌드 키워드 추출
const apiKey = '0fd813c8b6174b2ab21232034e78ec86';  // 여기에 News API 키를 입력하세요.
// const apiUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://newsapi.org/v2/everything?q=latest+ai&language=en&sortBy=publishedAt&apiKey=${apiKey}`)}`;
const apiUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://newsapi.org/v2/everything?q=latest+artificial+intelligence&language=en&sortBy=publishedAt&apiKey=${apiKey}`)}`;


async function fetchTrends() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        // 데이터가 정상인지 확인
        if (data && data.contents) {
            const articlesData = JSON.parse(data.contents);
            if (articlesData.status === 'ok') {
                console.log(articlesData.articles);
                processKeywords(articlesData.articles);
            } else {
                document.getElementById('tagCloud').innerText = 'Failed to fetch trends';
            }
        } else {
            throw new Error('Invalid data structure');
        }
    } catch (error) {
        console.error('Error fetching trends:', error);
        document.getElementById('tagCloud').innerText = 'Error loading trends';
    }
}


function processKeywords(articles) {
    const keywordCount = {};
    
    articles.forEach(article => {
        if (article) {
            const titleWords = article.title ? article.title.split(' ') : [];
            const descriptionWords = article.description ? article.description.split(' ') : [];
            const allWords = [...titleWords, ...descriptionWords];

            allWords.forEach(word => {
                const keyword = word.toLowerCase();
                if (keyword.length > 2) { // 필터링 조건
                    keywordCount[keyword] = (keywordCount[keyword] || 0) + 1;
                }
            });
        }
    });

    console.log(`Total articles: ${articles.length}`);
    console.log(`Extracted keywords: ${Object.keys(keywordCount).length}`);

    const sortedKeywords = Object.keys(keywordCount).sort((a, b) => keywordCount[b] - keywordCount[a]);
    displayTagCloud(sortedKeywords.slice(0, 20));
}




function displayTagCloud(keywords) {
    const tagCloud = document.getElementById('tagCloud');
    tagCloud.innerHTML = '';
    keywords.forEach(keyword => {
        const span = document.createElement('span');
        span.className = 'keyword';
        span.innerText = keyword;
        span.onclick = () => window.open(`https://www.google.com/search?q=${keyword}+ai`, '_blank');
        tagCloud.appendChild(span);
    });
}

// 실행
fetchTrends();
