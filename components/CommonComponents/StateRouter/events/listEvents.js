let StateEvents = {};

// Entering
StateEvents.startSpinGame = "stateStartSpinGame";
StateEvents.startFreeSpinGame = "stateStartFreeSpinGame";
StateEvents.startBonusGame = "stateStartBonusGame";

StateEvents.RoundStart = "spinAction";

//Change bet
StateEvents.changeBet = "stateChangeBet";
StateEvents.changeBetEnd = "stateChangeBetEnd";

StateEvents.openMiniPaytable = "stateOpenMiniPaytable";
StateEvents.closeMiniPaytable = "stateCloseMiniPaytable";
StateEvents.openPayTable = "stateOpenPayTable";
StateEvents.closePayTable = "stateClosePayTable";

StateEvents.clickOk = "stateClickOk"; // popup click OK

StateEvents.openAddedFreeSpins = "stateOpenAddedFreeSpins";

StateEvents.showInfoPopup = "stateShowInfoPopup";
StateEvents.showErrorPopup = "stateShowErrorPopup";

export default StateEvents;