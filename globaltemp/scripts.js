const images = [];
for (let year = 1960; year <= 2023; year++) {
    images.push({ year: year, src: `https://github.com/xnigyu/globaltemp/blob/main/${year}.png?raw=true` });
}

let currentIndex = 0;
let intervalId = null;
let isPlaying = true;
let scale = 1;

const imageElement = document.getElementById('image');
const slider = document.getElementById('slider');
const yearsContainer = document.querySelector('.years');
const zoomInButton = document.getElementById('zoom-in');
const zoomOutButton = document.getElementById('zoom-out');
const zoomContainer = document.querySelector('.zoom-container');

// 動態生成年份標記，每隔10年顯示一次
for (let year = 1960; year <= 2023; year += 10) {
    const span = document.createElement('span');
    span.textContent = year;
    yearsContainer.appendChild(span);
}

function showImage(index) {
    return new Promise((resolve, reject) => {
        if (index >= 0 && index < images.length) {
            currentIndex = index;
            const img = new Image();
            img.src = images[index].src;
            img.onload = () => {
                imageElement.src = images[index].src;
                slider.value = index;
                resolve();
            };
            img.onerror = reject;
        } else {
            reject(new Error("Index out of bounds"));
        }
    });
}

async function showNextImage() {
    if (currentIndex < images.length - 1) {
        let nextIndex = currentIndex + 1;
        await showImage(nextIndex);
    } else {
        stopAutoPlay(); // Stop when reaching the last image
    }
}

function startAutoPlay() {
    if (!intervalId) {
        intervalId = setInterval(showNextImage, 500); // 每張圖片1秒
        isPlaying = true;
    }
}

function stopAutoPlay() {
    clearInterval(intervalId);
    intervalId = null;
    isPlaying = false;
}

function zoomIn() {
    scale += 0.1;
    zoomContainer.style.transform = `scale(${scale})`;
}

function zoomOut() {
    scale = Math.max(1, scale - 0.1); // 縮小不小於原始大小
    zoomContainer.style.transform = `scale(${scale})`;
}

slider.addEventListener('input', (e) => {
    showImage(Number(e.target.value)).then(stopAutoPlay); // 停止自動播放
});

imageElement.addEventListener('click', () => {
    if (isPlaying) {
        stopAutoPlay();
    } else {
        if (currentIndex === images.length - 1) {
            // Restart from the beginning if the last image is reached
            showImage(0).then(startAutoPlay);
        } else {
            startAutoPlay();
        }
    }
});

zoomInButton.addEventListener('click', zoomIn);
zoomOutButton.addEventListener('click', zoomOut);

window.onload = async () => {
    slider.max = images.length - 1;
    await showImage(currentIndex); // 顯示當前索引的圖片
    startAutoPlay(); // 自動播放
};

window.onblur = stopAutoPlay; // 當窗口失去焦點時停止播放
window.onfocus = startAutoPlay; // 當窗口重新獲得焦點時開始播放
