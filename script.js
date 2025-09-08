// 获取所有需要的HTML元素
const setupContainer = document.getElementById('setup-container');
const countdownContainer = document.getElementById('countdown-container');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const eventTitleInput = document.getElementById('event-title');
const eventDateInput = document.getElementById('event-date');
const errorMessage = document.getElementById('error-message');
const countdownTitle = document.getElementById('countdown-title');
const progressBar = document.getElementById('progress-bar');

const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const countdownEl = document.getElementById('countdown');
const messageEl = document.getElementById('message');

let timerInterval; // 用于存储计时器

// 更新倒计时的核心函数
function updateCountdown() {
    // 从本地存储中获取数据
    const savedData = JSON.parse(localStorage.getItem('countdownData'));
    if (!savedData) return;

    const targetDate = new Date(savedData.date);
    const startDate = new Date(savedData.startDate);
    const totalTime = targetDate - startDate;
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
        // 时间到了
        countdownEl.classList.add('hidden');
        messageEl.classList.remove('hidden');
        progressBar.style.width = '100%';
        clearInterval(timerInterval);
        return;
    }

    // 计算剩余时间
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    // 更新页面上的数字
    daysEl.innerText = formatTime(days);
    hoursEl.innerText = formatTime(hours);
    minutesEl.innerText = formatTime(minutes);
    secondsEl.innerText = formatTime(seconds);

    // 更新进度条
    const elapsedTime = now - startDate;
    const progressPercentage = Math.min((elapsedTime / totalTime) * 100, 100);
    progressBar.style.width = `${progressPercentage}%`;
}

// 格式化时间，如果小于10则在前面加'0'
function formatTime(time) {
    return time < 10 ? `0${time}` : time;
}

// 切换视图函数
function showCountdownView() {
    setupContainer.classList.add('hidden');
    countdownContainer.classList.remove('hidden');
}

function showSetupView() {
    countdownContainer.classList.add('hidden');
    setupContainer.classList.remove('hidden');
    clearInterval(timerInterval); // 停止计时器
    localStorage.removeItem('countdownData'); // 清除数据

    // =======================================================
    // === 改动在这里：设置默认的标题和时间 ===
    // HTML 的 datetime-local 输入框需要 'YYYY-MM-DDTHH:MM' 格式
    // "2025年12月21日上午9点" 对应的格式是 "2025-12-21T09:00"
    eventTitleInput.value = '目标日';
    eventDateInput.value = '2025-12-21T09:00';
    // =======================================================
}

// "开始倒计时"按钮的点击事件
startBtn.addEventListener('click', () => {
    const title = eventTitleInput.value;
    const date = eventDateInput.value;

    // 输入验证
    if (!title || !date) {
        errorMessage.innerText = '请填写标题和日期！';
        return;
    }
    const targetDate = new Date(date);
    if (targetDate <= new Date()) {
        errorMessage.innerText = '请选择一个未来的时间！';
        return;
    }
    errorMessage.innerText = '';

    // 将数据保存到本地存储 (localStorage)
    const countdownData = {
        title: title,
        date: date,
        startDate: new Date().toISOString() // 记录开始时间用于计算进度条
    };
    localStorage.setItem('countdownData', JSON.stringify(countdownData));

    // 更新UI并开始计时
    countdownTitle.innerText = title;
    showCountdownView();
    updateCountdown();
    timerInterval = setInterval(updateCountdown, 1000);
});

// "创建新的倒计时"按钮的点击事件
resetBtn.addEventListener('click', showSetupView);

// 页面加载时执行的逻辑
window.addEventListener('load', () => {
    const savedData = JSON.parse(localStorage.getItem('countdownData'));
    if (savedData) {
        // 如果有保存的数据，直接进入倒计时状态
        countdownTitle.innerText = savedData.title;
        showCountdownView();
        updateCountdown();
        timerInterval = setInterval(updateCountdown, 1000);
    } else {
        // 否则显示设置界面 (此时会自动填充默认值)
        showSetupView();
    }
});
