# Nebaz AI Academy — local static server (Windows-friendly)
param(
    [int]$Port = 0,
    [switch]$NoBrowser
)

$dir = Join-Path $PSScriptRoot "ethioai-academy"
if (-not (Test-Path $dir)) {
    Write-Error "Folder not found: $dir"
    exit 1
}

$ports = if ($Port -gt 0) { @($Port) } else { @(5500, 8765, 3000, 8888, 5173, 9000, 8080) }

$python = $null
foreach ($cmd in @('python', 'py', 'python3')) {
    if (Get-Command $cmd -ErrorAction SilentlyContinue) {
        $python = $cmd
        break
    }
}
if (-not $python) {
    Write-Error "Python not found. Install from https://www.python.org/ and enable 'Add to PATH'."
    exit 1
}

Set-Location $dir

function Test-PortFree([int]$p) {
    try {
        $l = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $p)
        $l.Start()
        $l.Stop()
        return $true
    } catch {
        return $false
    }
}

$chosen = $null
foreach ($p in $ports) {
    if (Test-PortFree $p) { $chosen = $p; break }
}

if (-not $chosen) {
    Write-Error "No free port. Tried: $($ports -join ', '). Close other apps or run: python -m http.server 5500 --bind 127.0.0.1"
    exit 1
}

$url = "http://127.0.0.1:$chosen/index.html"
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Nebaz AI Academy" -ForegroundColor Green
Write-Host "  $url" -ForegroundColor Cyan
Write-Host "  Folder: $dir" -ForegroundColor DarkGray
Write-Host "  Press Ctrl+C to stop" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

if (-not $NoBrowser) {
    Start-Process $url
}

& $python -m http.server $chosen --bind 127.0.0.1
