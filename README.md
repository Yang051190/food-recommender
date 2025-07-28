# Dinner Decider / 食物推薦系統

## 功能
- 依座標推薦附近餐廳：`GET /api/recommend?lat=<lat>&lng=<lng>&maxDistance=<meters>`
- 記錄用餐紀錄：`POST /api/meals`
- 查詢歷史紀錄：`GET /api/meals/history?userId=guest`
- 健康檢查：`GET /health`
- 前端測試頁：根路徑 `/`（由 Express 提供 `public/index.html`）

## 技術
- Node.js + Express
- MongoDB Atlas + Mongoose（`2dsphere` 索引、`$nearSphere` 查詢）
- 前端：純 HTML/JS 測試頁

## 專案結構
.
├─ index.js
├─ seed.js
├─ models/
│ ├─ Restaurant.js
│ └─ MealRecord.js
├─ public/
│ └─ index.html
├─ .env # 不提交
├─ .env.example # 範例（提交）
├─ .gitignore
└─ package.json
## 測試步驟（驗收用）

1. 安裝
   ```bash
   npm install
