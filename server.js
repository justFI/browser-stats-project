const express = require('express');
const fetch = require('node-fetch');
const dotenv = require('dotenv');
dotenv.config();

const path = require('path');
const app = express();
app.use(express.json());

// 静态托管 public 目录（或当前目录）下的所有文件
app.use(express.static(path.join(__dirname)));

// 访问根路径时返回 index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 建议将 API Key 存在 .env 文件中，安全性更高
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

app.post('/api/gemini', async (req, res) => {
  try {
    const payload = req.body;
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    // 新增详细日志
    console.error('Gemini API 调用失败:', err);
    res.status(500).json({ error: '后端调用 Gemini 失败', detail: err.message });
  }
});

app.listen(3000, () => console.log('API server running on http://localhost:3000'));
