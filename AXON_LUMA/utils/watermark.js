const fs = require('fs');
const path = require('path');

function applyWatermark(inputPath, outputPath, options = {}) {
    fs.copyFileSync(inputPath, outputPath);
    return outputPath;
}

module.exports = { applyWatermark };
