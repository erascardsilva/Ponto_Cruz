const fileInput = document.getElementById("fileInput");
const originalCanvas = document.getElementById("originalCanvas");
const crossStitchCanvas = document.getElementById("crossStitchCanvas");
const originalCtx = originalCanvas.getContext("2d");
const crossStitchCtx = crossStitchCanvas.getContext("2d");
const downloadButton = document.getElementById("downloadButton");
const squareSizeRange = document.getElementById("squareSizeRange");
const squareSizeValue = document.getElementById("squareSizeValue");

// Evento para ajustar o valor do quadrado de ponto cruz em tempo real
squareSizeRange.addEventListener("input", function () {
  squareSizeValue.textContent = squareSizeRange.value;
  processImage();
});

// Evento de carregamento de arquivo
fileInput.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.onload = function () {
        // Limpa os canvases
        originalCtx.clearRect(
          0,
          0,
          originalCanvas.width,
          originalCanvas.height
        );
        crossStitchCtx.clearRect(
          0,
          0,
          crossStitchCanvas.width,
          crossStitchCanvas.height
        );

        // Desenha a imagem original no canvas original
        originalCtx.drawImage(
          img,
          0,
          0,
          originalCanvas.width,
          originalCanvas.height
        );

        // Processa a imagem para gerar o padrão de ponto cruz
        processImage();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// Função para processar a imagem e gerar o padrão de ponto cruz
function processImage() {
  const imageData = originalCtx.getImageData(
    0,
    0,
    originalCanvas.width,
    originalCanvas.height
  );
  const data = imageData.data;

  // Limpa o canvas de ponto cruz e define o fundo branco
  crossStitchCtx.fillStyle = "#ffffff"; // Branco
  crossStitchCtx.fillRect(
    0,
    0,
    crossStitchCanvas.width,
    crossStitchCanvas.height
  );

  // Tamanho do quadrado de ponto cruz (ajuste conforme necessário)
  const squareSize = parseInt(squareSizeRange.value); // Obtém o tamanho do quadrado do input range

  // Paleta de cores de ponto cruz (cores escuras para o padrão de ponto cruz)
  const crossStitchColors = ["#000000"]; // Apenas preto para o símbolo "X"

  // Itera pelos pixels da imagem
  for (let y = 0; y < originalCanvas.height; y += squareSize) {
    for (let x = 0; x < originalCanvas.width; x += squareSize) {
      const pixelIndex = (y * originalCanvas.width + x) * 4;
      const r = data[pixelIndex];
      const g = data[pixelIndex + 1];
      const b = data[pixelIndex + 2];

      // Desenha o símbolo de ponto cruz (X) com a cor do pixel original
      crossStitchCtx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      crossStitchCtx.font = `${squareSize}px Arial`;
      crossStitchCtx.fillText("X", x, y + squareSize);
    }
  }

  // Mostra o botão de download da imagem convertida
  downloadButton.style.display = "block";
  // Remove event listener anterior para evitar múltiplos registros
  downloadButton.removeEventListener("click", handleDownload);
  // Adiciona o event listener para o download da imagem convertida
  downloadButton.addEventListener("click", handleDownload);
}

// Função para lidar com o evento de download da imagem
function handleDownload() {
  const fileName = prompt("Coloque o nome do arquivo):", "padrao_ponto_cruz");
  if (fileName === null) return; // Cancelado pelo usuário

  const dataURL = crossStitchCanvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = dataURL;
  a.download = `${fileName}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
