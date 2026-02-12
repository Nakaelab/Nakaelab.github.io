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
  
  // メンバーカードを再表示
  if (currentMembersData.length > 0) {
    displayMembers(currentMembersData);
  }
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
      if (text.includes('<br>')) {
        element.innerHTML = text;
      } else {
        element.textContent = text;
      }
    }
  });

  console.log(`✅ 言語を${lang === 'ja' ? '日本語' : '英語'}に切り替えました`);
}

// 設定
const SPREADSHEET_ID = '1tTfxn1GpsZjD39wg4LNBwg6OJv98B1MjMLNQysP5GYk';
const SHEET_ID = '926336242';

// 現在のメンバーデータを保持
let currentMembersData = [];

// テストデータ（フォールバック用）
const testMembers = [
    {
        name: '中江 健',
        position_jp: '准教授',
        position_en: 'Associate Professor',
        role: 'faculty',
        research: 'コンピュータ神経科学',
        hobby1: '読書',
        hobby2: '映画鑑賞',
        specialty: 'AI研究',
        email: 'nakae@example.com',
        image_url: 'https://drive.google.com/uc?id=YOUR_GOOGLE_DRIVE_FILE_ID1'
    },
    {
        name: '岩田 康希',
        position_jp: '非常勤研究員',
        position_en: 'Research Fellow',
        role: 'staff',
        research: 'データ解析',
        hobby1: '登山',
        hobby2: '猫',
        specialty: 'Webページ制作',
        image_url: 'https://drive.google.com/uc?id=YOUR_GOOGLE_DRIVE_FILE_ID2'
    },
    {
        name: '朝日 恵梨菜',
        position_jp: '事務補佐員',
        position_en: 'Admin Assistant',
        role: 'staff',
        research: '事務サポート',
        hobby1: '子供のお世話',
        hobby2: '猫と遊ぶ',
        specialty: '秘書',
        image_url: 'https://drive.google.com/uc?id=YOUR_GOOGLE_DRIVE_FILE_ID3'
    },
    {
        name: '坂川 篤志',
        position_jp: '技術補佐員',
        position_en: 'Technical Assistant',
        role: 'staff',
        research: '技術サポート',
        hobby1: 'プログラミング',
        hobby2: 'ゲーム',
        specialty: 'システム管理',
        image_url: 'https://drive.google.com/uc?id=YOUR_GOOGLE_DRIVE_FILE_ID4'
    },
    {
        name: '吉田　智恵美',
        position_jp: '技術補佐員',
        position_en: 'Technical Assistant',
        role: 'staff',
        research: '地域幸福と文化の関係性探求',
        hobby1: '登山',
        hobby2: '猫',
        specialty: 'Webページ制作',
        image_url: 'https://drive.google.com/uc?id=YOUR_GOOGLE_DRIVE_FILE_ID5'
    },
    {
        name: '山内隆広',
        position_jp: 'B4学生',
        position_en: 'B4 Student',
        role: 'student',
        research: '機械学習',
        hobby1: '音楽',
        hobby2: 'ゲーム',
        specialty: 'データサイエンス',
        image_url: 'https://drive.google.com/uc?id=YOUR_GOOGLE_DRIVE_FILE_ID6'
    }
];

// 修正されたCSVパーサー
function parseCSV(text) {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const row = {};
        headers.forEach((header, index) => {
            row[header] = values[index] ? values[index].trim() : '';
        });
        if (row.name && row.name.trim()) {
            data.push(row);
        }
    }
    return data;
}

// メンバーをカテゴリに振り分ける関数
function categorizeMembers(members) {
    const staff = [];    // 教職員（faculty + staff）
    const b4 = [];       // B4学生
    const b3 = [];       // B3学生

    members.forEach(member => {
        const role = (member.role || '').toLowerCase().trim();
        const posJp = (member.position_jp || '').trim();

        // faculty または staff を含む場合は教職員（"staff, student" のようなケースも教職員に）
        if (role.includes('faculty') || role.includes('staff')) {
            staff.push(member);
        } else if (role.includes('student')) {
            if (posJp.includes('B4') || (member.position_en || '').includes('B4')) {
                b4.push(member);
            } else if (posJp.includes('B3') || (member.position_en || '').includes('B3')) {
                b3.push(member);
            } else {
                // B3/B4が判別できない学生はB4に
                b4.push(member);
            }
        } else {
            staff.push(member);
        }
    });

    return { staff, b4, b3 };
}

// 1枚のメンバーカードHTMLを生成する関数
function createMemberCard(member) {
    const card = document.createElement('div');
    card.className = 'member-card';

    const initial = member.name ? member.name.charAt(0) : '?';
    const imageUrl = member.image_url && member.image_url.trim() ? member.image_url.trim() : '';
    
    let avatarContent = '';
    if (imageUrl) {
        avatarContent = `
            <img src="${imageUrl}" alt="${member.name}" 
                 onload="this.style.opacity='1'; this.parentNode.classList.remove('no-image');"
                 onerror="this.parentNode.classList.add('no-image'); this.style.display='none';"
                 style="opacity: 0; transition: opacity 0.3s;">
            <div class="initial">${initial}</div>
        `;
    } else {
        avatarContent = `<div class="initial">${initial}</div>`;
    }

    // 言語に応じて役職を表示
    const position = currentLanguage === 'ja' ? 
        (member.position_jp || '') : 
        (member.position_en || member.position_jp || '');

    card.innerHTML = `
        <div class="member-avatar${!imageUrl ? ' no-image' : ''}">${avatarContent}</div>
        <h3 class="member-name">${member.name || 'Unknown'}</h3>
        <p class="member-position">${position}</p>
    `;

    return card;
}

// メンバー表示関数（カテゴリ別）
function displayMembers(members) {
    currentMembersData = members;

    const { staff, b4, b3 } = categorizeMembers(members);

    // 教職員を表示
    const staffContainer = document.getElementById('staffContainer');
    staffContainer.innerHTML = '';
    staff.forEach(member => {
        staffContainer.appendChild(createMemberCard(member));
    });

    // B4学生を表示
    const b4Container = document.getElementById('b4Container');
    b4Container.innerHTML = '';
    b4.forEach(member => {
        b4Container.appendChild(createMemberCard(member));
    });

    // B3学生を表示
    const b3Container = document.getElementById('b3Container');
    b3Container.innerHTML = '';
    b3.forEach(member => {
        b3Container.appendChild(createMemberCard(member));
    });
}

// データ読み込み
async function loadMembers() {
    try {
        const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=${SHEET_ID}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('スプレッドシートにアクセスできません');
        }
        
        const csvText = await response.text();
        const members = parseCSV(csvText);
        
        if (members.length === 0) {
            throw new Error('有効なメンバーデータが見つかりません');
        }
        
        displayMembers(members);
        
    } catch (error) {
        console.error('スプレッドシート読み込みエラー:', error);
        displayMembers(testMembers);
    }
}

// 共通のハンバーガーメニュー関数
function toggleMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.getElementById('navMenu');
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
}

// ページ読み込み時に実行
document.addEventListener('DOMContentLoaded', function() {
    // 言語設定を初期化
    initLanguage();
    
    displayMembers(testMembers);
    
    setTimeout(() => {
        loadMembers();
    }, 1000);
});