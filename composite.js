function compositeImages() {
  const imageFiles = document.getElementById('imageInput').files;
  const images = [];

  // 画像読み込み完了時のコールバック関数
  function imageLoaded() {
    let maxWidth = 0;
    let maxHeight = 0;

    // 画像サイズの取得と、最大幅と高さの計算
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      if (img.width > maxWidth) {
        maxWidth = img.width;
      }
      if (img.height > maxHeight) {
        maxHeight = img.height;
      }
    }

    // 合成画像の作成と、各画像の貼り付け
    const compositeCanvas = document.createElement('canvas');
    compositeCanvas.width = maxWidth;
    compositeCanvas.height = maxHeight;
    const ctx = compositeCanvas.getContext('2d');
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      const offsetX = (maxWidth - img.width) / 2;
      const offsetY = (maxHeight - img.height) / 2;
      ctx.drawImage(img, offsetX, offsetY);
    }

    // 合成画像の表示
    const compositeImage = new Image();
    compositeImage.src = compositeCanvas.toDataURL();
    const compositeImageContainer = document.getElementById('compositeImageContainer');
    compositeImageContainer.innerHTML = '';
    compositeImageContainer.appendChild(compositeImage);
  }

  // 画像ファイルの読み込みと、images配列への追加
  for (let i = 0; i < imageFiles.length; i++) {
    const file = imageFiles[i];
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = new Image();
      img.onload = function() {
        images.push(img);
        if (images.length === imageFiles.length) {
          imageLoaded();
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}
