let currentBrowser= /Chrome/.test(navigator.userAgent) ? "chrome" :
        /Firefox/.test(navigator.userAgent) ? "mozilla" : "other",
    currentOS = /Win/.test(navigator.platform) ? "windows" : "normal",
    crunchOffset = 0;
//Концептуально необходимое решение в связи с плохим шрифтом ("calibri" baselines)
if (currentBrowser === "chrome" && currentOS === "windows"){
    crunchOffset = -3;
} else if (currentBrowser === "mozilla"){
    if (currentOS === "windows") {
        crunchOffset = -3;
    } else {
        crunchOffset = -1;
    }
}

let styles = {
    label: {
        font: "13pt Calibri",
        color: "#FFFFFF"
    }
};

let autoPlayValueContainer = {
    "type": "Container",
    "left": 0,
    "top": 0,
    "cursor": "pointer",
    "children": {
        "background": {
            "type": "Bitmap",
            "src": "UI_panel_autogame_value",
            "left": 0,
            "top": 0
        },
        "autoPlayValue": {
            "type": "Text",
            "text": "100",
            "font": "bold 14px Calibri",
            "color": "#FFFFFF",
            "top": "56.5%",
            "left": "50%",
            "textAlign": "center",
            "textBaseline": "middle"
        }
    }
};

let autoPlayValueContainer1 = getClone(autoPlayValueContainer);
let autoPlayValueContainer2 = getClone(autoPlayValueContainer);
let autoPlayValueContainer3 = getClone(autoPlayValueContainer);
let autoPlayValueContainer4 = getClone(autoPlayValueContainer);
let autoPlayValueContainer5 = getClone(autoPlayValueContainer);
let autoPlayValueContainer6 = getClone(autoPlayValueContainer);
let autoPlayValueContainer7 = getClone(autoPlayValueContainer);
let autoPlayValueContainer8 = getClone(autoPlayValueContainer);

autoPlayValueContainer1.left = 10;
autoPlayValueContainer1.top = 49;
autoPlayValueContainer1.children.autoPlayValue.text = 10;

autoPlayValueContainer2.left = "28%";
autoPlayValueContainer2.top = 49;
autoPlayValueContainer2.children.autoPlayValue.text = 25;

autoPlayValueContainer3.left = "51%";
autoPlayValueContainer3.top = 49;
autoPlayValueContainer3.children.autoPlayValue.text = 50;

autoPlayValueContainer4.left = "74%";
autoPlayValueContainer4.top = 49;
autoPlayValueContainer4.children.autoPlayValue.text = 100;

autoPlayValueContainer5.left = "5%";
autoPlayValueContainer5.top = 110;
autoPlayValueContainer5.children.autoPlayValue.text = 200;

autoPlayValueContainer6.left = "28%";
autoPlayValueContainer6.top = 110;
autoPlayValueContainer6.children.autoPlayValue.text = 500;

autoPlayValueContainer7.left = "51%";
autoPlayValueContainer7.top = 110;
autoPlayValueContainer7.children.autoPlayValue.text = 1000;

autoPlayValueContainer8.left = "74%";
autoPlayValueContainer8.top = 110;
autoPlayValueContainer8.children.autoPlayValue.text = ":char:8734";
autoPlayValueContainer8.children.autoPlayValue.font = "bold 23pt Calibri";
autoPlayValueContainer8.children.autoPlayValue.top = 16 + crunchOffset;


let autoPlayCounterContainer = getClone(autoPlayValueContainer);
autoPlayCounterContainer.left = 578;
autoPlayCounterContainer.top = 570;
autoPlayCounterContainer.visible = false;
autoPlayCounterContainer.cursor = "";
export {autoPlayCounterContainer};


let autoPlaySettingsContainer = {
    "type": "Container",
    "left": 498,
    "top": 391,
    "zIndex": 5,
    visible: false,
    //backgroundClickable: true,
    "children": {

        "background": {
            "type": "Bitmap",
            "src": "UI_panel_autogame",
            "left": 0,
            "top": 0,
            "visible": true
        },

        "AutoPlayLabel": {
            "type": "Text",
            "text": "auto_play_head",
            "font": "bold 12pt Calibri",
            "color": "#FFFFFF",
            "top": 6+crunchOffset,
            "left": "5%",
            "fontTransform": "uppercase"
        },
        "numberOfWavesLabel": {
            "type": "Text",
            "text": "Number of waves",
            "font": styles.label.font,
            "color": styles.label.color,
            "left": 10,
            "top": 31+crunchOffset,
        },
        "selectToStartLabel": {
            "type": "Text",
            "text": "Select to start",
            "font": styles.label.font,
            "color": styles.label.color,
            "left": 10,
            "top": 92+crunchOffset,
        },
        "advancedSettingsContainer": {
            type: "Container",
            top: 153,
            width: 140,
            height: 30,
            left: 55,
            "cursor": "pointer",
            backgroundClickable: true,
            mouseChildren: false,
            children: {
                "advancedSettingsLabel": {
                    "type": "Text",
                    "text": "Advanced settings",
                    "font": styles.label.font,
                    "color": styles.label.color,
                    "textAlign": "left",
                    top: 30*0.52+crunchOffset,
                    "textBaseline": "middle"
                },
                "advancedSettingsIcon": {
                    "type": "Bitmap",
                    "src": "UI_panel_settings",
                    "align": "right",
                    verticalAlign: "middle"
                }
            }
        },

        autoPlayValueContainer1,
        autoPlayValueContainer2,
        "asd": {
            type:"Text"
        },
        "1asd": {
            type:"Text"
        },
        autoPlayValueContainer3,
        autoPlayValueContainer4,
        autoPlayValueContainer5,
        autoPlayValueContainer6,
        autoPlayValueContainer7,
        autoPlayValueContainer8,

    }
};
export {autoPlaySettingsContainer};



