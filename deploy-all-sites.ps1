# deploy-all-sites.ps1
# Deploy Healing Buds to all three cPanel sites: .global, .pt, and .co.uk
# Uses SSH keys from GitHub\SSH_Keys_Cpanel folder

param(
    [switch]$SkipBuild,
    [switch]$OnlyGlobal,
    [switch]$OnlyPT,
    [switch]$OnlyUK,
    [switch]$UseFTP
)

Clear-Host
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host "    HEALING BUDS - MULTI-SITE DEPLOYMENT                            " -ForegroundColor Cyan
Write-Host "    Deploying to .global, .pt and .co.uk                            " -ForegroundColor Cyan
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$ProjectRoot = Get-Location
$DistDir = Join-Path $ProjectRoot "dist"
$SshKeysFolder = "C:\Users\ABC\Documents\GitHub\SSH_Keys_Cpanel"

# Site configurations
$Sites = @{
    "global" = @{
        Name = "healingbuds.global"
        SshKey = "$SshKeysFolder\id_rsa_global"
        SshUser = "healingu"
        SshHost = "healingbuds.global"
        SshPort = "22"
        FtpHost = "ftp.healingbuds.global"
        Path = "public_html"
        Color = "Magenta"
    }
    "pt" = @{
        Name = "healingbuds.pt"
        SshKey = "$SshKeysFolder\id_rsa_pt"
        SshUser = "healingu"
        SshHost = "healingbuds.pt"
        SshPort = "22"
        FtpHost = "ftp.healingbuds.pt"
        Path = "public_html"
        Color = "Green"
    }
    "uk" = @{
        Name = "healingbuds.co.uk"
        SshKey = "$SshKeysFolder\id_rsa_uk"
        SshUser = "healingu"
        SshHost = "healingbuds.co.uk"
        SshPort = "22"
        FtpHost = "ftp.healingbuds.co.uk"
        Path = "public_html"
        Color = "Blue"
    }
}

# FTP Upload Functions (used when -UseFTP flag is passed)
function Upload-FtpFile {
    param(
        [string]$localFile,
        [string]$remoteUri,
        [string]$user,
        [string]$pass
    )

    $request = [System.Net.FtpWebRequest]::Create($remoteUri)
    $request.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
    $request.Credentials = New-Object System.Net.NetworkCredential($user, $pass)
    $request.UseBinary = $true
    $request.UsePassive = $true
    $request.KeepAlive = $false

    $fileBytes = [System.IO.File]::ReadAllBytes($localFile)
    $request.ContentLength = $fileBytes.Length

    $requestStream = $request.GetRequestStream()
    $requestStream.Write($fileBytes, 0, $fileBytes.Length)
    $requestStream.Close()
    $response = $request.GetResponse()
    $response.Close()
}

function Ensure-FtpDirectory {
    param(
        [string]$remoteDir,
        [string]$user,
        [string]$pass
    )

    try {
        $req = [System.Net.FtpWebRequest]::Create($remoteDir.TrimEnd('/') + "/")
        $req.Method = [System.Net.WebRequestMethods+Ftp]::MakeDirectory
        $req.Credentials = New-Object System.Net.NetworkCredential($user, $pass)
        $req.UsePassive = $true
        $req.KeepAlive = $false
        $req.GetResponse().Close()
    } catch {
        # Directory might already exist - ignore
    }
}

function Upload-FtpFolder {
    param(
        [string]$localPath,
        [string]$remoteBase,
        [string]$user,
        [string]$pass
    )

    Ensure-FtpDirectory -remoteDir $remoteBase -user $user -pass $pass

    Get-ChildItem -LiteralPath $localPath -File | ForEach-Object {
        $fileName = $_.Name
        $localFile = $_.FullName
        $remoteFile = $remoteBase.TrimEnd('/') + "/" + $fileName

        Write-Host "  Uploading $fileName" -ForegroundColor DarkGray
        Upload-FtpFile -localFile $localFile -remoteUri $remoteFile -user $user -pass $pass
    }

    Get-ChildItem -LiteralPath $localPath -Directory | ForEach-Object {
        $subLocal = $_.FullName
        $subRemote = $remoteBase.TrimEnd('/') + "/" + $_.Name
        Upload-FtpFolder -localPath $subLocal -remoteBase $subRemote -user $user -pass $pass
    }
}

