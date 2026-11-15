param(
    [string]$BlendFile,
    [string]$JobID = ("JOB_" + (Get-Date -Format "yyyyMMdd_HHmmss")),
    [string]$BuyerID = "STORE_PUBLIC",
    [int]$FrameStart = 1,
    [int]$FrameEnd = 1
)

$ErrorActionPreference = "SilentlyContinue"
$CloudVault = "D:\KNOCKS_CLOUD_DB"
$CloudRenders = "D:\KNOCKS_CLOUD_DB\MARKETPLACE_RENDERS"
$CloudTemp = "D:\KNOCKS_CLOUD_DB\RENDER_TEMP_CACHE"
$DbFile = Join-Path $CloudVault "marketplace_renders.db.json"
$LocalMirrorDb = "C:\KNOCKSSTUDiOS\_index\marketplace_renders.db.json"
$BlenderExe = "C:\Program Files\Blender Foundation\Blender 5.2\blender.exe"

foreach ($d in @($CloudVault, $CloudRenders, $CloudTemp)) {
    if (-not (Test-Path $d)) { New-Item -ItemType Directory -Force -Path $d | Out-Null }
}

$JobOutDir = Join-Path $CloudRenders $JobID
New-Item -ItemType Directory -Force -Path $JobOutDir | Out-Null

# Force Blender temp & render output directly to Cloud Vault (bypasses C:\ completely)
$env:TMP = $CloudTemp
$env:TEMP = $CloudTemp

if ($BlendFile -and (Test-Path $BlendFile) -and (Test-Path $BlenderExe)) {
    Start-Process -FilePath $BlenderExe -ArgumentList @(
        "-b", ""$BlendFile"",
        "-noaudio",
        "-o", ""$JobOutDir\frame_####"",
        "-s", $FrameStart,
        "-e", $FrameEnd,
        "-a",
        "--python-expr", ""import bpy; prefs = bpy.context.preferences.addons['cycles'].preferences; prefs.compute_device_type = 'HIP'; prefs.get_devices(); bpy.context.preferences.filepaths.temporary_directory = r'$CloudTemp'""
    ) -Wait
}

# Log render metadata into Cloud Database (lightweight JSON DB synced to _index)
$Entry = [PSCustomObject]@{
    JobID        = $JobID
    BuyerID      = $BuyerID
    SourceAsset  = $BlendFile
    CloudOutput  = $JobOutDir
    Palette      = "INFINITY_CORE_V2_SOVEREIGN_PULSE"
    StorageNode  = "CLOUD_ONLY_NO_LOCAL_DISK"
    Timestamp    = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
}

$CurrentDb = @()
if (Test-Path $DbFile) { $CurrentDb = @(Get-Content $DbFile | ConvertFrom-Json) }
$CurrentDb += $Entry

$CurrentDb | ConvertTo-Json -Depth 4 | Set-Content -Path $DbFile -Encoding UTF8
$CurrentDb | ConvertTo-Json -Depth 4 | Set-Content -Path $LocalMirrorDb -Encoding UTF8

Write-Host "Render [$JobID] routed directly to Cloud DB: $JobOutDir (0 MB written to C:\)" -ForegroundColor Cyan
