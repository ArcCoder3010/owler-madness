import OBR from "https://cdn.jsdelivr.net/npm/@owlbear-rodeo/sdk/+esm";

await OBR.onReady();

const btn = document.getElementById("activate");
const picker = document.getElementById("colorPicker");

const OVERLAY_ID = "tint-overlay-debug";

btn.onclick = async () => {
  try {
    await OBR.notification.show("Hello World!", "SUCCESS");
  } catch {}

  const color = picker.value || "#000000";

  try {
    await OBR.notification.show("COLOR: " + color, "INFO");
  } catch {}

  await applySolidTint(color);
};

async function applySolidTint(color) {
  try {
    await OBR.notification.show("REMOVING PREVIOUS OVERLAY", "INFO");
  } catch {}

  try {
    await OBR.scene.local.deleteItems([OVERLAY_ID]);
  } catch {}

  try {
    await OBR.notification.show("CREATING SVG OVERLAY", "INFO");
  } catch {}

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="5000" height="5000">
      <rect width="5000" height="5000" fill="${color}" fill-opacity="0.45"/>
    </svg>
  `;

  const encoded = btoa(svg);

  try {
    await OBR.notification.show("ADDING OVERLAY TO SCENE!", "INFO");
  } catch {}

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

  try {
    await OBR.notification.show("OVERLAY APPLIED", "SUCCESS");
  } catch {}
}
