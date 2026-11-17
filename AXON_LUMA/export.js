const fs = require('fs');
const path = require('path');

const STUDIO_STAMP = {
    brand: 'KNOCKSSTUDiOS',
    productionLine: 'AXON LUMA',
    registeredName: 'HOLLYWOOD MOTiON PiCTURES'
};

const sourceDir = path.resolve(__dirname, 'render_output');
const distDir = path.resolve(__dirname, 'dist');

if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

const files = fs.readdirSync(sourceDir);
files.forEach(file => {
    fs.copyFileSync(path.join(sourceDir, file), path.join(distDir, file));
});

console.log(`[${STUDIO_STAMP.brand} // ${STUDIO_STAMP.productionLine}] Distribution package exported for ${STUDIO_STAMP.registeredName} to /dist.`);
