const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { applyWatermark } = require('./utils/watermark');

const STUDIO_STAMP = {
    brand: 'KNOCKSSTUDiOS',
    productionLine: 'AXON LUMA',
    registeredName: 'HOLLYWOOD MOTiON PiCTURES'
};

const app = express();
const PORT = process.env.PORT || 3005;

app.use(express.json({ limit: '50mb' }));
app.use(cors());

const dbFile = path.resolve(__dirname, 'axon_memory.json');
if (!fs.existsSync(dbFile)) {
    fs.writeFileSync(dbFile, JSON.stringify({ logs: [] }, null, 2));
}

app.get('/health', (req, res) => {
    res.json({
        status: 'ONLINE',
        brand: STUDIO_STAMP.brand,
        productionLine: STUDIO_STAMP.productionLine,
        registeredName: STUDIO_STAMP.registeredName,
        port: PORT,
        brains: ['DeepSeek V3', 'Gemma 3 4B', 'LLaMA 3.1 8B'],
        database: 'JSON Memory Store Active'
    });
});

app.post('/api/inference', (req, res) => {
    const { brainModel, prompt } = req.body;
    
    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    const model = brainModel || 'DeepSeek V3';
    const simulatedResponse = `[${STUDIO_STAMP.brand} // ${model}] Processed execution for: "${prompt}"`;

    try {
        const raw = fs.readFileSync(dbFile, 'utf8');
        const dbData = JSON.parse(raw);
        dbData.logs.push({
            brainModel: model,
            prompt,
            response: simulatedResponse,
            timestamp: new Date().toISOString()
        });
        fs.writeFileSync(dbFile, JSON.stringify(dbData, null, 2));
    } catch (err) {
        console.error('Memory write error:', err.message);
    }

    res.json({
        success: true,
        model: model,
        response: simulatedResponse,
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`[${STUDIO_STAMP.brand} // ${STUDIO_STAMP.productionLine}] ${STUDIO_STAMP.registeredName} active on port ${PORT}`);
});
