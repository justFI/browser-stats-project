# Browser Stats Project

## 项目简介

本项目用于展示全球浏览器市场份额，并通过 Gemini AI 提供市场分析和趋势预测。前端为静态页面，后端为 Vercel Serverless Function（api/gemini.js），安全代理 Gemini API。

## 本地开发

1. 克隆代码仓库：
   ```sh
   git clone <your-repo-url>
   cd browser-stats-project
   ```
2. 安装依赖：
   ```sh
   npm install
   ```
3. 新建 `.env` 文件，内容参考 `.env.example`：
   ```
   GEMINI_API_KEY=你的真实key
   ```
4. 本地开发建议用 Vercel CLI：
   ```sh
   npx vercel dev
   ```
   或直接用 `npm run dev`（如有配置）。

## 部署到 Vercel

1. 推送代码到 GitHub。
2. 登录 [vercel.com](https://vercel.com/)，导入仓库。
3. 在 Vercel 项目设置中添加环境变量 `GEMINI_API_KEY`。
4. 一键部署，自动分配公开网址。

## 目录结构

- `index.html`：主页面
- `public/`：静态资源
- `api/gemini.js`：后端 Serverless Function，安全代理 Gemini API
- `.env.example`：环境变量示例

## 环境变量说明

- `GEMINI_API_KEY`：你的 Google Gemini API 密钥，**不要上传 .env 文件到仓库**。

## License

MIT
 