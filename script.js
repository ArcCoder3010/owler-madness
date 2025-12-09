import OBR, { buildEffect } from "https://cdn.jsdelivr.net/npm/@owlbear-rodeo/sdk/+esm";

await OBR.onReady();

const btnOn = document.getElementById("activate");
const btnOff = document.getElementById("deactivate");
const picker = document.getElementById("colorPicker");
const sizeSlider = document.getElementById("sizeSlider");
const intensitySlider = document.getElementById("intensitySlider");

const EFFECT_ID = "color-vignette-effect";

function hexToVec3(hex) {
  const r = parseInt(hex.substring(1, 3), 16) / 255;
  const g = parseInt(hex.substring(3, 5), 16) / 255;
  const b = parseInt(hex.substring(5, 7), 16) / 255;
  return { x: r, y: g, z: b };
}

async function applyVignette() {
  const hex = picker.value || "#000000";
  const color = hexToVec3(hex);
  const size = parseFloat(sizeSlider.value);
  const intensity = parseFloat(intensitySlider.value);

  try {
    await OBR.scene.local.deleteItems([EFFECT_ID]);
  } catch {}

  const sksl = `
    uniform vec2 size;
    uniform mat3 view;
    uniform vec3 tint;

    half4 main(float2 coord) {
  vec2 viewCoord = (vec3(coord, 1) * view).xy;
  vec2 p = viewCoord / size;
  p = p * 2.0 - 1.0;

  float d = length(p);

  float inner = ${size};
  float outer = 1.0;

  // Fade at outer edge
  float outerFade = smoothstep(inner, outer, d);

  // Fade for inner cutout
  float innerFade = smoothstep(inner - 0.02, inner, d);

  // True ring mask (no tint in center)
  float ring = outerFade - innerFade;

  return half4(tint, ring * ${intensity});
}
  `;

  const effect = buildEffect()
    .id(EFFECT_ID)
    .effectType("VIEWPORT")
    .uniforms([{ name: "tint", value: color }])
    .sksl(sksl)
    .locked(true)
    .disableHit(true)
    .build();

  await OBR.scene.local.addItems([effect]);
}

// Buttons
btnOn.onclick = applyVignette;

btnOff.onclick = async () => {
  await OBR.scene.local.deleteItems([EFFECT_ID]);
};

// Live update
sizeSlider.oninput = applyVignette;
intensitySlider.oninput = applyVignette;
picker.oninput = applyVignette;
