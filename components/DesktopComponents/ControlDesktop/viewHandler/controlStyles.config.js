let freeGameControlConfig = {
    containerOfMaxBet:{
        visible: false
    },
    containerOfAutoPlay: {
        visible: false
    },
    containerOfAutoStop: {
        visible: false
    },
    autoPlayCounterContainer: {
        visible: false
    },
    containerOfBet: {
        visible: false
    },
    containerOfLines: {
        visible: false
    },
    freeSpinBtn:{
        visible: true
    },
    spinBtn: {
        visible: false
    },

    "containerOfTotalBet": {
        visible: true,
        width: 210,
        left: 102

    },
    "containerOfTotalBet.background": {
        width: 210
    },
    containerOfWin: {
        visible: true,
        left: 564,
        width: 295
    },
    "containerOfWin.background": {
        width: 295
    },
    containerOfBalance: {
        left: 648,
        visible: true
    },
    containerOfTotalWin: {
        left:101,
        visible: true
    },
    spinCounter: {
        visible: true
    },



    infoBtn: {
        visible: true
    },
    containerOfQuickSpin: {
        visible: true
    },
    containerOfBonusBet: {
        visible: false
    },

    containerOfFreeBetWins: {
        visible: false
    }

};

let mainGameControlConfig = {
    containerOfMaxBet:{
        visible: true
    },
    containerOfAutoPlay: {
        visible: true
    },
    containerOfBet: {
        visible: true
    },
    containerOfLines: {
        visible: true
    },
    "containerOfTotalBet": {
        visible: true,
        width: 181,
        left: 71
    },
    spinBtn: {
        visible: true
    },
    infoBtn: {
        visible: true
    },
    containerOfQuickSpin: {
        visible: true
    },
    containerOfWin: {
        left: 657,
        visible: true,
        width: 273
    },

    freeSpinBtn:{
        visible: false
    },
    spinCounter: {
        visible: false
    },
    containerOfTotalWin: {
        visible: false
    },
    containerOfBonusBet: {
        visible: false
    },

    "containerOfWin.background": {
        width: ""
    },
    "containerOfTotalBet.background": {
        width: ""
    },
    containerOfBalance: {
        left: 689,
        visible: true
    },
    containerOfFreeBetWins: {
        visible: false
    }
};

let bonusGameControlConfig = {
    containerOfMaxBet:{
        visible: false
    },
    containerOfAutoPlay: {
        visible: false
    },
    containerOfAutoStop: {
        visible: false
    },
    autoPlayCounterContainer: {
        visible: false
    },
    infoBtn: {
        visible: false
    },
    containerOfQuickSpin: {
        visible: false
    },
    containerOfBet: {
        visible: false
    },
    containerOfLines: {
        visible: false
    },
    freeSpinBtn:{
        visible: false
    },
    spinBtn: {
        visible: false
    },
    "containerOfTotalBet": {
        visible: false
    },
    containerOfWin: {
        visible: false
    },
    spinCounter: {
        visible: false
    },
    containerOfBonusBet: {
        visible: true
    },

    containerOfTotalWin: {

        visible: true,
        left: 344
    },
    containerOfBalance: {
        visible: true,
        left: 520
    },
    containerOfFreeBetWins: {
        visible: false
    }

};

let freeBetsGameControlConfig = {
    containerOfBalance: {
        visible: false
    },
    containerOfFreeBetWins: {
        visible: true,
        left: 690
    }
};

let freeBetsFreeGameControlConfig = {
    containerOfBalance: {
        visible: false
    },
    containerOfFreeBetWins: {
        visible: true,
        left: 648
    }
};

let freeBetsBonusGameControlConfig = {
    containerOfBalance: {
        visible: false
    },
    containerOfFreeBetWins: {
        visible: true,
        left: 563
    }
};


export {mainGameControlConfig};
export {freeGameControlConfig};
export {bonusGameControlConfig};
export {freeBetsGameControlConfig};
export {freeBetsFreeGameControlConfig};
export {freeBetsBonusGameControlConfig};