export default class TransferInterface {

    static get TYPE_POST () {  return "POST";  }
    static get TYPE_GET () {   return "GET";   }

    constructor(data = {}){

        this.init(data);

        this.promiseSuccess = null;
        this.promiseError = null;
    }

    /**
     * Set data to transfers
     * @param data
     */
    init (data = {}) {
        for(let key in data){
            this[key] = data[key];
        }
    }

    /**
     * Send data to server
     * @param url
     * @param data
     * @param type
     */
    send (url = null, data = null, type = TransferInterface.TYPE_POST) {
        /* @TODO complete method in children class */
    }

    /**
     * Set promise success
     * @param promiseSuccess
     */
    setPromiseSuccess (promiseSuccess = null){
        this.promiseSuccess = promiseSuccess;
    }

    /**
     * Set promise error
     * @param promiseError
     */
    setPromiseError (promiseError = null){
        this.promiseError = promiseError;
    }

    /**
     * Get count of creates instances
     * @returns {number}
     */
    createCountOfInstance (){
        return $_required.getCountImage();
    }

    /**
     * Protocol restart game for FreeBets
     * @param status
     * @returns {boolean}
     */
    ifStatusRestart(status = "OK"){

        if(status === "RESTART"){
            $_signal.goTo("protocol.freebets.reload");
            return false;
        }

        return true;
    }

}
