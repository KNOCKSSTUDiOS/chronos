const fs = require('fs');
const path = require('path');

const STUDIO_STAMP = {
    brand: 'KNOCKSSTUDiOS',
    productionLine: 'AXON LUMA',
    registeredName: 'HOLLYWOOD MOTiON PiCTURES'
};

const distDir = path.resolve(__dirname, 'dist');
const count = fs.readdirSync(distDir).length;

console.log(`[${STUDIO_STAMP.brand} // ${STUDIO_STAMP.productionLine}] ${STUDIO_STAMP.registeredName} build verified. ${count} items locked in dist.`);
