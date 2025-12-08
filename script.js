import OBR from "https://unpkg.com/@owlbear-rodeo/sdk?module";

(async () => {
  try {
    await OBR.onReady();

    const btn = document.getElementById("activate");
    const picker = document.getElementById("colorPicker");

    await OBR.notification.show("SDK Ready", "INFO");

    btn.onclick = async () => {
      await OBR.notification.show("Button Clicked", "INFO");

      const color = picker.value;

      await OBR.notification.show("Cor: " + color, "INFO");

      await testOverlay(color);
    };

    async function testOverlay(color) {
      const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024">
        <rect x="0" y="0" width="1024" height="1024"
              fill="none"
              stroke="${color}"
              stroke-width="50"/>
      </svg>
      `;

      const encoded = btoa(svg);

      await OBR.scene.local.addItems([
        {
          id: "debug-overlay",
          type: "IMAGE",
          image: {
            url: "data:image/svg+xml;base64," + encoded
          },
          width: 5000,
          height: 5000
        }
      ]);

      await OBR.notification.show("Overlay attempt done", "INFO");
    }
  } catch (err) {
    console.error("Erro no plugin:", err);
    alert("Erro: " + err.message);
  }
})();
