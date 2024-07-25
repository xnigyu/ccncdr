const images = [];
for (let year = 1; year <= 143; year++) {
    images.push({ year: year, src: `https://github.com/xnigyu/global2023/blob/main/${year}.png?raw=true` });
}

let currentIndex = 0;
let intervalId = null;
let isPlaying = true; // 用於跟踪播放狀態
let startTime = null;
const duration = 300; // 動畫持續時間（毫秒）
const imageElement = document.getElementById('image');
const slider = document.getElementById('slider');
const yearsContainer = document.querySelector('.years');

// 動態生成年份標記，每隔10年顯示一次
for (let year = 1; year <= 143; year += 10) {
    const span = document.createElement('span');
    span.textContent = year;
    yearsContainer.appendChild(span);
}

// 緩動函數：easeInOutQuad
function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function animateImageTransition(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;

    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeInOutQuad(progress);

    const nextIndex = (currentIndex + 1) % images.length;
    imageElement.style.opacity = 1 - easedProgress;

    if (progress < 1) {
        requestAnimationFrame(animateImageTransition);
    } else {
        showImage(nextIndex);
        startTime = null;
        imageElement.style.opacity = 1;
    }
}

function showImage(index) {
    if (index >= 0 && index < images.length) {
        currentIndex = index;
        imageElement.src = images[index].src;
        slider.value = index;
    }
}

function fadeImage(index) {
    imageElement.classList.add('fade-out');
    setTimeout(() => {
        showImage(index);
        imageElement.classList.remove('fade-out');
        imageElement.classList.add('fade-in');
    }, 500);
    setTimeout(() => {
        imageElement.classList.remove('fade-in');
    }, 1000);
}

function showNextImage() {
    fadeImage((currentIndex + 1) % images.length);
}

function startAutoPlay() {
    intervalId = setInterval(showNextImage, duration); // 每張圖片1秒
    isPlaying = true;
}

function stopAutoPlay() {
    clearInterval(intervalId);
    isPlaying = false;
}

slider.addEventListener('input', (e) => {
    showImage(Number(e.target.value));
    stopAutoPlay(); // 停止自動播放
});

imageElement.addEventListener('click', () => {
    if (isPlaying) {
        stopAutoPlay();
    } else {
        startAutoPlay();
    }
});

window.onload = () => {
    slider.max = images.length - 1;
    showImage(currentIndex);
    startAutoPlay(); // 自動播放
};
