export interface SuggestionChip {
  id: string;
  label: string;
  prompt: string;
  description: string;
  image: string;
}

export interface MediaSelection {
  id: string;
  source: 'suggestion' | 'upload';
  images: string[];    // asset URLs or data URLs
  description: string;
}

export const MAX_PRODUCT_IMAGES = 1;

function makeSvg(content: string, width = 800, height = 600, bg = '#18181b'): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <rect width="${width}" height="${height}" fill="${bg}" />
    ${content}
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// 1. Artisan Ceramic Mug
const artisanMugSvg = makeSvg(`
  <defs>
    <radialGradient id="studioKey" cx="40%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#3f3f46" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#09090b" stop-opacity="1" />
    </radialGradient>
    <linearGradient id="mugGlaze" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fdba74" />
      <stop offset="45%" stop-color="#ea580c" />
      <stop offset="85%" stop-color="#7c2d12" />
      <stop offset="100%" stop-color="#431407" />
    </linearGradient>
    <linearGradient id="speckle" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#fff" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#000" stop-opacity="0.3" />
    </linearGradient>
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="15" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <rect width="800" height="600" fill="url(#studioKey)" />
  <!-- Shadow on table -->
  <ellipse cx="400" cy="460" rx="140" ry="24" fill="#000" opacity="0.6" filter="blur(8px)" />
  <!-- Mug Handle -->
  <circle cx="510" cy="350" r="58" fill="none" stroke="url(#mugGlaze)" stroke-width="28" stroke-linecap="round" />
  <circle cx="510" cy="350" r="58" fill="none" stroke="url(#speckle)" stroke-width="28" stroke-linecap="round" opacity="0.4" />
  <!-- Mug Body -->
  <rect x="300" y="250" width="180" height="190" rx="16" fill="url(#mugGlaze)" />
  <rect x="300" y="250" width="180" height="190" rx="16" fill="url(#speckle)" opacity="0.3" />
  <!-- Rim highlight -->
  <ellipse cx="390" cy="250" rx="90" ry="16" fill="#fed7aa" />
  <ellipse cx="390" cy="250" rx="84" ry="12" fill="#431407" />
  <ellipse cx="390" cy="250" rx="78" ry="8" fill="#1c1917" />
  <!-- Specular glaze shine -->
  <path d="M320 270 Q340 340 330 420" stroke="#ffedd5" stroke-width="8" stroke-linecap="round" opacity="0.6" fill="none" filter="url(#softGlow)" />
`, 800, 600, '#18181b');

// 2. Colorful Mug
const colorfulMugSvg = makeSvg(`
  <defs>
    <radialGradient id="bgMug2" cx="50%" cy="40%" r="65%">
      <stop offset="0%" stop-color="#27272a" />
      <stop offset="100%" stop-color="#09090b" />
    </radialGradient>
    <linearGradient id="colorWave" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#06b6d4" />
      <stop offset="35%" stop-color="#8b5cf6" />
      <stop offset="70%" stop-color="#ec4899" />
      <stop offset="100%" stop-color="#f59e0b" />
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#bgMug2)" />
  <ellipse cx="400" cy="460" rx="145" ry="25" fill="#000" opacity="0.7" filter="blur(10px)" />
  <!-- Handle -->
  <circle cx="515" cy="340" r="62" fill="none" stroke="#ec4899" stroke-width="26" />
  <!-- Mug -->
  <rect x="290" y="240" width="190" height="200" rx="20" fill="url(#colorWave)" />
  <ellipse cx="385" cy="240" rx="95" ry="18" fill="#a7f3d0" />
  <ellipse cx="385" cy="240" rx="88" ry="13" fill="#111827" />
  <!-- Colorblock shapes -->
  <circle cx="340" cy="330" r="28" fill="#facc15" opacity="0.9" />
  <polygon points="410,310 440,360 380,360" fill="#38bdf8" opacity="0.9" />
  <rect x="330" y="380" width="100" height="30" rx="15" fill="#ffffff" opacity="0.8" />
`, 800, 600, '#121215');

