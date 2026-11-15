$ErrorActionPreference = "SilentlyContinue"
$Root = "C:\KNOCKSSTUDiOS"
$VaultDrive = "V:\"
$VaultDir = "C:\KNOCKSSTUDiOS_VAULT"

if (-not (Test-Path $VaultDir)) {
    New-Item -ItemType Directory -Force -Path $VaultDir | Out-Null
}

if (-not (Test-Path $VaultDrive)) {
    subst V: $VaultDir
}

$MediaDirs = @("01_SCREENPLAY", "03_KEYFRAMES", "04_VIDEO_RAW", "05_VIDEO_SELECTS", "06_AUDIO_FOLEY", "07_AUDIO_SCORE", "08_EDIT_PROJECT", "09_EXPORTS", "10_ARCHIVE", "AI_VIDEOS", "PERSONAL_PICTURES", "WORK_RELATED")

foreach ($dir in $MediaDirs) {
    $srcPath = Join-Path $Root $dir
    $dstPath = Join-Path $VaultDrive $dir
    if (-not (Test-Path $dstPath)) {
        New-Item -ItemType Directory -Force -Path $dstPath | Out-Null
    }
    if (Test-Path $srcPath) {
        Get-ChildItem -Path $srcPath -File | Move-Item -Destination $dstPath -Force
    }
}

Get-ChildItem -Path $Root, $VaultDrive -Recurse -File | Where-Object { $_.Length -eq 0 } | Remove-Item -Force
Get-ChildItem -Path $Root, $VaultDrive -Recurse -Include *.tmp, *.log, *.bak, *.cache -File | Remove-Item -Force

Get-ChildItem -Path $Root, $VaultDrive -Recurse -File | Where-Object { $_.Length -gt 0 } | Group-Object Length | Where-Object { $_.Count -gt 1 } | ForEach-Object {
    $_.Group | Group-Object { (Get-FileHash $_.FullName -Algorithm MD5).Hash } | Where-Object { $_.Count -gt 1 } | ForEach-Object {
        $_.Group | Select-Object -Skip 1 | Remove-Item -Force
    }
}
