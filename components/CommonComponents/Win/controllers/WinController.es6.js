import Controller from "../../../../bower_components/html5-game-kernel/interfaces/controllers/Controller.es6.js";

export default class WinController extends Controller {

    constructor(data = {}){
        super(data);
    }

    /**
     * Check big win
     * @param nextAction
     */
    checkBigWin(nextAction = null){

        if(HelperFlags.get("justStarted")){
            return nextAction();
        }

        try{
            let totalWin = this.getService("ProtocolService").getCurrentWin();
            let bet = this.getService("BetService").getCurrentValue();
            let lines = this.getService("LinesService").getCurrentValue();
            let totalBet = bet * lines * this.getService("ProtocolService").getCurrentDenominator();
            let winType = totalBet * 25 <= totalWin ? 'SuperMega' :
                    totalBet * 20 <= totalWin ? 'Super' :
                    totalBet * 15 <= totalWin ? 'Mega' :
                    totalBet * 10 <= totalWin ? 'Big' : false;

            if(totalWin > 0 && winType !== false){
                $_signal.goTo("!settings.toolbar.fastMessage", "fast_big_win");
                new Promise((resolve, reject)=>{
                    try{
                        this.getHandler().showBigWin(nextAction, winType);
                    } catch(e){
                        console.error('big win', e);
                        nextAction();
                    }
                }).then(()=>{
                    if(typeof nextAction == "function"){
                        nextAction();
                    }
                });
            } else {
                if(typeof nextAction == "function"){
                    nextAction();
                }
            }
        } catch (e){
            $_log.error("WinController::checkBigWin", e);
            if(typeof nextAction == "function"){
                nextAction();
            }
        }

    }
}