// 3. Perfume Bottle
const perfumeSvg = makeSvg(`
  <defs>
    <linearGradient id="goldCap" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ca8a04" />
      <stop offset="50%" stop-color="#fef08a" />
      <stop offset="100%" stop-color="#854d0e" />
    </linearGradient>
    <linearGradient id="glassLiquid" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0284c7" stop-opacity="0.85" />
      <stop offset="50%" stop-color="#0f766e" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#1e1b4b" stop-opacity="0.95" />
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="#0c0a09" />
  <ellipse cx="400" cy="480" rx="130" ry="22" fill="#000" opacity="0.8" filter="blur(12px)" />
  <!-- Bottle body -->
  <rect x="310" y="250" width="180" height="210" rx="24" fill="url(#glassLiquid)" stroke="#38bdf8" stroke-width="2" />
  <rect x="330" y="270" width="140" height="170" rx="12" fill="#ffffff" fill-opacity="0.08" />
  <!-- Label -->
  <rect x="345" y="325" width="110" height="60" rx="4" fill="#09090b" stroke="#ca8a04" stroke-width="1.5" />
  <text x="400" y="350" font-family="serif" font-size="12" fill="#fef08a" text-anchor="middle" letter-spacing="3">ESSENCE</text>
  <text x="400" y="370" font-family="sans-serif" font-size="7" fill="#a1a1aa" text-anchor="middle" letter-spacing="2">GLASS DECANTER</text>
  <!-- Gold Neck -->
  <rect x="375" y="215" width="50" height="36" rx="4" fill="url(#goldCap)" />
  <!-- Cap / Stopper -->
  <polygon points="360,215 440,215 425,160 375,160" fill="url(#goldCap)" />
  <circle cx="400" cy="155" r="14" fill="#14b8a6" stroke="#ca8a04" stroke-width="2" />
`, 800, 600, '#0c0a09');

// 4. Running Sneaker
const sneakerSvg = makeSvg(`
  <defs>
    <linearGradient id="sneakerUpper" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#18181b" />
      <stop offset="60%" stop-color="#27272a" />
      <stop offset="100%" stop-color="#3f3f46" />
    </linearGradient>
    <linearGradient id="neonAccent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#22c55e" />
      <stop offset="100%" stop-color="#06b6d4" />
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="#18181b" />
  <ellipse cx="400" cy="460" rx="220" ry="26" fill="#000" opacity="0.8" filter="blur(14px)" />
  <!-- Sneaker Silhouette -->
  <!-- Chunky Sole -->
  <path d="M220 420 Q320 440 460 435 Q560 430 600 390 L585 370 Q480 395 360 390 Q260 390 220 420 Z" fill="#ffffff" />
  <path d="M250 420 Q350 435 480 430 L530 405 Q440 410 330 405 Z" fill="url(#neonAccent)" />
  <!-- Upper body -->
  <path d="M220 410 Q230 350 280 340 Q330 335 380 290 Q430 250 480 320 Q540 340 585 375 L560 390 Q460 385 330 385 Z" fill="url(#sneakerUpper)" />
  <!-- Collar & tongue -->
  <path d="M380 290 Q410 240 450 245 L475 310 Z" fill="#52525b" />
  <!-- Swoosh/Decal -->
  <path d="M320 370 Q420 320 500 340 Q440 375 340 375 Z" fill="url(#neonAccent)" opacity="0.9" />
  <!-- Laces -->
  <line x1="390" y1="290" x2="430" y2="305" stroke="#ffffff" stroke-width="4" stroke-linecap="round" />
  <line x1="400" y1="310" x2="445" y2="325" stroke="#ffffff" stroke-width="4" stroke-linecap="round" />
`, 800, 600, '#18181b');

