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
    constructor(gameType,teamColor) {
        if(storage.getItem("currentState") === null){
            this.currentState = initialBoardState;
        }else{
            this.getState();
        }
        this.chessboardInstances = chessboardInstances;
        this.pieceFactory = new PieceFactory();
        this.colorTurn = "white";
        this.gameState = "";
        this.gameType = gameType;
        this.pieceMoved = false;
        console.log(teamColor);

        if(gameType === "MULTIPLAYER"){
            this.sendDataFromApi();
            this.playerColor = teamColor;
            console.log(this.playerColor);
        }
    }
    //Variables
    get playerColor() {
        return this._player1Color;
    }
    set playerColor(value) {
        this._player1Color = value;
    }
    get pieceMoved() {
        return this._pieceMoved;
    }
    set pieceMoved(value) {
        this._pieceMoved = value;
    }
    get gameType() {
        return this._gameType;
    }
    set gameType(value) {
        this._gameType = value;
    }
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

    sendDataFromApi(){
        // $(document).ajaxSuccess(this.handleSuccess.bind(this));
        $(document).on("sendData",this.handleSuccess.bind(this));
    }

    draw() {
        $("#turn").text(`Now moving: ${this.colorTurn}`);

        //Take every piece instance from matrix state, and put them their matching divs
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {

                //create a piece div
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

        this.fromRow = row;
        this.fromColumn = column;

        if(this.checkKing() === true){
            const position = this.getPiecePosition("king",this.colorTurn);
            const kingChessbox = Helper.getChessboxAt(position[0],position[1])
            kingChessbox.toggleClass("danger");
        }else{
            
        }

        if(currentChessPiece.color === this.colorTurn){
            this.setSuggestions(currentChessPiece);
            this.drawSuggestions(this.suggestedMoves);
        }
            
        console.log("Selected "+currentChessPiece.name+" of team "+ currentChessPiece.color+" at ["+ row +"]["+ column+"]");

    }
    onSquareDrop(e){
        const chessbox = e.target;
        const row = parseInt(chessbox.dataset.rowIndex);
        const column = parseInt(chessbox.dataset.columnIndex);
        this.toRow = row;
        this.toColumn = column;

        if(this.gameType === "SINGLEPLAYER"){
            this.moveSelectedPiece();
            this.changeColorTurn();
            this.saveState();
        }
    
        if(this.gameType === "MULTIPLAYER"){
            if(this.playerColor === this.colorTurn){
                this.moveSelectedPiece();
                if(this.pieceMoved === true){
                    this.sendApiMoves();
                }
            }else{
                alert("Not your turn!");
                // console.log(this.playerColor);
            }
            // this.changeColorTurn();
        }

        this.fromRow = undefined;
        this.fromColumn = undefined;
        this.toRow = undefined;
        this.toColumn = undefined;

        this.clear();
        this.draw();
    }
    setSuggestions(currentChessPiece, fromRow = this.fromRow, fromColumn = this.fromColumn){
        // "0" means empty chessbox;
        if(currentChessPiece !== "0"){
            //Generate all legal moves and attack moves;
            this.suggestedMoves = currentChessPiece.getSuggestedMoves(this.chessboardInstances, fromRow, fromColumn);
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
        $("#turn").text("");
        this.suggestedMoves = undefined;
        Helper.removeFromClassList("selected");
        Helper.removeFromClassList("suggest");
        Helper.removeFromClassList("attack");
        Helper.removeFromClassList("danger");
    }
    init() {
        $(document).on("click",".chessbox",this.onSquareClick.bind(this));
        $("#reset").click(this.reset.bind(this));
        $("#build-chessboard").click(this.buildChessboard.bind(this));
        $("<p id=\"turn\" class=\"center\"></p>").appendTo($("header"));
        $("#turn").text(`Now moving:${this.colorTurn}`);
        if(this.gameType === "MULTIPLAYER"){
            $("#player-color").remove();
            $(`<p id=\"player-color\" class=\"center\">Your assigned team: ${this.playerColor}</p>`).appendTo($("header"));
        }
        
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

            console.table([this.fromRow,this.fromColumn,this.toRow,this.toColumn]);
            this.moveSelectedPiece();

            this.changeColorTurn();

            // this.currentState has only name and color attributes, not instances, so we have to sync them, with the piece instance matrix;
            this.syncAfterInstances();
            // Save current state in local storage;
            this.saveState();
            // console.log(this.currentState);
            
            //Assuming the two events happend, we have to clear the row and column class attributes for the further events;
            //Also the chessboardInstances was modified, we have to redraw after the new chessboardInstances matrix;
            //And we have to clear suggested moves, and selected pieces;
            this.fromRow = undefined;
            this.fromColumn = undefined;
            this.toRow = undefined;
            this.toColumn = undefined;

            this.clear();
            this.draw();

            
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
                chessbox.droppable({drop:this.onSquareDrop.bind(this)});
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
    syncAfterInstances(){
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
    syncAfterObjects(){
        this.chessboardInstances = [ [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
    ];  
        for(let i=0;i<8;i++){
            for(let j=0;j<8;j++){
                if(this.currentState[i][j].name === "EMPTY"){
                    this.chessboardInstances[i][j] = "0";
                }else{
                    let piece = this.pieceFactory.create(this.currentState[i][j].name,this.currentState[i][j].color);
                    this.chessboardInstances[i][j] = piece;
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
        this.moveApiPiece("0","0","0","0");
        // console.log(this.currentState);
        // console.log(this.chessboardInstances);
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
    changeColorTurn(colorTurn = this.colorTurn, pieceMoved = this.pieceMoved){
        if(pieceMoved === true){
            colorTurn === "white" ? this.colorTurn = "black" : this.colorTurn = "white"; 
        }
    }
    getOpponentColor(color = this.colorTurn){
        return color === "white" ? "black" : "white";
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
    moveSelectedPiece(fromRow = this.fromRow, fromColumn = this.fromColumn, toRow = this.toRow, toColumn = this.toColumn){

        // sync in case player does an ilegal move;
        this.syncAfterInstances();
        console.log(fromRow);
        let lastSelectedPiece = this.chessboardInstances[fromRow][fromColumn];
        if(lastSelectedPiece !== "0"){

            let moveInfo = lastSelectedPiece.movePiece(this.chessboardInstances,this.suggestedMoves,fromRow,fromColumn,toRow,toColumn);
            
            this.chessboardInstances = moveInfo.state;
            this.pieceMoved = moveInfo.moved;
            
            if(typeof moveInfo.state === 'undefined'){
                console.log("Performed an illegal move!");
                this.syncAfterObjects();
                this.pieceMoved = false;
            }else{
                console.log("Moved "+lastSelectedPiece.name+" of team "+ lastSelectedPiece.color+" at ["+ toRow +"]["+ toColumn+"]");
                console.log("Now is "+this.colorTurn+" turn");
            }
        }
    }
    moveApiPiece(fromRow, fromColumn, toRow, toColumn){
        if(this.chessboardInstances[fromRow][fromColumn] !== "0"){
            this.chessboardInstances[toRow][toColumn] = this.chessboardInstances[fromRow][fromColumn];
            this.chessboardInstances[fromRow][fromColumn] = "0";
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
    getApiMoves(){
        return moves; 
    }
    sendApiMoves(){
        const move = Helper.moveShape(this.fromRow,this.fromColumn,this.toRow,this.toColumn,this.colorTurn);

        if(this.gameType === "MULTIPLAYER"){
            $.ajax({
                method: "POST",
                url: `https://chess.thrive-dev.bitstoneint.com/wp-json/chess-api/game/${gameID}`,
                data: {move}
            }).done(function(data){
            });
        }
    }
    handleSuccess(event,data){
        // console.log(this);
        //get last move
        let moves = this.getApiMoves();
        let move = moves[moves.length - 1];
        console.log(move);
        
        if(typeof move !== "undefined" ){
            
            const apiColor = move.by;
            const fromRow = parseInt(move.from.x);
            const fromColumn = parseInt(move.from.y);
            const toRow = parseInt(move.to.x);
            const toColumn = parseInt(move.to.y);

            if(apiColor === "black"){
                this.colorTurn = "white";
            }else{
                this.colorTurn = "black";
            }
            $("#turn").text(`Now moving: ${this.colorTurn}`);

            //if the player color is different from the color of the last player that moved a piece
            if(this.playerColor !== apiColor){
                // should move the piece on their tab too

                // we know that the piece is moved corectly we dont have to check suggestions;
                this.moveApiPiece(fromRow,fromColumn,toRow,toColumn);
                this.clear();
                this.draw();
            }else{
                this.moveApiPiece(fromRow,fromColumn,toRow,toColumn);
                this.clear();
                this.draw();
            }
        }
    }
}




