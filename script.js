import OBR, { buildEffect } from "https://cdn.jsdelivr.net/npm/@owlbear-rodeo/sdk/+esm";

await OBR.onReady();

const btnOn = document.getElementById("activate");
const btnOff = document.getElementById("deactivate");
const picker = document.getElementById("colorPicker");

const EFFECT_ID = "color-vignette-effect";

function hexToVec3(hex) {
  const r = parseInt(hex.substring(1, 3), 16) / 255;
  const g = parseInt(hex.substring(3, 5), 16) / 255;
  const b = parseInt(hex.substring(5, 7), 16) / 255;
  return { x: r, y: g, z: b };
}

// ===================== ACTIVATE =====================
btnOn.onclick = async () => {
  try {
    await OBR.notification.show("Hello World!", "SUCCESS");
  } catch {}

  const hex = picker.value || "#000000";
  const color = hexToVec3(hex);

  await applyVignette(color);
};

// ===================== DEACTIVATE =====================
btnOff.onclick = async () => {
  try {
    await OBR.scene.local.deleteItems([EFFECT_ID]);
    await OBR.notification.show("Vignette removed ✅", "SUCCESS");
  } catch {}
};

async function applyVignette(colorVec3) {
  try {
    await OBR.scene.local.deleteItems([EFFECT_ID]);
  } catch {}

  // SMALLER VIGNETTE: changed smoothstep values
  const sksl = `
    uniform vec2 size;
    uniform mat3 view;
    uniform vec3 tint;

    half4 main(float2 coord) {
      vec2 viewCoord = (vec3(coord, 1) * view).xy;
      vec2 p = viewCoord / size;
      p = p * 2.0 - 1.0;

      float d = length(p);

      // Smaller effect (tighter edges)
      float alpha = smoothstep(0.65, 1.0, d);

      return half4(tint, alpha * 0.7);
    }
  `;

  const effect = buildEffect()
    .id(EFFECT_ID)
    .effectType("VIEWPORT")
    .uniforms([{ name: "tint", value: colorVec3 }])
    .sksl(sksl)
    .locked(true)
    .disableHit(true)
    .build();

  await OBR.scene.local.addItems([effect]);
}
