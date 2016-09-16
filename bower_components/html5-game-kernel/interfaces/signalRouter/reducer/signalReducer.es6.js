import SignalReduceInterface from "../interface/signalReduceInterface.es6.js";

export default class SignalReducer extends SignalReduceInterface {

    constructor(router){
        super();

        this.router = router;
        this.history = $_signal_history;

        this.lastReduce = null;

        this._listTypes = ["onlyList", "group", "many"];
    }

    /**
     * Return explanation of executive type of checked reducers
     * @param type
     * @param issue
     * @param args
     * @returns {*}
     */
    execute (type = 1, issue = {}, args = []){

        if(Object.keys(this._listTypes).indexOf(type.toString()) == -1){
            return null;
        }

        let method = `_${this._listTypes[type]}Executive`;

        try{
            return this[method](issue, args);
        } catch(e){
            $_log.error(`Exception found in "${method}" reduce state!`, e);
        }
    }

    /**
     * Execute only blockers operations if condition is approved
     * @param issue
     * @returns {boolean}
     * @private
     */
    _onlyListExecutive (issue = null){

        for(let i = 0, l = issue.length; i < l; i++){

            if(this.history.getLastAlias().indexOf(issue[i]) !== -1){
                $_log.error(`EXEC reduce blocked from "${this.lastReduce}"`);
                return true;
            }
        }

        return false;
    }

    _groupExecutive (issue = null, args = []){
        $_log.log(`EXEC "${this.history.getLastAlias()}" STATE REDUCER -- _groupExecutive`, issue, args);
    }

    /**
     * Execute reducers with issues
     * @param issues
     * @param args
     * @returns {boolean}
     * @private
     */
    _manyExecutive (issues = null, args = []){

        let keys = Object.keys(issues);

        for(let i = 0, len = keys.length; i < len; i++){

            if(issues[ keys[i]].indexHistory !== undefined){

                if(issues[ keys[i]].indexHistory instanceof Array && issues[ keys[i]].indexHistory.indexOf(this.history.find(keys[i])) !== -1){

                    return this.__exec(issues, keys, i, args);

                } if(!(issues[ keys[i]].indexHistory instanceof Array) && this.history.find(keys[i]) === issues[ keys[i]].indexHistory) {

                    return this.__exec(issues, keys, i, args);
                }

                continue;
            }

            if(this.history.getLastAlias().indexOf(keys[i]) !== -1){

                return this.__exec(issues, keys, i, args);
            }
        }

        return false;
    }

    /**
     * Exec
     * @param issues
     * @param keys
     * @param i
     * @param args
     * @returns {boolean}
     * @private
     */
    __exec(issues, keys, i, args){
        $_log.error(`EXEC "${this.lastReduce}" with "${keys[i]}" STATE REDUCER -- _manyExecutive`, issues[ keys[i] ], args);

        this.router.executeActions(issues[ keys[i] ], args);

        return !(issues[ keys[i] ].resume !== undefined && issues[ keys[i] ].resume === true);
    }

}