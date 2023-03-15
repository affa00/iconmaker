// HTMLから要素を取得
const baseImageInput = document.getElementById('baseImageInput');
const overlayImageInputs = document.getElementById('overlayImageInputs');
const compositeButton = document.getElementById('compositeButton');
const compositeImageContainer = document.getElementById('compositeImageContainer');

// 画像ファイルの読み込み
function loadImages() {
  // 基準画像の読み込み
  const baseImageFile = baseImageInput.files[0];
  const baseImagePromise = new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const baseImage = new Image();
      baseImage.src = reader.result;
      baseImage.onload = () => {
        resolve(baseImage);
      };
    };
    reader.readAsDataURL(baseImageFile);
  });
  
  // 透過PNG画像の読み込み
  const overlayImagePromises = [];
  for (let i = 0; i < overlayImageInputs.files.length; i++) {
    const overlayImageFile = overlayImageInputs.files[i];
    const overlayImagePromise = new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const overlayImage = new Image();
        overlayImage.src = reader.result;
        overlayImage.onload = () => {
          resolve(overlayImage);
        };
      };
      reader.readAsDataURL(overlayImageFile);
    });
    overlayImagePromises.push(overlayImagePromise);
  }
  
  Promise.all([baseImagePromise, Promise.all(overlayImagePromises)]).then((results) => {
    const baseImage = results[0];
    const overlayImages = results[1];
    compositeImages(baseImage, overlayImages);
  });
}

// 画像の合成
function compositeImages(baseImage, overlayImages) {
  // 画像のサイズを取得
  const maxW = baseImage.width;
  const maxH = baseImage.height;
  
  // canvas要素の作成
  const canvas = document.createElement('canvas');
  canvas.width = maxW;
  canvas.height = maxH;
  const ctx = canvas.getContext('2d');
  
  // 基準画像を描画
  ctx.drawImage(baseImage, 0, 0, maxW, maxH);
  
  // 透過PNG画像を描画
  for (let i = 0; i < overlayImages.length; i++) {
    const overlayImage = overlayImages[i];
    const offsetX = (maxW - overlayImage.width) / 2;
   
    const offsetY = (maxH - overlayImage.height) / 2;
    ctx.drawImage(overlayImage, offsetX, offsetY);
  }
  
  // canvasを画像として出力
  const compositeImage = new Image();
  compositeImage.src = canvas.toDataURL('image/png');
  
  // 画像を表示
  compositeImageContainer.innerHTML = '';
  compositeImageContainer.appendChild(compositeImage);
}

// 合成ボタンのクリックイベントに関数を設定
compositeButton.addEventListener('click', loadImages);
