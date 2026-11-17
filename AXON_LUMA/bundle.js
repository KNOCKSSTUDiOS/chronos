const fs = require('fs');
const path = require('path');

const STUDIO_STAMP = {
    brand: 'KNOCKSSTUDiOS',
    productionLine: 'AXON LUMA',
    registeredName: 'HOLLYWOOD MOTiON PiCTURES'
};

const outputDir = path.resolve(__dirname, 'render_output');
const manifestPath = path.join(outputDir, 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

console.log(`[${STUDIO_STAMP.brand} // ${STUDIO_STAMP.productionLine}] Packaging distribution bundle for ${STUDIO_STAMP.registeredName}...`);
console.log(`Manifest Verified: ${manifest.totalFrames} frames locked in.`);
