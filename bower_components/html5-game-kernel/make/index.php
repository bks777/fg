<?php

/**
 * Game kernel includes
 * @author Antony Lavrenko
 */

namespace make;

use make\Cache\BufferCache;
use make\Cache\MakeCache;

require_once 'Helpers/MergeArrays.php';
require_once 'Helpers/FindClass.php';
require_once 'Helpers/GetAudioData.php';
require_once 'Helpers/JSON/Services_JSON.php';
require_once 'Helpers/JSON/Services_Decrypt.php';
require_once 'Helpers/Buffer/auth.php';
require_once 'Helpers/HelperJSON.php';
require_once 'Finder/Finder.php';
require_once 'Cache/Fabric/Fabric.php';
require_once 'Cache/Interfaces/InterfaceCache.php';
require_once 'Cache/Interfaces/FindConnectionsInterface.php';
require_once 'Cache/Connections/FolderFinder.php';
require_once 'Cache/Connections/ListenerFinder.php';
require_once 'Cache/Connections/ClassesFinder.php';
require_once 'Cache/Connections/ComponentFinder.php';
require_once 'Cache/Connections/ViewsFinder.php';
require_once 'Cache/Connections/LibsFinder.php';
require_once 'Cache/Connections/CssFinder.php';
require_once 'Cache/Connections/ImagesFinder.php';
require_once 'Cache/Connections/AudioFinder.php';
require_once 'Cache/Connections/AudioSpriteFinder.php';
require_once 'Cache/Connections/FrameDataFinder.php';
require_once 'Cache/Connections/TranslationsFinder.php';
require_once 'Cache/Connections/StatesFinder.php';
require_once 'Cache/Connections/SignalsFinder.php';
require_once 'Cache/Console/Color.php';
require_once 'Cache/Console/Console.php';
require_once 'Cache/BufferCache.php';
require_once 'Cache/MakeCache.php';
require_once 'Cache/CreateCache/SaveIndexCache.php';
require_once 'Cache/CreateCache/CreateInterface.php';
require_once 'Cache/CreateCache/CreateDevCache.php';
require_once 'Cache/CreateCache/CreateProdCache.php';
require_once 'Types/ClassesLink.php';
require_once 'Types/AudioMergeLink.php';
require_once 'Types/AudioConvertOggLink.php';
require_once 'Types/SignalCombination.php';
require_once 'Compression/JSMin.php';
require_once 'Compression/audio/MergeMP3s.php';
require_once 'Compression/audio/AudioToOgg.php';
require_once 'Compression/pngquant/pngQuant.php';

$cache = new MakeCache();
$cache->setBuffer(new BufferCache());

/**
 * @var $argv null
 */
$cache->setArguments($argv);

//$cache->buffer->debug();
$cache->buffer->info();