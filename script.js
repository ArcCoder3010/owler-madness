import OBR, { buildEffect } from "https://cdn.jsdelivr.net/npm/@owlbear-rodeo/sdk/+esm";

await OBR.onReady();

const btn = document.getElementById("activate");
const picker = document.getElementById("colorPicker");

const EFFECT_ID = "color-vignette-effect";

// Converte #rrggbb para vec3
function hexToVec3(hex) {
  const r = parseInt(hex.substring(1, 3), 16) / 255;
  const g = parseInt(hex.substring(3, 5), 16) / 255;
  const b = parseInt(hex.substring(5, 7), 16) / 255;
  return { x: r, y: g, z: b };
}

btn.onclick = async () => {
  try {
    await OBR.notification.show("Hello World!", "SUCCESS");
  } catch {}

  const hex = picker.value || "#000000";
  const color = hexToVec3(hex);

  try {
    await OBR.notification.show("Color picked: " + hex, "INFO");
  } catch {}

  await applyVignette(color);
};

async function applyVignette(colorVec3) {
  try {
    await OBR.notification.show("Removing old vignette...", "INFO");
  } catch {}

  try {
    await OBR.scene.local.deleteItems([EFFECT_ID]);
  } catch {}

  try {
    await OBR.notification.show("Building vignette shader...", "INFO");
  } catch {}

  const sksl = `
    uniform vec2 size;
    uniform mat3 view;
    uniform vec3 tint;

    half4 main(float2 coord) {
      // Converte coordenadas para viewport space
      vec2 viewCoord = (vec3(coord, 1) * view).xy;
      vec2 p = viewCoord / size;

      // Centraliza (-1 a 1)
      p = p * 2.0 - 1.0;

      // Distância do centro
      float d = length(p);

      // Intensidade da borda
      float alpha = smoothstep(0.4, 1.0, d);

      return half4(tint, alpha * 0.7);
    }
  `;

  const effect = buildEffect()
    .id(EFFECT_ID)
    .effectType("VIEWPORT")
    .uniforms([
      { name: "tint", value: colorVec3 }
    ])
    .sksl(sksl)
    .locked(true)
    .disableHit(true)
    .build();

  try {
    await OBR.notification.show("Adding vignette...", "INFO");
  } catch {}

  await OBR.scene.local.addItems([effect]);

  try {
    await OBR.notification.show("VIGNETTE APPLIED ✅", "SUCCESS");
  } catch {}
}
