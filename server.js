const express = require('express');
const fetch = require('node-fetch');
const dotenv = require('dotenv');
dotenv.config();

const path = require('path');
const app = express();
app.use(express.json());

// 静态文件托管
app.use(express.static(path.join(__dirname))); // 托管根目录，用于 index.html
app.use(express.static(path.join(__dirname, 'public'))); // 托管 public 目录，用于 script.js 等

// 访问根路径时返回 index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 从环境变量中获取 API Key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error('错误：GEMINI_API_KEY 未在 .env 文件中设置。');
  process.exit(1);
}
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

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

// 导出 Express 应用实例，以便 Vercel 等平台可以将其作为无服务器函数使用
module.exports = app;
