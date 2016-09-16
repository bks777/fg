import panelDefault from "./panelDefault";
import lines from "./lines";
import paytable from "./paytable";

let panelPaytable = getClone (panelDefault);

panelPaytable.children.panelWrapper.children = {
    paytable,
    lines
};

export default panelPaytable;