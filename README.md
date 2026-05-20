# My Brand Workspace

這是一套以 Supabase 為後端的私有工作區 MVP，目標使用者為接案型自由工作者。你可以在同一個深色、桌機優先的 SaaS 介面中管理專案、客戶、任務與收入紀錄。

## 目前狀態

本專案已達到可上線驗證的 MVP 階段，並部署於 Netlify。核心 CRUD 流程與驗證機制皆已啟用並完成 smoke test。

Production URL：

https://harry-brand-workspace.netlify.app

## 技術棧

| 層級     | 技術                        |
| -------- | --------------------------- |
| 前端框架 | React + TypeScript          |
| 建置工具 | Vite                        |
| 樣式系統 | styled-components           |
| 測試工具 | Vitest + Testing Library    |
| 資料庫   | Supabase (PostgreSQL + RLS) |
| 託管平台 | Netlify                     |

## 核心功能

- 專案：新增、讀取、搜尋、更新、刪除
- 客戶：新增、讀取、搜尋、更新、刪除
- 任務：新增、讀取、搜尋、更新、刪除
- 收入紀錄：新增、讀取、搜尋、更新、刪除
- 儀表板：以真實資料呈現專案、任務、客戶與收入摘要
- 報表：聚合式總覽
- 驗證機制：私有工作區，未登入使用者在進入工作區頁面前會看到 private workspace login gate

## 驗證行為

此工作區為私有環境，不是公開 SaaS。未提供公開註冊。帳號由管理員在 Supabase Auth 建立。未登入使用者在進入工作區頁面前會看到 private workspace login gate。所有資料會透過 Supabase Row Level Security 依使用者隔離。

## 本機開發

```bash
npm install
npm run dev
```

執行測試：

```bash
npm run test
```

產出生產建置：

```bash
npm run build
```

## 環境變數

請建立 `.env.local`（不要提交到版本庫），內容如下：

```txt
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

前端環境變數僅可使用前端可公開的設定值。

## Supabase 說明

- 核心資料表與 RLS 規則定義於 `supabase/migrations/`。
- 前端僅使用 publishable / anon key，資料隔離由 RLS 負責。
- 不可在前端程式碼或前端環境變數中使用 service role key。
- 不可在前端環境變數中使用資料庫密碼（database passwords）。
- 不可在前端環境變數中使用儲存相關密鑰（storage secrets）。

## Netlify 說明

- 建置指令：`npm run build`
- 發佈目錄：`dist`
- SPA fallback redirect 已在 `netlify.toml` 設定。
- 請於 Netlify 環境變數設定 `VITE_SUPABASE_URL` 與 `VITE_SUPABASE_ANON_KEY`。
- Netlify 的 `VITE_SUPABASE_ANON_KEY` 應對應 Supabase publishable / anon key。
- 不可在前端環境變數中使用 service role keys、database passwords、storage secrets。
- 生產環境前端變數的 `VITE_SUPABASE_URL` 不可使用 `127.0.0.1` 或 `localhost`。

## 樣式組織

每個元件皆採用同目錄共置（colocation）慣例：

```txt
Component.tsx          - 邏輯、JSX、資料處理
Component.styles.ts    - styled-components 定義
```

全域主題 token 位於 `src/styles/theme.ts`，全域基礎樣式位於 `src/styles/GlobalStyle.ts`。

## AI 工作流程備註

- 變更以 GitHub Issue 為主要真實來源。
- `AGENTS.md` 定義此儲存庫的範圍、技術棧與開發規範。
- 每個 Issue 只處理一個聚焦任務，PR 合併前需先檢查是否符合 Issue 範圍。
- 不可遷移到 Next.js。
- 不可新增 Tailwind CSS。
- 不可新增 UI framework。
- 除非未來 Issue 明確要求，不可新增 Redux、Zustand 或 React Query。
