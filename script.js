import OBR from "https://cdn.jsdelivr.net/npm/@owlbear-rodeo/sdk/+esm";

await OBR.onReady();

// =========================
// DEBUG: plugin carregado
// =========================
try {
  await OBR.notification.show("PLUGIN LOADED", "SUCCESS");
} catch {}

const btn = document.getElementById("activate");
const picker = document.getElementById("colorPicker");

const OVERLAY_ID = "fake-tint-overlay";

// URLs que você pediu
const IMAGE_1 = "https://i.pinimg.com/474x/ac/51/ef/ac51ef08735d2632d7e5b082fde78e83.jpg";
const IMAGE_2 = "https://webstockreview.net/images/white-square-border-png.png";

// =========================
// Botão
// =========================
btn.onclick = async () => {
  try {
    await OBR.notification.show("BUTTON CLICKED", "SUCCESS");
  } catch {}

  const color = picker.value || "#000000";

  try {
    await OBR.notification.show("COLOR PICKED: " + color, "INFO");
  } catch {}

  await applyOverlay(color);
};

// =========================
// Testador de overlay
// =========================
async function applyOverlay(color) {
  try {
    await OBR.notification.show("REMOVING OLD OVERLAY", "INFO");
  } catch {}

  // remove overlay antigo
  try {
    await OBR.scene.local.deleteItems([OVERLAY_ID]);
  } catch {}

  // tenta com a primeira imagem
  try {
    await OBR.notification.show("TRYING IMAGE 1 (Pinterest)", "INFO");
  } catch {}

  const ok1 = await tryImage(IMAGE_1, color);
  if (ok1) {
    try {
      await OBR.notification.show("IMAGE 1 SUCCESS", "SUCCESS");
    } catch {}
    return;
  }

  // tenta com a segunda imagem
  try {
    await OBR.notification.show("TRYING IMAGE 2 (webstockreview)", "INFO");
  } catch {}

  const ok2 = await tryImage(IMAGE_2, color);
  if (ok2) {
    try {
      await OBR.notification.show("IMAGE 2 SUCCESS", "SUCCESS");
    } catch {}
    return;
  }

  // se nenhuma funcionou
  try {
    await OBR.notification.show("BOTH IMAGES FAILED", "ERROR");
  } catch {}
}

// =========================
// Função que tenta aplicar imagem
// =========================
async function tryImage(url, color) {
  try {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="5000" height="5000">
        <defs>
          <filter id="tint">
            <feFlood flood-color="${color}" flood-opacity="0.5"/>
            <feComposite operator="atop" in2="SourceGraphic"/>
          </filter>
        </defs>

        <image href="${url}" width="5000" height="5000" filter="url(#tint)"/>
      </svg>
    `;

    const encoded = btoa(svg);

    await OBR.scene.local.addItems([
      {
        id: OVERLAY_ID,
        type: "IMAGE",
        image: {
          url: "data:image/svg+xml;base64," + encoded
        },
        width: 50000,
        height: 50000
      }
    ]);

    return true;
  } catch (err) {
    console.error("Image failed:", err);
    return false;
  }
}
