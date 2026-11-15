$ErrorActionPreference = "SilentlyContinue"
$Root = "C:\KNOCKSSTUDiOS"
$IndexDir = Join-Path $Root "_index"
$VaultRoot = "D:\KNOCKS_VAULT"
$CatalogFile = Join-Path $IndexDir "master_asset_database.json"

# Offload ALL media & project assets (>1KB) outside core engine folders
if (Test-Path (Split-Path $VaultRoot -Qualifier)) {
    if (-not (Test-Path $VaultRoot)) { New-Item -ItemType Directory -Force -Path $VaultRoot | Out-Null }
    
    $AssetsToMove = Get-ChildItem -Path $Root -Recurse -File | Where-Object { 
        $_.Length -gt 1KB -and 
        $_.Extension -ne ".vaultref" -and
        $_.FullName -notmatch "\\(02_PIPELINE|_index|bin|node_modules)\\" 
    }

    foreach ($file in $AssetsToMove) {
        $rel = $file.FullName.Replace($Root, "")
        $dest = Join-Path $VaultRoot $rel
        $destDir = Split-Path $dest -Parent
        if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Force -Path $destDir | Out-Null }
        
        Move-Item -Path $file.FullName -Destination $dest -Force
        "$dest" | Set-Content -Path "$($file.FullName).vaultref" -Encoding UTF8
    }
}

# Build unified Everyday Reach index across Laptop + Vault
$AllAssets = @()
foreach ($scanPath in @($Root, $VaultRoot)) {
    if (Test-Path $scanPath) {
        $loc = if ($scanPath -eq $Root) { "LAPTOP" } else { "DATABASE_VAULT" }
        $found = Get-ChildItem -Path $scanPath -Recurse -File | Where-Object { $_.Extension -ne ".vaultref" } | ForEach-Object {
            [PSCustomObject]@{
                Name         = $_.Name
                Category     = ($_.DirectoryName -split "\\")[-1]
                SizeMB       = [math]::Round($_.Length / 1MB, 3)
                Extension    = $_.Extension
                Location     = $loc
                FullPath     = $_.FullName
                LastModified = $_.LastWriteTime.ToString("yyyy-MM-dd HH:mm")
            }
        }
        $AllAssets += $found
    }
}

$AllAssets | ConvertTo-Json -Depth 4 | Set-Content -Path $CatalogFile -Encoding UTF8
Write-Host "Indexed $($AllAssets.Count) total assets into Everyday Reach Database." -ForegroundColor Cyan
