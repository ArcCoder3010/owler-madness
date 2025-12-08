import OBR from "https://cdn.jsdelivr.net/npm/@owlbear-rodeo/sdk/+esm";

await OBR.onReady();

const btn = document.getElementById("activate");
const picker = document.getElementById("colorPicker");

// ID padrão do overlay
const OVERLAY_ID = "color-border-overlay";

btn.onclick = async () => {
  const isGM = await OBR.player.getRole() === "GM";
  if (!isGM) return alert("Only the GM can activate this.");

  const color = picker.value;

  // salva a cor nos metadados da cena
  await OBR.scene.setMetadata({
    "color-border:color": color,
    "color-border:active": true
  });

  await applyOverlay(color);
};

// Observa mudanças p/ sincronizar com todos
OBR.scene.onMetadataChange(async (meta) => {
  if (meta["color-border:active"]) {
    await applyOverlay(meta["color-border:color"]);
  } else {
    clearOverlay();
  }
});

async function applyOverlay(color) {
  await clearOverlay();

  await OBR.scene.local.addItems([
    {
      id: OVERLAY_ID,
      type: "EFFECT",
      width: 100000,
      height: 100000,
      style: {
        fill: "transparent",
        stroke: color,
        strokeWidth: 60
      }
    }
  ]);
}

async function clearOverlay() {
  await OBR.scene.local.deleteItems([OVERLAY_ID]);
}
