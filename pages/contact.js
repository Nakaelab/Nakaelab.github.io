// 共通のハンバーガーメニュー関数
function toggleMenu() {
  const navMenu = document.getElementById('navMenu');
  const hamburger = document.querySelector('.hamburger');
  
  navMenu.classList.toggle('active');
  hamburger.classList.toggle('active');
}

// 地図の初期化
function initMap() {
  try {
    // 福井大学文京キャンパスの座標
    const fukuiUniversity = [36.075678, 136.211365];
    
    // 地図を作成
    const map = L.map('map').setView(fukuiUniversity, 16);
    
    // OpenStreetMapタイルを追加
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // マーカーを追加
    const marker = L.marker(fukuiUniversity).addTo(map);
    
    // ポップアップを設定
    marker.bindPopup(`
      <div style="text-align: center; padding: 5px;">
        <h4 style="margin: 0 0 8px 0; color: #1e3c72;">福井大学 文京キャンパス</h4>
        <p style="margin: 0 0 8px 0; font-size: 0.9em;">総合研究棟I 0511号室<br>Digital Twin Lab</p>
        <div style="display: flex; gap: 8px; margin-top: 10px;">
          <a href="https://www.google.com/maps/place/36.075678,136.211365" target="_blank" 
             style="background: #4285f4; color: white; padding: 6px 12px; text-decoration: none; border-radius: 4px; font-size: 0.8em;">
            Google Maps
          </a>
          <a href="https://maps.apple.com/?q=36.075678,136.211365" target="_blank"
             style="background: #007aff; color: white; padding: 6px 12px; text-decoration: none; border-radius: 4px; font-size: 0.8em;">
            Apple Maps
          </a>
        </div>
      </div>
    `).openPopup();
    
  } catch (error) {
    console.error('地図の初期化に失敗しました:', error);
    document.getElementById('map').innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; background: #f0f0f0; color: #666; text-align: center; padding: 20px; border-radius: 10px;">
        <div style="font-size: 2em; margin-bottom: 10px;">📍</div>
        <h3 style="margin: 0 0 10px 0;">福井大学 文京キャンパス</h3>
        <p style="margin: 0 0 15px 0; font-size: 0.9em;">総合研究棟I 0511号室</p>
        <div style="display: flex; gap: 10px; flex-wrap: wrap; justify-content: center;">
          <a href="https://www.google.com/maps/place/36.075678,136.211365" target="_blank" 
             style="background: #4285f4; color: white; padding: 8px 16px; text-decoration: none; border-radius: 20px; font-size: 0.9em;">
            🌐 Google Maps
          </a>
          <a href="https://maps.apple.com/?q=36.075678,136.211365" target="_blank"
             style="background: #007aff; color: white; padding: 8px 16px; text-decoration: none; border-radius: 20px; font-size: 0.9em;">
            🍎 Apple Maps
          </a>
        </div>
      </div>
    `;
  }
}

// ページ読み込み完了時の処理
document.addEventListener('DOMContentLoaded', function() {
  // 地図を初期化
  initMap();
  
  // アニメーション要素の処理
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-up');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.content-section').forEach(section => {
    observer.observe(section);
  });
});