// Atmospheres
// 1. Marble Plinth
const marblePlinthSvg = makeSvg(`
  <defs>
    <linearGradient id="sageWall" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#52796f" />
      <stop offset="100%" stop-color="#354f52" />
    </linearGradient>
    <linearGradient id="marbleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#e4e4e7" />
      <stop offset="40%" stop-color="#ffffff" />
      <stop offset="80%" stop-color="#f4f4f5" />
      <stop offset="100%" stop-color="#d4d4d8" />
    </linearGradient>
  </defs>
  <!-- Background Wall -->
  <rect width="800" height="380" fill="url(#sageWall)" />
  <!-- Floor -->
  <rect y="380" width="800" height="220" fill="#2f3e46" />
  <!-- Diagonal Sunlight Beam -->
  <polygon points="0,0 350,0 600,600 0,600" fill="#ffffff" fill-opacity="0.12" />
  <!-- Pedestal shadow -->
  <ellipse cx="400" cy="500" rx="160" ry="32" fill="#1c252a" opacity="0.9" filter="blur(10px)" />
  <!-- Marble Cylindrical Plinth -->
  <rect x="250" y="380" width="300" height="110" fill="url(#marbleGrad)" />
  <ellipse cx="400" cy="380" rx="150" ry="28" fill="#ffffff" />
  <ellipse cx="400" cy="490" rx="150" ry="28" fill="url(#marbleGrad)" />
  <!-- Veins -->
  <path d="M280 400 Q340 440 370 470" stroke="#a1a1aa" stroke-width="2.5" fill="none" opacity="0.6" />
  <path d="M430 390 Q460 430 510 450" stroke="#71717a" stroke-width="2" fill="none" opacity="0.5" />
`, 800, 600, '#354f52');

// 2. Travertine Blocks
const travertineSvg = makeSvg(`
  <defs>
    <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#bae6fd" />
    </linearGradient>
    <linearGradient id="travertineTone" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef3c7" />
      <stop offset="50%" stop-color="#fde68a" />
      <stop offset="100%" stop-color="#d97706" />
    </linearGradient>
  </defs>
  <!-- Azure Sky -->
  <rect width="800" height="400" fill="url(#skyGrad)" />
  <rect y="400" width="800" height="200" fill="#fef3c7" />
  <!-- Palm Leaf Shadow overlay -->
  <path d="M750 0 Q600 150 450 180 Q550 250 650 320" stroke="#0369a1" stroke-width="45" fill="none" opacity="0.2" stroke-linecap="round" filter="blur(16px)" />
  <!-- Travertine Podium Blocks -->
  <!-- Block 1 Left -->
  <polygon points="180,360 340,310 340,480 180,530" fill="#f59e0b" />
  <polygon points="180,360 340,310 460,340 300,390" fill="#fef08a" />
  <polygon points="300,390 460,340 460,500 300,550" fill="#d97706" />
  <!-- Center Stage Block -->
  <polygon points="350,330 520,280 640,310 470,360" fill="#fffbeb" />
  <polygon points="470,360 640,310 640,470 470,520" fill="#b45309" />
  <polygon points="350,330 470,360 470,520 350,490" fill="#f59e0b" />
`, 800, 600, '#0284c7');

// 3. Plaster & Palm
const plasterPalmSvg = makeSvg(`
  <defs>
    <linearGradient id="rosePlaster" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fda4af" />
      <stop offset="50%" stop-color="#f43f5e" />
      <stop offset="100%" stop-color="#9f1239" />
    </linearGradient>
  </defs>
  <!-- Wall corner -->
  <polygon points="0,0 450,0 450,450 0,450" fill="#fecdd3" />
  <polygon points="450,0 800,0 800,450 450,450" fill="#fda4af" />
  <!-- Floor -->
  <rect y="450" width="800" height="150" fill="#fb7185" />
  <!-- Palm shadows -->
  <path d="M0,0 Q250,180 500,220 M200,50 Q350,150 480,340 M100,100 Q280,300 400,420" stroke="#881337" stroke-width="32" stroke-linecap="round" fill="none" opacity="0.3" filter="blur(12px)" />
`, 800, 600, '#881337');

