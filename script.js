// 설정: News API를 이용해 기술 관련 트렌드 키워드 추출
const apiKey = '0fd813c8b6174b2ab21232034e78ec86';  // 여기에 News API 키를 입력하세요.
// const apiUrl = `https://newsapi.org/v2/everything?q=technology&language=en&apiKey=${apiKey}`;
// const apiUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://newsapi.org/v2/everything?q=technology&language=en&apiKey=${apiKey}`)}`;
const apiUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://newsapi.org/v2/everything?q=latest+technology&language=en&sortBy=publishedAt&apiKey=${apiKey}`)}`;


/*
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
*/

async function fetchTrends() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    // 데이터 확인용 console.log
    console.log(data.contents); // 여기서 데이터 구조를 확인하세요

    // allorigins 프록시의 "contents" 필드를 JSON으로 파싱
    const articlesData = JSON.parse(data.contents);
    console.log(articlesData); // 파싱된 JSON 로그

    if (articlesData.status === 'ok') {
      console.log(articlesData.articles); // 기사 목록 로그
      processKeywords(articlesData.articles);
    } else {
      document.getElementById('tagCloud').innerText = 'Failed to fetch trends';
    }
  } catch (error) {
    console.error('Error fetching trends:', error);
    document.getElementById('tagCloud').innerText = 'Error loading trends';
  }
}

/*
function processKeywords(articles) {
  // 기사에서 키워드 추출
  const keywordCount = {};
  articles.forEach(article => {
    const words = article.title.split(' ');
    words.forEach(word => {
      const keyword = word.toLowerCase();
      if (keyword.length > 2) {
        keywordCount[keyword] = (keywordCount[keyword] || 0) + 1;
      }
    });
  });

  // 빈도 순으로 키워드 정렬 후 상위 키워드만 태그 클라우드로 표시
  const sortedKeywords = Object.keys(keywordCount).sort((a, b) => keywordCount[b] - keywordCount[a]);
  displayTagCloud(sortedKeywords.slice(0, 20));
}
*/

function processKeywords(articles) {
  const keywordCount = {};
  
  articles.forEach(article => {
    if (article.title) { // title이 null이 아닌 경우에만
      const words = article.title.split(' ');
      words.forEach(word => {
        const keyword = word.toLowerCase();
        if (keyword.length > 2) {
          keywordCount[keyword] = (keywordCount[keyword] || 0) + 1;
        }
      });
    }
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
