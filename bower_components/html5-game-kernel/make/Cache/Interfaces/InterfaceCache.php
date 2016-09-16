<?php
/**
 * Interface
 * @author Antony Lavrenko
 */

namespace make\Cache\Interfaces;

use make\Cache\BufferCache;
use make\Finder\Finder;

interface InterfaceCache
{
    /**
     * Set Finder
     *
     * @param Finder $finder
     * @return mixed
     */
    public function setFinder(Finder $finder);

    /**
     * Set folder
     *
     * @param $path
     */
    public function setFolder($path);

    /**
     *
     * Get list elements in folder
     * @return mixed
     */
    public function getFolder();

    /**
     * Set buffer instance
     *
     * @param BufferCache $bufferCache
     * @return mixed
     */
    public function setBuffer(BufferCache $bufferCache);

    /**
     * Get buffer instance
     *
     * @return BufferCache
     */
    public function getBuffer();

    /**
     * Get auth config
     * @return mixed
     */
    public static function getAuth();

    /**
     * Execute method of class
     * @param null $data
     * @return mixed
     */
    public function execute($data = null);
} 