let defaultLabel = {
    type: "Text",
    font: "14px Calibri",
    color: "#FFFFFF",
    left: 26,
    top: "53%",
    width: "100%",
    "textBaseline": "middle"
};
let defaultCheckBox = {
    type: "Checkbox",
    scaleX: 1.3,
    scaleY: 1.3,
    spriteSheet: {
        images: ["UI_panel_checkbox-sprite"],
        "frames": {width: 20, height: 17},
        animations: {normal: [1], clicked: [0]}
    },
    left: 0
};
let defaultCheckBoxContainer = {
    type: "CheckboxContainer",
    top: "14%",
    left: "6%",
    backgroundColor: "#FFF",
    //width: "100%",
    children: {
        "checkBox": defaultCheckBox,
        "label": defaultLabel
    }
};

let onAnyWinCheckBox = getClone (defaultCheckBoxContainer);
onAnyWinCheckBox.children.label.text = "on any win";
onAnyWinCheckBox.top = "15%";

let ifFreeWavesIsWonCheckBox = getClone (defaultCheckBoxContainer);
ifFreeWavesIsWonCheckBox.children.label.text = "if free waves is won";
ifFreeWavesIsWonCheckBox.top = "29%";

let ifBonusIsWonCheckBox = getClone (defaultCheckBoxContainer);
ifBonusIsWonCheckBox.children.label.text = "if bonus is won";
ifBonusIsWonCheckBox.top = "43%";

let ifSingleWinExceedsCheckBox = getClone (defaultCheckBoxContainer);
ifSingleWinExceedsCheckBox.children.label.text = "if single win exceeds";
ifSingleWinExceedsCheckBox.top = "57%";
ifSingleWinExceedsCheckBox.visible = false;

let ifCashIncreasesByCheckBox = getClone (defaultCheckBoxContainer);
ifCashIncreasesByCheckBox.children.label.text = "if cash increases by";
ifCashIncreasesByCheckBox.top = "71%";
ifCashIncreasesByCheckBox.visible = false;

let ifCashDecreasesByCheckBox = getClone (defaultCheckBoxContainer);
ifCashDecreasesByCheckBox.children.label.text = "if cash decreases by";
ifCashDecreasesByCheckBox.top = "85%";
ifCashDecreasesByCheckBox.visible = false;

let currencyContainer = {
    "type": "Container",
    left: 169,
    width: 65,
    //height: 40,
    children: {
        "valueContainer": {
            type: "Input",
            top: 0,
            left: 0,

            fontSize: 11,
            fontFamily: 'Arial',
            fontColor: '#000',
            fontWeight: 'bold',
            width: 40,
            padding: 2,
            borderWidth: 0,
            backgroundColor: "none",
            boxShadow: "none",
            innerShadow: "none",
            maxlength: 6,
            backgroundImage: "UI_panel_currencybox"
        },

        "currencyLabel": {
            "type": "Text",
            "text": "USD",
            "font": "11px Calibri",
            "color": "#FFFFFF",
            "top": "55%",
            "left": 47,
            "textBaseline": "middle"
        }
    },
    visible: false
};

let ifSingleWinExceedsCurrency = getClone (currencyContainer);
ifSingleWinExceedsCurrency.top = "58%";

let ifCacheIncreasesByCurrency = getClone (currencyContainer);
ifCacheIncreasesByCurrency.top = "72%";

let ifCacheDecreasesByCurrency = getClone (currencyContainer);
ifCacheDecreasesByCurrency.top = "86%";

let autoPlayAdvancedSettingsContainer = {
    "type": "Container",
    "left": 690,
    "top": 391,
    //backgroundClickable: true,
    visible: false,
    "children": {

        "background": {
            "type": "Bitmap",
            "src": "UI_panel_autogame_custom",
            "left": 0,
            "top": 0
        },
        "stopAutoPlayLabel": {
            "type": "Text",
            "text": "Stop autoplay:",
            "font": "12pt Calibri",
            "color": "#FFFFFF",
            "top": 6+crunchOffset,
            "left": 14
        },

        onAnyWinCheckBox,
        ifFreeWavesIsWonCheckBox,
        ifBonusIsWonCheckBox,

        "asd": {
            type:"Text"
        },
        "1asd": {
            type:"Text"
        },

        ifSingleWinExceedsCheckBox,
        ifCashIncreasesByCheckBox,
        ifCashDecreasesByCheckBox,

        ifSingleWinExceedsCurrency,
        ifCacheIncreasesByCurrency,
        ifCacheDecreasesByCurrency,

    }
};
export {autoPlayAdvancedSettingsContainer}