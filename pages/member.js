// ===== 言語切り替え機能 =====
let currentLanguage = 'ja';

function initLanguage() {
  const savedLang = localStorage.getItem('preferredLanguage');
  if (savedLang) {
    currentLanguage = savedLang;
    applyLanguage(currentLanguage);
  }
}

function toggleLanguage() {
  currentLanguage = currentLanguage === 'ja' ? 'en' : 'ja';
  applyLanguage(currentLanguage);
  localStorage.setItem('preferredLanguage', currentLanguage);
  
  if (currentMembersData.length > 0) {
    displayMembers(currentMembersData);
  }
}

function applyLanguage(lang) {
  const langText = document.getElementById('langText');
  if (langText) {
    langText.textContent = lang === 'ja' ? 'EN' : 'JP';
  }

  document.documentElement.lang = lang;

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
        image_url: '../images/members/nakae2.png'
    },
    {
        name: '岩田 康希',
        position_jp: '非常勤研究員',
        position_en: 'Doctoral course student',
        role: 'doctoral',
        research: 'デジタルツインマーモセット',
        hobby1: '',
        hobby2: '',
        specialty: '',
        email: 'iwata.koki.sd@gmail.com',
        image_url: ''
    },
    {
        name: '朝日 恵梨菜',
        position_jp: '事務補佐員',
        position_en: 'Admin Assistant',
        role: 'staff',
        research: '',
        hobby1: '子供と猫と遊ぶ',
        hobby2: 'サ活',
        specialty: '秘書',
        email: 'e1kn5@g.u-fukui.ac.jp',
        image_url: '../images/members/asahi.jpg'
    },
    {
        name: '坂川 篤志',
        position_jp: '技術補佐員',
        position_en: 'Technical Assistant',
        role: 'staff',
        research: '3D-EEGシステムの開発',
        hobby1: 'コンピュータ',
        hobby2: '猫',
        specialty: '技術的な補佐',
        email: 'sakagawa@g.u-fukui.ac.jp',
        image_url: '../images/members/sakagawa.jpg'
    },
    {
        name: '吉田 智恵美',
        position_jp: '技術補佐員',
        position_en: 'Technical Assistant',
        role: 'staff',
        research: '（仮）社会的実践としてのアートにおける中間支援者の役割',
        hobby1: '登山',
        hobby2: '猫',
        specialty: 'Webページ制作 他',
        email: 'chiemiyo@g.u-fukui.ac.jp',
        image_url: '../images/members/yoshida2.jpg'
    },
    {
        name: '山内 隆広',
        position_jp: 'B4学生',
        position_en: 'B4 Student',
        role: 'student',
        image_url: ''
    },
    {
        name: '山本 侑玄',
        position_jp: 'B4学生',
        position_en: 'B4 Student',
        role: 'student',
        image_url: '../images/members/yamamoto.jpg'
    },
    {
        name: '石田 海',
        position_jp: 'B4学生',
        position_en: 'B4 Student',
        role: 'student',
        image_url: ''
    },
    {
        name: '吉野 琴音',
        position_jp: 'B4学生',
        position_en: 'B4 Student',
        role: 'student',
        image_url: ''
    },
    {
        name: '石橋 燈河',
        position_jp: 'B3学生',
        position_en: 'B3 Student',
        role: 'student',
        image_url: ''
    },
    {
        name: '筒井 輝',
        position_jp: 'B3学生',
        position_en: 'B3 Student',
        role: 'student',
        image_url: ''
    },
    {
        name: '畑 祐成',
        position_jp: 'B3学生',
        position_en: 'B3 Student',
        role: 'student',
        image_url: ''
    },
    {
        name: '松鷹 直央',
        position_jp: 'B3学生',
        position_en: 'B3 Student',
        role: 'student',
        image_url: ''
    },
    {
        name: '森田 都登',
        position_jp: 'B3学生',
        position_en: 'B3 Student',
        role: 'student',
        image_url: ''
    },
    {
        name: '横田 哲',
        position_jp: 'B3学生',
        position_en: 'B3 Student',
        role: 'student',
        image_url: ''
    }
];

// CSVパーサー
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
// Google Sheetsのrole列の値：
//   faculty  → 教員
//   doctoral → 博士課程
//   master   → 修士課程
//   student  → 学部（B3・B4まとめて）
//   staff    → 教員セクションに含める（事務・技術補佐員）
function categorizeMembers(members) {
    const faculty = [];   // 教員＋スタッフ
    const doctoral = [];  // 博士課程
    const master = [];    // 修士課程
    const undergrad = []; // 学部

    members.forEach(member => {
        const role = (member.role || '').toLowerCase().trim();

        if (role === 'faculty' || role === 'staff') {
            faculty.push(member);
        } else if (role === 'doctoral') {
            doctoral.push(member);
        } else if (role === 'master') {
            master.push(member);
        } else if (role === 'student') {
            undergrad.push(member);
        } else {
            // roleが未設定・不明な場合は教員側に
            faculty.push(member);
        }
    });

    return { faculty, doctoral, master, undergrad };
}

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

    const role = (member.role || '').toLowerCase().trim();
    const isStudent = role === 'student';
    const position = currentLanguage === 'ja' ?
        (member.position_jp || '') :
        (member.position_en || member.position_jp || '');

    const displayName = currentLanguage === 'en' && member.name_en
        ? member.name_en
        : (member.name || 'Unknown');

    // 裏面コンテンツ
    const hobby = (member.hobby1 || '').trim();
    const backLabel = currentLanguage === 'ja' ? '趣味・好きなこと' : 'Hobby';
    const backText = hobby || (currentLanguage === 'ja' ? '情報準備中' : 'Coming soon');

    card.innerHTML = `
        <div class="member-card-inner">
            <div class="member-card-front">
                <div class="member-avatar${!imageUrl ? ' no-image' : ''}">${avatarContent}</div>
                <h3 class="member-name">${displayName}</h3>
                ${!isStudent ? `<p class="member-position">${position}</p>` : ''}
            </div>
            <div class="member-card-back">
                <p class="back-name">${displayName}</p>
                <p class="back-label">${backLabel}</p>
                <p class="back-content">${backText}</p>
            </div>
        </div>
    `;

    // タップでフリップ（モバイル対応）
    card.addEventListener('click', () => {
        card.classList.toggle('flipped');
    });

    return card;
}

// メンバー表示関数（4カテゴリー）
function displayMembers(members) {
    currentMembersData = members;

    const { faculty, doctoral, master, undergrad } = categorizeMembers(members);

    // 教員を表示
    const facultyContainer = document.getElementById('facultyContainer');
    if (!facultyContainer) return;
    facultyContainer.innerHTML = '';
    faculty.forEach(member => {
        facultyContainer.appendChild(createMemberCard(member));
    });

    // 博士課程を表示
    const doctoralContainer = document.getElementById('doctoralContainer');
    if (!doctoralContainer) return;
    doctoralContainer.innerHTML = '';
    doctoral.forEach(member => {
        doctoralContainer.appendChild(createMemberCard(member));
    });

    // 修士課程を表示
    const masterContainer = document.getElementById('masterContainer');
    if (!masterContainer) return;
    masterContainer.innerHTML = '';
    master.forEach(member => {
        masterContainer.appendChild(createMemberCard(member));
    });

    // 学部を表示
    const undergradContainer = document.getElementById('undergradContainer');
    undergradContainer.innerHTML = '';
    undergrad.forEach(member => {
        undergradContainer.appendChild(createMemberCard(member));
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
    initLanguage();
    
    displayMembers(testMembers);
    
    setTimeout(() => {
        loadMembers();
    }, 1000);
});