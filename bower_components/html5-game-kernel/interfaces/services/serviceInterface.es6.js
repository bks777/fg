/**
 * Service Interface
 */
export default class ServiceInterface {

    constructor(data = {}){
        this.init(data);

        this.service = this;

        this.setInstanceToFabric();
    }

    /**
     * Set data to service
     * @param data
     */
    init (data = {}) {
        for(let key in data){
            this[key] = data[key];
        }
    }

    /**
     * Set to service fabric instance of current class
     */
    setInstanceToFabric () {

        if(!$_services.hasService(this.constructor.name)){
            $_services.setService(this.constructor.name, this);
        } else {
            this.service = $_services.getService(this.constructor.name);
        }
    }

    /**
     * Get instance of service
     * @param name
     * @returns {*}
     */
    getService (name = null){
        return $_services.getService(name);
    }

}