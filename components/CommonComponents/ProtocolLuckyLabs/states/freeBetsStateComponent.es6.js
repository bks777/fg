import StateEvent from "../../../../bower_components/html5-game-kernel/interfaces/stateMachine/stateEvent.es6";
import ComponentInterface from "../../../../bower_components/html5-game-kernel/interfaces/component/componentInterface.es6";

export default class freeBetsStateComponent extends StateEvent {

    constructor() {
        super();

        this.component = new ComponentInterface();

        this.available = false;
        this.data = null;

        this.deteled = false;
        this.finished = false;
    }

    /**
     * Update freeBets
     */
    update(){
        this.available = this.component.getService("ProtocolService").hasFreeBets();
        this.data = this.component.getService("ProtocolService").getFreeBets();
    }

    /**
     * Is active FreeBets
     * @returns {boolean}
     */
    isActive(){
        this.update();

        return this.available;
    }

    /**
     * Is finished freeBets
     * @returns {boolean}
     */
    isFinished(){
        return this.finished;
    }

    /**
     * Set finished freeBets
     * @returns {boolean}
     */
    setFinished(){
        return this.finished = true;
    }

    /**
     * Is deleted freebets
     * @returns {boolean}
     */
    isDeleted(){
        return this.deteled;
    }

    setDeleted(){
        this.deteled = true;

        this.component.getService("ProtocolService").setFreeBets({status: "deleted"});
        $_stateMachine.router.restartGame = true;

        this.component.getService("PopupService").removeInfoPopup("freebets", ()=>{
            this.showPopupEnd($_stateMachine.goToRouter.bind($_stateMachine));
        });
    }

    /**
     * Show popup start freeBets
     * @param callback
     */
    showPopupStart(callback = () => {}){
        this.update();

        let clicked = false, intervalClick = null;

        this.component.getService("PopupService").addInfoPopup("freebets", {message: $_t.getText("free_bets_start",
            this.data.left_spins), header: $_t.getText("free_bets_head")}, {
                resolve: () => {

                    if(intervalClick !== null){
                        clearTimeout(intervalClick);
                    }

                    if(!clicked){
                        clicked = true;
                        callback();
                    }
                }
            }
        );

        /**
         * Auto close popup
         */
        if(this.component.getService("AutoPlayService").isActive()){
            intervalClick = setTimeout(() => {

                if(!clicked){
                    clicked = true;
                    this.component.getService("PopupService").removeInfoPopup("freebets", callback);
                }

            }, 7 * 1000); // 7 sec
        }
    }

    /**
     * Show end popup
     * @param callback
     */
    showPopupEnd(callback){

        this.data = this.component.getService("ProtocolService").getFreeBetsLast();

        if(this.isFinished()){
            this.component.getService("PopupService").addInfoPopup("freebets", {
                message: this.data.total_win > 0 ? $_t.getText("free_bets_end_{0}", number_format(this.data.total_win / 100, 2, ".", ",")) : $_t.getText("free_bets_end_no_win"), header: $_t.getText("free_bets_head")},{
                resolve: callback});
        } else {
            this.component.getService("PopupService").addInfoPopup("freebets", {
                message: $_t.getText("free_bets_deleted"), header: $_t.getText("free_bets_head")},{
                resolve: callback});
        }

        this.available = false;
        this.deteled = false;
        this.finished = false;
    }

}