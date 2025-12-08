import OBR, { buildImage } from "https://cdn.jsdelivr.net/npm/@owlbear-rodeo/sdk/+esm";

await OBR.onReady();

const btn = document.getElementById("activate");
const picker = document.getElementById("colorPicker");

const ID = "color-border-overlay";

if (!btn || !picker) {
  alert("Erro: UI não encontrada");
}

btn.onclick = async () => {
  const color = picker.value || "#ff0000";

  // SVG com borda colorida
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024">
      <rect x="20" y="20" width="984" height="984"
            fill="none"
            stroke="${color}"
            stroke-width="60"/>
    </svg>
  `;

  const encoded = btoa(svg);
  const url = "data:image/svg+xml;base64," + encoded;

  // Remove overlay antigo (se existir)
  try {
    await OBR.scene.local.deleteItems([ID]);
  } catch {}

  // Pega tamanho da viewport pra centralizar
  const view = await OBR.viewport.getBounds();

  const image = buildImage()
    .id(ID)
    .url(url)
    .size({ width: 20000, height: 20000 })    // bem grande pra cobrir tudo
    .position({ x: view.center.x, y: view.center.y })
    .rotation(0)
    .locked(true)
    .layer("FOREGROUND")
    .build();

  // Adiciona o overlay
  await OBR.scene.local.addItems([image]);
};
