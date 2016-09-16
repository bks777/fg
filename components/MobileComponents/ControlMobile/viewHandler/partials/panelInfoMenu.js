import panelDefault from "./panelDefault";
import wild from "./wild";
import scatters from "./scatters";
import bonusGame from "./bonusGame";

let panelInfoMenu = getClone (panelDefault);

panelInfoMenu.children.panelWrapper.children = {
    wild,
    scatters,
    bonusGame
};

export default panelInfoMenu;