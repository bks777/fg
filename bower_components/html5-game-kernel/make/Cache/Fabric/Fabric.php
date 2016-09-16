<?php
/**
 * Fabric of cache components
 * @author Antony Lavrenko
 */

namespace make\Cache\Fabric;

use make\Cache\Interfaces\InterfaceCache;
use make\Finder\Finder;
use make\Cache\BufferCache;

class Fabric {

    protected static $method = 'execute';
    protected static $finder = null;

    protected static $listInstances = array();

    /**
     * @var BufferCache
     */
    protected static $bufferCache = null;

    public static $typeClass = 'Finder';

    /**
     * Set Finder
     *
     * @param Finder $finder
     */
    public static function setFinder(Finder $finder)
    {
        self::$finder = $finder;
    }

    /**
     * Set Buffer Cache
     *
     * @param BufferCache $bufferCache
     */
    public static function setBuffer(BufferCache $bufferCache)
    {
        self::$bufferCache = $bufferCache;
    }

    /**
     * Get Buffer Instance
     *
     * @return BufferCache
     */
    public static function getBuffer()
    {
        return self::$bufferCache;
    }

    /**
     * Return Finder instance
     *
     * @return Finder
     */
    public static function getFinder()
    {
        return self::$finder;
    }

    /**
     * Get class name
     *
     * @param $className
     * @return string
     */
    protected static function getClassName($className)
    {
        return ucfirst($className) . self::$typeClass;
    }

    /**
     * Get instance of fabric Classes
     *
     * @param $name
     * @return mixed
     */
    protected static function getInstanceClass($name)
    {
        $className = '\make\Cache\Connections\\' . self::getClassName($name);

        if(!array_key_exists($name, self::$listInstances)){
            $instance = new $className();
            self::$listInstances[ $name ] = $instance;
        } else {
            $instance = self::$listInstances[ $name ];
        }

        return $instance;
    }

    /**
     * Get instance of cache components
     *
     * @param $name
     * @param null $data
     * @return mixed
     * @throws \Exception
     */
    public static function getResult($name, $data = null)
    {
        $instance = self::getInstanceClass($name);

        if(!method_exists($instance, self::$method)){
            throw new \Exception(sprintf('Type config of %s not found!', $name), 500);
        }

        /**
         * @var $instance InterfaceCache
         */
        $instance->setFinder(self::getFinder());
        $instance->setBuffer(self::getBuffer());

        return $instance->{self::$method}($data);
    }

} 