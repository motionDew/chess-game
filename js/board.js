let seconds = 3;
let timerScreen;
let headingCount;
const storage = window.localStorage;

//Utils classes
class UndoCommand {
    constructor() {
        this.stateArray = [];
    }

}

// Used to generate chessboard table with pieces and save state to storage;
const chessboardState = {
    0: [    {name:"rook", color: "black"},
            {name:"knight",color: "black"},
            {name:"bishop", color: "black"},
            {name:"queen", color: "black"},
            {name: "king",color: "black"},
            {name: "bishop",color: "black"},
            {name: "knight",color: "black"},
            {name: "rook",color: "black"}],
    1: [    {name: "pawn",color: "black"},
            {name: "pawn",color: "black"},
            {name: "pawn",color: "black"},
            {name: "pawn",color: "black"},
            {name: "pawn",color: "black"},
            {name: "pawn",color: "black"},
            {name: "pawn",color: "black"},
            {name: "pawn",color: "black"}],
    2: [    {name: "EMPTY",color: ""},
            {name: "EMPTY",color: ""},
            {name: "EMPTY",color: ""},
            {name: "EMPTY",color: ""},
            {name: "EMPTY",color: ""},
            {name: "EMPTY",color: ""},
            {name: "EMPTY",color: ""},
            {name: "EMPTY",color: ""}],
    3: [    {name: "EMPTY",color: ""},
            {name: "EMPTY",color: ""},
            {name: "EMPTY",color: ""},
            {name: "EMPTY",color: ""},
            {name: "EMPTY",color: ""},
            {name: "EMPTY",color: ""},
            {name: "EMPTY",color: ""},
            {name: "EMPTY",color: ""}],
    4: [    {name: "EMPTY",color: ""},
            {name: "EMPTY",color: ""},
            {name: "EMPTY",color: ""},
            {name: "EMPTY",color: ""},
            {name: "EMPTY",color: ""},
            {name: "EMPTY",color: ""},
            {name: "EMPTY",color: ""},
            {name: "EMPTY",color: ""}],
    5: [    {name: "EMPTY",color: ""},
            {name: "EMPTY",color: ""},
            {name: "EMPTY",color: ""},
            {name: "EMPTY",color: ""},
            {name: "EMPTY",color: ""},
            {name: "EMPTY",color: ""},
            {name: "EMPTY",color: ""},
            {name: "EMPTY",color: ""}],
    6: [    {name: "pawn",color: "white"},
            {name: "pawn",color: "white"},
            {name: "pawn",color: "white"},
            {name: "pawn",color: "white"},
            {name: "pawn",color: "white"},
            {name: "pawn",color: "white"},
            {name: "pawn",color: "white"},
            {name: "pawn",color: "white"}],
    7:[     {name:"rook", color: "white"},
            {name:"knight",color: "white"},
            {name:"bishop", color: "white"},
            {name:"queen", color: "white"},
            {name: "king",color: "white"},
            {name: "bishop",color: "white"},
            {name: "knight",color: "white"},
            {name: "rook",color: "white"}]
}

// Object containing the instances of chess pieces, generated after chessboardState
const chessboardInstances = [ [null,null,null,null,null,null,null,null],
                            [null,null,null,null,null,null,null,null],
                            [null,null,null,null,null,null,null,null],
                            [null,null,null,null,null,null,null,null],
                            [null,null,null,null,null,null,null,null],
                            [null,null,null,null,null,null,null,null],
                            [null,null,null,null,null,null,null,null],
                            [null,null,null,null,null,null,null,null],
                        ];

class Board {

