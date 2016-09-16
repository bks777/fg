import Container from "./Container.es6";
import LinesCarribean from "./LineCarribean.es6";

export default class LineCarribeanManager extends Container{
    constructor (config, alias) {
       super(config);

        this.lines = [];

        /* initialize default value */
        config.defaultLine = config.defaultLine || {};
        config.defaultLeftLine = config.defaultLeftLine || {};
        config.defaultRightLine = config.defaultRightLine || {};
        config.defaultDoubleLine = config.defaultDoubleLine || {};

        let row = [];

        /* detect how much labels there is in every row */
        for (let lineName in config.lines) {
            let lineRow = config.lines[lineName].start.row;
            let linePosition = config.lines[lineName].start.position;

            if (row[lineRow] === undefined) {
                row[lineRow] = [];
            }
            if (row[lineRow][linePosition] === undefined) {
                row[lineRow][linePosition] = [];
            }

            row[lineRow][linePosition].push (lineName);
        }

        let rowHeight = this.height / (row.length-1);

        /* draw lines */
        for (let lineName in config.lines) {

            let lineConfig;

            /* initialize config from default config for every line and from current config for current line */
            if (config.lines[lineName].type === "left") {
                lineConfig = Object.assign({}, config.defaultLine, config.defaultLeftLine, config.lines[lineName]);
            } else if (config.lines[lineName].type === "right"){
                lineConfig = Object.assign({}, config.defaultLine, config.defaultRightLine, config.lines[lineName]);
            } else if (config.lines[lineName].type === "double") {
                lineConfig = Object.assign({}, config.defaultLine, config.defaultDoubleLine, config.lines[lineName]);
            }

            /* initialize image alias for background for every line */
            lineConfig.background.src = `${config.imageAlias}_${lineName}`;

            let lineRow = config.lines[lineName].start.row;
            let linePosition = config.lines[lineName].start.position;
            let rowPadding = config.rowPadding;

            /* calculate Y coordinate for start label of line */
            lineConfig.labelTop = (rowHeight * (lineRow-1) + ((rowHeight-rowPadding*2)/(row[lineRow].length-1) * (linePosition-1) + rowPadding) );

            lineConfig.lineName = lineName;

            let line = new LinesCarribean(lineConfig, alias);
            line.name = lineName;

            this.addChild(line);
            line.init();

            this.lines.push(line);

        }

        if (config.debug) {
            for (let i = 0; i < this.lines.length; i++) {

                if (this.lines[i].name == config.debug) {
                    this.lines[i].visible = true;
                    this.lines[i].alpha = 1;
                } else {
                    this.lines[i].visible = false;
                    this.lines[i].alpha = 0;
                }
            }
        }
    }

    fadeLines () {
        let promises = [];
        for (let i = 0; i < this.lines.length; i++) {
            promises.push(this.lines[i].fadeLine());
            this.lines[i].showStandardLabel();
        }
        return Promise.all(promises);
    }

    showLine (lineNum) {
        this.lines[lineNum-1].showLine();
    }

    showWinLine (lineNum) {
        this.lines[lineNum-1].showLine();
        this.lines[lineNum-1].showWinLabel();
    }

    hideLine (lineNum) {
        try{
            this.lines[lineNum-1].hideLine();
            this.lines[lineNum-1].showStandardLabel();
        } catch(e){
            $_log.error(e, lineNum);
        }
    }

    hideAllLines () {
        for (let i = 0; i < this.lines.length; i ++) {
            this.lines[i].hideLine();
            this.lines[i].showStandardLabel();
        }
    }

    disableMouseOverForLabels () {
        for (let i = 0; i < this.lines.length; i ++) {
            this.lines[i].disableMouseOverForLabels();
        }
    }

    enableMouseOverForLabels () {
        for (let i = 0; i < this.lines.length; i ++) {
            this.lines[i].enableMouseOverForLabels();
        }
    }



}