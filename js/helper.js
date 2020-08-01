const Helper = {
    getChessboxesAsArray: function () {
        return Array.from(document.getElementsByClassName("chessbox"));
    },
    getElementAsArray: function(className){
        return Array.from(document.getElementsByClassName(className));
    },
    getChessboxFromIndexes: function (row, column) {
        if (Number.isInteger(row) || Number.isInteger(column)) {
            row = row.toString();
            column = column.toString();
        }
        return this.getChessboxesAsArray().find(element => element.dataset.rowIndex === row && element.dataset.columnIndex === column);
    },
    getChessboxAt: function(row,column){
        return this.getChessboxesAsArray().find(element => element.dataset.rowIndex === row.toString() && element.dataset.columnIndex === column.toString());;
    },
    getChessboxesAsArrayWithConstraint: function (indexArray) {
        let divArray = [];
        let allDivs = this.getChessboxesAsArray();
        indexArray.forEach(element => divArray.push(this.getChessboxFromIndexes(element[0], element[1])));
        return divArray;
    },
    removeFromClassList: function(className){
        this.getElementAsArray(className).forEach(element => element.classList.remove(className));
    },
    inRange: function (number, low, high) {
        if (number >= low && number <= high) {
            return true;
        }
        return false;
    }
}

class ChesstableParser{
    constructor(){

    }
    parse(chesstable){
        
    }
}