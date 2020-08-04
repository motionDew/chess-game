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
        this.gameState = "";
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
    get gameState() {
        return this._gameState;
    }
    set gameState(value) {
        this._gameState = value;
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
                    pieceDiv.draggable({
                        revert:true,
                        start: this.onStartDraggable.bind(this)
                    });
                    pieceDiv.addClass(piece.color);
                    chessbox.append(pieceDiv);
                } else {
                    chessbox.text("");
                }
            }
        }
    }
    onStartDraggable(e){
        const chessbox = e.currentTarget.parentNode;
        const row = parseInt(chessbox.dataset.rowIndex);
        const column = parseInt(chessbox.dataset.columnIndex);
        const currentChessPiece = this.chessboardInstances[row][column];

        console.log(row +" "+ column);
    }
    onDrop(e){
        const chessbox = e.target;
        //const row = parseInt(chessbox.dataset.rowIndex);
        //const column = parseInt(chessbox.dataset.columnIndex);
        //const currentChessPiece = this.chessboardInstances[row][column];
    }
    setSuggestions(currentChessPiece){
        // "0" means empty chessbox;
        if(currentChessPiece !== "0"){
            //Generate all legal moves and attack moves;
            this.suggestedMoves = currentChessPiece.getSuggestedMoves(this.chessboardInstances, this.fromRow, this.fromColumn);
            // console.log(this.suggestedMoves);
        }
    }
    drawSuggestions(suggestedMoves){
        //Helper.addClassForEachPosition gets all DIVS that have indexes(row,column) in the specified array( from suggestedMoves struture) that looks like [[row1,col1],[row2,col2],..]
            //for each element suggest/attack class name is added
            Helper.addClassForMultipleElements(suggestedMoves.legalMoves,"suggest");
            Helper.addClassForMultipleElements(suggestedMoves.attackMoves,"attack");
    }
    clear() {
        $(".piece").remove();
    }
    init() {
        $(document).on("click",".chessbox",this.onSquareClick.bind(this));
        $("#reset").click(this.reset.bind(this));
        $("#build-chessboard").click(this.buildChessboard.bind(this));
        
        this.deleteBoard();
        this.generateBoard();
        this.draw();
    }
    buildChessboard(){
        this.deleteBoard();
        this.generateBoard();
        this.generateDraggable();
    }
    generateDraggable(){
        $("main").append($("<aside><h2>Select a chess piece:</h2></aside>"));

        let pieceArray = [new King(),new Queen(),new Knight(),new Bishop(),new Rook(), new Pawn()];

        $("aside").append($("<div class=\"piece-container\"></div>"));
        $(".piece-container").append($("<div class=\"black-pieces\"></div>"));
        $(".piece-container").append($("<div class=\"white-pieces\"></div>"));

        for(let i=0;i<pieceArray.length;i++){
            $(".black-pieces").append($(`<div>${pieceArray[i].symbol}</div>`));
            $(".white-pieces").append($(`<div>${pieceArray[i].symbol}</div>`));
        }
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
        
        //Summary:  if first chessbox is clicked, we draw move suggestions based on selected piece logic;
        //          Also we save the piece row and column dataset attributes for further use when the second square is clicked;
        if (!this.hasSquareSelected() && currentChessPiece.color === this.colorTurn) {
            
            chessbox.classList.add("selected");
            this.fromRow = row;
            this.fromColumn = column;

            this.setSuggestions(currentChessPiece);
            
            //check if king under attack
            if(this.checkKing() === true){
                if(currentChessPiece.name === "king"){
                    console.log("MOVING KING!");

                    //check if drawing suggestion intersesct with opponent suggested moves
                        //remove those who could be possible attacks;
                    let opponentMoves = this.getOpponentMoves(this.getOpponentColor());
                    //Helper.addClassForMultipleElements(opponentMoves.legalMoves,"suggest");
                    //if king legal move is found in opponent legal move, remove from suggested moves
                    // this.removePossibleDangerMoves(opponentMoves);

                    this.drawSuggestions(this.suggestedMoves);

                }else{
                    //animate king position and don't let other pieces move;
                    const position = this.getPiecePosition("king",this.colorTurn);
                    const kingChessbox = Helper.getChessboxAt(position[0],position[1])
                    kingChessbox.toggleClass("danger");
                    
                    //make selected piece position undefined so player has to select another piece
                    this.fromRow = undefined;
                    this.fromColumn = undefined;
                    Helper.removeFromClassList("selected");
                }
            }else{
                //normal execution
                this.setSuggestions(currentChessPiece);
                this.drawSuggestions(this.suggestedMoves);
            }

        } else if(this.hasSquareSelected()){

            //the second square was clicked, now we must decide if we can move the piece selected in the previous event, based on the suggested moves saved;
            this.toRow = row;
            this.toColumn = column;
            let lastSelectedPiece = this.chessboardInstances[this.fromRow][this.fromColumn];

            this.moveSelectedPiece(lastSelectedPiece);

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
            this.toColumn = undefined;

            this.clear();
            this.draw();

            Helper.removeFromClassList("selected");
            Helper.removeFromClassList("suggest");
            Helper.removeFromClassList("attack");
            Helper.removeFromClassList("danger");
        }
    }
    generateBoard() {
        let chessboard = $("<div id=\"chessboard\"></div>");

        for (let i = 0; i < 8; i++) {
            for(let j=0; j<8;j++){
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
                chessbox.droppable(this.onDrop.bind(this));
                //append to document fragment
                chessbox.appendTo(chessboard);

                //create chess piece
                let piece = this.pieceFactory.create(this.currentState[i][j].name,this.currentState[i][j].color);

                this.chessboardInstances[i][j] = piece;
            }
        }
        // container.appendChild(chessboard);
        // document.body.appendChild(container);
        $("main").append(chessboard);
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
        this.saveState();
    }

    checkKing(){
        //get king position, for the current color turn
        let position = this.getPiecePosition("king",this.colorTurn);

        // check if position exists
        if(typeof position === 'undefined'){
            console.log("King Is Dead");
        }else{
            let opponentMoves = this.getOpponentMoves(this.getOpponentColor());
            let kingUnderAttack = opponentMoves.attackMoves.some( move => move[0] === position[0] && move[1] === position[1]);
            console.log("is "+this.colorTurn+" king under attack? :" + kingUnderAttack);
            return kingUnderAttack;
        }
    }

    getOpponentColor(){
        return this.colorTurn === "white" ? "black" : "white";
    }
    getOpponentMoves(opponentColor){

        let allOpponentMoves = Helper.getSuggestionShape();

        for(let i=0;i<8;i++){
            for(let j=0;j<8;j++){
                let currentPiece = this.chessboardInstances[i][j];
                if(currentPiece.color === opponentColor){
                    let pieceSuggestedMoves = currentPiece.getSuggestedMoves(this.chessboardInstances,i,j);
                    allOpponentMoves.legalMoves = [...allOpponentMoves.legalMoves,...pieceSuggestedMoves.legalMoves];
                    allOpponentMoves.attackMoves = [...allOpponentMoves.attackMoves,...pieceSuggestedMoves.attackMoves];
                }
            }
        }
        // console.log(allOpponentMoves);
        return allOpponentMoves;
    }
    getPiecePosition(name,pieceColor){
        for(let i=0;i<8;i++){
            for(let j=0;j<8;j++){
                let currentPiece = this.chessboardInstances[i][j];
                if(currentPiece.name === name && currentPiece.color === pieceColor){
                    return [i,j];
                }
            }
        }
        return undefined;
    }
    moveSelectedPiece(lastSelectedPiece){
        if(lastSelectedPiece !== "0"){
            this.chessboardInstances = lastSelectedPiece.movePiece(this.chessboardInstances,this.suggestedMoves,this.fromRow,this.fromColumn,this.toRow,this.toColumn);
        }
    }
    removePossibleDangerMoves(opponentMoves){

        let pieceSuggestedMoves = this.suggestedMoves.legalMoves;

        for(let i=0;i<pieceSuggestedMoves.length;i++){
            let possibleDanger = opponentMoves.legalMoves.filter( move => move[0] === (pieceSuggestedMoves[i])[0] && move[1] === (pieceSuggestedMoves[i])[1]);
            if(possibleDanger.length > 0){
                //TODO
            }
        }
    }

}



