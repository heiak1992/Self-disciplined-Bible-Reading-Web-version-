document.addEventListener('DOMContentLoaded', () => {
    // 初始化变量
    let wakeLock = null; // 屏幕常亮锁
    let timerId = null;
    let timeLeft = 25 * 60; // 默认25分钟
    let isPaused = true;

    // DOM元素
    const timerDisplay = document.getElementById('timerDisplay');
    const startTimerBtn = document.getElementById('startTimer');
    const settingsBtn = document.getElementById('openSettings');
    const settingsPanel = document.getElementById('settingsPanel');
    const closeSettingsBtn = document.getElementById('closeSettings');
    const keepScreenOnToggle = document.getElementById('keepScreenOn');
    const timerDurationSelect = document.getElementById('timerDuration');
    const meditationInput = document.getElementById('meditationInput');
    const feedbackBtn = document.getElementById('feedbackBtn');
    const helpBtn = document.getElementById('helpBtn');
    const feedbackModal = document.getElementById('feedbackModal');
    const helpModal = document.getElementById('helpModal');
    const themeButtons = document.querySelectorAll('.theme-btn');

    // 屏幕常亮功能
    async function requestWakeLock() {
        try {
            if ('wakeLock' in navigator) {
                wakeLock = await navigator.wakeLock.request('screen');
            }
        } catch (err) {
            console.error('屏幕常亮功能不可用:', err);
        }
    }

    // 释放屏幕常亮
    async function releaseWakeLock() {
        if (wakeLock) {
            await wakeLock.release();
            wakeLock = null;
        }
    }

    // 更新计时器显示
    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // 计时器功能
    function startTimer() {
        if (isPaused) {
            isPaused = false;
            startTimerBtn.innerHTML = '<span class="material-icons">pause</span>暂停';
            
            if (keepScreenOnToggle.checked) {
                requestWakeLock();
            }

            timerId = setInterval(() => {
                timeLeft--;
                updateTimerDisplay();

                if (timeLeft <= 0) {
                    clearInterval(timerId);
                    showCompletionMessage();
                    resetTimer();
                }
            }, 1000);
        } else {
            pauseTimer();
        }
    }

    function pauseTimer() {
        isPaused = true;
        clearInterval(timerId);
        startTimerBtn.innerHTML = '<span class="material-icons">play_arrow</span>继续';
        releaseWakeLock();
    }

    function resetTimer() {
        isPaused = true;
        timeLeft = parseInt(timerDurationSelect.value) * 60;
        updateTimerDisplay();
        startTimerBtn.innerHTML = '<span class="material-icons">play_arrow</span>开始专注读经';
        releaseWakeLock();
    }

    // 完成提醒
    function showCompletionMessage() {
        const message = document.createElement('div');
        message.className = 'completion-message';
        message.innerHTML = `
            <div class="message-content">
                <h3>🎉 今日目标已完成</h3>
                <p>愿上帝赐福你，再接再厉哦！</p>
                <button onclick="this.parentElement.parentElement.remove()">阿们</button>
            </div>
        `;
        document.body.appendChild(message);
    }

    // 主题切换
    function setTheme(themeName) {
        document.body.className = `${themeName}-theme`;
        localStorage.setItem('theme', themeName);
    }

    // 保存默想内容
    function saveMeditation() {
        localStorage.setItem('meditation', meditationInput.value);
    }

    // 事件监听器
    startTimerBtn.addEventListener('click', startTimer);

    settingsBtn.addEventListener('click', () => {
        settingsPanel.classList.add('active');
    });

    closeSettingsBtn.addEventListener('click', () => {
        settingsPanel.classList.remove('active');
    });

    timerDurationSelect.addEventListener('change', () => {
        resetTimer();
    });

    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            setTheme(btn.dataset.theme);
        });
    });

    meditationInput.addEventListener('input', saveMeditation);

    feedbackBtn.addEventListener('click', () => {
        feedbackModal.style.display = 'block';
    });

    helpBtn.addEventListener('click', () => {
        helpModal.style.display = 'block';
    });

    // 关闭模态框
    document.querySelectorAll('.modal .close-btn, .modal .cancel-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.modal').style.display = 'none';
        });
    });

    // 提交反馈
    document.getElementById('feedbackForm').addEventListener('submit', (e) => {
        e.preventDefault();
        // 这里可以添加发送反馈的逻辑
        alert('感谢您的反馈！');
        feedbackModal.style.display = 'none';
    });

    // 键盘快捷键
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            startTimer();
        } else if (e.code === 'Escape') {
            settingsPanel.classList.remove('active');
            feedbackModal.style.display = 'none';
            helpModal.style.display = 'none';
        }
    });

    // 初始化
    function init() {
        // 加载保存的主题
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);

        // 加载保存的默想内容
        const savedMeditation = localStorage.getItem('meditation');
        if (savedMeditation) {
            meditationInput.value = savedMeditation;
        }

        // 更新计时器显示
        updateTimerDisplay();
    }

    init();
});

// 添加自定义样式
const styles = `
    .completion-message {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
    }

    .message-content {
        background: white;
        padding: 30px;
        border-radius: 15px;
        text-align: center;
    }

    .message-content h3 {
        margin-bottom: 15px;
        color: #333;
    }

    .message-content button {
        margin-top: 20px;
        padding: 10px 30px;
        background: var(--light-primary);
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);
// 在现有的 JavaScript 代码中修改或添加以下代码

// 主题切换函数
function setTheme(themeName) {
    // 移除所有主题类
    document.body.classList.remove('light-theme', 'warm-theme', 'dark-theme');
    // 添加新主题类
    document.body.classList.add(`${themeName}-theme`);
    // 保存到本地存储
    localStorage.setItem('theme', themeName);
    console.log('Theme changed to:', themeName); // 添加调试日志
}

// 确保主题按钮事件监听正确设置
document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const theme = btn.dataset.theme;
        setTheme(theme);
        console.log('Theme button clicked:', theme); // 添加调试日志
    });
});

// 在初始化函数中加载保存的主题
function init() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    console.log('Initial theme:', savedTheme); // 添加调试日志
}