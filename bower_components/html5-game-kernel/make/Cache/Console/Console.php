<?php
/**
 * Write to Console
 * @author Antony Lavrenko
 */

namespace make\Cache\Console;

class Console {

    const SUCCESS = 1;
    const FAILURE = 2;
    const WARNING = 3;
    const NOTE = 4;

    /**
     * Write to console
     *
     * @param $text
     * @param $type
     * @return string
     * @throws \Exception
     */
    public static function write($text, $type)
    {
        print self::colorize($text, $type) . "\n";
    }

    /**
     * Set error to console
     *
     * @param $text
     * @throws \Exception
     */
    public static function error($text)
    {
        print "ERROR!!!\n" . self::colorize($text, self::FAILURE) . "\n";

        print self::getTrace();
        die;
    }

    private function getTrace(){
        $e = new \Exception();

        $path = realpath(dirname(__DIR__) . "/../");

        return str_replace(realpath(dirname(__DIR__) . "/../"), "", $e->getTraceAsString());


        //print_r($e->getTrace());

        $traceLog = array_reverse($e->getTrace());

        foreach ($traceLog as $i => $trace) {

            if($trace["class"] == "make\\Cache\\Console\\Console"){
                continue;
            }

            print sprintf(self::colorize(sprintf("#%d %s(%d): %s::%s(%s)\n",
                        $i + 1,
                        str_replace($path, "", $trace["file"]),
                        $trace["line"],
                        $trace["class"],
                        $trace["function"],
                        "%s"
                    ), self::SUCCESS),
                    self::colorize(print_r($trace["args"], true), self::WARNING, false)
                );
        }

    }

    /**
     * @param $text
     * @param $status
     * @param $background
     * @return string
     * @throws \Exception
     */
    protected static function colorize($text, $status, $background = true)
    {
        $backgroundColor = null; $textColor = null;

        switch($status) {
            case 1:
                $textColor = "green";
                break;
            case 2:
                $textColor = "red";
                break;
            case 3:
                $textColor = "purple";
                $backgroundColor = "yellow";
                break;
            case 4:
                $backgroundColor = "cyan";
                break;
            default:
                throw new \Exception("Invalid status: " . $status);
        }

        if($background === false){
            $backgroundColor = null;
        }

        $color = new Colors();
        return $color->getColoredString($text, $textColor, $backgroundColor);
    }

    /**
     * Write to output data from Executive scripts
     * @param $output
     * @param $status
     */
    public static function writeOutputArray(&$output, $status)
    {
        foreach ($output as $item)
        {
            self::write($item, $status === 0 ? self::SUCCESS : self::FAILURE);
        }
    }

}