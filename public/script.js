// 浏览器市场份额数据
const browserData = [
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
    if (window.lucide) {
        lucide.createIcons();
    }

    // 市场分析功能
    const analyzeBtn = document.getElementById('analyzeBtn');
    const analysisResult = document.getElementById('analysis-result');
    const loader = document.getElementById('loader');
    const btnText = document.getElementById('btn-text');
    const initialPromptText = document.querySelector('#analysis-content p');

    analyzeBtn.addEventListener('click', async () => {
        analyzeBtn.disabled = true;
        loader.classList.remove('hidden');
        btnText.textContent = '分析中...';
        analysisResult.classList.add('hidden');
        if (initialPromptText) initialPromptText.classList.add('hidden');

        const dataString = browserData.map(b => `${b.name} ${b.share}%`).join(', ');
        const prompt = `请根据以下全球浏览器市场份额数据，为普通用户生成一段大约100-150字的简短市场分析。请用友好、易于理解的语言，指出1-2个最主要的市场趋势或现象。数据如下：${dataString}。`;
        let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
        const payload = { contents: chatHistory };
        const apiUrl = "/api/gemini";

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                throw new Error(`API 请求失败，状态码: ${response.status}`);
            }
            const result = await response.json();
            if (result.candidates && result.candidates.length > 0 && result.candidates[0].content && result.candidates[0].content.parts && result.candidates[0].content.parts.length > 0) {
                const text = result.candidates[0].content.parts[0].text;
                analysisResult.innerHTML = text.replace(/\n/g, '<br>');
                analysisResult.classList.remove('hidden');
            } else {
                throw new Error('未能从API响应中获取有效内容。');
            }
        } catch (error) {
            analysisResult.innerHTML = 'Gemini API 调用出错: ' + error;
            analysisResult.classList.remove('hidden');
        } finally {
            analyzeBtn.disabled = false;
            loader.classList.add('hidden');
            btnText.textContent = '生成分析报告';
        }
    });

    // 未来趋势预测功能
    const predictBtn = document.getElementById('predictBtn');
    const predictionResult = document.getElementById('prediction-result');
    const predictLoader = document.getElementById('predict-loader');
    const predictBtnText = document.getElementById('predict-btn-text');
    const initialPredictionText = document.querySelector('#prediction-content p');

    predictBtn.addEventListener('click', async () => {
        predictBtn.disabled = true;
        predictLoader.classList.remove('hidden');
        predictBtnText.textContent = '预测中...';
        predictionResult.classList.add('hidden');
        if (initialPredictionText) initialPredictionText.classList.add('hidden');

        const dataString = browserData.map(b => `${b.name} ${b.share}%`).join(', ');
        const prompt = `根据以下全球浏览器市场份额数据：${dataString}，请预测未来1-3年内浏览器市场可能出现的趋势、潜在的挑战或机遇，并简要说明原因。请用友好、易于理解的语言，字数在150-200字之间。`;
        let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
        const payload = { contents: chatHistory };
        const apiUrl = "/api/gemini";

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                throw new Error(`API 请求失败，状态码: ${response.status}`);
            }
            const result = await response.json();
            if (result.candidates && result.candidates.length > 0 && result.candidates[0].content && result.candidates[0].content.parts && result.candidates[0].content.parts.length > 0) {
                const text = result.candidates[0].content.parts[0].text;
                predictionResult.innerHTML = text.replace(/\n/g, '<br>');
                predictionResult.classList.remove('hidden');
            } else {
                throw new Error('未能从API响应中获取有效内容。');
            }
        } catch (error) {
            predictionResult.innerHTML = `<p class="text-red-600">抱歉，预测时出现错误。请稍后再试。</p><small class="text-red-500">${error.message}</small>`;
            predictionResult.classList.remove('hidden');
        } finally {
            predictBtn.disabled = false;
            predictLoader.classList.add('hidden');
            predictBtnText.textContent = '重新预测趋势';
        }
    });
});