# SSH/SCP Upload Function
function Deploy-ViaSsh {
    param(
        [string]$localPath,
        [string]$sshKey,
        [string]$sshUser,
        [string]$sshHost,
        [string]$sshPort,
        [string]$remotePath
    )

    $scpCmd = "scp -i `"$sshKey`" -P $sshPort -o StrictHostKeyChecking=no -r `"$localPath\*`" ${sshUser}@${sshHost}:$remotePath/"
    Write-Host "Running: $scpCmd" -ForegroundColor DarkGray
    
    $result = Invoke-Expression $scpCmd 2>&1
    return $LASTEXITCODE -eq 0
}

# Step 1: Build the project
if (-not $SkipBuild) {
    Write-Host "`n[1/3] Building project..." -ForegroundColor Yellow
    
    # Run npm install first
    Write-Host "Running npm install..." -ForegroundColor Gray
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Error "npm install failed"
        exit 1
    }
    
    # Run the build
    Write-Host "Running npm run build..." -ForegroundColor Gray
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Build failed"
        exit 1
    }
    
    if (-not (Test-Path $DistDir)) {
        Write-Error "Build failed - dist folder not created"
        exit 1
    }
    
    Write-Host "Build complete!" -ForegroundColor Green
} else {
    Write-Host "`n[1/3] Skipping build (--SkipBuild flag)" -ForegroundColor DarkYellow
    if (-not (Test-Path $DistDir)) {
        Write-Error "dist folder not found. Run without --SkipBuild first."
        exit 1
    }
}

# Step 2: Determine which sites to deploy
$SitesToDeploy = @()
if ($OnlyGlobal) {
    $SitesToDeploy = @("global")
} elseif ($OnlyPT) {
    $SitesToDeploy = @("pt")
} elseif ($OnlyUK) {
    $SitesToDeploy = @("uk")
} else {
    $SitesToDeploy = @("global", "pt", "uk")
}

Write-Host "`n[2/3] Deploying to sites: $($SitesToDeploy -join ', ')" -ForegroundColor Yellow

# Step 3: Get credentials if using FTP
$ftpUser = $null
$ftpPass = $null

if ($UseFTP) {
    Write-Host "`nUsing FTP deployment method" -ForegroundColor Yellow
    Write-Host "Enter FTP credentials (same for all cPanel sites)" -ForegroundColor Cyan
    $ftpUser = Read-Host "FTP/cPanel Username"
    $securePass = Read-Host "FTP/cPanel Password" -AsSecureString
    $ftpPass = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
        [Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePass)
    )
} else {
    Write-Host "`nUsing SSH deployment method with keys from:" -ForegroundColor Yellow
    Write-Host "  $SshKeysFolder" -ForegroundColor Gray
}

# Step 4: Deploy to each site
Write-Host "`n[3/3] Deploying to sites..." -ForegroundColor Yellow
$SuccessCount = 0
$FailCount = 0

