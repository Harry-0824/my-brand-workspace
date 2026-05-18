# MVP Manual Smoke Test Checklist

## 1. 目的與範圍

本清單用於 `my-brand-workspace` 目前 Supabase-backed MVP 的手動冒煙測試，確認以下流程可端到端使用：

- Auth（註冊 / 登入 / 登出 / session-aware UI）
- Projects CRUD
- Clients CRUD
- Tasks CRUD
- Income Records CRUD
- Dashboard 真實資料摘要
- Reports 真實資料總覽
- 本地與正式環境變數就緒檢查（不暴露 secrets）

> 注意：本文件只做驗證清單，不包含功能實作、schema/RLS/migration 變更或架構重構。

## 2. 測試前置條件

- 已安裝相依套件（使用 npm）
- 本地有可用的 Supabase 專案與測試帳號
- `.env` 僅在本地設定，不可提交
- 前端環境變數已設定（僅列名稱，不填值）：
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

## 3. Auth 流程

### 3.1 註冊（Signup）

- [ ] 測試動作：使用未註冊 Email + 密碼完成註冊。
- [ ] 預期結果：註冊成功，不出現未處理錯誤；可進入登入後流程（或依目前流程提示驗證/登入）。

### 3.2 登入（Login）

- [ ] 測試動作：使用有效帳號密碼登入。
- [ ] 預期結果：登入成功，UI 進入已登入狀態，可存取受保護頁面內容。

### 3.3 登出（Logout）

- [ ] 測試動作：在已登入狀態執行登出。
- [ ] 預期結果：登出成功，UI 回到未登入狀態，受保護資料不可再直接存取。

### 3.4 Session-aware UI

- [ ] 測試動作：登入後重新整理頁面。
- [ ] 預期結果：session 仍可被正確識別，UI 維持登入狀態。
- [ ] 測試動作：登出後重新整理頁面。
- [ ] 預期結果：UI 仍維持未登入狀態，不顯示前一位使用者資料。

### 3.5 使用者資料隔離

- [ ] 測試動作：A 帳號建立資料後登出，改以 B 帳號登入檢查列表。
- [ ] 預期結果：B 不應看到 A 的使用者私有資料（僅可見 B 自己資料）。

## 4. Projects CRUD

### 4.1 Empty state

- [ ] 測試動作：使用無 Projects 的測試帳號開啟 Projects 頁。
- [ ] 預期結果：顯示合理空狀態，不出現崩潰或未處理錯誤。

### 4.2 Create

- [ ] 測試動作：新增一筆 Project。
- [ ] 預期結果：建立成功，列表可看到新資料。

### 4.3 Read/List

- [ ] 測試動作：重新整理頁面並回到 Projects。
- [ ] 預期結果：已建立資料可被正確讀取與顯示。

### 4.4 Update

- [ ] 測試動作：編輯既有 Project 欄位並儲存。
- [ ] 預期結果：更新成功，列表顯示最新值。

### 4.5 Delete

- [ ] 測試動作：刪除一筆 Project。
- [ ] 預期結果：刪除成功，列表不再顯示該筆資料。

### 4.6 Loading / Error

- [ ] 測試動作：在 CRUD 操作時觀察載入與失敗提示。
- [ ] 預期結果：有可理解的 loading/error 呈現；不出現卡死或空白頁。

## 5. Clients CRUD

### 5.1 Empty state

- [ ] 測試動作：使用無 Clients 的測試帳號開啟 Clients 頁。
- [ ] 預期結果：顯示合理空狀態。

### 5.2 Create

- [ ] 測試動作：新增一筆 Client。
- [ ] 預期結果：建立成功，列表可見新資料。

### 5.3 Read/List

- [ ] 測試動作：重新整理後檢查 Clients 列表。
- [ ] 預期結果：資料可正確讀取與顯示。

### 5.4 Update

- [ ] 測試動作：編輯既有 Client 並儲存。
- [ ] 預期結果：更新成功且畫面顯示新值。

### 5.5 Delete

- [ ] 測試動作：刪除一筆 Client。
- [ ] 預期結果：刪除成功，列表移除該筆。

### 5.6 Loading / Error

- [ ] 測試動作：操作期間觀察 loading/error 行為。
- [ ] 預期結果：提示清楚且不影響其他頁面基本操作。

## 6. Tasks CRUD

### 6.1 Empty state

