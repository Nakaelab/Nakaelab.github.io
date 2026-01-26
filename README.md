# nakaelab.github.io

福井大学 中江研究室の公式ウェブサイト

🌐 **URL**: https://nakaelab.github.io/

---

## 概要

このリポジトリは、福井大学工学部 中江健研究室（デジタルツイン研究室）の公式ウェブサイトのソースコードを管理しています。

### 主な特徴

- **静的サイト**: HTML/CSS/JavaScript
- **ホスティング**: GitHub Pages
- **動的コンテンツ**: Google Sheets連携
- **多言語対応**: 日本語/英語

---

## ファイル構成

```
nakaelab.github.io/
├── index.html              # トップページ
├── common.css              # ナビゲーション用CSS
├── styles.css              # メインコンテンツ用CSS
├── script.js               # JavaScript（Google Sheets連携等）
├── sitemap.xml             # サイトマップ
├── pages/                  # サブページ
│   ├── research.html       # 研究内容
│   ├── member.html         # メンバー紹介
│   ├── news.html           # ニュース一覧
│   └── contact.html        # お問い合わせ
└── images/                 # 画像ファイル
    ├── common/             # 共通画像（ロゴ等）
    ├── members/            # メンバー写真
    └── news/               # ニュース関連画像
```

---

## コンテンツ管理

### Google Sheets連携

以下のコンテンツはGoogle Sheetsで管理され、自動的にウェブサイトに反映されます：

- **ニュース** (News シート)
- **論文情報** (Publications シート)
- **メンバー情報** (Members シート)

詳細は「nakaelab ウェブサイト管理」Googleドライブフォルダ内のマニュアルを参照してください。

---

## 開発環境

### 必要なツール

- **VS Code**: コードエディタ
- **GitHub Desktop**: バージョン管理
- **Live Server**: ローカルプレビュー（VS Code拡張機能）

### ローカル開発

1. リポジトリをクローン
   ```bash
   git clone https://github.com/nakaelab/nakaelab.github.io.git
   ```

2. VS Codeで開く

3. Live Server拡張機能でプレビュー

---

## デプロイ

### 自動デプロイ

`main` ブランチへのプッシュで自動的にGitHub Pagesにデプロイされます。

反映まで1〜2分かかります。

---

## 更新手順（簡易版）

### 1. 日常的な更新（非技術者向け）

- Google Sheetsでコンテンツを更新
- 自動的にサイトに反映されます

### 2. 画像やコードの更新（技術者向け）

1. ファイルを編集
2. GitHub Desktopでコミット
3. プッシュ

詳細は[nakaelab ウェブサイト更新マニュアル](Googleドライブへのリンク)を参照。

---

## SEO対策

- ✅ Google Search Console登録済み
- ✅ sitemap.xml作成済み
- ✅ メタディスクリプション設定済み
- ✅ 構造化データマークアップ実装済み
- ✅ レスポンシブデザイン対応

---

## トラブルシューティング

### 更新が反映されない

1. スーパーリロード（`Cmd + Shift + R` / `Ctrl + Shift + R`）
2. GitHub Actionsのステータス確認
3. 2〜3分待ってから再確認

### 画像が表示されない

- ファイルパスを確認
- ファイル名が正しいか確認
- GitHubにプッシュされているか確認

---

## 連絡先

**管理責任者**: 中江健 教授  
**Email**: nakae [at] u-fukui.ac.jp

**技術的な問い合わせ**: （担当者連絡先）

---

## ライセンス

© 2025 Nakae Lab, University of Fukui. All rights reserved.

---

## 改訂履歴

- 2026-01-26: 初版作成
- (今後の更新をここに記録)
