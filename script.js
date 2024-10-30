// 설정: News API를 이용해 기술 관련 트렌드 키워드 추출
const apiKey = 'YOUR_NEWS_API_KEY';  // 여기에 News API 키를 입력하세요.
const apiUrl = `https://newsapi.org/v2/everything?q=technology&language=en&apiKey=${apiKey}`;

async function fetchTrends() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    if (data.status === 'ok') {
      processKeywords(data.articles);
    } else {
      document.getElementById('tagCloud').innerText = 'Failed to fetch trends';
    }
  } catch (error) {
    console.error('Error fetching trends:', error);
    document.getElementById('tagCloud').innerText = 'Error loading trends';
  }
}

function processKeywords(articles) {
  // 기사에서 키워드 추출
  const keywordCount = {};
  articles.forEach(article => {
    const words = article.title.split(' ');
    words.forEach(word => {
      const keyword = word.toLowerCase();
      if (keyword.length > 3) {
        keywordCount[keyword] = (keywordCount[keyword] || 0) + 1;
      }
    });
  });

  // 빈도 순으로 키워드 정렬 후 상위 키워드만 태그 클라우드로 표시
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
    span.onclick = () => window.open(`https://www.google.com/search?q=${keyword}+technology`, '_blank');
    tagCloud.appendChild(span);
  });
}

// 실행
fetchTrends();