- [ ] 測試動作：使用無 Tasks 的測試帳號開啟 Tasks 頁。
- [ ] 預期結果：顯示合理空狀態。

### 6.2 Create

- [ ] 測試動作：新增一筆 Task。
- [ ] 預期結果：建立成功，列表可見新資料。

### 6.3 Read/List

- [ ] 測試動作：重新整理後檢查 Tasks 列表。
- [ ] 預期結果：資料可正確讀取與顯示。

### 6.4 Update

- [ ] 測試動作：編輯既有 Task 並儲存。
- [ ] 預期結果：更新成功且畫面顯示新值。

### 6.5 Delete

- [ ] 測試動作：刪除一筆 Task。
- [ ] 預期結果：刪除成功，列表移除該筆。

### 6.6 Loading / Error

- [ ] 測試動作：操作期間觀察 loading/error 行為。
- [ ] 預期結果：提示清楚且不造成頁面異常。

## 7. Income Records CRUD

### 7.1 Empty state

- [ ] 測試動作：使用無 Income Records 的測試帳號開啟 Invoices/Income Records 頁。
- [ ] 預期結果：顯示合理空狀態。

### 7.2 Create

- [ ] 測試動作：新增一筆 Income Record。
- [ ] 預期結果：建立成功，列表可見新資料。

### 7.3 Read/List

- [ ] 測試動作：重新整理後檢查 Income Records 列表。
- [ ] 預期結果：資料可正確讀取與顯示。

### 7.4 Update

- [ ] 測試動作：編輯既有 Income Record 並儲存。
- [ ] 預期結果：更新成功且畫面顯示新值。

### 7.5 Delete

- [ ] 測試動作：刪除一筆 Income Record。
- [ ] 預期結果：刪除成功，列表移除該筆。

### 7.6 Loading / Error

- [ ] 測試動作：操作期間觀察 loading/error 行為。
- [ ] 預期結果：提示清楚且不導致資料顯示錯亂。

## 8. Dashboard 真實資料驗證

- [ ] 測試動作：先記錄 Dashboard 摘要值，再執行 Projects/Tasks/Clients/Income Records 的新增或刪除。
- [ ] 預期結果：Dashboard 對應摘要值會反映最新 Supabase 資料。
- [ ] 測試動作：使用空資料帳號開啟 Dashboard。
- [ ] 預期結果：空狀態呈現可接受，無錯誤爆炸。

## 9. Reports 真實資料驗證

- [ ] 測試動作：先記錄 Reports 顯示值，再執行相關 CRUD 變更後重新檢查。
- [ ] 預期結果：Reports 值會反映最新 Supabase 資料。
- [ ] 測試動作：使用空資料帳號開啟 Reports。
- [ ] 預期結果：空狀態呈現可接受，無未處理錯誤。

## 10. Local Supabase 驗證步驟

- [ ] 測試動作：確認本地 `.env` 已設定 `VITE_SUPABASE_URL`、`VITE_SUPABASE_ANON_KEY`（只檢查是否存在，不記錄值）。
- [ ] 預期結果：應用可成功連線到測試用 Supabase 專案。
- [ ] 測試動作：執行 `npm.cmd run build`。
- [ ] 預期結果：建置成功（無需修改 schema/RLS/migration）。
- [ ] 測試動作：執行 `npm.cmd run test`。
- [ ] 預期結果：測試通過或可明確指出與本 Issue 無關的既有失敗。

## 11. Production 環境就緒檢查（不暴露 secrets）

- [ ] 測試動作：確認正式環境已配置前端變數名稱（不貼值）：`VITE_SUPABASE_URL`、`VITE_SUPABASE_ANON_KEY`。
- [ ] 預期結果：部署平台上僅保存變數值，不出現在 repo 或 PR 內容中。
- [ ] 測試動作：檢查本次變更檔案與 PR 內容。
- [ ] 預期結果：未提交 `.env`、API key、service role key、任何 secret。

## 12. 驗收總結欄

- [ ] Auth 流程（Signup/Login/Logout/Session-aware）通過
- [ ] Projects CRUD 通過
- [ ] Clients CRUD 通過
- [ ] Tasks CRUD 通過
- [ ] Income Records CRUD 通過
- [ ] Dashboard 真實資料驗證通過
- [ ] Reports 真實資料驗證通過
- [ ] Local build/test 驗證完成
- [ ] Production env readiness 檢查完成（無 secrets 外洩）
