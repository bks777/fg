import ComponentInterface from "../component/componentInterface.es6";

/**
 * Events Interface class
 * @constructor
 */
export default class Events extends ComponentInterface {

    constructor(data = {}){
        super(data);
    }

    /**
     * Initialization component - interface method
     */
    run () {

    }

    /**
     * Set event for application
     * @param name
     * @param data
     */
    setEvent (name, data = {})
    {
        try{
            $_event.setEvent(name, data);
        } catch(e) {
            $_log.error(e);
        }
    };

    /**
     * Subscribe event to listener
     * @param name
     */
    setSubscriber (name)
    {
        try{
            $_event.setSubscriber(name, this.instanceName);
        } catch(e) {
            $_log.error(e);
        }
    };

    /**
     * Un Subscribe event from listener
     * @param name
     */
    unsetSubscriber (name)
    {
        try{
            $_event.unsetSubscriber(name, this.instanceName);
        } catch(e) {
            $_log.error(e);
        }
    };
}
