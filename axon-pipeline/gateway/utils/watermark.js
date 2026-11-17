/* =====================================================================
 * © 2024–2026 KNOCKSSTUDiOS™. All rights reserved.
 * ===================================================================== */

const STUDIO_STAMP = {
    brand: "KNOCKSSTUDiOS",
    productionLine: "HOLLYWOOD MOTiON PiCTURES",
    imagingStudio: "HOLLYWOOD IMAGING STUDIO",
    domain: "hollywoodimaging.studio",
    copyright: "© 2024–2026 HOLLYWOOD MOTION PICTURES. All rights reserved.",
    tagline: "ALL KNOCKS // BUILT FROM THE GROUND UP",
    registeredName: "AXON LUMA"
};

function applyStamp(metadata = {}) {
    return {
        ...metadata,
        __studio_watermark: STUDIO_STAMP.tagline,
        __studio_brand: STUDIO_STAMP.brand,
        __studio_production: STUDIO_STAMP.productionLine,
        __studio_imaging: STUDIO_STAMP.imagingStudio,
        __domain: STUDIO_STAMP.domain,
        __copyright: STUDIO_STAMP.copyright,
        __registered_name: STUDIO_STAMP.registeredName,
        __timestamp: new Date().toISOString()
    };
}

module.exports = { STUDIO_STAMP, applyStamp };

