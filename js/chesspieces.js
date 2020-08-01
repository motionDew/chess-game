class PieceFactory{
    constructor(){
    }
    create(name,color){
        switch(name){
            case "pawn":{
                return new Pawn(color);
            }
            case "rook": {
                return new Rook(color);
            }
            case "knight":{
                return new Knight(color);
            }
            case "bishop":{
                return new Bishop(color);
            }
            case "queen": {
                return new Queen(color);
            }
            case "king":{
                return new King(color);
            }
            default: return "0";
        }
    }
}

class ChessPiece {
    constructor(color) {
        if (new.target === ChessPiece) {
            throw new TypeError("Cannot construct ChessPiece instances  directly!");
        }
        this.color = color;
    }

    get color() {
        return this._color;
    }
    set color(value) {
        this._color = value;
    }

    //return
    getSuggestedMoves() {
        return this.diagonalSuggestedMoves();
    }
    // Gets the div where the piece is placed.
    getContainerElement() {
        let container = Array.from(document.body.getElementsByClassName("chessbox"));
        let childContainer = container.find(box => box.dataset.columnIndex === this.coordinate.x && box.dataset.rowIndex === this.coordinate.y);
        return childContainer;
    }

    diagonalSuggestedMoves(chesstableState, fromRow, fromCol) {
        let suggestedMoves = {
            legalMoves: [],
            attackMoves: [],
        };
        const selectedChessPiece = chesstableState[fromRow][fromCol];

        let i = 1;
        let done = false;

        // let rightBottomSuggestions = Helper.diagonalTravesalWithDirection(chesstableState,fromRow,fromCol,"rightBottom");
        // let leftTopSuggestions = Helper.diagonalTravesalWithDirection(chesstableState,fromRow,fromCol,"leftTop");
        // let leftBottomSuggestions = Helper.diagonalTravesalWithDirection(chesstableState,fromRow,fromCol,"leftBottom");
        // let rightTopSuggestions = Helper.diagonalTravesalWithDirection(chesstableState,fromRow,fromCol,"rightTop");

        // suggestedMoves.legalMoves = [...rightBottomSuggestions.legalMoves,...leftTopSuggestions.legalMoves,...leftBottomSuggestions.legalMoves,...rightTopSuggestions.legalMoves];


        //repair
        while (!done) {
            let row = fromRow + i;
            let column = fromCol + i;
            //first diagonal that goes to the right-bottom corner
            if (row <= 7 && column <= 7) {
                if (chesstableState[row][column] === "0") {
                    suggestedMoves.legalMoves.push([row, column]);

                } else if (chesstableState[row][column].color !== selectedChessPiece.color) {
                    suggestedMoves.attackMoves.push([row, column]);
                    break;
                } else {
                    break;
                }
            } else {
                done = true;
            }
            i++;
        }
        i = 1;
        done = false;
        while (!done) {

            let row = fromRow - i;
            let column = fromCol - i;

            // first diagonal that goes to the left-top corner
            if (row >= 0 && column >= 0) {
                if (chesstableState[row][column] === "0") {
                    suggestedMoves.legalMoves.push([row, column]);

                } else if (chesstableState[row][column].color !== selectedChessPiece.color) {
                    suggestedMoves.attackMoves.push([row, column]);
                    break;
                } else {
                    break;
                }
            } else {
                done = true;
            }
            i++;
        }
        i = 1;
        done = false;
        while (!done) {
            let row = fromRow + i;
            let column = fromCol - i;
            //first diagonal that goes to the left-bottom corner
            if (row <= 7 && column >= 0) {
                if (chesstableState[row][column] === "0") {
                    suggestedMoves.legalMoves.push([row, column]);

                } else if (chesstableState[row][column].color !== selectedChessPiece.color) {
                    suggestedMoves.attackMoves.push([row, column]);
                    break;
                } else {
                    break;
                }
            } else {
                done = true;
            }
            i++;
        }
        i = 1;
        done = false;
        while (!done) {
            let row = fromRow - i;
            let column = fromCol + i;
            //first diagonal that goes to the right-top corner
            if (row >= 0 && column <= 7) {
                if (chesstableState[row][column] === "0") {
                    suggestedMoves.legalMoves.push([row, column]);

                } else if (chesstableState[row][column].color !== selectedChessPiece.color) {
                    suggestedMoves.attackMoves.push([row, column]);
                    break;
                } else {
                    break;
                }
            } else {
                done = true;
            }
            i++;
        }
        return suggestedMoves;

    }
    crossSuggestedMoves(chesstableState, fromRow, fromCol) {
        let suggestedMoves = {
            legalMoves: [],
            attackMoves: [],
        };
        const selectedChessPiece = chesstableState[fromRow][fromCol];
        let i = 1;
        let done = false;
        let stopSuggestingNorth = false;
        let stopSuggestingSouth = false;
        let stopSuggestingEast = false;
        let stopSuggestingWest = false;
        while (i <= 7) {

            let rowForward = fromRow + i;
            let colForward = fromCol + i;
            let rowBack = fromRow - i;
            let colBack = fromCol - i;

            //suggest north
            if (!stopSuggestingSouth) {
                if (rowForward >= 0 && rowForward <= 7) {
                    if (chesstableState[rowForward][fromCol] === "0" && stopSuggestingSouth === false) {
                        suggestedMoves.legalMoves.push([rowForward, fromCol]);
                    } else {
                        if (chesstableState[rowForward][fromCol].color !== selectedChessPiece.color) {
                            suggestedMoves.attackMoves.push([rowForward, fromCol]);
                            stopSuggestingSouth = true;
                        } else {
                            stopSuggestingSouth = true;
                        }
                    }
                }
            }
            if (!stopSuggestingWest) {
                if (colForward >= 0 && colForward <= 7) {
                    if (chesstableState[fromRow][colForward] === "0" && stopSuggestingWest === false) {
                        suggestedMoves.legalMoves.push([fromRow, colForward]);
                    } else {
                        if (chesstableState[fromRow][colForward].color !== selectedChessPiece.color) {
                            suggestedMoves.attackMoves.push([fromRow, colForward]);
                            stopSuggestingWest = true;
                        } else {
                            stopSuggestingWest = true;
                        }
                    }
                }
            }
            if (!stopSuggestingNorth) {
                if (rowBack >= 0 && rowBack <= 7) {
                    if (chesstableState[rowBack][fromCol] === "0" && stopSuggestingNorth === false) {
                        suggestedMoves.legalMoves.push([rowBack, fromCol]);
                    } else {
                        if (chesstableState[rowBack][fromCol].color !== selectedChessPiece.color) {
                            suggestedMoves.attackMoves.push([rowBack, fromCol]);
                            stopSuggestingNorth = true;
                        } else {
                            stopSuggestingNorth = true;
                        }
                    }
                }
            }
            if (!stopSuggestingEast) {
                if (colBack >= 0 && colBack <= 7) {
                    if (chesstableState[fromRow][colBack] === "0" && stopSuggestingEast === false) {
                        suggestedMoves.legalMoves.push([fromRow, colBack]);
                    } else {
                        if (chesstableState[fromRow][colBack].color !== selectedChessPiece.color) {
                            suggestedMoves.attackMoves.push([fromRow, colBack]);
                            stopSuggestingEast = true;
                        } else {
                            stopSuggestingEast = true;
                        }
                    }
                }
            }
            i++;
        }
        return suggestedMoves;
    }
    movePiece(chessboardState,suggestedMoves,fromRow,fromCol,toRow,toColumn){
        
        //check if to position is in suggested moves;
        const selectedLegalMove = suggestedMoves.legalMoves.find( position => position[0] === toRow && position[1] === toColumn); //duplicate 
        const selectedAttackMove = suggestedMoves.attackMoves.find( position => position[0] === toRow && position[1] === toColumn); //duplicate

        //didn't find legal move, check if attack move
        if(typeof selectedLegalMove === 'undefined'){
           console.log("No legal move found");
        }else{
            //its legal move, put piece on legal move selected, and delete it from where it was;
            chessboardState[toRow][toColumn] = chessboardState[fromRow][fromCol];
            chessboardState[fromRow][fromCol] = "0";
            return chessboardState;
        }

        if(typeof selectedAttackMove === 'undefined'){
            console.log("No attack move found, exit");
            return chessboardState;
        }else{
            //its attack move, delete piece instance of oposite team, move chesspiece; 
            chessboardState[toRow][toColumn] = chessboardState[fromRow][fromCol];
            chessboardState[fromRow][fromCol] = "0";
            return chessboardState;
        }
    }
}

