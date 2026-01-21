// ===== 言語切り替え機能 =====
let currentLanguage = 'ja'; // デフォルトは日本語

// ページ読み込み時に保存された言語設定を復元
function initLanguage() {
  const savedLang = localStorage.getItem('preferredLanguage');
  if (savedLang) {
    currentLanguage = savedLang;
    applyLanguage(currentLanguage);
  }
}

// 言語を切り替える関数
function toggleLanguage() {
  currentLanguage = currentLanguage === 'ja' ? 'en' : 'ja';
  applyLanguage(currentLanguage);
  localStorage.setItem('preferredLanguage', currentLanguage);
}

// 言語を適用する関数
function applyLanguage(lang) {
  // ボタンのテキストを更新
  const langText = document.getElementById('langText');
  if (langText) {
    langText.textContent = lang === 'ja' ? 'EN' : 'JP';
  }

  // HTML要素の言語を更新
  document.documentElement.lang = lang;

  // data-ja と data-en 属性を持つすべての要素を更新
  const elements = document.querySelectorAll('[data-ja][data-en]');
  elements.forEach(element => {
    const text = element.getAttribute(`data-${lang}`);
    if (text) {
      // HTMLタグを含む場合（brタグなど）
      if (text.includes('<br>')) {
        element.innerHTML = text;
      } else {
        element.textContent = text;
      }
    }
  });

  // 研究テーマも言語に応じて更新
  updateResearchTopics(lang);

  console.log(`✅ 言語を${lang === 'ja' ? '日本語' : '英語'}に切り替えました`);
}

// 研究テーマのデータ（日本語と英語）
const researchTopicsJa = {
    'デジタルツインマーモセット': 'マーモセットの行動を3Dで再現し、デジタル空間で生命現象を理解する研究です。長期的な行動データから、生命体のダイナミクスをモデル化します。',
    '3d-eegデジタルツイン': '脳波データを3次元的に可視化し、脳活動のデジタルツインを構築する研究です。非侵襲的な計測技術により、脳の状態をリアルタイムで把握します。',
    '行動変容生物学': '生物の行動がどのように変化するかを数理モデルで解明する研究です。環境や刺激に対する適応メカニズムを理解します。',
    'スマートネスト': 'IoT技術を活用した次世代型動物飼育環境の構築研究です。センサーとAIにより、動物の健康状態を常時モニタリングします。',
    '足羽山動物園': '福井県の足羽山動物園との共同研究プロジェクトです。動物の行動観察データを活用した研究を進めています。',
    'キーポイント推定全般': '画像・動画から生物の骨格や動きを自動抽出する技術研究です。機械学習を用いて高精度な姿勢推定を実現します。',
    '凝集たんぱく質伝播モデル': 'アルツハイマー病などの神経変性疾患における、異常タンパク質の伝播メカニズムを数理モデルで解明する研究です。',
    '建築×生命デジタルツイン': '建築空間と生命活動を統合的にモデル化する研究です。居住環境が生体に与える影響を定量的に評価します。',
    'マーモセット脳データ解析': 'マーモセットの脳活動データを大規模に解析し、脳機能のメカニズムを解明する研究です。先進的な解析手法を開発しています。'
};

const researchTopicsEn = {
    'Digital Twin Marmoset': 'Research to recreate marmoset behavior in 3D and understand life phenomena in digital space. We model life dynamics from long-term behavioral data.',
    '3D-EEG Digital Twin': 'Research to visualize EEG data in 3D and construct digital twins of brain activity. Non-invasive measurement technology enables real-time understanding of brain states.',
    'Behavioral Change Biology': 'Research to elucidate how biological behavior changes through mathematical models. We understand adaptation mechanisms to environment and stimuli.',
    'Smart Nest': 'Research to construct next-generation animal breeding environments using IoT technology. Sensors and AI continuously monitor animal health conditions.',
    'Asuwa Zoo': 'Collaborative research project with Asuwa Zoo in Fukui Prefecture. We advance research utilizing animal behavioral observation data.',
    'Keypoint Estimation': 'Technology research to automatically extract skeletal structure and movements from images and videos. We achieve high-precision pose estimation using machine learning.',
    'Protein Aggregation Model': 'Research to elucidate the propagation mechanism of abnormal proteins in neurodegenerative diseases such as Alzheimer\'s through mathematical models.',
    'Architecture × Life Digital Twin': 'Research to integratively model architectural spaces and life activities. We quantitatively evaluate the impact of living environments on living organisms.',
    'Marmoset Brain Data Analysis': 'Research to analyze marmoset brain activity data on a large scale and elucidate brain function mechanisms. We develop advanced analysis methods.'
};

let researchTopics = researchTopicsJa;

// 研究テーマを言語に応じて更新
function updateResearchTopics(lang) {
  researchTopics = lang === 'ja' ? researchTopicsJa : researchTopicsEn;
}

// 共通のハンバーガーメニュー関数
function toggleMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.getElementById('navMenu');
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
}

// モーダルを開く
function openResearchModal(topicName) {
    const modal = document.getElementById('researchModal');
    const title = document.getElementById('modalTitle');
    const description = document.getElementById('modalDescription');
    
    title.textContent = topicName;
    description.textContent = researchTopics[topicName] || (currentLanguage === 'ja' ? '研究テーマの詳細は準備中です。' : 'Research theme details are in preparation.');
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// モーダルを閉じる
function closeResearchModal(event) {
    if (!event || event.target.id === 'researchModal' || event.target.classList.contains('modal-close')) {
        const modal = document.getElementById('researchModal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// DOMが読み込まれた後に実行
document.addEventListener('DOMContentLoaded', () => {
    // 言語設定を初期化
    initLanguage();

    // スクロールアニメーション
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // すべての data-scroll 要素を監視
    document.querySelectorAll('[data-scroll]').forEach(el => {
        observer.observe(el);
    });

    // 各キーワードタグにクリックイベントを追加
    document.querySelectorAll('.keyword-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            const topicName = tag.textContent.replace('# ', '').trim();
            openResearchModal(topicName);
        });
    });
});

// ESCキーで閉じる
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeResearchModal();
    }
});