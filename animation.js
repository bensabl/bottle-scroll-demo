const canvas = document.getElementById("scroll-canvas");
const context = canvas.getContext("2d");

const frameCount = 8;

const currentFrame = (index) =>
  `frames/Bottles-opening_bottle${index}.jpeg`;

const images = [];
let loadedImages = 0;

for (let i = 0; i < frameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i);

  img.onload = () => {
    loadedImages++;

    if (loadedImages === frameCount) {
      resizeCanvas();
      render(0);
    }
  };

  images.push(img);
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function render(index) {
  const img = images[index];

  context.clearRect(0, 0, canvas.width, canvas.height);

  const canvasRatio = canvas.width / canvas.height;
  const imageRatio = img.width / img.height;

  let drawWidth;
  let drawHeight;
  let x;
  let y;

  if (imageRatio > canvasRatio) {
    drawHeight = canvas.height;
    drawWidth = drawHeight * imageRatio;
    x = (canvas.width - drawWidth) / 2;
    y = 0;
  } else {
    drawWidth = canvas.width;
    drawHeight = drawWidth / imageRatio;
    x = 0;
    y = (canvas.height - drawHeight) / 2;
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

  const frameIndex = Math.min(
    frameCount - 1,
    Math.floor(scrollProgress * frameCount)
  );

  render(frameIndex);
}

window.addEventListener("scroll", updateFrameOnScroll);

window.addEventListener("resize", () => {
  resizeCanvas();
  updateFrameOnScroll();
});