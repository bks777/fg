<?php

/**
 * Created by PhpStorm.
 * User: Anton
 * Date: 4/18/16
 * Time: 12:26 AM
 */
class PNGQuant
{

    /**
     * Optimizes PNG file with pngquant 1.8 or later (reduces file size of 24-bit/32-bit PNG images).
     *
     * You need to install pngquant 1.8 on the server (ancient version 1.0 won't work).
     * There's package for Debian/Ubuntu and RPM for other distributions on http://pngquant.org
     *
     * @param $path_to_png_file - path to any PNG file, e.g. $_FILE['file']['tmp_name']
     * @param int $max_quality - conversion quality, useful values from 60 to 100 (smaller number = smaller file)
     * @return string - content of PNG file after conversion
     * @throws Exception
     */
    public static function compress_png($path_to_png_file, $max_quality = 90)
    {
        if (!file_exists($path_to_png_file)) {
            throw new Exception("File does not exist: $path_to_png_file");
        }

        // guarantee that quality won't be worse than that.
        $min_quality = 10;

        // '-' makes it use stdout, required to save to $compressed_png_content variable
        // '<' makes it read from the given file path
        // escapeshellarg() makes this safe to use with any path

        $compressed_png_content = shell_exec(dirname(__FILE__)."/pngquant --quality=$min_quality-$max_quality - < ".escapeshellarg( realpath($path_to_png_file) ));

        if (!$compressed_png_content) {
            throw new Exception("Conversion to compressed PNG failed. Is pngquant 1.8+ installed on the server?");
        }

        return $compressed_png_content;
    }
}