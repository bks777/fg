<?php
/**
 * Get audio data of frame
 * @author Antony Lavrenko
 */

class GetAudioData {

    public static function readframe($file) {
        if (! ($f = fopen($file, 'rb')) ) die("Unable to open " . $file);
        $res['filesize'] = filesize($file);
        do {
            while (fread($f,1) != Chr(255)) { // Find the first frame
                if (feof($f))  {
			\make\Cache\Console\Console::error(sprintf("Audio first frame not found: %s| or file not valid", $file));
		}
            }
            fseek($f, ftell($f) - 1); // back up one byte

            $frameoffset = ftell($f);

            $r = fread($f, 4);

            $bits = sprintf("%'08b%'08b%'08b%'08b", ord($r{0}), ord($r{1}), ord($r{2}), ord($r{3}));
        }
        while (!$bits[8] and !$bits[9] and !$bits[10]); // 1st 8 bits true from the while

        // Detect VBR header
        if ($bits[11] == 0) {
            if (($bits[24] == 1) && ($bits[25] == 1)) {
                $vbroffset = 9; // MPEG 2.5 Mono
            } else {
                $vbroffset = 17; // MPEG 2.5 Stereo
            }
        } else if ($bits[12] == 0) {
            if (($bits[24] == 1) && ($bits[25] == 1)) {
                $vbroffset = 9; // MPEG 2 Mono
            } else {
                $vbroffset = 17; // MPEG 2 Stereo
            }
        } else {
            if (($bits[24] == 1) && ($bits[25] == 1)) {
                $vbroffset = 17; // MPEG 1 Mono
            } else {
                $vbroffset = 32; // MPEG 1 Stereo
            }
        }

        fseek($f, ftell($f) + $vbroffset);
        $r = fread($f, 4);

        switch ($r) {
            case 'Xing':
                $res['encoding_type'] = 'VBR';
            case 'VBRI':
            default:
                if ($vbroffset != 32) {
                    // VBRI Header is fixed after 32 bytes, so maybe we are looking at the wrong place.
                    fseek($f, ftell($f) + 32 - $vbroffset);
                    $r = fread($f, 4);

                    if ($r != 'VBRI') {
                        $res['encoding_type'] = 'CBR';
                        break;
                    }
                } else {
                    $res['encoding_type'] = 'CBR';
                    break;
                }

                $res['encoding_type'] = 'VBR';
        }

        fclose($f);

        if ($bits[11] == 0) {
            $res['mpeg_ver'] = "2.5";
            $bitrates = array(
                '1' => array(0, 32, 48, 56, 64, 80, 96, 112, 128, 144, 160, 176, 192, 224, 256, 0),
                '2' => array(0,  8, 16, 24, 32, 40, 48,  56,  64,  80,  96, 112, 128, 144, 160, 0),
                '3' => array(0,  8, 16, 24, 32, 40, 48,  56,  64,  80,  96, 112, 128, 144, 160, 0),
            );
        } else if ($bits[12] == 0) {
            $res['mpeg_ver'] = "2";
            $bitrates = array(
                '1' => array(0, 32, 48, 56, 64, 80, 96, 112, 128, 144, 160, 176, 192, 224, 256, 0),
                '2' => array(0,  8, 16, 24, 32, 40, 48,  56,  64,  80,  96, 112, 128, 144, 160, 0),
                '3' => array(0,  8, 16, 24, 32, 40, 48,  56,  64,  80,  96, 112, 128, 144, 160, 0),
            );
        } else {
            $res['mpeg_ver'] = "1";
            $bitrates = array(
                '1' => array(0, 32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448, 0),
                '2' => array(0, 32, 48, 56,  64,  80,  96, 112, 128, 160, 192, 224, 256, 320, 384, 0),
                '3' => array(0, 32, 40, 48,  56,  64,  80,  96, 112, 128, 160, 192, 224, 256, 320, 0),
            );
        }

        $layer = array(
            array(0,3),
            array(2,1),
        );
        $res['layer'] = $layer[$bits[13]][$bits[14]];

        if ($bits[15] == 0) {
            // It's backwards, if the bit is not set then it is protected.
            $res['crc'] = true;
        }

        $bitrate = 0;
        if ($bits[16] == 1) $bitrate += 8;
        if ($bits[17] == 1) $bitrate += 4;
        if ($bits[18] == 1) $bitrate += 2;
        if ($bits[19] == 1) $bitrate += 1;
        $res['bitrate'] = $bitrates[$res['layer']][$bitrate];

        $frequency = array(
            '1' => array(
                '0' => array(44100, 48000),
                '1' => array(32000, 0),
            ),
            '2' => array(
                '0' => array(22050, 24000),
                '1' => array(16000, 0),
            ),
            '2.5' => array(
                '0' => array(11025, 12000),
                '1' => array(8000, 0),
            ),
        );
        $res['frequency'] = $frequency[$res['mpeg_ver']][$bits[20]][$bits[21]];

        $mode = array(
            array('Stereo', 'Joint Stereo'),
            array('Dual Channel', 'Mono'),
        );
        $res['mode'] = $mode[$bits[24]][$bits[25]];

        $samplesperframe = array(
            '1' => array(
                '1' => 384,
                '2' => 1152,
                '3' => 1152
            ),
            '2' => array(
                '1' => 384,
                '2' => 1152,
                '3' => 576
            ),
            '2.5' => array(
                '1' => 384,
                '2' => 1152,
                '3' => 576
            ),
        );
        $res['samples_per_frame'] = $samplesperframe[$res['mpeg_ver']][$res['layer']];

        if ($res['encoding_type'] != 'VBR') {
            if ($res['bitrate'] == 0) {
                $s = -1;
            } else {
                $s = ((8*filesize($file))/1000) / $res['bitrate'];
            }
            $res['length'] = sprintf('%02d:%02d',floor($s/60),floor($s-(floor($s/60)*60)));
            $res['lengthh'] = sprintf('%02d:%02d:%02d',floor($s/3600),floor($s/60),floor($s-(floor($s/60)*60)));
            $res['lengths'] = $s;

            $res['samples'] = ceil($res['lengths'] * $res['frequency']);
            if(0 != $res['samples_per_frame']) {
                $res['frames'] = ceil($res['samples'] / $res['samples_per_frame']);
            } else {
                $res['frames'] = 0;
            }
            $res['musicsize'] = ceil($res['lengths'] * $res['bitrate'] * 1000 / 8);
        } else {
            $res['samples'] = $res['samples_per_frame'] * $res['frames'];
            $s = $res['samples'] / $res['frequency'];

            $res['length'] = sprintf('%02d:%02d',floor($s/60),floor($s-(floor($s/60)*60)));
            $res['lengthh'] = sprintf('%02d:%02d:%02d',floor($s/3600),floor($s/60),floor($s-(floor($s/60)*60)));
            $res['lengths'] = $s;

            $res['bitrate'] = (int)(($res['musicsize'] / $s) * 8 / 1000);
        }

        return $res;
    }

} 
