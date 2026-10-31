# =========================================================
# Estnak Tours and Travel - image placeholder generator
# Run from the project root:
#   powershell -ExecutionPolicy Bypass -File scripts/make-placeholders.ps1
#
# Every JPG in assets/img/ is replaced with a branded placeholder.
# To use your own photo, simply overwrite the matching file with a
# JPG or WebP of the same name. Keep the same aspect ratio.
# =========================================================
Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$imgDir = Join-Path $root "assets/img"

$images = @(
  [pscustomobject]@{ File = "hero-serengeti-balloon.jpg"; Label = "HERO IMAGE"; W = 1280; H = 720; Use = "Home hero" },
  [pscustomobject]@{ File = "style-island.jpg"; Label = "ISLAND ESCAPES"; W = 1280; H = 721; Use = "Home travel styles + Destinations hero" },
  [pscustomobject]@{ File = "style-safari.jpg"; Label = "SAFARI"; W = 1280; H = 853; Use = "Home travel styles + Tours hero" },
  [pscustomobject]@{ File = "style-adventure.jpg"; Label = "ADVENTURE"; W = 1280; H = 853; Use = "Home travel styles" },
  [pscustomobject]@{ File = "style-city.jpg"; Label = "CITY BREAKS"; W = 1280; H = 853; Use = "Home travel styles" },
  [pscustomobject]@{ File = "tour-bwindi.jpg"; Label = "BWINDI GORILLA TREK"; W = 1280; H = 853; Use = "Tour cards + About" },
  [pscustomobject]@{ File = "tour-serengeti.jpg"; Label = "SERENGETI SAFARI"; W = 1280; H = 912; Use = "Tour cards" },
  [pscustomobject]@{ File = "tour-zanzibar.jpg"; Label = "ZANZIBAR BEACH"; W = 1280; H = 853; Use = "Tour cards" },
  [pscustomobject]@{ File = "tour-murchison.jpg"; Label = "MURCHISON FALLS"; W = 1280; H = 854; Use = "Tour cards" },
  [pscustomobject]@{ File = "tour-dubai.jpg"; Label = "DUBAI CITY BREAK"; W = 1280; H = 960; Use = "Tour cards + Destinations" },
  [pscustomobject]@{ File = "tour-santorini.jpg"; Label = "SANTORINI"; W = 1280; H = 853; Use = "Tour cards + Destinations" },
  [pscustomobject]@{ File = "pkg-capetown.jpg"; Label = "CAPE TOWN"; W = 1280; H = 853; Use = "Package carousel + Tour cards" },
  [pscustomobject]@{ File = "pkg-bali.jpg"; Label = "BALI"; W = 1280; H = 853; Use = "Package carousel + Tour cards" },
  [pscustomobject]@{ File = "pkg-paris.jpg"; Label = "PARIS"; W = 1280; H = 853; Use = "Package carousel + Tour cards" },
  [pscustomobject]@{ File = "pkg-maldives.jpg"; Label = "MALDIVES"; W = 1280; H = 853; Use = "Package carousel + Tour cards" },
  [pscustomobject]@{ File = "pkg-amboseli.jpg"; Label = "AMBOSELI"; W = 1280; H = 852; Use = "Package carousel + Tour cards" },
  [pscustomobject]@{ File = "pkg-kyoto.jpg"; Label = "KYOTO"; W = 1280; H = 853; Use = "Package carousel + Tour cards" },
  [pscustomobject]@{ File = "about-uganda.jpg"; Label = "UGANDA - THE NILE"; W = 1280; H = 853; Use = "About story + Tour cards" },
  [pscustomobject]@{ File = "dest-italy.jpg"; Label = "ITALY"; W = 1280; H = 960; Use = "Destinations + Tour cards" },
  [pscustomobject]@{ File = "about-journey.jpg"; Label = "OUR JOURNEY"; W = 1280; H = 959; Use = "About hero + About story + Tours" },
  [pscustomobject]@{ File = "about-alps.jpg"; Label = "THE ALPS"; W = 1280; H = 853; Use = "About values band" },
  [pscustomobject]@{ File = "banner-assistance.jpg"; Label = "TRAVEL ASSISTANCE"; W = 1280; H = 725; Use = "Home assistance banner + Tours CTA" },
  [pscustomobject]@{ File = "dest-uganda.jpg"; Label = "UGANDA - GORILLAS"; W = 1280; H = 853; Use = "Destinations + Contact hero" },
  [pscustomobject]@{ File = "dest-tanzania.jpg"; Label = "TANZANIA"; W = 1280; H = 853; Use = "Destinations" },
  [pscustomobject]@{ File = "dest-zanzibar.jpg"; Label = "ZANZIBAR"; W = 1280; H = 853; Use = "Destinations" },
  [pscustomobject]@{ File = "dest-japan.jpg"; Label = "JAPAN"; W = 1280; H = 853; Use = "Destinations" }
)

