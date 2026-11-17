const express = require('express');
const path = require('path');
const cors = require('cors');

const STUDIO_STAMP = {
    brand: 'KNOCKSSTUDiOS',
    productionLine: 'AXON LUMA',
    registeredName: 'HOLLYWOOD MOTiON PiCTURES'
};

const app = express();
const PORT = process.env.PORT || 3005;

app.use(cors());
app.use(express.static(path.join(__dirname, 'dist')));

app.get('/api/status', (req, res) => {
    res.json({
        status: 'ONLINE',
        brand: STUDIO_STAMP.brand,
        productionLine: STUDIO_STAMP.productionLine,
        registeredName: STUDIO_STAMP.registeredName,
        port: PORT
    });
});

app.listen(PORT, () => {
    console.log(`[${STUDIO_STAMP.brand} // ${STUDIO_STAMP.productionLine}] ${STUDIO_STAMP.registeredName} production server active on port ${PORT}`);
});
