<?php
// Script to generate PWA icons
$sizes = array(72, 96, 128, 144, 152, 192, 384, 512);

foreach($sizes as $size) {
    // Create image
    $im = imagecreatetruecolor($size, $size);
    
    // Colors
    $blue = imagecolorallocate($im, 13, 110, 253); // Bootstrap primary color
    $white = imagecolorallocate($im, 255, 255, 255);
    
    // Fill background
    imagefill($im, 0, 0, $blue);
    
    // Add text
    $font_size = 5; // Max built-in font size
    $text = 'TC';
    $text_width = imagefontwidth($font_size) * strlen($text);
    $text_height = imagefontheight($font_size);
    
    // Center text
    $x = ($size - $text_width) / 2;
    $y = ($size - $text_height) / 2;
    
    imagestring($im, $font_size, $x, $y, $text, $white);
    
    // Save image
    $filename = __DIR__ . '/images/icons/icon-' . $size . 'x' . $size . '.png';
    imagepng($im, $filename);
    imagedestroy($im);
    
    echo "Created icon: $filename\n";
}

echo "All PWA icons generated successfully!\n";
?>