import OBR from "https://cdn.jsdelivr.net/npm/@owlbear-rodeo/sdk/+esm";;

(async () => {
  try {
    console.log("Script started");

    await OBR.onReady();

    console.log("OBR Ready");

    // Tenta notificar quando o plugin carrega
    try {
      await OBR.notification.show("Hello World! (plugin loaded)", "SUCCESS");
    } catch (e) {
      console.log("Notification failed at load:", e);
    }

    const btn = document.getElementById("activate");
    const picker = document.getElementById("colorPicker");

    if (!btn) {
      alert("ERRO: botão não encontrado");
      return;
    }

    if (!picker) {
      alert("ERRO: colorPicker não encontrado");
      return;
    }

    btn.onclick = async () => {
      console.log("Button clicked");

      // Notificação ao clicar
      try {
        await OBR.notification.show("Hello World! (button)", "SUCCESS");
      } catch (e) {
        console.log("Notification failed at click:", e);
      }

      const color = picker.value;

      console.log("Selected color:", color);

      try {
        await OBR.notification.show("Color is " + color, "INFO");
      } catch (e) {
        console.log("Notification failed at color log:", e);
      }

      await testOverlay(color);
    };

    async function testOverlay(color) {
      console.log("Starting overlay");

      try {
        await OBR.notification.show("Starting overlay...", "INFO");
      } catch {}

      const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024">
        <rect x="20" y="20" width="984" height="984"
              fill="none"
              stroke="${color}"
              stroke-width="60"/>
      </svg>
      `;

      const encoded = btoa(svg);

      try {
        await OBR.scene.local.addItems([
          {
            id: "debug-overlay",
            type: "IMAGE",
            image: {
              url: "data:image/svg+xml;base64," + encoded
            },
            width: 30000,
            height: 30000
          }
        ]);

        console.log("Overlay addItems called");

        try {
          await OBR.notification.show("Overlay addItems DONE", "SUCCESS");
        } catch {}

      } catch (err) {
        console.error("Overlay failed:", err);
        alert("Overlay failed: " + err.message);
      }
    }

  } catch (err) {
    console.error("Fatal plugin error:", err);
    alert("Fatal error: " + err.message);
  }
})();
