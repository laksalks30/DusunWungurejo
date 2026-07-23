Add-Type -AssemblyName System.Drawing
$file = 'e:\SEMESTEER 6\KKN\WEBKKNSTATIC\webwungurejo\assets\profilepic\AHMAD.jpeg'
$img = [System.Drawing.Image]::FromFile($file)
# Remove all PropertyItems to strip EXIF metadata
foreach ($prop in $img.PropertyItems) {
    $img.RemovePropertyItem($prop.Id)
}
$newFile = 'e:\SEMESTEER 6\KKN\WEBKKNSTATIC\webwungurejo\assets\profilepic\AHMAD_fixed.jpeg'
$img.Save($newFile, [System.Drawing.Imaging.ImageFormat]::Jpeg)
$img.Dispose()
