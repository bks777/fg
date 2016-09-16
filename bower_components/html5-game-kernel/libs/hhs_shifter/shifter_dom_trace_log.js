/**
 *
 * @constructor
 */
var HHSShifterDOMTraceLog = function()
{
    var _activeTraceLogDOM = false;
    var _listTraceLogDOM = [];

    /**
     * Init log
     */
    this.init = function ()
    {
        _activeTraceLogDOM = true;
        $_log._traceStart = true;
        $_log.traceLog = _saveTraceLogToDOM;

        window.console.error = function(e) {
            _saveTraceLogToDOM('error', {
                message: e.message,
                name: e.name,
                filename: e.fileName,
                line: e.lineNumber,
                column: e.columnNumber,
                stack: e.stack
            });
        };

        window.console.log = function(){
            _saveTraceLogToDOM('log', arguments);
        };
    };

    /**
     * Write to log
     * @private
     */
    var _saveTraceLogToDOM = function()
    {
        _listTraceLogDOM.unshift(arguments);
        _listTraceLogDOM.splice(300);
    };

    /**
     * Open block
     */
    this.open = function()
    {
        $('#' + $_shifter._id_block).append($_shifter.template.render('traceDOMConsole', {
            _close: "$('#_shifter_trace_dom').remove();",
            _list: _listTraceLogDOM
        }));
    };
};