import { PanoVortexCanvas } from "./vortex_display.js";

const container = document.createElement("div");
container.id = "canvas-container";
container.style.cssText = "position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:1;background:#0A0A0A;";
document.body.appendChild(container);

const overlay = document.createElement("div");
overlay.style.cssText = "position:fixed;top:30px;left:40px;z-index:10;font-family:monospace;pointer-events:none;";
overlay.innerHTML = `
    <h1 style="color:#FFDAB9;font-size:24px;margin:0;letter-spacing:2px;">KNOCKSSTUD<span style="color:#FC8EAC;">i</span>OS</h1>
    <p style="color:#00FFFF;font-size:14px;margin:5px 0 0 0;letter-spacing:1px;">3D VORTEX PANOCANVAS // WEBGL ACTIVE</p>
`;
document.body.appendChild(overlay);

const dummyVideo = document.createElement("video");
dummyVideo.loop = true;
dummyVideo.muted = true;
dummyVideo.playsInline = true;

const vortex = new PanoVortexCanvas(container, [dummyVideo]);

