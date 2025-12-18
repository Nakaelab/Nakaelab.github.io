// Googleスプレッドシートの設定
const SPREADSHEET_ID = '1tTfxn1GpsZjD39wg4LNBwg6OJv98B1MjMLNQysP5GYk';
const NEWS_SHEET_ID = '0'; // newsシートのgid

// CSVをパースする関数
function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  const data = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    
    // カンマ区切りで分割（引用符を考慮）
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    
    const row = {
      date: values[0] || '',
      title: values[1] || '',
      detail: values[2] || '',
      category: values[3] || 'event',
      link: values[4] || ''
    };
    
    // 空のタイトルは除外
    if (row.title && row.title.trim() !== '') {
      data.push(row);
    }
  }
  return data;
}

// リンクのタイプを判定する関数
function getLinkType(url) {
  if (!url) return '';
  
  const lowerUrl = url.toLowerCase();
  
  if (lowerUrl.includes('arxiv.org') || lowerUrl.includes('doi.org') || lowerUrl.includes('.pdf')) {
    return 'paper';
  } else if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be') || lowerUrl.includes('video')) {
    return 'video';
  } else if (lowerUrl.includes('github.com')) {
    return 'github';
  } else {
    return 'website';
  }
}

// リンクアイコンのSVGを取得する関数
function getLinkIcon(type) {
  const icons = {
    paper: `<svg class="news-quick-link-icon" viewBox="0 0 24 24">
      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
    </svg>`,
    website: `<svg class="news-quick-link-icon" viewBox="0 0 24 24">
      <path d="M16.36,14C16.44,13.34 16.5,12.68 16.5,12C16.5,11.32 16.44,10.66 16.36,10H19.74C19.9,10.64 20,11.31 20,12C20,12.69 19.9,13.36 19.74,14M14.59,19.56C15.19,18.45 15.65,17.25 15.97,16H18.92C17.96,17.65 16.43,18.93 14.59,19.56M14.34,14H9.66C9.56,13.34 9.5,12.68 9.5,12C9.5,11.32 9.56,10.65 9.66,10H14.34C14.43,10.65 14.5,11.32 14.5,12C14.5,12.68 14.43,13.34 14.34,14M12,19.96C11.17,18.76 10.5,17.43 10.09,16H13.91C13.5,17.43 12.83,18.76 12,19.96M8,8H5.08C6.03,6.34 7.57,5.06 9.4,4.44C8.8,5.55 8.35,6.75 8,8M5.08,16H8C8.35,17.25 8.8,18.45 9.4,19.56C7.57,18.93 6.03,17.65 5.08,16M4.26,14C4.1,13.36 4,12.69 4,12C4,11.31 4.1,10.64 4.26,10H7.64C7.56,10.66 7.5,11.32 7.5,12C7.5,12.68 7.56,13.34 7.64,14M12,4.03C12.83,5.23 13.5,6.57 13.91,8H10.09C10.5,6.57 11.17,5.23 12,4.03M18.92,8H15.97C15.65,6.75 15.19,5.55 14.59,4.44C16.43,5.07 17.96,6.34 18.92,8M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
    </svg>`,
    video: `<svg class="news-quick-link-icon" viewBox="0 0 24 24">
      <path d="M17,10.5V7A1,1 0 0,0 16,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16A1,1 0 0,0 17,17V13.5L21,17.5V6.5L17,10.5Z" />
    </svg>`,
    github: `<svg class="news-quick-link-icon" viewBox="0 0 24 24">
      <path d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z" />
    </svg>`
  };
  return icons[type] || icons.website;
}

// ニュースを表示
function displayNews(newsData) {
  const container = document.getElementById('newsContainer');
  container.innerHTML = '';

  // 最新順に表示（最大5件）
  const recentNews = newsData.slice(0, 5);
  
  recentNews.forEach(news => {
    const li = document.createElement('li');
    
    // リンクがある場合のクイックリンクボタン
    let quickLink = '';
    if (news.link && news.link.trim() !== '') {
      const linkType = getLinkType(news.link);
      const linkIcon = getLinkIcon(linkType);
      quickLink = `
        <a href="${news.link}" target="_blank" class="news-quick-link ${linkType}" onclick="event.stopPropagation();">
          ${linkIcon}
        </a>
      `;
    }
    
    li.innerHTML = `
      <span class="date">${news.date}</span>
      <div class="news-content">
        <span class="news-title">${news.title}</span>
        ${quickLink}
      </div>
    `;
    
    // ニュース項目全体をクリックでnews.htmlに移動（リンクボタン以外）
    li.addEventListener('click', function(e) {
      if (!e.target.closest('.news-quick-link')) {
        window.location.href = 'pages/news.html';
      }
    });
    
    container.appendChild(li);
  });
}

// Googleスプレッドシートからデータを読み込み
async function loadData() {
  const updateBadge = document.getElementById('updateBadge');
  updateBadge.style.display = 'block';
  
  try {
    const newsResponse = await fetch(
      `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=${NEWS_SHEET_ID}`
    );
    const newsCSV = await newsResponse.text();
    const newsData = parseCSV(newsCSV);
    
    // 日付でソート（新しい順）
    newsData.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    displayNews(newsData);
    
    console.log('✅ データ更新完了');
    
  } catch (error) {
    console.error('❌ データの読み込みに失敗:', error);
    
    // エラー時はフォールバック表示
    document.getElementById('newsContainer').innerHTML = 
      '<li>データの読み込みに失敗しました。しばらく後に再度お試しください。</li>';
  } finally {
    updateBadge.style.display = 'none';
  }
}

// 共通のハンバーガーメニュー関数
function toggleMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.getElementById('navMenu');
  
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('active');
}

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', function() {
  loadData();
});

// フェードインアニメーション
const fadeEls = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });
fadeEls.forEach(el => observer.observe(el));

// クリックした場所に飛んでいくマーモセット
document.addEventListener('click', function(e) {
  const marmoset = document.querySelector('.floating-marmoset.following');
  if (marmoset) {
    const randomX = e.clientX + (Math.random() - 0.5) * 200;
    const randomY = e.clientY + (Math.random() - 0.5) * 200;

    const maxX = window.innerWidth - 60;
    const maxY = window.innerHeight - 60;
    const finalX = Math.max(30, Math.min(randomX, maxX));
    const finalY = Math.max(30, Math.min(randomY, maxY));

    marmoset.style.transition = 'all 0.5s ease-out';
    marmoset.style.left = finalX + 'px';
    marmoset.style.top = finalY + 'px';
    
    marmoset.classList.add('bounce');
    setTimeout(() => {
      marmoset.classList.remove('bounce');
      marmoset.style.transition = 'all 0.1s ease';
    }, 600);
  }
});
// ヒーローセクションのキャッチコピーをスクロールで表示
function initHeroCatchphrase() {
  const catchphrase = document.querySelector('.hero-catchphrase');
  const subtitle = document.querySelector('.hero-subtitle');
  
  if (!catchphrase || !subtitle) return;
  
  // Intersection Observerで監視
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // ビューポートに入ったら表示
        setTimeout(() => {
          catchphrase.classList.add('visible');
        }, 300); // 300ms遅延
        
        setTimeout(() => {
          subtitle.classList.add('visible');
        }, 800); // 800ms遅延（キャッチコピーの後）
      }
    });
  }, {
    threshold: 0.3 // 30%見えたら発火
  });
  
  observer.observe(document.querySelector('.hero'));
}

// ページ読み込み時に実行
document.addEventListener('DOMContentLoaded', function() {
  initHeroCatchphrase();
  
  // 既存のコードもここに続く
});