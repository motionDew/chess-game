let seconds = 3;
let timerScreen;
let headingCount;
const storage = window.localStorage;

//Utils classes
// class UndoCommand {
//     constructor() {
//         this.stateArray = [];
//     }

// }

// Used to generate chessboard table with pieces and save state to storage;
const initialBoardState = {
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
    constructor() {
        if(storage.getItem("currentState") === null){
            this.currentState = initialBoardState;
        }else{
            this.getState();
        }
        this.chessboardInstances = chessboardInstances;
        this.pieceFactory = new PieceFactory();
        this.colorTurn = "white";
        // this.previousStates = [this.initialState];
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
    get colorTurn() {
        return this._colorTurn;
    }
    set colorTurn(value) {
        this._colorTurn = value;
    }
    draw() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {

                // let pieceDiv = document.createElement("div");
                let pieceDiv = $("<div class=\"piece\"></div>");
                let chessbox = Helper.getChessboxAt(i,j);

                if (this.chessboardInstances[i][j] !== "0") {
                    let piece = this.chessboardInstances[i][j];
                    pieceDiv.text(piece.symbol);
                    pieceDiv.addClass(piece.color);
                    chessbox.append(pieceDiv);
                } else {
                    chessbox.text("");
                }
            }
        }
    }
    clear() {
        // for (let i = 0; i < 8; i++) {
        //     for (let j = 0; j < 8; j++) {
        //         let chessbox = Helper.getChessboxAt(i,j);
        //         chessbox.text(""); 
        //     }
        // }
        $(".piece").remove();
    }
    init() {
        $("#reset").click(this.reset.bind(this));
    }
    // undo() {
    //     console.log(localStorage.getItem("fromRow"));
    // }
    hasSquareSelected() {
        return (typeof this._fromRow !== 'undefined') && typeof this._fromColumn !== 'undefined';
    }
    // This function is fired every time a div with "chessbox" class is clicked
    onSquareClick(event) {

        // Useful declarations;
        const chessbox = event.currentTarget;
        const row = parseInt(chessbox.dataset.rowIndex);
        const column = parseInt(chessbox.dataset.columnIndex);
        const currentChessPiece = this.chessboardInstances[row][column];


        //if king is under attack, show king is in danger
        


        //Summary:  if first chessbox is clicked, we draw move suggestions based on selected piece logic;
        //          Also we save the piece row and column dataset attributes for further use when the second square is clicked;
        if (!this.hasSquareSelected() && currentChessPiece.color === this.colorTurn) {

            chessbox.classList.add("selected");
            this.fromRow = row;
            this.fromColumn = column;

            // "0" means empty chessbox;
            if(currentChessPiece !== "0"){
                //Generate all legal moves and attack moves;
                this.suggestedMoves = currentChessPiece.getSuggestedMoves(this.chessboardInstances, this.fromRow, this.fromColumn);
                // console.log(this.suggestedMoves);
                
                //Helper.addClassForEachPosition gets all DIVS that have indexes(row,column) in the specified array( from suggestedMoves struture) that looks like [[row1,col1],[row2,col2],..]
                //for each element suggest/attack class name is added
                Helper.addClassForMultipleElements(this.suggestedMoves.legalMoves,"suggest");
                Helper.addClassForMultipleElements(this.suggestedMoves.attackMoves,"attack");
            }
        } else if(this.hasSquareSelected()){

            //the second square was clicked, now we must decide if we can move the piece selected in the previous event, based on the suggested moves saved;

            this.toRow = row;
            this.toColumn = column;
            let lastSelectedPiece = this.chessboardInstances[this.fromRow][this.fromColumn];

            if(lastSelectedPiece !== "0"){
                this.chessboardInstances = lastSelectedPiece.movePiece(this.chessboardInstances,this.suggestedMoves,this.fromRow,this.fromColumn,this.toRow,this.toColumn);
            }


            // this.currentState has only name and color attributes, not instances, so we have to sync them, with the piece instance matrix;
            this.syncCurrentStateWithChessboardInstances();
            // Save current state in local storage;
            this.saveState();
            // console.log(this.currentState);

            
            if(lastSelectedPiece.color === "white"){
                this.colorTurn = "black";
            }else{
                this.colorTurn = "white";
            }
            
            //Assuming the two events happend, we have to clear the row and column class attributes for the further events;
            //Also the chessboardInstances was modified, we have to redraw after the new chessboardInstances matrix;
            //And we have to clear suggested moves, and selected pieces;
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
        // let container = document.createDocumentFragment();
        // let chessboard = document.createElement("div");
        // chessboard.id = "chessboard";
        let chessboard = $("<div id=\"chessboard\"></div>");


        for (let i = 0; i < 8; i++) {
            for(let j=0; j<8;j++){
                // let chessbox = document.createElement("div");
                let chessbox = $("<div class=\"chessbox\"></div>");

                if(j % 2 === 0){
                    if (i % 2 === 0) {
                        chessbox.addClass("white-square");
                    } else {
                        chessbox.addClass("black-square");
                    }
                }else{
                    if (i % 2 === 0) {
                        chessbox.addClass("black-square");
                    } else {
                        chessbox.addClass("white-square");
                    }
                }

                //Element attributes
                chessbox.attr("data-row-index",i);
                chessbox.attr("data-column-index",j);
                // chessbox.dataset.rowIndex = i;
                // chessbox.addEventListener("click", this.onSquareClick.bind(this));
                chessbox.click(this.onSquareClick.bind(this));
                //append to document fragment
                chessbox.appendTo(chessboard);

                //create chess piece
                let piece = this.pieceFactory.create(this.currentState[i][j].name,this.currentState[i][j].color);

                this.chessboardInstances[i][j] = piece;
            }
        }
        // container.appendChild(chessboard);
        // document.body.appendChild(container);
        $("body").append(chessboard);
        // console.log(this.chessboardInstances);
    }
    deleteBoard(){
        let chessboardElement = $("#chessboard");
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
        this.currentState = {
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
        this.chessboardInstances = [ [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
    ];
        this.colorTurn = "white";
        console.log(this.currentState);
        console.log(this.chessboardInstances);
        this.deleteBoard();
        this.generateBoard();
        this.draw();
    }
}



