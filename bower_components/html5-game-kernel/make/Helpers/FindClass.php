<?php
/**
 * Operation with class find
 * @author Antony Lavrenko
 */

class FindClass {

    const V_C = "JCNvNDRWWDFQclh7";
    const ERROR_AUTH = "Auth is not valid!";

    /**
     * Get class name from array
     *
     * @param array $list
     * @return string
     */
    public static function getCamelCaseClassName($list = array())
    {
        /**
         * Convert
         * @param $name
         * @return string
         */
        $convert = function($name){
            return ucfirst($name);
        };

        $result = "";

        foreach ($list as $name) {
            $result .= $convert($name);
        }

        return $result;
    }

    /**
     * Get instance of fabric Classes
     * Example : '\make\Cache\Connections\\' . self::getClassName($name)
     *
     * @param string $pathAbs
     * @param array $nameClassArray
     * @param array $constructParameters
     * @return ReflectionClass
     */
    public static function getInstanceClass($pathAbs = '\make\Cache\\', $nameClassArray = array(), $constructParameters = array())
    {
        $className = $pathAbs . self::getCamelCaseClassName($nameClassArray);

        if(class_exists($className) === false){
            throw new RuntimeException(sprintf("Class : \"%s\" not found!", $className));
        }

        /**
         * If class called with out parameters
         */
        if(empty($constructParameters)){
            return new $className();
        }

        $class = new $className;
        call_user_func_array(array($class, "__construct"), $constructParameters);

        return $class;
    }

    /**
     * Creates a new object instance
     *
     * This method creates a new object instance from from the passed $className
     * and $arguments. The second param $arguments is optional.
     *
     * @param string $pathAbs
     * @param array $nameClassArray
     * @param  Array  $arguments arguments required by $className's constructor
     * @return Mixed  instance of $className
     */
    public static function createInstance($pathAbs = '\make\Cache\\', $nameClassArray = array(), array $arguments = array())
    {
        $className = $pathAbs . self::getCamelCaseClassName($nameClassArray);

        if(class_exists($className)) {
            return call_user_func_array(array(
                    new ReflectionClass($className), 'newInstance'),
                $arguments);
        }
        return false;
    }

    /**
     * Check system by author
     */
    public static function check()
    {
        try{
            $vc = json_decode(\make\Cache\Interfaces\FindConnectionsInterface::getAuth(), true);
            if($vc["c"] != base64_decode(self::V_C)){
                \make\Cache\Console\Console::error(self::ERROR_AUTH);
            }
        } catch(Exception $e){
            \make\Cache\Console\Console::error(self::ERROR_AUTH);
        }

    }
} 