// 4. Concrete Wall
const concreteWallSvg = makeSvg(`
  <defs>
    <linearGradient id="concreteWall" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#52525b" />
      <stop offset="100%" stop-color="#27272a" />
    </linearGradient>
  </defs>
  <rect width="800" height="420" fill="url(#concreteWall)" />
  <rect y="420" width="800" height="180" fill="#18181b" />
  <!-- Floor Seam -->
  <line x1="0" y1="420" x2="800" y2="420" stroke="#09090b" stroke-width="4" />
  <!-- Dramatic side light beam -->
  <polygon points="0,0 200,0 600,600 0,600" fill="#ffffff" fill-opacity="0.08" />
  <ellipse cx="400" cy="460" rx="160" ry="24" fill="#000000" opacity="0.6" filter="blur(10px)" />
`, 800, 600, '#27272a');

export const PRODUCTS: SuggestionChip[] = [
  {
    id: 'mug',
    label: 'Artisan Mug',
    prompt: 'An elegant artisan ceramic mug with a gradient glaze and a large perfectly round handle, studio product photography',
    description: 'Artisan ceramic mug with a gradient glaze featuring a large, perfectly round, thick handle.',
    image: artisanMugSvg
  },
  {
    id: 'colorful_mug',
    label: 'Colorful Mug',
    prompt: 'A vibrant colorful hand-painted ceramic coffee mug on a clean surface, studio product photography',
    description: 'A vibrant colorful hand-painted ceramic coffee mug.',
    image: colorfulMugSvg
  },
  {
    id: 'perfume',
    label: 'Perfume Bottle',
    prompt: 'A luxury ornate glass perfume bottle with sodalite and malachite minerals, studio product photography',
    description: 'An ornate glass fragrance decanter featuring inlaid mineral stone accents.',
    image: perfumeSvg
  },
  {
    id: 'sneaker',
    label: 'Running Sneaker',
    prompt: 'A premium luxury running sneaker with a sculptural modular sole, suede and mesh panels, studio product photography',
    description: 'Premium luxury running sneakers. Sculptural modular sole and an upper made out of suede nubuck leather and mesh sculptural panels.',
    image: sneakerSvg
  }
];

export const ATMOSPHERES: SuggestionChip[] = [
  {
    id: 'marble_plinth',
    label: 'Marble Plinth',
    prompt: 'A pristine Carrara marble plinth resting against a soft sage green backdrop, warm directional sunlight with soft shadows',
    description: 'Minimalist craft luxury. A pristine Carrara marble plinth rests against a soft sage backdrop. Crisp directional sunlight casts soft shadows, creating an earthy yet elevated aesthetic.',
    image: marblePlinthSvg
  },
  {
    id: 'travertine_blocks',
    label: 'Travertine Blocks',
    prompt: 'Warm porous travertine blocks creating a structured geometric podium under a brilliant azure sky, soft dappled leaf shadows',
    description: 'Mediterranean, modern luxury. Warm, porous travertine blocks create a structured geometric podium beneath a brilliant azure sky, presenting the product perfectly.',
    image: travertineSvg
  },
  {
    id: 'plaster_palm',
    label: 'Plaster & Palm',
    prompt: 'A warm sun-drenched polished plaster corner with a soft rose-tinted floor and crisp palm frond silhouettes casting dramatic shadows',
    description: 'Mediterranean minimalism utilizing a warm sun-drenched, polished plaster corner with a soft rose-tinted floor. Crisp palm frond silhouettes cast dramatic yet serene shadows.',
    image: plasterPalmSvg
  },
  {
    id: 'concrete_wall',
    label: 'Concrete Wall',
    prompt: 'A minimalist scene with a clean raw concrete wall background and subtle industrial textures, dramatic side-lighting',
    description: 'A minimalist scene with a clean raw concrete wall background and subtle industrial textures, dramatic side-lighting.',
    image: concreteWallSvg
  },
  {
    id: 'custom_monogram',
    label: 'Metallic Backdrop',
    prompt: 'A brushed metallic monogram backdrop with subtle studio sheen and depth',
    description: 'Uploaded brushed metallic monogram surface backdrop for high-contrast HDR showcase rendering.',
    image: '/assets/aistudio/image_1a575009.png'
  }
];
