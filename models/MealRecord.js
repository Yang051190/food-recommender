const mongoose = require('mongoose');

const MealRecordSchema = new mongoose.Schema({
  userId: { type: String, default: 'guest' }, // 先用 guest，之後可改成真正登入使用者
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  restaurantName: { type: String, required: true },
  menuName: { type: String },        // 先留空，未來可加入菜單
  rating: { type: Number, min: 1, max: 5 },
  note: { type: String },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('MealRecord', MealRecordSchema);