function New-RoundedPath {
  param([float]$X, [float]$Y, [float]$W, [float]$H, [float]$R)
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $d = $R * 2
  $path.AddArc($X, $Y, $d, $d, 180, 90)
  $path.AddArc($X + $W - $d, $Y, $d, $d, 270, 90)
  $path.AddArc($X + $W - $d, $Y + $H - $d, $d, $d, 0, 90)
  $path.AddArc($X, $Y + $H - $d, $d, $d, 90, 90)
  $path.CloseFigure()
  return $path
}

foreach ($img in $images) {
  $bmp = New-Object System.Drawing.Bitmap -ArgumentList $img.W, $img.H
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

  $rect = New-Object System.Drawing.Rectangle -ArgumentList 0, 0, $img.W, $img.H
  $bg = New-Object System.Drawing.Drawing2D.LinearGradientBrush -ArgumentList $rect, ([System.Drawing.Color]::FromArgb(11, 27, 77)), ([System.Drawing.Color]::FromArgb(29, 59, 213)), 35
  $g.FillRectangle($bg, $rect)
  $bg.Dispose()

  $green = New-Object System.Drawing.SolidBrush -ArgumentList ([System.Drawing.Color]::FromArgb(38, 16, 185, 129))
  $g.FillEllipse($green, [float]($img.W * 0.62), [float](-$img.H * 0.25), [float]($img.W * 0.62), [float]($img.W * 0.62))
  $green.Dispose()

  $white = New-Object System.Drawing.SolidBrush -ArgumentList ([System.Drawing.Color]::FromArgb(14, 255, 255, 255))
  $g.FillEllipse($white, [float](-$img.W * 0.18), [float]($img.H * 0.55), [float]($img.W * 0.55), [float]($img.W * 0.55))
  $white.Dispose()

  $pen = New-Object System.Drawing.Pen -ArgumentList ([System.Drawing.Color]::FromArgb(60, 255, 255, 255)), 2
  $pen.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Dash
  $inset = [float]($img.W * 0.025)
  $g.DrawRectangle($pen, $inset, $inset, $img.W - 2 * $inset, $img.H - 2 * $inset)
  $pen.Dispose()

  $badgeW = [float]($img.W * 0.15)
  $badgeH = [float]($img.W * 0.035)
  $badgeX = [float]($img.W * 0.05)
  $badgeY = [float]($img.H * 0.07)
  $badgePath = New-RoundedPath -X $badgeX -Y $badgeY -W $badgeW -H $badgeH -R ($badgeH / 2)
  $badgeBrush = New-Object System.Drawing.SolidBrush -ArgumentList ([System.Drawing.Color]::FromArgb(255, 16, 185, 129))
  $g.FillPath($badgeBrush, $badgePath)
  $badgeBrush.Dispose()
  $badgeFont = New-Object System.Drawing.Font -ArgumentList "Segoe UI", ([float]($img.W * 0.011)), ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel)
  $badgeFmt = New-Object System.Drawing.StringFormat
  $badgeFmt.Alignment = [System.Drawing.StringAlignment]::Center
  $badgeFmt.LineAlignment = [System.Drawing.StringAlignment]::Center
  $badgeRect = New-Object System.Drawing.RectangleF -ArgumentList $badgeX, $badgeY, $badgeW, $badgeH
  $g.DrawString("PLACEHOLDER", $badgeFont, [System.Drawing.Brushes]::White, $badgeRect, $badgeFmt)
  $badgeFont.Dispose(); $badgeFmt.Dispose(); $badgePath.Dispose()

  $centerFmt = New-Object System.Drawing.StringFormat
  $centerFmt.Alignment = [System.Drawing.StringAlignment]::Center
  $centerFmt.LineAlignment = [System.Drawing.StringAlignment]::Center

  $labelFont = New-Object System.Drawing.Font -ArgumentList "Segoe UI", ([float]($img.W * 0.045)), ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel)
  $labelRect = New-Object System.Drawing.RectangleF -ArgumentList 0, ([float]($img.H * 0.36)), $img.W, ([float]($img.H * 0.14))
  $g.DrawString($img.Label, $labelFont, [System.Drawing.Brushes]::White, $labelRect, $centerFmt)
  $labelFont.Dispose()

  $subFont = New-Object System.Drawing.Font -ArgumentList "Segoe UI", ([float]($img.W * 0.021)), ([System.Drawing.FontStyle]::Regular), ([System.Drawing.GraphicsUnit]::Pixel)
  $subBrush = New-Object System.Drawing.SolidBrush -ArgumentList ([System.Drawing.Color]::FromArgb(215, 255, 255, 255))
  $subRect = New-Object System.Drawing.RectangleF -ArgumentList 0, ([float]($img.H * 0.52)), $img.W, ([float]($img.H * 0.06))
  $g.DrawString("Replace this file with your own photo", $subFont, $subBrush, $subRect, $centerFmt)
  $subFont.Dispose(); $subBrush.Dispose()

  $dimFont = New-Object System.Drawing.Font -ArgumentList "Segoe UI", ([float]($img.W * 0.016)), ([System.Drawing.FontStyle]::Regular), ([System.Drawing.GraphicsUnit]::Pixel)
  $dimBrush = New-Object System.Drawing.SolidBrush -ArgumentList ([System.Drawing.Color]::FromArgb(170, 255, 255, 255))
  $dimRect = New-Object System.Drawing.RectangleF -ArgumentList 0, ([float]($img.H * 0.60)), $img.W, ([float]($img.H * 0.05))
  $dimText = "{0} x {1} px  |  JPG or WebP  |  {2}" -f $img.W, $img.H, $img.Use
  $g.DrawString($dimText, $dimFont, $dimBrush, $dimRect, $centerFmt)
  $dimFont.Dispose(); $dimBrush.Dispose()

  $brandFont = New-Object System.Drawing.Font -ArgumentList "Segoe UI", ([float]($img.W * 0.012)), ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel)
  $brandBrush = New-Object System.Drawing.SolidBrush -ArgumentList ([System.Drawing.Color]::FromArgb(160, 255, 255, 255))
  $brandRect = New-Object System.Drawing.RectangleF -ArgumentList ([float]($img.W * 0.04)), ([float]($img.H * 0.91)), ([float]($img.W * 0.92)), ([float]($img.H * 0.04))
  $leftFmt = New-Object System.Drawing.StringFormat
  $leftFmt.Alignment = [System.Drawing.StringAlignment]::Near
  $leftFmt.LineAlignment = [System.Drawing.StringAlignment]::Center
  $g.DrawString("ESTNAK TOURS AND TRAVEL", $brandFont, $brandBrush, $brandRect, $leftFmt)
  $brandFont.Dispose(); $brandBrush.Dispose(); $leftFmt.Dispose()

  $lineBrush = New-Object System.Drawing.SolidBrush -ArgumentList ([System.Drawing.Color]::FromArgb(255, 16, 185, 129))
  $g.FillRectangle($lineBrush, 0, $img.H - [float]($img.H * 0.006), $img.W, [float]($img.H * 0.006))
  $lineBrush.Dispose()

  $centerFmt.Dispose()
  $g.Dispose()
  $bmp.Save((Join-Path $imgDir $img.File), [System.Drawing.Imaging.ImageFormat]::Jpeg)
  $bmp.Dispose()
  Write-Output ("  {0} ({1}x{2})" -f $img.File, $img.W, $img.H)
}

