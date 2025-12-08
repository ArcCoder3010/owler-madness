import OBR from "https://unpkg.com/@owlbear-rodeo/sdk?module";

(async () => {
  try {
    await OBR.onReady();

    const btn = document.getElementById("activate");
    const picker = document.getElementById("colorPicker");

    btn.onclick = async () => {
      const color = picker.value;
      await testOverlay(color);
    };

    async function testOverlay(color) {
      const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024">
        <rect x="10" y="10" width="1004" height="1004"
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
          width: 20000,
          height: 20000
        }
      ]);
    }

  } catch (err) {
    console.error("Erro no plugin:", err);
    alert("Erro: " + err.message);
  }
})();
