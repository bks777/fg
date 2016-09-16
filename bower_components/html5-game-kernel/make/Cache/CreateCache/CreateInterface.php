<?php
/**
 * Create Interface
 * @author Antony Lavrenko
 */

namespace make\Cache\CreateCache;


use make\Cache\BufferCache;

interface CreateInterface {

    /**
     * Set Buffer
     *
     * @param BufferCache $bufferCache
     * @return mixed
     */
    public function __construct(BufferCache $bufferCache);

    /**
     * Generate cache
     *
     * @return mixed
     */
    public function generate();

} 