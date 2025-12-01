// 共通のハンバーガーメニュー関数
function toggleMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.getElementById('navMenu');
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
}

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

// 研究テーマのデータ(後で詳細を追加)
const researchTopics = {
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

// モーダルを開く
function openResearchModal(topicName) {
    const modal = document.getElementById('researchModal');
    const title = document.getElementById('modalTitle');
    const description = document.getElementById('modalDescription');
    
    title.textContent = topicName;
    description.textContent = researchTopics[topicName] || '研究テーマの詳細は準備中です。';
    
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

// ESCキーで閉じる
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeResearchModal();
    }
});

// 各キーワードタグにクリックイベントを追加
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.keyword-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            const topicName = tag.textContent.replace('# ', '').trim();
            openResearchModal(topicName);
        });
    });
});
