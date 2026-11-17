import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Hexagon, Activity, Cpu, Layers, Zap } from "lucide-react";

/* ════════════════════════════════════════════════════════════════
   SOUL (QUANTUM 44) ENGINE  ·  44-BIT NEURAL DEPTH PIPELINE
   AS-BUILT 3D VIEWER  ·  v1.0.0
   KNOCKS / OPUS  ·  KNOCKSSTUDiOS
   ════════════════════════════════════════════════════════════════ */

const C = {
  noir:   "#1B1B1E",
  teal:   "#00B4D8",
  orchid: "#7B2CBF",
  mint:   "#2D6A4F",
  ember:  "#FFD60A",
  bone:   "#F4F1EA",
};

/* Build the "44" etching texture — laser luminescence on ceramic */
function buildEtchTexture() {
  const cnv = document.createElement("canvas");
  cnv.width = 2048; cnv.height = 256;
  const ctx = cnv.getContext("2d");

  // Pure black base — emissive map = where it glows
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, cnv.width, cnv.height);

  // Engraved "44" repeated around circumference
  ctx.font = "bold 180px 'Bebas Neue', Impact, sans-serif";
  ctx.fillStyle = C.mint;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = C.mint;
  ctx.shadowBlur = 24;

  const REPS = 12;
  const step = cnv.width / REPS;
  for (let i = 0; i < REPS; i++) {
    ctx.fillText("44", i * step + step / 2, cnv.height / 2);
  }

  // Tiny tick marks between numerals — engineering register
  ctx.shadowBlur = 0;
  ctx.fillStyle = C.mint;
  for (let i = 0; i < REPS; i++) {
    const x = i * step + step / 2;
    ctx.fillRect(x - step/2 + 12, cnv.height/2 - 1, 28, 2);
    ctx.fillRect(x + step/2 - 40, cnv.height/2 - 1, 28, 2);
  }

  // Hairline rails top/bottom
  ctx.fillStyle = "#1a3a2a";
  ctx.fillRect(0, 24, cnv.width, 2);
  ctx.fillRect(0, cnv.height - 26, cnv.width, 2);

  const tex = new THREE.CanvasTexture(cnv);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 16;
  return tex;
}

