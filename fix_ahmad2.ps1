Add-Type -AssemblyName System.Drawing
$file = 'e:\SEMESTEER 6\KKN\WEBKKNSTATIC\webwungurejo\assets\profilepic\AHMAD.jpeg'
$img = [System.Drawing.Image]::FromFile($file)

$orientationId = 0x0112
$orientation = 1

if ($img.PropertyIdList -contains $orientationId) {
    $propItem = $img.GetPropertyItem($orientationId)
    $orientation = [BitConverter]::ToUInt16($propItem.Value, 0)
}

Write-Host "Original Orientation: $orientation"

switch ($orientation) {
    2 { $img.RotateFlip([System.Drawing.RotateFlipType]::RotateNoneFlipX) }
    3 { $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate180FlipNone) }
    4 { $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate180FlipX) }
    5 { $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipX) }
    6 { $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipNone) }
    7 { $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate270FlipX) }
    8 { $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate270FlipNone) }
}

# Remove all EXIF tags so browsers don't try to rotate it again
foreach ($prop in $img.PropertyItems) {
    $img.RemovePropertyItem($prop.Id)
}

$newFile = 'e:\SEMESTEER 6\KKN\WEBKKNSTATIC\webwungurejo\assets\profilepic\AHMAD_fixed2.jpeg'
$img.Save($newFile, [System.Drawing.Imaging.ImageFormat]::Jpeg)
$img.Dispose()
Write-Host "Saved fixed image to $newFile"
