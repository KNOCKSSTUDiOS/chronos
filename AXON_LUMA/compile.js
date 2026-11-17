const fs = require('fs');
const path = require('path');

const STUDIO_STAMP = {
    brand: 'KNOCKSSTUDiOS',
    productionLine: 'AXON LUMA',
    registeredName: 'HOLLYWOOD MOTiON PiCTURES'
};

const outputDir = path.resolve(__dirname, 'render_output');
const files = fs.readdirSync(outputDir).filter(f => f.endsWith('.json') && f !== 'manifest.json');

console.log(`[${STUDIO_STAMP.brand} // ${STUDIO_STAMP.productionLine}] Consolidating ${files.length} total frames for ${STUDIO_STAMP.registeredName}...`);

const manifest = {
    studio: STUDIO_STAMP.brand,
    engine: STUDIO_STAMP.productionLine,
    registered: STUDIO_STAMP.registeredName,
    totalFrames: files.length,
    compiledAt: new Date().toISOString()
};

fs.writeFileSync(path.join(outputDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`[${STUDIO_STAMP.brand} // ${STUDIO_STAMP.productionLine}] Manifest generated with ${files.length} frames locked in.`);