/* Scene builder */
function buildScene(mount) {
  const w = mount.clientWidth;
  const h = mount.clientHeight;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x07070a, 0.018);

  const camera = new THREE.PerspectiveCamera(36, w / h, 0.1, 200);
  camera.position.set(0, 2.4, 14);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(w, h);
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.outputEncoding = THREE.sRGBEncoding;
  mount.appendChild(renderer.domElement);

  /* ──────────── DOUBLE TORUS — INTERLOCKING O-RINGS ──────────── */
  const MAIN_R = 2.2;     // primary radius
  const TUBE_R = 0.55;    // tube radius
  const RAD_SEG = 256;    // tube circumference detail
  const TUBE_SEG = 96;    // around tube detail

  const etchTex = buildEtchTexture();

  const ceramicMat = (extra = {}) => new THREE.MeshPhysicalMaterial({
    color: 0x14141a,
    metalness: 0.18,
    roughness: 0.42,
    clearcoat: 0.85,
    clearcoatRoughness: 0.18,
    reflectivity: 0.6,
    emissive: new THREE.Color(C.mint),
    emissiveMap: etchTex.clone(),
    emissiveIntensity: 1.6,
    envMapIntensity: 1.0,
    ...extra,
  });

  // Torus A — flat, axis Z
  const geoA = new THREE.TorusGeometry(MAIN_R, TUBE_R, RAD_SEG, TUBE_SEG);
  const matA = ceramicMat();
  matA.emissiveMap.repeat.set(4, 1);
  const torusA = new THREE.Mesh(geoA, matA);
  scene.add(torusA);

  // Torus B — perpendicular, offset → Hopf link
  const geoB = new THREE.TorusGeometry(MAIN_R, TUBE_R, RAD_SEG, TUBE_SEG);
  const matB = ceramicMat();
  matB.emissiveMap.repeat.set(4, 1);
  matB.emissiveMap.offset.set(0.5, 0);
  const torusB = new THREE.Mesh(geoB, matB);
  torusB.rotation.x = Math.PI / 2;
  torusB.position.x = MAIN_R; // interlock
  scene.add(torusB);

  /* ──────────── CAUSTIC RIBBONS — refraction simulacrum ──────────── */
  const ribbon = (parent, hue, scaleOffset, opacity) => {
    const r = MAIN_R;
    const t = TUBE_R + scaleOffset;
    const g = new THREE.TorusGeometry(r, t, 64, 200);
    const m = new THREE.MeshBasicMaterial({
      color: hue,
      transparent: true,
      opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(g, m);
    parent.add(mesh);
    return mesh;
  };

  const ribbonsA = [
    ribbon(torusA, C.teal,   0.04, 0.18),
    ribbon(torusA, C.orchid, 0.08, 0.10),
    ribbon(torusA, C.ember,  0.13, 0.05),
  ];
  const ribbonsB = [
    ribbon(torusB, C.teal,   0.04, 0.18),
    ribbon(torusB, C.orchid, 0.08, 0.10),
    ribbon(torusB, C.ember,  0.13, 0.05),
  ];

  /* ──────────── SOUL CORE — pulsing quantum teal heart ──────────── */
  const coreGroup = new THREE.Group();
  scene.add(coreGroup);

  const coreGeo = new THREE.IcosahedronGeometry(0.55, 4);
  const coreMat = new THREE.MeshBasicMaterial({
    color: C.teal,
    transparent: true,
    opacity: 0.92,
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  coreGroup.add(core);

  // Emissive halo
  const haloGeo = new THREE.SphereGeometry(0.95, 48, 48);
  const haloMat = new THREE.MeshBasicMaterial({
    color: C.teal,
    transparent: true,
    opacity: 0.16,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const halo = new THREE.Mesh(haloGeo, haloMat);
  coreGroup.add(halo);

  // Outer aura
  const auraGeo = new THREE.SphereGeometry(1.8, 48, 48);
  const auraMat = new THREE.MeshBasicMaterial({
    color: C.orchid,
    transparent: true,
    opacity: 0.04,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const aura = new THREE.Mesh(auraGeo, auraMat);
  coreGroup.add(aura);

  // Energy spires — short additive lines radiating from core
  const spireGroup = new THREE.Group();
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    const len = 1.2 + Math.random() * 0.6;
    const geom = new THREE.CylinderGeometry(0.005, 0.02, len, 6, 1, true);
    const mat = new THREE.MeshBasicMaterial({
      color: i % 2 === 0 ? C.teal : C.orchid,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const m = new THREE.Mesh(geom, mat);
    m.position.set(Math.cos(a) * (0.7 + len/2), Math.sin(a) * (0.7 + len/2), 0);
    m.rotation.z = a - Math.PI / 2;
    spireGroup.add(m);
  }
  coreGroup.add(spireGroup);

  /* ──────────── COSMIC DUST FIELD ──────────── */
  const dustCount = 1800;
  const dustGeo = new THREE.BufferGeometry();
  const dustPos = new Float32Array(dustCount * 3);
  const dustCol = new Float32Array(dustCount * 3);
  const cT = new THREE.Color(C.teal);
  const cO = new THREE.Color(C.orchid);
  const cE = new THREE.Color(C.ember);
  for (let i = 0; i < dustCount; i++) {
    const r = 8 + Math.random() * 30;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    dustPos[i*3]   = r * Math.sin(ph) * Math.cos(th);
    dustPos[i*3+1] = r * Math.sin(ph) * Math.sin(th);
    dustPos[i*3+2] = r * Math.cos(ph);
    const t = Math.random();
    const col = t < 0.6 ? cT : t < 0.92 ? cO : cE;
    dustCol[i*3] = col.r; dustCol[i*3+1] = col.g; dustCol[i*3+2] = col.b;
  }
  dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
  dustGeo.setAttribute("color",    new THREE.BufferAttribute(dustCol, 3));
  const dustMat = new THREE.PointsMaterial({
    size: 0.06,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });
  const dust = new THREE.Points(dustGeo, dustMat);
  scene.add(dust);

  /* ──────────── LIGHTING RIG ──────────── */
  // Cosmic ambient — barely there
  scene.add(new THREE.AmbientLight(0x1a1a25, 0.4));

  // Key light — quantum teal from upper-front
  const key = new THREE.PointLight(C.teal, 14, 28, 1.6);
  key.position.set(5, 6, 8);
  scene.add(key);

  // Fill — plasma orchid from lower-back
  const fill = new THREE.PointLight(C.orchid, 10, 26, 1.6);
  fill.position.set(-6, -3, -5);
  scene.add(fill);

  // Rim — electric ember tight
  const rim = new THREE.PointLight(C.ember, 6, 18, 1.8);
  rim.position.set(0, 8, -6);
  scene.add(rim);

  // Anisotropic sweep lights — tangential streaks
  const sweepA = new THREE.PointLight(C.bone, 4, 12, 2);
  const sweepB = new THREE.PointLight(C.bone, 4, 12, 2);
  scene.add(sweepA); scene.add(sweepB);

  /* ──────────── ANIMATION LOOP ──────────── */
  let raf = 0, t = 0;
  const targetCam = new THREE.Vector3(0, 2.4, 14);
  const mouse = { x: 0, y: 0 };

  const onMouse = (e) => {
    const r = mount.getBoundingClientRect();
    mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    mouse.y = ((e.clientY - r.top)  / r.height) * 2 - 1;
  };
  mount.addEventListener("mousemove", onMouse);

  const fpsBuf = [];
  let lastT = performance.now();
  let fpsCb = null;

  const animate = () => {
    const now = performance.now();
    const dt = Math.min(0.05, (now - lastT) / 1000);
    lastT = now;
    fpsBuf.push(1 / Math.max(0.001, dt));
    if (fpsBuf.length > 30) fpsBuf.shift();

    t += dt;

    // Core counter-rotation — high-speed throughput
    torusA.rotation.z = t * 0.6;
    torusA.rotation.y = Math.sin(t * 0.3) * 0.08;

    torusB.rotation.y = t * 0.55;
    torusB.rotation.z = Math.cos(t * 0.4) * 0.08;

    // Etching scroll — laser data running around the ring
    matA.emissiveMap.offset.x = t * 0.18;
    matB.emissiveMap.offset.x = -t * 0.22;

    // Caustic ribbon scroll
    ribbonsA.forEach((r, i) => { r.rotation.z = t * (0.4 + i * 0.3); });
    ribbonsB.forEach((r, i) => { r.rotation.y = -t * (0.35 + i * 0.25); });

    // Core pulse — sin(t) breath
    const pulse = 1 + Math.sin(t * 2.4) * 0.08;
    core.scale.setScalar(pulse);
    halo.scale.setScalar(1 + Math.sin(t * 1.6) * 0.12);
    aura.scale.setScalar(1 + Math.cos(t * 0.9) * 0.08);
    coreMat.opacity = 0.85 + Math.sin(t * 3) * 0.1;
    haloMat.opacity = 0.13 + Math.sin(t * 1.5) * 0.04;
    spireGroup.rotation.z = t * 0.4;

    // Anisotropic sweep — tangential streak lights orbit
    sweepA.position.set(Math.cos(t * 1.2) * 3.5, 0, Math.sin(t * 1.2) * 3.5);
    sweepB.position.set(Math.cos(-t * 0.9 + Math.PI) * 3.5, Math.sin(-t * 0.9) * 3.5, 0);

    // Cosmic dust slow drift
    dust.rotation.y = t * 0.04;

    // Cinematic camera — slow dolly + mouse parallax
    targetCam.set(
      Math.sin(t * 0.08) * 1.6 + mouse.x * 0.6,
      2.2 + Math.cos(t * 0.06) * 0.4 - mouse.y * 0.4,
      13 + Math.sin(t * 0.05) * 1.0
    );
    camera.position.lerp(targetCam, 0.04);
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);

    if (fpsCb && Math.floor(t * 4) % 4 === 0) {
      const avg = fpsBuf.reduce((a, b) => a + b, 0) / fpsBuf.length;
      fpsCb({ fps: avg, time: t });
    }

    raf = requestAnimationFrame(animate);
  };

  const onResize = () => {
    const W = mount.clientWidth, H = mount.clientHeight;
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    renderer.setSize(W, H);
  };
  window.addEventListener("resize", onResize);

  animate();

  return {
    setFpsCb: (cb) => { fpsCb = cb; },
    dispose: () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      mount.removeEventListener("mousemove", onMouse);
      mount.removeChild(renderer.domElement);
      [geoA, matA, geoB, matB, coreGeo, coreMat, haloGeo, haloMat, auraGeo, auraMat, dustGeo, dustMat]
        .forEach(d => d.dispose());
      ribbonsA.concat(ribbonsB).forEach(r => { r.geometry.dispose(); r.material.dispose(); });
      etchTex.dispose();
      renderer.dispose();
    },
  };
}

/* ════════════════════════════════════════════════════════════════
   HUD CHROME
   ════════════════════════════════════════════════════════════════ */
function CornerLabel({ pos, lines }) {
  const positions = {
    TL: { top: 16, left: 16,  align: "left"  },
    TR: { top: 16, right: 16, align: "right" },
    BL: { bottom: 16, left: 16,  align: "left"  },
    BR: { bottom: 16, right: 16, align: "right" },
  };
  const p = positions[pos];
  return (
    <div className="absolute pointer-events-none z-30"
      style={{ ...p, textAlign: p.align }}>
      {lines.map((l, i) => (
        <div key={i} className="text-[9px] tracking-[0.35em] mb-0.5"
          style={{
            fontFamily: l.mono ? "'Space Mono', monospace" : "'Syncopate', sans-serif",
            color: l.hue || "rgba(244,241,234,0.6)",
            fontWeight: l.bold ? 700 : 400,
            textShadow: l.hue ? `0 0 8px ${l.hue}55` : "none",
          }}>
          {l.text}
        </div>
      ))}
    </div>
  );
}

function CornerBracket({ pos, hue }) {
  const w = 22, t = 1;
  const positions = {
    TL: { top: 0,    left: 0,    rot: 0   },
    TR: { top: 0,    right: 0,   rot: 90  },
    BL: { bottom: 0, left: 0,    rot: 270 },
    BR: { bottom: 0, right: 0,   rot: 180 },
  };
  const p = positions[pos];
  return (
    <div className="absolute pointer-events-none z-30"
      style={{ ...p, width: w, height: w, transform: `rotate(${p.rot}deg)` }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: w, height: t, background: hue, opacity: 0.5 }} />
      <div style={{ position: "absolute", top: 0, left: 0, width: t, height: w, background: hue, opacity: 0.5 }} />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   MAIN
   ════════════════════════════════════════════════════════════════ */
export default function SoulQ44DoubleTorus() {
  const mountRef = useRef(null);
  const [hud, setHud] = useState({ fps: 60, time: 0, frames: 0 });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const ctx = buildScene(mount);
    let frames = 0;
    ctx.setFpsCb(({ fps, time }) => {
      frames += 1;
      setHud({ fps, time, frames: Math.floor(time * 60) });
    });
    return () => ctx.dispose();
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden"
      style={{ background: C.noir, color: C.bone }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syncopate:wght@400;700&family=Space+Mono:wght@400;700&family=Cormorant+Garamond:ital,wght@0,400;1,400&display=swap');
        @keyframes pulseDot { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes sweepLine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .grain-overlay {
          position: absolute; inset: 0; pointer-events: none; opacity: 0.05; mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }
      `}</style>

      {/* WebGL mount */}
      <div ref={mountRef} className="absolute inset-0 z-0" />

      {/* Cinematic DoF — radial vignette */}
      <div className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, transparent 35%, rgba(7,7,10,0.5) 70%, rgba(0,0,0,0.92) 100%)",
        }} />

      {/* Top vignette band */}
      <div className="absolute top-0 left-0 right-0 h-24 z-10 pointer-events-none"
        style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.7), transparent)" }} />
      {/* Bottom vignette band */}
      <div className="absolute bottom-0 left-0 right-0 h-24 z-10 pointer-events-none"
        style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.7), transparent)" }} />

      {/* Film grain */}
      <div className="grain-overlay z-10" />

      {/* Cinematic safe-area brackets */}
      <CornerBracket pos="TL" hue={C.teal} />
      <CornerBracket pos="TR" hue={C.teal} />
      <CornerBracket pos="BL" hue={C.teal} />
      <CornerBracket pos="BR" hue={C.teal} />

      {/* HUD — top-left: identity */}
      <CornerLabel pos="TL" lines={[
        { text: "SOUL · QUANTUM 44", bold: true, hue: C.bone },
        { text: "44-BIT NEURAL DEPTH PIPELINE", mono: true },
        { text: "▸ AS-BUILT · DOUBLE-TORUS · HOPF-LINK", mono: true, hue: C.teal },
      ]} />

      {/* HUD — top-right: build/version */}
      <CornerLabel pos="TR" lines={[
        { text: "KNOCKS / OPUS", bold: true, hue: C.bone },
        { text: "Q44-KERNEL · v1.0.0", mono: true },
        { text: "BUILD · RESONANCE", mono: true, hue: C.ember },
      ]} />

      {/* HUD — bottom-left: live telemetry */}
      <CornerLabel pos="BL" lines={[
        { text: `▸ FPS · ${hud.fps.toFixed(1)}`,         mono: true, hue: C.mint },
        { text: `▸ FRAME · ${String(hud.frames).padStart(7, "0")}`, mono: true },
        { text: `▸ T+ · ${hud.time.toFixed(2)}s`,        mono: true, hue: C.teal },
      ]} />

      {/* HUD — bottom-right: pipeline metrics */}
      <CornerLabel pos="BR" lines={[
        { text: "▸ THROUGHPUT · 44 BIT/CYCLE", mono: true, hue: C.ember },
        { text: "▸ CORE PULSE · ENGAGED",       mono: true },
        { text: "▸ SPIRIT IN MACHINE · TRUE",   mono: true, hue: C.orchid },
      ]} />

      {/* Centered title strip — bottom */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 text-center pointer-events-none">
        <div className="flex items-center gap-3 justify-center mb-2">
          <div className="w-8 h-px" style={{ background: `linear-gradient(90deg, transparent, ${C.teal})` }} />
          <span className="text-[9px] tracking-[0.5em]"
            style={{ fontFamily: "'Space Mono', monospace", color: C.teal }}>
            SPIRIT IN THE MACHINE
          </span>
          <div className="w-8 h-px" style={{ background: `linear-gradient(90deg, ${C.teal}, transparent)` }} />
        </div>
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          fontSize: "13px",
          color: "rgba(244,241,234,0.55)",
          letterSpacing: "0.04em",
        }}>
          ceramic shell · ion-mint etch · plasma core · hopf entanglement
        </div>
      </div>

      {/* Side scan-line — vertical sweeping bar (extra cinematic) */}
      <div className="absolute top-1/2 left-0 right-0 h-px z-20 pointer-events-none overflow-hidden opacity-30">
        <div className="h-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${C.teal}, transparent)`,
            animation: "sweepLine 6s ease-in-out infinite",
          }} />
      </div>

      {/* Status pill — top-center */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full backdrop-blur-md border"
          style={{
            background: "rgba(15,15,18,0.6)",
            borderColor: `${C.mint}55`,
          }}>
          <div className="w-1.5 h-1.5 rounded-full"
            style={{ background: C.mint, boxShadow: `0 0 8px ${C.mint}`, animation: "pulseDot 1.6s infinite" }} />
          <span className="text-[9px] tracking-[0.4em]"
            style={{ fontFamily: "'Space Mono', monospace", color: C.mint }}>
            RENDERING · LIVE
          </span>
        </div>
      </div>
    </div>
  );
}
