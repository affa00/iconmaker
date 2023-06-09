// HTMLから要素を取得
const baseImageInput = document.getElementById('baseImageInput');
const overlayImageInput = document.getElementById('overlayImageInput');
const compositeButton = document.getElementById('compositeButton');
const compositeImageContainer = document.getElementById('compositeImageContainer');

// 基準画像と透過PNG画像を読み込む関数
function loadImages() {
  // 基準画像を読み込み
  const baseImage = new Image();
  baseImage.onload = () => {
    // 画像読み込み後に実行する処理
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // canvasのサイズを基準画像のサイズに合わせる
    canvas.width = baseImage.width;
    canvas.height = baseImage.height;

    // 基準画像を描画
    ctx.drawImage(baseImage, 0, 0);

    // 透過PNG画像を読み込み
    const overlayImage = new Image();
    overlayImage.onload = () => {
      // 画像読み込み後に実行する処理
      const ratio = Math.min(canvas.width / overlayImage.width, canvas.height / overlayImage.height);
      const newWidth = overlayImage.width * ratio;
      const newHeight = overlayImage.height * ratio;

      // 透過PNG画像をリサイズして描画
      const offsetX = (canvas.width - newWidth) / 2;
      const offsetY = (canvas.height - newHeight) / 2;
      ctx.drawImage(overlayImage, offsetX, offsetY, newWidth, newHeight);
      
      // canvasを画像として出力
      const compositeImage = new Image();
      compositeImage.src = canvas.toDataURL('image/png');
      
      // 画像を表示
      compositeImageContainer.innerHTML = '';
      compositeImageContainer.appendChild(compositeImage);
    }
    overlayImage.onerror = () => {
      // 画像読み込みエラー時に実行する処理
      const errorMessage = document.createElement('p');
      errorMessage.textContent = `Error loading image: ${overlayImageInput.files[0].name}`;
      compositeImageContainer.innerHTML = '';
      compositeImageContainer.appendChild(errorMessage);
    };
    overlayImage.src = URL.createObjectURL(overlayImageInput.files[0]);
  }
  baseImage.onerror = () => {
    // 画像読み込みエラー時に実行する処理
    const errorMessage = document.createElement('p');
    errorMessage.textContent = `Error loading image: ${baseImageInput.files[0].name}`;
    compositeImageContainer.innerHTML = '';
    compositeImageContainer.appendChild(errorMessage);
  };
  baseImage.src = URL.createObjectURL(baseImageInput.files[0]);
}

// 合成ボタンのクリックイベントに関数を設定
compositeButton.addEventListener('click', loadImages);