class King extends ChessPiece {
    constructor(color) {
        super(color);
        this.kingNeightboursRow = [-1, -1, -1, 0, 1, 1, 1, 0];
        this.kingNeightboursCol = [-1, 0, 1, 1, 1, 0, -1, -1, -1];
    }

    get symbol() {
        return "♚";
    }
    get name() {
        return "king";
    }
    getSuggestedMoves(chesstableState, fromRow, fromCol) {
        let suggestedMoves = {
            legalMoves: [],
            attackMoves: [],
        };

        const selectedChessPiece = chesstableState[fromRow][fromCol];

        for (let i = 0; i < 8; i++) {
            let currentNeighbourRowIndex = fromRow + this.kingNeightboursRow[i];
            let currentNeighbourColIndex = fromCol + this.kingNeightboursCol[i];
            if (Helper.inRange(currentNeighbourRowIndex, 0, 7) && Helper.inRange(currentNeighbourColIndex, 0, 7)) {
                let currentNeighbourPiece = chesstableState[currentNeighbourRowIndex][currentNeighbourColIndex];
                if (typeof currentNeighbourPiece !== 'undefined') {
                    if (currentNeighbourPiece === "0") {
                        suggestedMoves.legalMoves.push([currentNeighbourRowIndex, currentNeighbourColIndex]);
                    } else {
                        if (currentNeighbourPiece.color !== selectedChessPiece.color) {
                            suggestedMoves.attackMoves.push([currentNeighbourRowIndex, currentNeighbourColIndex]);
                        }
                    }
                }
            }
        }
        return suggestedMoves;
    }
}
class Queen extends ChessPiece {
    constructor(color) {
        super(color);
    }

