<?php
/**
 * JSON parse and encode
 * @author Antony Lavrenko
 */

class HelperJSON {

    /**
     * Check valid JSON
     * @return bool
     */
    protected static function is_JSON()
    {
        call_user_func_array('json_decode',func_get_args());
        return (json_last_error()===JSON_ERROR_NONE);
    }

    /**
     * Remove comments from json string
     * @param $string
     * @return string
     */
    protected static function removeComments($string)
    {
        return preg_replace("#(/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+/)|([\s\t]//.*)|(^//.*)#", '', $string);
    }

    /**
     * Decode JSON string to Array or Object
     * @param $string
     * @param bool $array
     * @param bool $filePath
     * @return mixed
     */
    public static function decode($string, $array = false, $filePath = null)
    {
        $string = self::removeComments($string);

        $service = new Services_JSON(JSON_HELPER);

        $result = array();

        try{

            $result = $service->decode($string);

        } catch(\Exception $e) {
            \make\Cache\Console\Console::error($e->getMessage() . ";line - " . $e->getLine() . "; in - " . $filePath);
        }

        return $result;
    }

    /**
     * Encode Array to JSON
     * @param $array
     * @return string
     */
    public static function encode($array)
    {
        return json_encode($array);
    }
} 