foreach ($SiteKey in $SitesToDeploy) {
    $Site = $Sites[$SiteKey]
    Write-Host "`n--------------------------------------------------------------" -ForegroundColor $Site.Color
    Write-Host "Deploying to $($Site.Name)..." -ForegroundColor $Site.Color
    Write-Host "--------------------------------------------------------------" -ForegroundColor $Site.Color
    
    $DeploySuccess = $false
    
    if ($UseFTP) {
        # FTP deployment
        $FtpHost = $Site.FtpHost
        $RemotePath = $Site.Path
        $BaseUri = "ftp://$FtpHost/$RemotePath".TrimEnd('/') + "/"
        
        Write-Host "Target: $BaseUri" -ForegroundColor Gray
        
        try {
            Upload-FtpFolder -localPath $DistDir -remoteBase $BaseUri -user $ftpUser -pass $ftpPass
            $DeploySuccess = $true
        } catch {
            Write-Host "FTP Error: $($_.Exception.Message)" -ForegroundColor Red
        }
    } else {
        # SSH/SCP deployment
        $SshKey = $Site.SshKey
        $SshUser = $Site.SshUser
        $SshHost = $Site.SshHost
        $SshPort = $Site.SshPort
        $RemotePath = $Site.Path
        
        Write-Host "Target: $SshUser@$SshHost`:$RemotePath" -ForegroundColor Gray
        Write-Host "Using key: $SshKey" -ForegroundColor Gray
        
        # Check if key exists
        if (-not (Test-Path $SshKey)) {
            Write-Host "SSH key not found: $SshKey" -ForegroundColor Red
        } else {
            $DeploySuccess = Deploy-ViaSsh -localPath $DistDir -sshKey $SshKey -sshUser $SshUser -sshHost $SshHost -sshPort $SshPort -remotePath $RemotePath
        }
    }
    
    if ($DeploySuccess) {
        Write-Host "✅ Successfully deployed to $($Site.Name)" -ForegroundColor Green
        $SuccessCount++
    } else {
        Write-Host "❌ Failed to deploy to $($Site.Name)" -ForegroundColor Red
        $FailCount++
    }
}

# Summary
Write-Host "`n=====================================================================" -ForegroundColor Cyan
Write-Host "    DEPLOYMENT SUMMARY                                              " -ForegroundColor Cyan
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host "Successful: $SuccessCount" -ForegroundColor Green
Write-Host "Failed: $FailCount" -ForegroundColor $(if ($FailCount -gt 0) { "Red" } else { "Green" })
Write-Host ""

if ($SuccessCount -gt 0) {
    Write-Host "Deployed sites:" -ForegroundColor Yellow
    foreach ($SiteKey in $SitesToDeploy) {
        $Site = $Sites[$SiteKey]
        Write-Host "  - https://$($Site.Name)" -ForegroundColor $Site.Color
    }
    Write-Host ""
    Write-Host "Hard refresh (Ctrl+Shift+R) to see changes!" -ForegroundColor Yellow
}

if ($FailCount -gt 0) {
    Write-Host "`nTroubleshooting tips:" -ForegroundColor Yellow
    if ($UseFTP) {
        Write-Host "1. Verify FTP credentials are correct" -ForegroundColor Gray
        Write-Host "2. Check that FTP is enabled in cPanel" -ForegroundColor Gray
        Write-Host "3. Ensure firewall allows FTP connections" -ForegroundColor Gray
    } else {
        Write-Host "1. Ensure SSH keys are authorized in cPanel" -ForegroundColor Gray
        Write-Host "2. Go to cPanel > SSH Access > Manage SSH Keys" -ForegroundColor Gray
        Write-Host "3. Import the public key and click 'Authorize'" -ForegroundColor Gray
        Write-Host "4. Try running with -UseFTP flag for FTP deployment" -ForegroundColor Gray
    }
}

Write-Host "`nUsage:" -ForegroundColor Cyan
Write-Host "  .\deploy-all-sites.ps1              # Deploy all sites via SSH" -ForegroundColor Gray
Write-Host "  .\deploy-all-sites.ps1 -UseFTP      # Deploy all sites via FTP" -ForegroundColor Gray
Write-Host "  .\deploy-all-sites.ps1 -OnlyGlobal  # Deploy only .global" -ForegroundColor Gray
Write-Host "  .\deploy-all-sites.ps1 -OnlyPT      # Deploy only .pt" -ForegroundColor Gray
Write-Host "  .\deploy-all-sites.ps1 -OnlyUK      # Deploy only .co.uk" -ForegroundColor Gray
Write-Host "  .\deploy-all-sites.ps1 -SkipBuild   # Skip npm build" -ForegroundColor Gray
