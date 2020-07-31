let seconds = 3;
let timerScreen;
let headingCount;
const localStorage = window.localStorage;

//Utils classes
class UndoCommand {
    constructor() {
        this.stateArray = [];
    }

}

// Board drawing

const initialState = {
    0: [    {name:"rook", color: "black"},
            {name:"knight",color: "black"},
            {name:"bishop", color: "black"},
            {name:"queen", color: "black"}]
}

class Board {

    get initialState() {
        return [
            [new Rook('black'), new Knight('black'), new Bishop('black'), new Queen('black'), new King('black'), new Bishop('black'), new Knight('black'), new Rook('black')],
            [new Pawn('black'), new Pawn('black'), new Pawn('black'), new Pawn('black'), new Pawn('black'), new Pawn('black'), new Pawn('black'), new Pawn('black')],
            ['0', '0', '0', '0', '0', '0', '0', '0'],
            ['0', '0', '0', '0', '0', '0', '0', '0'],
            ['0', '0', new King('black'), '0', '0', '0', '0', '0'],
            ['0', '0', '0', '0', '0', '0', '0', '0'],
            [new Pawn('white'), new Pawn('white'), new Pawn('white'), new Pawn('white'), new Pawn('white'), new Pawn('white'), new Pawn('white'), new Pawn('white')],
            [new Rook('white'), new Knight('white'), new Bishop('white'), new Queen('white'), new King('white'), new Bishop('white'), new Knight('white'), new Rook('white')]
        ]
    }
    constructor() {
        this.currentState = this.initialState;
        this.previousStates = [this.initialState];
    }

    //Variables
    get fromRow() {
        return this._fromRow;
    }
    set fromRow(value) {
        this._fromRow = value;
    }
    get fromColumn() {
        return this._fromColumn;
    }
    set fromColumn(value) {
        this._fromColumn = value;
    }
    get toRow() {
        return this._toRow;
    }
    set toRow(value) {
        this._toRow = value;
    }
    get toColumn() {
        return this._toColumn;
    }
    set toColumn(value) {
        this._toColumn = value;
    }

