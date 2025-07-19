import express from 'express';
import cors from 'cors';
import runRecapGenerator from './sportsRunner.js';
import gameSummary from './endpoints/game-summary.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const allowedOrigin = 'https://gaboai.com';
// const allowedOrigin = 'http://localhost:5173';



app.use(cors({
  origin: function (origin, callback) {
    if (origin === allowedOrigin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));



app.use(express.json());






app.get('/game-summary', async (req, res) => {
  const { team } = req.query;
  if (!team) {
    return res.status(400).json({ error: 'Missing team parameter' });
  }

  try {

    res.json(gameSummary(team));

  } catch (error) {
    console.error("❌ Error:", error.response?.data || error.message);
    res.status(500).json({ error: 'Server error' });
  }
});






app.listen(3000, () => {
  console.log('✅ Server running on http://localhost:3000');

  runRecapGenerator().catch(err => console.error('❌ Recap loop crashed:', err));
});