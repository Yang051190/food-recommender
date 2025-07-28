require('dotenv').config();
const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant');

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);

  await Restaurant.deleteMany({});

  const docs = [
    {
      name: '大心新泰式',
      type: '泰式',
      rating: 4.2,
      priceLevel: 2,
      address: '台北市信義區市府路45號',
      location: { type: 'Point', coordinates: [121.56, 25.033] }
    },
    {
      name: '福勝亭',
      type: '日式',
      rating: 3.9,
      priceLevel: 1,
      address: '台北市大安區復興南路一段',
      location: { type: 'Point', coordinates: [121.543, 25.026] }
    },
    {
      name: '八方雲集',
      type: '中式',
      rating: 4.0,
      priceLevel: 1,
      address: '台北市中山區南京東路',
      location: { type: 'Point', coordinates: [121.533, 25.052] }
    }
  ];

  await Restaurant.insertMany(docs);
  console.log('示範餐廳已匯入');
  await mongoose.disconnect();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
