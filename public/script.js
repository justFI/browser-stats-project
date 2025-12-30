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

    // 初始化 Charts
    initCharts();

    // 初始化比较选项
    initComparisonOptions();

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
    
    // AI 浏览器比较功能
    const compareBtn = document.getElementById('compareBtn');
    const comparisonResult = document.getElementById('comparison-result');
    const compareLoader = document.getElementById('compare-loader');
    const compareBtnText = document.getElementById('compare-btn-text');
    
    compareBtn.addEventListener('click', async () => {
        const browserA = document.getElementById('browserA').value;
        const browserB = document.getElementById('browserB').value;
        
        if (browserA === browserB) {
            alert('请选择两个不同的浏览器进行对比。');
            return;
        }
        
        compareBtn.disabled = true;
        compareLoader.classList.remove('hidden');
        compareBtnText.textContent = '对比分析中...';
        comparisonResult.classList.add('hidden');
        
        const prompt = `请详细比较 ${browserA} 和 ${browserB} 这两款浏览器。从用户体验、性能、隐私安全、扩展生态等方面进行对比，并指出它们各自的优缺点。最后给出适合什么样的人群使用的建议。字数控制在200-300字左右。`;
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
            if (result.candidates && result.candidates.length > 0 && result.candidates[0].content) {
                const text = result.candidates[0].content.parts[0].text;
                comparisonResult.innerHTML = marked.parse ? marked.parse(text) : text.replace(/\n/g, '<br>');
                comparisonResult.classList.remove('hidden');
            } else {
                throw new Error('未能从API响应中获取有效内容。');
            }
        } catch (error) {
             comparisonResult.innerHTML = `<p class="text-red-600">抱歉，对比分析时出现错误。请稍后再试。</p><small class="text-red-500">${error.message}</small>`;
             comparisonResult.classList.remove('hidden');
        } finally {
            compareBtn.disabled = false;
            compareLoader.classList.add('hidden');
            compareBtnText.textContent = '开始对比分析';
        }
    });
});

function initCharts() {
    // 饼图
    const pieCtx = document.getElementById('sharePieChart').getContext('2d');
    new Chart(pieCtx, {
        type: 'doughnut',
        data: {
            labels: browserData.map(b => b.name),
            datasets: [{
                data: browserData.map(b => b.share),
                backgroundColor: [
                    '#4285F4', '#0EA5E9', '#0078D4', '#F97316', '#9333EA', '#EF4444'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: { font: { family: 'Inter' } }
                }
            }
        }
    });

    // 折线图 (模拟数据)
    const lineCtx = document.getElementById('trendLineChart').getContext('2d');
    const months = ['1月', '2月', '3月', '4月', '5月', '6月'];
    // 简单模拟一点波动
    const chromeData = [64.0, 64.2, 64.5, 64.1, 64.6, 64.8];
    const safariData = [18.8, 18.7, 18.5, 18.6, 18.5, 18.6];
    const edgeData = [5.0, 5.1, 5.2, 5.3, 5.3, 5.4];

    new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                {
                    label: 'Chrome',
                    data: chromeData,
                    borderColor: '#4285F4',
                    tension: 0.3,
                    fill: false
                },
                {
                    label: 'Safari',
                    data: safariData,
                    borderColor: '#0EA5E9',
                    tension: 0.3,
                    fill: false
                },
                {
                    label: 'Edge',
                    data: edgeData,
                    borderColor: '#0078D4',
                    tension: 0.3,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' }
            },
            scales: {
                y: { beginAtZero: false, min: 0 }
            }
        }
    });
}

function initComparisonOptions() {
    const browserA = document.getElementById('browserA');
    const browserB = document.getElementById('browserB');
    
    browserData.forEach(browser => {
        const optionA = document.createElement('option');
        optionA.value = browser.name;
        optionA.textContent = browser.name;
        browserA.appendChild(optionA);
        
        const optionB = document.createElement('option');
        optionB.value = browser.name;
        optionB.textContent = browser.name;
        browserB.appendChild(optionB);
    });
    
    // 设置默认值
    browserA.value = 'Chrome';
    browserB.value = 'Safari';
}
