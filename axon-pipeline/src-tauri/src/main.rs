/* =====================================================================
 * © 2024–2026 KNOCKSSTUDiOS™. All rights reserved.
 * ===================================================================== */

#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running AXON LUMA");
}

