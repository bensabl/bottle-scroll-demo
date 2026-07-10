const canvas = document.getElementById("scroll-canvas");
const context = canvas.getContext("2d");

// Frames: Bottle-00201.png to Bottle-00350.png
const firstFrame = 0;
const lastFrame = 350;
const frameCount = lastFrame - firstFrame + 1;

const currentFrame = (index) => {
  const frameNumber = firstFrame + index;
  return `frames/Bottle-${String(frameNumber).padStart(5, "0")}.jpeg`;
};

const images = [];
let loadedImages = 0;

for (let i = 0; i < frameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i);

  img.onload = () => {
    loadedImages++;

    if (loadedImages === 1) {
      resizeCanvas();
      render(0);
    }
  };

  img.onerror = () => {
    console.warn("Frame missing:", img.src);
  };

  images.push(img);
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function render(index) {
  const img = images[index];

  if (!img || !img.complete) return;

  context.clearRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "white";
  context.fillRect(0, 0, canvas.width, canvas.height);

  const canvasRatio = canvas.width / canvas.height;
  const imageRatio = img.width / img.height;

  let drawWidth;
  let drawHeight;
  let x;
  let y;

  if (imageRatio > canvasRatio) {
    drawWidth = canvas.width;
    drawHeight = drawWidth / imageRatio;
    x = 0;
    y = (canvas.height - drawHeight) / 2;
  } else {
    drawHeight = canvas.height;
    drawWidth = drawHeight * imageRatio;
    x = (canvas.width - drawWidth) / 2;
    y = 0;
  }

  context.drawImage(img, x, y, drawWidth, drawHeight);
}

function updateFrameOnScroll() {
  const section = document.querySelector(".animation-section");
  const rect = section.getBoundingClientRect();

  const scrollProgress = Math.min(
    Math.max(-rect.top / (section.offsetHeight - window.innerHeight), 0),
    1
  );

  const frameIndex = Math.round(scrollProgress * (frameCount - 1));

  render(frameIndex);
}

window.addEventListener("scroll", updateFrameOnScroll);

window.addEventListener("resize", () => {
  resizeCanvas();
  updateFrameOnScroll();
});

resizeCanvas();
render(0);
