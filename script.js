import OBR from "https://cdn.jsdelivr.net/npm/@owlbear-rodeo/sdk/+esm";

await OBR.onReady();

const btn = document.getElementById("activate");
const picker = document.getElementById("colorPicker");

const OVERLAY_ID = "color-border-overlay";

// Debug inicial para confirmar que o plugin carregou
OBR.notification.show("Plugin carregado!", "INFO");

btn.onclick = async () => {
  const role = await OBR.player.getRole();

  // Debug ao clicar
  await OBR.notification.show("Hello World!", "SUCCESS");

  if (role !== "GM") {
    await OBR.notification.show("Apenas o GM pode ativar.", "WARNING");
    return;
  }

  const color = picker.value;

  // Salva nos metadados
  await OBR.scene.setMetadata({
    "color-border:color": color,
    "color-border:active": true
  });

  await applyOverlay(color);
};

// Escuta mudanças de metadata
OBR.scene.onMetadataChange(async (meta) => {
  if (meta["color-border:active"]) {
    await applyOverlay(meta["color-border:color"]);
  }
});

async function applyOverlay(color) {
  await clearOverlay();

  // Usando imagem de borda
  await OBR.scene.local.addItems([
    {
      id: OVERLAY_ID,
      type: "IMAGE",
      image: {
        url: "https://webstockreview.net/images/white-square-border-png.png"
      },
      width: 100000,
      height: 100000,
      style: {
        opacity: 1,
        tint: color
      }
    }
  ]);

  await OBR.notification.show("Overlay aplicado!", "INFO");
}

async function clearOverlay() {
  await OBR.scene.local.deleteItems([OVERLAY_ID]);
}
