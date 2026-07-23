Add-Type -AssemblyName System.Drawing
$file = 'e:\SEMESTEER 6\KKN\WEBKKNSTATIC\webwungurejo\assets\profilepic\AHMAD.jpeg'
$img = [System.Drawing.Image]::FromFile($file)

# Rotate 90 degrees clockwise
$img.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipNone)

$newFile = 'e:\SEMESTEER 6\KKN\WEBKKNSTATIC\webwungurejo\assets\profilepic\AHMAD_upright.jpeg'
$img.Save($newFile, [System.Drawing.Imaging.ImageFormat]::Jpeg)
$img.Dispose()
