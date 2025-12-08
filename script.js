import OBR from "https://unpkg.com/@owlbear-rodeo/sdk?module";

await OBR.onReady();

const btn = document.getElementById("activate");
const picker = document.getElementById("colorPicker");

// Overlay principal
const OVERLAY_ID = "debug-overlay";

btn.onclick = async () => {
  const color = picker.value;

  // Aplica overlay
  await applyBorder(color);
};

async function applyBorder(color) {
  await clearOverlay();

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1000">
    <rect x="10" y="10" width="980" height="980"
          fill="none"
          stroke="${color}"
          stroke-width="50"/>
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
      width: 20000,
      height: 20000
    }
  ]);
}

async function clearOverlay() {
  await OBR.scene.local.deleteItems([OVERLAY_ID]);
}
