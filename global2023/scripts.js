const images = [];
for (let year = 1; year <= 143; year++) {
    images.push({ year: year, src: `https://github.com/xnigyu/global2023/blob/main/${year}.png?raw=true` });
}

let currentIndex = 0;
let intervalId = null;
let isPlaying = true; // 用於跟蹤播放狀態

const imageElement = document.getElementById('image');
const slider = document.getElementById('slider');
const yearsContainer = document.querySelector('.years');

// 動態生成年份標記，每隔10年顯示一次
for (let year = 1; year <= 143; year += 10) {
    const span = document.createElement('span');
    span.textContent = year;
    yearsContainer.appendChild(span);
}

function showImage(index) {
    if (index >= 0 && index < images.length) {
        currentIndex = index;
        imageElement.src = images[index].src;
        slider.value = index;
    }
}

function showNextImage() {
    let nextIndex = (currentIndex + 1) % images.length;
    showImage(nextIndex);
}

function startAutoPlay() {
    intervalId = setInterval(showNextImage, 1000); // 每張圖片1秒
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
