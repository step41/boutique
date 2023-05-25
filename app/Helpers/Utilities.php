<?php

namespace App\Helpers;

class Utilities {

    /**
     * Used to import data from CSV files
     */
    public static function csvImport($filename, $delim = ',') {
        if (!file_exists($filename) || !is_readable($filename)):
            return FALSE;
        endif;
        $header = NULL;
        $data = [];
        if (($handle = fopen($filename, 'r')) !== FALSE):
            while (($row = fgetcsv($handle, 1000, $delim)) !== FALSE):
                if (!$header):
                    $header = $row;
                else:
                $data[] = array_combine($header, $row);
                endif;
            endwhile;
            fclose($handle);
        endif;
        return $data;
    }
    
}
