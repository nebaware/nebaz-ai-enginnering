# Download Prism 1.29.0 and Highlight.js 11.8.0 into vendor/
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$vendor = Join-Path $root "vendor"
$prism = Join-Path $vendor "prism\1.29.0"
$hl = Join-Path $vendor "highlight.js\11.8.0"

New-Item -ItemType Directory -Force -Path (Join-Path $prism "themes") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $prism "components") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $hl "styles") | Out-Null

$base = "https://cdnjs.cloudflare.com/ajax/libs"
$files = @(
  @{ url = "$base/prism/1.29.0/prism.min.js"; dest = "$prism/prism.min.js" },
  @{ url = "$base/prism/1.29.0/themes/prism-tomorrow.min.css"; dest = "$prism/themes/prism-tomorrow.min.css" },
  @{ url = "$base/prism/1.29.0/components/prism-python.min.js"; dest = "$prism/components/prism-python.min.js" },
  @{ url = "$base/prism/1.29.0/components/prism-javascript.min.js"; dest = "$prism/components/prism-javascript.min.js" },
  @{ url = "$base/prism/1.29.0/components/prism-bash.min.js"; dest = "$prism/components/prism-bash.min.js" },
  @{ url = "$base/prism/1.29.0/components/prism-json.min.js"; dest = "$prism/components/prism-json.min.js" },
  @{ url = "$base/highlight.js/11.8.0/highlight.min.js"; dest = "$hl/highlight.min.js" },
  @{ url = "$base/highlight.js/11.8.0/styles/atom-one-dark.min.css"; dest = "$hl/styles/atom-one-dark.min.css" }
)

foreach ($f in $files) {
  Write-Host "Downloading $($f.url)"
  Invoke-WebRequest -Uri $f.url -OutFile $f.dest -UseBasicParsing
}
Write-Host "Vendor libraries ready."
