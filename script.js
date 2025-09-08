// =======================================================
// === 请在这里设置你的目标日期和时间！ ===
// 格式：'年-月-日T时:分:秒'  例如：'2026-01-01T00:00:00'
const targetDate = new Date('2025-12-20T00:00:00');
// =======================================================

// 获取HTML中的元素
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const countdownEl = document.getElementById('countdown');
const messageEl = document.getElementById('message');

function updateCountdown() {
    const now = new Date();
    const diff = targetDate - now; // 剩余时间的毫秒数

    if (diff <= 0) {
        // 时间到了
        countdownEl.classList.add('hidden');
        messageEl.classList.remove('hidden');
        clearInterval(timerInterval); // 停止计时器
        return;
    }

    // 将毫秒转换为天、小时、分钟和秒
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    // 在页面上显示
    daysEl.innerText = formatTime(days);
    hoursEl.innerText = formatTime(hours);
    minutesEl.innerText = formatTime(minutes);
    secondsEl.innerText = formatTime(seconds);
}

// 格式化时间，如果数字小于10，则在前面加一个'0'
function formatTime(time) {
    return time < 10 ? `0${time}` : time;
}

// 立即运行一次，避免页面加载时数字闪烁
updateCountdown();

// 每秒更新一次倒计时
const timerInterval = setInterval(updateCountdown, 1000);