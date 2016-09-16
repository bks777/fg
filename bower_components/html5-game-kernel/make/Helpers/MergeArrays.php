<?php
/**
 * Merge Arrays
 * @author Antony Lavrenko
 */

class MergeArrays {

    /**
     * Merge 2 arrays with recursive and overwrites data in first array (2 priority)
     *
     * @param $Arr1
     * @param $Arr2
     * @return mixed
     */
    public static function arrayMergeRecursive($Arr1, $Arr2)
    {
        if(!is_array($Arr1)){
            \make\Cache\Console\Console::error(sprintf("Must be array! \$Arr1"));
        }

        if(!is_array($Arr2)){
            \make\Cache\Console\Console::error(sprintf("Must be array! \$Arr2"));
        }

        foreach($Arr2 as $key => $Value) {
            if(array_key_exists($key, $Arr1) && is_array($Value)){
                $Arr1[$key] = self::arrayMergeRecursive($Arr1[$key], $Arr2[$key]);
            } else {
                $Arr1[$key] = $Value;
            }
        }

        return $Arr1;
    }


} 