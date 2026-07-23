param (
    [int]$Port = 8080
)

$prefix = "http://localhost:$Port/"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Host "Server running at $prefix"
Write-Host "Press Ctrl+C to stop"

$mimeTypes = @{
    ".html" = "text/html"
    ".css"  = "text/css"
    ".js"   = "application/javascript"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".gif"  = "image/gif"
    ".ico"  = "image/x-icon"
    ".svg"  = "image/svg+xml"
    ".json" = "application/json"
    ".woff2" = "font/woff2"
    ".ttf"   = "font/ttf"
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $localPath = $request.Url.LocalPath.TrimStart('/')
        if ($localPath -eq "") {
            $localPath = "index.html"
        }
        
        $filePath = Join-Path (Get-Location).Path $localPath
        $filePath = [System.IO.Path]::GetFullPath($filePath)
        
        # Security check: ensure path is within current directory
        if (!$filePath.StartsWith((Get-Location).Path)) {
            $response.StatusCode = 403
        }
        elseif (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            if ($mimeTypes.ContainsKey($ext)) {
                $response.ContentType = $mimeTypes[$ext]
            } else {
                $response.ContentType = "application/octet-stream"
            }
            
            $content = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $content.Length
            $response.OutputStream.Write($content, 0, $content.Length)
            $response.StatusCode = 200
        } else {
            $response.StatusCode = 404
        }
        
        $response.Close()
        Write-Host "$($request.HttpMethod) $($request.Url.LocalPath) - $($response.StatusCode)"
    }
}
catch {
    Write-Host "Server stopped."
}
finally {
    $listener.Stop()
}