    get symbol() {
        return "♛";
    }
    get name() {
        return "queen";
    }

    getSuggestedMoves(chesstableState, fromRow, fromCol) {

        const diagonalMoves = super.diagonalSuggestedMoves(chesstableState, fromRow, fromCol);
        const crossMoves = super.crossSuggestedMoves(chesstableState, fromRow, fromCol);

        diagonalMoves.legalMoves = [...diagonalMoves.legalMoves, ...crossMoves.legalMoves];
        diagonalMoves.attackMoves = [...diagonalMoves.attackMoves, ...crossMoves.attackMoves];

        return diagonalMoves;
    }
}
class Bishop extends ChessPiece {
    constructor(color) {
        super(color);
    }

    get symbol() {
        return "♝";
    }
    get name() {
        return "bishop";
    }

    getSuggestedMoves(chesstableState, fromRow, fromCol) {
        return super.diagonalSuggestedMoves(chesstableState, fromRow, fromCol);
    }
}
class Knight extends ChessPiece {
    constructor(color) {
        super(color);
        this.knightNeightboursRow = [-2, -2, -1, 1, 2, 2, 1, -1];
        this.knightNeightboursCol = [-1, 1, 2, 2, 1, -1, -2, -2];
    }

    get symbol() {
        return "♞";
    }
    get name() {
        return "knight";
    }

    getSuggestedMoves(chesstableState, fromRow, fromCol) {

        let suggestedMoves = {
            legalMoves: [],
            attackMoves: [],
        };

        const selectedChessPiece = chesstableState[fromRow][fromCol];

        for (let i = 0; i < 8; i++) {
            let currentNeighbourRowIndex = fromRow + this.knightNeightboursRow[i];
            let currentNeighbourColIndex = fromCol + this.knightNeightboursCol[i];
            if (Helper.inRange(currentNeighbourRowIndex, 0, 7) && Helper.inRange(currentNeighbourColIndex, 0, 7)) {
                let currentNeighbourPiece = chesstableState[currentNeighbourRowIndex][currentNeighbourColIndex];
                if (typeof currentNeighbourPiece !== 'undefined') {
                    if (currentNeighbourPiece === "0") {
                        suggestedMoves.legalMoves.push([currentNeighbourRowIndex, currentNeighbourColIndex]);
                    } else {
                        if (currentNeighbourPiece.color !== selectedChessPiece.color) {
                            suggestedMoves.attackMoves.push([currentNeighbourRowIndex, currentNeighbourColIndex]);
                        }
                    }
                }
            }
        }
        return suggestedMoves;
    }
}
class Rook extends ChessPiece {
    constructor(color) {
        super(color);
    }

    get symbol() {
        return "♜";
    }
    get name() {
        return "rook";
    }
    getSuggestedMoves(chesstableState, fromRow, fromCol) {
        return super.crossSuggestedMoves(chesstableState, fromRow, fromCol);
    }
}
class Pawn extends ChessPiece {
    constructor(color) {
        super(color);
    }

    get symbol() {
        return "♟";
    }
    get name() {
        return "pawn";
    }

    getPieceDirection(colorValue) {
        if (colorValue === "black") {
            return 1;
        }
        return -1;
    }

    //return a list of grid indexes where the piece can move;
    getSuggestedMoves(chesstableState, fromRow, fromCol) {

        let suggestedMoves = {
            legalMoves: [],
            attackMoves: [],
        };

        let chessPiece = chesstableState[fromRow][fromCol];
        let pieceDirection = this.getPieceDirection(chessPiece.color);
        const leftSideChessbox = chesstableState[fromRow + pieceDirection][fromCol - 1];
        const rightSideChessbox = chesstableState[fromRow + pieceDirection][fromCol + 1];

        if ((fromRow + pieceDirection) >= 0 && (fromRow + pieceDirection) <= 7) {
            if (chesstableState[fromRow + pieceDirection][fromCol] === "0") {
                if (leftSideChessbox !== "0") {
                    if (typeof leftSideChessbox !== 'undefined') {
                        if (leftSideChessbox.color !== this.color) {
                            suggestedMoves.attackMoves.push([fromRow + pieceDirection, fromCol - 1]);
                        }
                    }
                }
                if (rightSideChessbox !== "0") {
                    if (typeof rightSideChessbox !== 'undefined') {
                        if (rightSideChessbox.color !== this.color) {
                            suggestedMoves.attackMoves.push([fromRow + pieceDirection, fromCol + 1]);
                        }
                    }
                }
                suggestedMoves.legalMoves.push([fromRow + pieceDirection, fromCol]);
            } else {
                if (leftSideChessbox !== "0") {
                    suggestedMoves.attackMoves.push([fromRow + pieceDirection, fromCol - 1]);
                }
                if (rightSideChessbox !== "0") {
                    suggestedMoves.attackMoves.push([fromRow + pieceDirection, fromCol + 1]);
                }
            }
        }
        return suggestedMoves;
    }
    
}