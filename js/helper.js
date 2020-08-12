export const Helper = {
    getChessboxAt: function(row,column){
        // return this.getChessboxesAsArray().find(element => element.dataset.rowIndex === row.toString() && element.dataset.columnIndex === column.toString());
        return $(".chessbox[data-row-index="+row+"][data-column-index="+column+"]");
    },
    addClassForMultipleElements: function (indexArray,className) {
        //add class name to specific divs
        indexArray.forEach(element => this.getChessboxAt(element[0], element[1]).addClass(className));
    },
    removeFromClassList: function(className){
        // this.getElementAsArray(className).forEach(element => element.classList.remove(className));
        $("."+className).removeClass(className);
    },
    inRange: function (number, low, high) {
        if (number >= low && number <= high) {
            return true;
        }
        return false;
    },
    getSuggestionShape(){
        let suggestedMoves = {
            legalMoves: [],
            attackMoves: [],
        };
        return suggestedMoves;
    },
    moveShape(fromRow,fromColumn,toRow,toColumn,color){
        const moveObject = {
            "from": {
                "x": fromRow,
                "y": fromColumn
            },
            "to":{
                "x": toRow,
                "y": toColumn
            },
            "by": color
        }
        return moveObject;
    },
    negative(color){
        return color === "white" ? "black" : "white";
    },
    requestBodyModified(){
        
    }
}





