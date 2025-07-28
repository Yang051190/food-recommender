require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');        // 一定要有這行
const Restaurant = require('./models/Restaurant');

const app = express();
const port = process.env.PORT || 3000;
const MealRecord = require('./models/MealRecord');


app.use(express.json());app.use(express.static('public'));


// 確認有讀到連線字串
console.log('MONGODB_URI length =', (process.env.MONGODB_URI || '').length);

// MongoDB 連線事件（方便觀察狀態）
mongoose.connection.on('connected', () => {
  console.log('MongoDB 已連線');
});
mongoose.connection.on('error', (err) => {
  console.error('MongoDB 連線錯誤：', err.message);
});
mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB 已中斷');
});

// 連線
(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (err) {
    console.error('connect() 失敗：', err.message);
    process.exit(1);
  }
})();

// 首頁
//app.get('/', (req, res) => {
//  res.send('伺服器啟動成功');
//});

// 健康檢查
const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
app.get('/health', (req, res) => {
  const s = states[mongoose.connection.readyState] || 'unknown';
  res.json({ dbState: s });
});

// 推薦 API：依座標找附近，再隨機回一間
app.get('/api/recommend', async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);
    const maxDistance = parseInt(req.query.maxDistance || '3000', 10); // 公尺

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return res.status(400).json({ message: '請提供 lat 與 lng 參數' });
    }

    const candidates = await Restaurant.find({
      location: {
        $nearSphere: {
          $geometry: { type: 'Point', coordinates: [lng, lat] }, // [經度, 緯度]
          $maxDistance: maxDistance
        }
      }
    }).limit(30);

    if (!candidates.length) {
      return res.status(404).json({ message: '附近找不到餐廳，請放大搜尋範圍' });
    }

    const idx = Math.floor(Math.random() * candidates.length);
    res.json(candidates[idx]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '伺服器錯誤' });
  }
});

app.listen(port, () => {
  console.log(`伺服器正在 http://localhost:${port} 執行中`);
});

// 建立用餐紀錄
app.post('/api/meals', async (req, res) => {
  try {
    const { userId = 'guest', restaurantId, restaurantName, rating, note, menuName } = req.body;

    if (!restaurantId || !restaurantName) {
      return res.status(400).json({ message: '缺少必要欄位：restaurantId 或 restaurantName' });
    }

    const record = await MealRecord.create({
      userId,
      restaurantId,
      restaurantName,
      rating: rating ? Number(rating) : undefined,
      note,
      menuName
    });

    res.json({ message: '用餐紀錄已儲存', recordId: record._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '伺服器錯誤' });
  }
});

// 查詢歷史紀錄（簡易版）
app.get('/api/meals/history', async (req, res) => {
  try {
    const { userId = 'guest', limit = 20 } = req.query;
    const list = await MealRecord.find({ userId })
      .sort({ date: -1 })
      .limit(Number(limit));
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '伺服器錯誤' });
  }
});