$guide = @()
$guide += "# Image placeholders"
$guide += ""
$guide += "Every photo in this folder is a branded placeholder. To use your own image,"
$guide += "overwrite the matching file with a JPG or WebP of the same name. Keeping the"
$guide += "same filename means you do not need to edit any HTML."
$guide += ""
$guide += "| File | Recommended size | Used on |"
$guide += "| --- | --- | --- |"
foreach ($img in $images) {
  $guide += ("| `{0}` | {1} x {2} px | {3} |" -f $img.File, $img.W, $img.H, $img.Use)
}
$guide += ""
$guide += "Tips:"
$guide += ""
$guide += "- Keep each photo under about 400 KB so pages stay fast."
$guide += "- Export at roughly 1600 px wide if your source is larger; the site scales images down."
$guide += "- Keep the same aspect ratio to avoid cropping surprises. The HTML width/height"
$guide += "  attributes match the sizes above."
$guide += "- Update the alt text in src/pages/*.html so it describes your new photo."
$guide += "  Good alt text helps screen-reader users and search engines."
$guide += '- The logo files are `logo.svg` (light backgrounds) and `logo-light.svg` (dark'
$guide += '  backgrounds). Replace them with your own SVG or PNG, or update the paths in'
$guide += '  `partials/header.html` and `partials/footer.html`.'
$guide += ""
$guide += 'Run `powershell -ExecutionPolicy Bypass -File scripts/make-placeholders.ps1`'
$guide += "to regenerate all placeholders."

[System.IO.File]::WriteAllLines((Join-Path $imgDir "README.md"), $guide, (New-Object System.Text.UTF8Encoding($false)))
Write-Output "`nWrote assets/img/README.md"