    get initialState() {
        return chessboardState;
    }
    constructor() {
        // this.currentState = this.initialState;
        this.getState();
        this.chessboardInstances = chessboardInstances;
        this.pieceFactory = new PieceFactory();
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
    get suggestedMoves() {
        return this._suggestedMoves;
    }
    set suggestedMoves(value) {
        this._suggestedMoves = value;
    }

    draw() {
        let chessboxArray = Helper.getElementAsArray("chessbox")
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {

                let pieceDiv = document.createElement("div");
                let chessbox = Helper.getChessboxAt(i,j);

                if (this.chessboardInstances[i][j] !== "0") {
                    let piece = this.chessboardInstances[i][j];
                    pieceDiv.innerText = piece.symbol;
                    pieceDiv.classList.add(piece.color);
                    chessbox.appendChild(pieceDiv);
                } else {
                    chessbox.innerHTML = "";
                }
            }
        }
        this.saveState();
    }
    clear() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let chessbox = Helper.getChessboxAt(i,j);
                chessbox.innerHTML = "";
            }
        }
    }

    init() {
        // let undoBtn = document.getElementById("undo");
        // undoBtn.addEventListener("click", this.undo.bind(this));
        let resetBtn = document.getElementById("reset");
        resetBtn.addEventListener("click", this.reset.bind(this));
    }

    // undo() {
    //     console.log(localStorage.getItem("fromRow"));
    // }

    hasSquareSelected() {
        return (typeof this._fromRow !== 'undefined') && typeof this._fromColumn !== 'undefined';
    }


    onSquareClick(event) {

        const chessbox = event.currentTarget;
        const row = parseInt(chessbox.dataset.rowIndex);
        const column = parseInt(chessbox.dataset.columnIndex);
        const currentChessPiece = this.chessboardInstances[row][column];
        let chessboxDivArray = Helper.getChessboxesAsArray();

        if (!this.hasSquareSelected()) {

            chessbox.classList.add("selected");
            this.fromRow = row;
            this.fromColumn = column;

            if(currentChessPiece !== "0"){
                this.suggestedMoves = currentChessPiece.getSuggestedMoves(this.chessboardInstances, this.fromRow, this.fromColumn);
                console.log(this.suggestedMoves);
                
                //Helper.getChessboxesAsArrayWithConstraint gets all DIVS that have indexes(row,column) in the specified array that looks like [[row1,col1],[row2,col2],..]
                //for each element suggest/attack class name is added
                Helper.getChessboxesAsArrayWithConstraint(this.suggestedMoves.legalMoves).forEach(element => element.classList.add("suggest"));
                Helper.getChessboxesAsArrayWithConstraint(this.suggestedMoves.attackMoves).forEach(element => element.classList.add("attack"));
            }
            //draw suggestions


        } else {
            this.toRow = row;
            this.toColumn = column;
            let lastSelectedPiece = this.chessboardInstances[this.fromRow][this.fromColumn];
            let secondSelectedPiece = this.chessboardInstances[this.toRow][this.toColumn];

            if(lastSelectedPiece !== "0"){
                this.chessboardInstances = lastSelectedPiece.movePiece(this.chessboardInstances,this.suggestedMoves,this.fromRow,this.fromColumn,this.toRow,this.toColumn);
            }

            this.syncCurrentStateWithChessboardInstances();
            console.log(this.currentState);

            this.fromRow = undefined;
            this.fromColumn = undefined;
            this.toRow = undefined;
            this.toRow = undefined;
            this.clear();
            this.draw();

            Helper.removeFromClassList("selected");
            Helper.removeFromClassList("suggest");
            Helper.removeFromClassList("attack");
        }
    }
    generateBoard() {
        let container = document.createDocumentFragment();
        let chessboard = document.createElement("div");
        chessboard.id = "chessboard";

        for (let i = 0; i < 8; i++) {
            for(let j=0; j<8;j++){
                let chessbox = document.createElement("div");

                if(j % 2 === 0){
                    if (i % 2 === 0) {
                        chessbox.className = "chessbox white-square";
                    } else {
                        chessbox.className = "chessbox black-square";
                    }
                }else{
                    if (i % 2 === 0) {
                        chessbox.className = "chessbox black-square";
                    } else {
                        chessbox.className = "chessbox white-square";
                    }
                }

                //fields given
                chessbox.dataset.columnIndex = j;
                chessbox.dataset.rowIndex = i;
                chessbox.addEventListener("click", this.onSquareClick.bind(this));
                
                //append to document fragment
                chessboard.appendChild(chessbox);

                //create chess piece
                let piece = this.pieceFactory.create(this.currentState[i][j].name,this.currentState[i][j].color);
                this.chessboardInstances[i][j] = piece;
            }
        }
        container.appendChild(chessboard);
        document.body.appendChild(container);
        console.log(this.chessboardInstances);
    }
    deleteBoard(){
        let chessboardElement = document.getElementById("chessboard");
        chessboardElement.remove();
    }

    saveState(){
        //Stringify chesboard state array
        let currentStateStringified = JSON.stringify(this.currentState);
        //Save to browset local storage
        storage.setItem("currentState",currentStateStringified);
    }
    getState(){
        //Parse currentState from storage
        let currentStateStringified = storage.getItem("currentState");
        let currentStateParsed = JSON.parse(currentStateStringified);
        //Update the state to the storage saved state;
        this.currentState = currentStateParsed;
    }
    syncCurrentStateWithChessboardInstances(){
        for(let i=0;i<8;i++){
            for(let j=0;j<8;j++){
                if(this.chessboardInstances[i][j] === "0"){
                    this.currentState[i][j].name = "EMPTY";
                    this.currentState[i][j].color = "";
                }else{
                    this.currentState[i][j].name = this.chessboardInstances[i][j].name;
                    this.currentState[i][j].color = this.chessboardInstances[i][j].color;
                }
            }
        }
    }
    reset(){
        this.currentState = chessboardState;
        this.chessboardInstances = chessboardInstances;
        console.log(this.currentState);
        console.log(this.chessboardInstances);
        this.deleteBoard();
        this.generateBoard();
        this.draw();
    }
}



