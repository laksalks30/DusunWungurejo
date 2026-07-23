$vendorDir = "assets/vendor"

if (!(Test-Path -Path $vendorDir)) {
    New-Item -ItemType Directory -Path $vendorDir | Out-Null
}

function Download-File {
    param([string]$url, [string]$destination)
    Write-Host "Downloading $url to $destination..."
    $dir = Split-Path $destination
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir | Out-Null
    }
    try {
        Invoke-WebRequest -Uri $url -OutFile $destination -UseBasicParsing -ErrorAction Stop
    } catch {
        Write-Host "WARNING: Failed to download $url : $_"
    }
}

# 1. Download JS and simple CSS
$simpleDownloads = @(
    @{ url = "https://unpkg.com/aos@2.3.1/dist/aos.css"; dest = "$vendorDir/aos/aos.css" },
    @{ url = "https://cdn.jsdelivr.net/npm/chart.js"; dest = "$vendorDir/chartjs/chart.min.js" },
    @{ url = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"; dest = "$vendorDir/jspdf/jspdf.umd.min.js" },
    @{ url = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"; dest = "$vendorDir/leaflet/leaflet.js" },
    @{ url = "https://cdn.jsdelivr.net/npm/marked/marked.min.js"; dest = "$vendorDir/marked/marked.min.js" },
    @{ url = "https://unpkg.com/aos@2.3.1/dist/aos.js"; dest = "$vendorDir/aos/aos.js" },
    @{ url = "https://cdnjs.cloudflare.com/ajax/libs/vanilla-tilt/1.8.1/vanilla-tilt.min.js"; dest = "$vendorDir/vanilla-tilt/vanilla-tilt.min.js" }
)

foreach ($item in $simpleDownloads) {
    Download-File -url $item.url -destination $item.dest
}

# 2. FontAwesome (CSS + Webfonts)
$faCssUrl = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
$faCssDest = "$vendorDir/fontawesome/css/all.min.css"
Download-File -url $faCssUrl -destination $faCssDest

$faWebfonts = @("fa-solid-900.woff2", "fa-brands-400.woff2", "fa-regular-400.woff2", "fa-v4compat.woff2", "fa-solid-900.ttf", "fa-brands-400.ttf", "fa-regular-400.ttf")
foreach ($font in $faWebfonts) {
    $fontUrl = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/$font"
    $fontDest = "$vendorDir/fontawesome/webfonts/$font"
    Download-File -url $fontUrl -destination $fontDest
}

# 3. Leaflet (CSS + Images)
$leafletCssUrl = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
$leafletCssDest = "$vendorDir/leaflet/leaflet.css"
Download-File -url $leafletCssUrl -destination $leafletCssDest

$leafletImages = @("marker-icon.png", "marker-icon-2x.png", "marker-shadow.png")
foreach ($img in $leafletImages) {
    $imgUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/$img"
    $imgDest = "$vendorDir/leaflet/images/$img"
    Download-File -url $imgUrl -destination $imgDest
}

# 4. Google Fonts
Write-Host "Downloading Google Fonts CSS..."
$gfUrl = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
$gfDestDir = "$vendorDir/googlefonts"
if (!(Test-Path $gfDestDir)) {
    New-Item -ItemType Directory -Path $gfDestDir | Out-Null
}
$gfCssDest = "$gfDestDir/plus-jakarta-sans.css"

# Use a standard modern browser User-Agent to ensure we get woff2 links
$userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
try {
    $response = Invoke-WebRequest -Uri $gfUrl -Headers @{"User-Agent" = $userAgent} -UseBasicParsing
    $cssContent = $response.Content
    
    # Extract URLs
    $pattern = 'url\((https://fonts\.gstatic\.com/s/plusjakartasans/[^\)]+\.woff2)\)'
    $matches = [regex]::Matches($cssContent, $pattern)
    
    foreach ($match in $matches) {
        $fontUrl = $match.Groups[1].Value
        $fontName = $fontUrl.Substring($fontUrl.LastIndexOf('/') + 1)
        $fontDest = "$gfDestDir/$fontName"
        
        # Download font file if not exists
        if (!(Test-Path $fontDest)) {
            Download-File -url $fontUrl -destination $fontDest
        }
        
        # Replace URL in CSS
        $cssContent = $cssContent.Replace($fontUrl, "./$fontName")
    }
    
    Set-Content -Path $gfCssDest -Value $cssContent -Encoding UTF8
    Write-Host "Google Fonts downloaded and CSS updated successfully."
} catch {
    Write-Error "Failed to process Google Fonts: $_"
}

Write-Host "All assets downloaded successfully!"
