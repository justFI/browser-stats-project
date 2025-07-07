
const fetch = require('node-fetch');
const HttpsProxyAgent = require('https-proxy-agent');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    res.status(500).json({ error: 'GEMINI_API_KEY not set' });
    return;
  }
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  try {
    const payload = req.body;
    // 检查代理环境变量
    let agent = undefined;
    const proxy = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
    if (proxy) {
      agent = new HttpsProxyAgent(proxy);
    }
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      agent
    });
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (jsonErr) {
      res.status(502).json({ error: 'Gemini API 返回非 JSON', detail: text });
      return;
    }
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Gemini API 调用失败', detail: err.message });
  }
};
