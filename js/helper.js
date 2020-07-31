const Helper = {
    getChessboxesAsArray: function () {
        return Array.from(document.getElementsByClassName("chessbox"));
    },
    getChessboxFromIndexes: function (row, column) {
        if (Number.isInteger(row) || Number.isInteger(column)) {
            row = row.toString();
            column = column.toString();
        }
        return this.getChessboxesAsArray().find(element => element.dataset.rowIndex === row && element.dataset.columnIndex === column);
    },
    getChessboxesAsArrayWithConstraint: function (indexArray) {
        let divArray = [];
        let allDivs = this.getChessboxesAsArray();
        indexArray.forEach(element => divArray.push(this.getChessboxFromIndexes(element[0], element[1])));
        return divArray;
    },
    diagonalTravesalWithDirection: function (chesstable, fromRow, fromCol, direction) {


        //postponed

        let suggestedMoves = {
            legalMoves: [],
            attackMoves: [],
        };

        let done = false;
        let i = 1;

        let directionConstraints = {
            rightBottom: {
                rowSign: 1,
                colSign: 1,
                rowMargin: 7,
                colMargin: 7,
                colComp: 1,
                rowComp: 1
            },
            leftTop: {
                rowSign: -1,
                colSign: -1,
                rowMargin: 0,
                colMargin: 0,
                colComp: -1,
                rowComp: -1
            },
            rightTop: {
                rowSign: -1,
                colSign: 1,
                rowMargin: 0,
                colMargin: 7,
                colComp: 1,
                rowComp: 1
            },
            leftBottom: {
                rowSign: 1,
                colSign: -1,
                rowMargin: 7,
                colMargin: 0,
                colComp: 1,
                rowComp: 1
            }
        }

        let rowSign = directionConstraints[direction]["rowSign"];
        let colSign = directionConstraints[direction]["colSign"];
        let rowMargin = directionConstraints[direction]["rowMargin"];
        let colMargin = directionConstraints[direction]["colMargin"];
        // let colMargin = directionConstraints[direction]["colMargin"];
        // let colMargin = directionConstraints[direction]["colMargin"];

        while (!done) {

            //first diagonal that goes to the right-bottom corner
            if (fromRow + i * rowSign <= rowMargin && fromCol + i * colSign <= colMargin) {
                suggestedMoves.legalMoves.push([fromRow + i * rowSign, fromCol + i * colSign]);
                done = false;
            } else {
                done = true;
            }
            i++;
        }
        return suggestedMoves;
    },
    inRange: function (number, low, high) {
        if (number >= low && number <= high) {
            return true;
        }
        return false;
    }
}

class PieceFactory{

    constructor(){
    }
    create(pieceName){
    }

}

class ChesstableParser{
    constructor(){

    }
    parse(chesstable){
        
    }
}