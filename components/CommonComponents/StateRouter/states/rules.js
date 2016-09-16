import StateEvents from "../events/listEvents";

/**
 * Transitions of states
 * @type {*[]}
 */
let Rules = [

    ["STATE_LOADING", "START_ROUTER"],

    // Инициализация
    ["START_ROUTER", "STATE_SPINS_INTRO"],
    ["START_ROUTER", "STATE_FREE_SPINS_INTRO"],
    ["START_ROUTER", "STATE_FREE_SPINS_OUTRO"],
    ["START_ROUTER", "STATE_BONUS_INTRO"],

    ["STATE_SPINS_INTRO", "STATE_SPINS_RESULT"],
    ["STATE_SPINS_INTRO", "STATE_SPINS_IDLE"],
    ["STATE_SPINS_OUTRO", "STATE_SPINS_INTRO"],

    // SPIN STATES
    ["STATE_SPINS_IDLE", "STATE_SPINS_SPINNING", StateEvents.RoundStart],
    ["STATE_SPINS_SPINNING", "STATE_BIG_WIN"],
    ["STATE_SPINS_SPINNING", "STATE_SPINS_RESULT"],
    ["STATE_SPINS_RESULT", "STATE_SPINS_OUTRO"],

    // change bet
    ["STATE_SPINS_IDLE", "STATE_CHANGE_BET", StateEvents.changeBet ],
    ["STATE_CHANGE_BET", "STATE_SPINS_IDLE", StateEvents.changeBetEnd ],

    // Paytable
    ["STATE_SPINS_IDLE", "STATE_PAYTABLE", StateEvents.openPayTable],
    ["STATE_PAYTABLE", "STATE_SPINS_IDLE", StateEvents.closePayTable],

    // Mini paytable
    ["STATE_SPINS_IDLE", "STATE_MINI_PAYTABLE", StateEvents.openMiniPaytable],
    ["STATE_MINI_PAYTABLE", "STATE_SPINS_IDLE", StateEvents.closeMiniPaytable],

    // BIG WIN STATE
    ["STATE_BIG_WIN", "STATE_SPINS_RESULT"],
    ["STATE_BIG_WIN", "STATE_FREE_SPINS_RESULT"],

    // Переход с спинов в фриспины и бонус
    ["STATE_SPINS_OUTRO", "STATE_FREE_SPINS_INTRO", StateEvents.startFreeSpinGame],
    ["STATE_SPINS_OUTRO", "STATE_BONUS_INTRO", StateEvents.startBonusGame],

    // FREE SPIN STATES
    ["STATE_FREE_SPINS_INTRO", "STATE_FREE_SPINS_ADDED", StateEvents.openAddedFreeSpins],
    ["STATE_FREE_SPINS_INTRO", "STATE_FREE_SPINS_SPINNING", StateEvents.clickOk],
    ["STATE_FREE_SPINS_INTRO", "STATE_FREE_SPINS_OUTRO"],

    ["STATE_FREE_SPINS_ADDED", "STATE_FREE_SPINS_SPINNING", StateEvents.clickOk],

    ["STATE_FREE_SPINS_SPINNING", "STATE_FREE_SPINS_RESULT"],

    ["STATE_FREE_SPINS_SPINNING", "STATE_BIG_WIN"],
    ["STATE_BIG_WIN", "STATE_FREE_SPINS_RESULT"],

    ["STATE_FREE_SPINS_RESULT", "STATE_FREE_SPINS_ADDED", StateEvents.openAddedFreeSpins],
    ["STATE_FREE_SPINS_RESULT", "STATE_FREE_SPINS_OUTRO"],

    // Переходы с фриспинов в спины, бонуску и фриспины
    ["STATE_FREE_SPINS_OUTRO", "STATE_SPINS_INTRO"],
    ["STATE_FREE_SPINS_OUTRO", "STATE_BONUS_INTRO"],
    ["STATE_FREE_SPINS_OUTRO", "STATE_FREE_SPINS_INTRO"],

    // BONUS STATES
    // Инициализация + реконект
    ["STATE_BONUS_INTRO", "STATE_BONUS_IDLE"],
    ["STATE_BONUS_INTRO", "STATE_BONUS_OUTRO"],
    ["STATE_BONUS_INTRO", "STATE_BONUS_RESULT"],

    ["STATE_BONUS_IDLE", "STATE_BONUS_RESULT"],
    ["STATE_BONUS_RESULT", "STATE_BONUS_OUTRO"],

    // Переходы с бонуски в спины, фриспины и бонуску
    ["STATE_BONUS_OUTRO", "STATE_SPINS_INTRO"],
    ["STATE_BONUS_OUTRO", "STATE_FREE_SPINS_INTRO"],
    ["STATE_BONUS_OUTRO", "STATE_BONUS_INTRO"],

    ["*", "STATE_POPUP_INFO", StateEvents.showInfoPopup ],
    ["*", "STATE_POPUP_ERROR", StateEvents.showErrorPopup ]

];

export default Rules;