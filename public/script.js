// 浏览器市场份额数据
const browserData = [
    // 使用 placehold.co 占位符图片来确保显示
    { name: 'Chrome', share: 64.8, developer: 'Google', logo: 'https://placehold.co/60x60/4285F4/ffffff?text=C', color: 'from-blue-500 to-blue-700' },
    { name: 'Safari', share: 18.6, developer: 'Apple', logo: 'https://placehold.co/60x60/1DA1F2/ffffff?text=S', color: 'from-sky-500 to-sky-700' },
    { name: 'Edge', share: 5.4, developer: 'Microsoft', logo: 'https://placehold.co/60x60/0078D4/ffffff?text=E', color: 'from-teal-500 to-teal-700' },
    { name: 'Firefox', share: 2.8, developer: 'Mozilla', logo: 'https://placehold.co/60x60/FF7139/ffffff?text=F', color: 'from-orange-500 to-orange-700' },
    { name: 'Samsung Internet', share: 2.6, developer: 'Samsung', logo: 'https://placehold.co/60x60/663399/ffffff?text=SI', color: 'from-purple-500 to-purple-700' },
    { name: 'Opera', share: 2.2, developer: 'Opera Software', logo: 'https://placehold.co/60x60/CC0F16/ffffff?text=O', color: 'from-red-500 to-red-700' }
];

document.addEventListener('DOMContentLoaded', () => {
    const statsContainer = document.getElementById('browser-stats');
    const tableBody = document.getElementById('browser-table-body');

    // 动态生成图表和表格
    browserData.forEach((browser, index) => {
        // 生成图表项
        const statItem = document.createElement('div');
        statItem.className = 'browser-item';
        statItem.innerHTML = `
            <div class="flex items-center justify-between mb-2">
                <div class="flex items-center space-x-3">
                    <img src="${browser.logo}" alt="${browser.name} Logo" class="w-8 h-8 rounded-full shadow-sm">
                    <span class="font-semibold text-lg text-gray-900">${browser.name}</span>
                </div>
                <span class="text-gray-800 font-bold text-lg">${browser.share}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div class="bg-gradient-to-r ${browser.color} h-full rounded-full chart-bar-animation" style="width: ${browser.share}%;"></div>
            </div>
        `;
        statsContainer.appendChild(statItem);

        // 生成表格行
        const tableRow = document.createElement('tr');
        tableRow.className = 'hover:bg-gray-100 transition-colors duration-200';
        tableRow.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">${index + 1}</td>
            <td class="px-6 py-4 whitespace-nowrap flex items-center space-x-3">
                <img src="${browser.logo}" alt="${browser.name} Logo" class="w-7 h-7 rounded-full">
                <span>${browser.name}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-700">${browser.share}%</td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-700">${browser.developer}</td>
        `;
        tableBody.appendChild(tableRow);
    });

    // 初始化 Lucide Icons
    lucide.createIcons();

    // API 调用通用函数
    async function callGeminiAPI(prompt, resultElement, button, loader, btnTextElement, originalBtnText) {
        button.disabled = true;
        loader.classList.remove('hidden');
        btnTextElement.textContent = '处理中...';
        resultElement.classList.add('hidden');

        try {
            const response = await fetch('/api/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }] })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API 请求失败: ${errorData.error || response.status}`);
            }

            const result = await response.json();
            if (result.candidates && result.candidates.length > 0 && result.candidates[0].content) {
                const analysisText = result.candidates[0].content.parts[0].text;
                resultElement.innerHTML = marked.parse(analysisText); // 使用 marked.js 渲染 Markdown
                resultElement.classList.remove('hidden');
            } else {
                throw new Error('无效的 API 响应格式');
            }
        } catch (error) {
            console.error('API 调用错误:', error);
            resultElement.innerHTML = `<p class="text-red-600">分析失败，请稍后重试。错误：${error.message}</p>`;
            resultElement.classList.remove('hidden');
        } finally {
            button.disabled = false;
            loader.classList.add('hidden');
            btnTextElement.textContent = originalBtnText;
        }
    }

    // 市场分析功能
    const analyzeBtn = document.getElementById('analyzeBtn');
    const analysisResult = document.getElementById('analysis-result');
    const analyzeLoader = document.getElementById('loader');
    const analyzeBtnText = document.getElementById('btn-text');

    analyzeBtn.addEventListener('click', () => {
        const dataString = browserData.map(b => `${b.name} ${b.share}%`).join(', ');
        const prompt = `请根据以下全球浏览器市场份额数据，为普通用户生成一段大约100-150字的简短市场分析。请用友好、易于理解的语言，指出1-2个最主要的市场趋势或现象。数据如下：${dataString}。`;
        callGeminiAPI(prompt, analysisResult, analyzeBtn, analyzeLoader, analyzeBtnText, '生成分析报告');
    });

    // 未来趋势预测功能
    const predictBtn = document.getElementById('predictBtn');
    const predictionResult = document.getElementById('prediction-result');
    const predictLoader = document.getElementById('predict-loader');
    const predictBtnText = document.getElementById('predict-btn-text');

    predictBtn.addEventListener('click', () => {
        const dataString = browserData.map(b => `${b.name} ${b.share}%`).join(', ');
        const prompt = `根据以下浏览器市场份额数据，预测未来1-2年内可能出现的2-3个主要趋势。请用简洁、易于理解的语言描述，并可以适当提出一些对开发者的建议。数据：${dataString}。`;
        callGeminiAPI(prompt, predictionResult, predictBtn, predictLoader, predictBtnText, '预测未来趋势');
    });
});