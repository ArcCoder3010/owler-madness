import OBR from "https://cdn.skypack.dev/@owlbear-rodeo/sdk";

let phrases = [];
let running = false;
let interval = null;

OBR.onReady(() => {
  OBR.broadcast.onMessage("madness:start", (event) => {
    phrases = [
      event.data.t1,
      event.data.t2,
      event.data.t3
    ].filter(p => p && p.trim() !== "");

    const color = event.data.color;
    const border = document.getElementById("border");
    border.style.borderColor = color;

    startEffect(color);
  });

  OBR.broadcast.onMessage("madness:stop", () => {
    stopEffect();
  });
});

function startEffect(color) {
  stopEffect();
  running = true;

  interval = setInterval(() => {
    if (!running || phrases.length === 0) return;

    const text = document.createElement("div");
    text.className = "flying-text";
    text.style.color = color;

    const phrase = phrases[Math.floor(Math.random() * phrases.length)];
    text.textContent = phrase;

    text.style.left = `${Math.random() * 100}%`;
    text.style.top = `${Math.random() * 100}%`;
    text.style.transform += ` rotate(${Math.random() * 360}deg)`;

    document.body.appendChild(text);

    setTimeout(() => {
      text.remove();
    }, 2500);

  }, 250);
}

function stopEffect() {
  running = false;
  if (interval) clearInterval(interval);

  const texts = document.querySelectorAll(".flying-text");
  texts.forEach(t => t.remove());
}