    draw() {
        let chessboxArray = Array.from(document.getElementsByClassName("chessbox"));
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let piece = document.createElement("div");

                if (this.currentState[i][j] !== "0") {
                    piece.innerText = this.currentState[i][j].symbol;
                    piece.className = this.currentState[i][j].color;
                    //this finds the div that has data-column-index === j and data-row-index === i
                    let chessbox = chessboxArray.find(element => element.dataset.rowIndex === i.toString() && element.dataset.columnIndex === j.toString());
                    chessbox.appendChild(piece);
                } else {
                    let chessbox = chessboxArray.find(element => element.dataset.rowIndex === i.toString() && element.dataset.columnIndex === j.toString());
                    chessbox.innerHTML = "";
                }
            }
        }
    }
    clear() {
        let chessboxArray = Array.from(document.getElementsByClassName("chessbox"));
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let chessbox = chessboxArray.find(element => element.dataset.rowIndex === i.toString() && element.dataset.columnIndex === j.toString());
                chessbox.innerHTML = "";
            }
        }
    }

    init() {
        let undoBtn = document.getElementById("undo");
        undoBtn.addEventListener("click", this.undo.bind(this));
    }

    undo() {
        console.log(localStorage.getItem("fromRow"));
    }

    hasSquareSelected() {
        return (typeof this._fromRow !== 'undefined') && typeof this._fromColumn !== 'undefined';
    }
    saveFromPositionToLocalStorage(row,column){
        localStorage.setItem("fromRow",row.toString());
        localStorage.setItem("fromColumn",column.toString());
    }
    saveToPositionToLocalStorage(row,column){
        localStorage.setItem("toRow",row.toString());
        localStorage.setItem("toColumn",column.toString());
    }
    onSquareClick(event) {

        const chessbox = event.currentTarget;
        const row = parseInt(chessbox.dataset.rowIndex);
        const column = parseInt(chessbox.dataset.columnIndex);
        const currentChessPiece = this.currentState[row][column];
        let chessboxDivArray = Helper.getChessboxesAsArray();

        if (!this.hasSquareSelected()) {

            chessbox.classList.add("selected");
            this.fromRow = row;
            this.fromColumn = column;
            this.saveFromPositionToLocalStorage(row,column);

            let suggestedMoves = currentChessPiece.getSuggestedMoves(this.currentState, this.fromRow, this.fromColumn);
            console.log(suggestedMoves);

            //draw suggestions

            //Helper.getChessboxesAsArrayWithConstraint gets all DIVS that have indexes(row,column) in the specified array that looks like [[row1,col1],[row2,col2],..]
            //for each element suggest/attack class name is added
            Helper.getChessboxesAsArrayWithConstraint(suggestedMoves.legalMoves).forEach(element => element.classList.add("suggest"));
            Helper.getChessboxesAsArrayWithConstraint(suggestedMoves.attackMoves).forEach(element => element.classList.add("attack"));

        } else {
            chessbox.classList.add("selected");
            this.toRow = row;
            this.toColumn = column;
            let lastSelectedPiece = this.currentState[this.fromRow][this.fromColumn];
            let secondSelectedPiece = this.currentState[this.toRow][this.toColumn];

            //Pawn game mecanics:
            //check if LAST SELECTED element was a Pawn
            if (lastSelectedPiece instanceof Pawn) {
                //Check the color
                if (lastSelectedPiece.color === "black") {
                    //Decide what type of move Pawn will do: Attack or Move
                    if (this.currentState[this.toRow][this.toColumn] === "0") {
                        //move rule
                        //check if distance between LAST SELECTED row index and CURRENT SELECTED row index is 1
                        //in less words check if it can move forward acording to their move direction
                        if ((this.toRow - this.fromRow) !== 1 || this.toColumn !== this.fromColumn) {
                            console.log("ilegal move!");
                        } else {
                            //Change position
                            this.currentState[this.toRow][this.toColumn] = lastSelectedPiece; //duplicate;
                            this.currentState[this.fromRow][this.fromColumn] = "0"; //duplicate
                        }
                    } else {
                        //attack rule
                        //if _to position is in fron of the Pawn or distance on the vertical axis is greater than 1 than ilegal
                        if (this.toColumn === this.fromColumn || (this.toRow - this.fromRow) !== 1) {
                            console.log("ilegal move!");
                        } else {
                            //Change position
                            this.currentState[this.toRow][this.toColumn] = lastSelectedPiece; //duplicate;
                            this.currentState[this.fromRow][this.fromColumn] = "0"; //duplicate
                        }
                    }
                }
                else {
                    //white Pawn
                    if (this.currentState[this.toRow][this.toColumn] === "0") {
                        //move rule
                        if ((this.fromRow - this.toRow) !== 1 || this.toColumn !== this.fromColumn) {
                            console.log("ilegal move!");
                        } else {
                            //Change position
                            this.currentState[this.toRow][this.toColumn] = lastSelectedPiece; //duplicate;
                            this.currentState[this.fromRow][this.fromColumn] = "0"; //duplicate
                        }
                    } else {
                        //attack rule
                        if (this.toColumn === this.fromColumn || (this.fromRow - this.toRow) !== 1) {
                            console.log("ilegal move!");
                        } else {
                            //Change position
                            this.currentState[this.toRow][this.toColumn] = lastSelectedPiece; //duplicate;
                            this.currentState[this.fromRow][this.fromColumn] = "0"; //duplicate
                        }
                    }
                }
            }

            

            this.fromRow = undefined;
            this.fromColumn = undefined;
            this.toRow = undefined;
            this.toRow = undefined;
            this.clear();
            this.draw();

            let selectedChessboxes = Array.from(document.getElementsByClassName("selected"));
            selectedChessboxes.forEach(element => element.classList.remove("selected"));

            let suggestedChessboxes = Array.from(document.getElementsByClassName("chessbox"));
            suggestedChessboxes.forEach(element => element.classList.remove("suggest"));

            let attackChessboxes = Array.from(document.getElementsByClassName("chessbox"));
            suggestedChessboxes.forEach(element => element.classList.remove("attack"));



        }
    }
    generateBoard() {
        let container = document.createDocumentFragment();
        let chessboard = document.createElement("div");
        chessboard.className = "chessboard";

        let paddingflag = 0;
        let columnIndex = 0;


        //TODO: refactor so this uses 2 fors
        for (let i = 0; i < 64; i++) {

            let chessbox = document.createElement("div");

            if ((i + paddingflag) % 2 === 0) {
                chessbox.className = "chessbox white-square";
            } else {
                chessbox.className = "chessbox black-square";
            }

            //fields given
            chessbox.dataset.columnIndex = i % 8;
            if (i % 8 === 0) {
                columnIndex = i / 8;
            }
            chessbox.dataset.rowIndex = columnIndex;
            chessbox.addEventListener("click", this.onSquareClick.bind(this));

            chessboard.appendChild(chessbox);

            if ((i + 1) % 8 === 0) {
                if (paddingflag === 0) {
                    paddingflag = 1;
                } else {
                    paddingflag = 0;
                }
            }
        }
        container.appendChild(chessboard);
        document.body.appendChild(container);
    }
}



