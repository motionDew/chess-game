let seconds = 3;
let timerScreen;
let headingCount;


//Pieces look up table symbol
const pieces = {
    king: '♚',
    queen: '♛',
    bishop: '♝',
    knight: '♞',
    rook: '♜',
    pawn: '♟'
}


// Pieces classes

class ChessPiece {
    constructor(color) {
        if (new.target === ChessPiece) {
            throw new TypeError("Cannot construct ChessPiece instances  directly!");
        }
        this.color = color;
    }

    get color(){
        return this._color;
    }
    set color(value){
        this._color = value;
    }

    // Gets the div where the piece is placed.
    getContainerElement() {
        let container = Array.from(document.body.getElementsByClassName("chessbox"));
        let childContainer = container.find(box => box.dataset.columnIndex === this.coordinate.x && box.dataset.rowIndex === this.coordinate.y);
        return childContainer;
    }
}

class King extends ChessPiece {
    constructor(color){
        super(color);
    }

    get symbol(){
        return "♚";
    }
}
class Queen extends ChessPiece {
    constructor(color){
        super(color);
    }

    get symbol(){
        return "♛";
    }
}
class Bishop extends ChessPiece {
    constructor(color){
        super(color);
    }

    get symbol(){
        return "♝";
    }
}
class Knight extends ChessPiece {
    constructor(color){
        super(color);
    }

    get symbol(){
        return "♞";
    }
}
class Rook extends ChessPiece {
    constructor(color){
        super(color);
    }

    get symbol(){
        return "♜";
    }
}
class Pawn extends ChessPiece {
    constructor(color){
        super(color);
    }

    get symbol(){
        return "♟";
    }

    legalMove(){

    }

}


// Board drawing

class Board {

    get initialState() {
        return [
            [new Rook('black'), new Knight('black'), new Bishop('black'), new Queen('black'), new King('black'), new Bishop('black'), new Knight('black'), new Rook('black')],
            [new Pawn('black'), new Pawn('black'), new Pawn('black'), new Pawn('black'), new Pawn('black'), new Pawn('black'), new Pawn('black'), new Pawn('black')],
            ['0', '0', '0', '0', '0', '0', '0', '0'],
            ['0', '0', '0', '0', '0', '0', '0', '0'],
            ['0', '0', '0', '0', '0', '0', '0', '0'],
            ['0', '0', '0', '0', '0', '0', '0', '0'],
            [new Pawn('white'), new Pawn('white'), new Pawn('white'), new Pawn('white'), new Pawn('white'), new Pawn('white'), new Pawn('white'), new Pawn('white')],
            [new Rook('white'), new Knight('white'), new Bishop('white'), new King('white'), new Queen('white'), new Bishop('white'), new Knight('white'), new Rook('white')]
        ]
    }
    constructor() {
        this.currentState = this.initialState;
    }

    //Variables
    get from(){
        return this._from;
    }
    set from(value){
        this._from = value;
    }
    get to(){
        return this._to;
    }
    set to(value){
        this._to = value;
    }

    draw() {
        let chessboxArray = Array.from(document.getElementsByClassName("chessbox"));
        for(let i=0;i<8;i++){
            for(let j=0;j<8;j++){
                let piece = document.createElement("div");

                if(this.currentState[i][j] !== "0"){
                    piece.innerText = this.currentState[i][j].symbol;
                    piece.className = this.currentState[i][j].color;
                    //this finds the div that has data-column-index === j and data-row-index === i
                    let chessbox = chessboxArray.find(element => element.dataset.rowIndex === i.toString() && element.dataset.columnIndex === j.toString());
                    chessbox.appendChild(piece);
                }else{
                    let chessbox = chessboxArray.find(element => element.dataset.rowIndex === i.toString() && element.dataset.columnIndex === j.toString());
                    chessbox.innerHTML="";
                }
            }
        }
    }
    clear(){
        let chessboxArray = Array.from(document.getElementsByClassName("chessbox"));
        for(let i=0;i<8;i++){
            for(let j=0;j<8;j++){
                    let chessbox = chessboxArray.find(element => element.dataset.rowIndex === i.toString() && element.dataset.columnIndex === j.toString());
                    chessbox.innerHTML="";
                }
            }
    }

    init() {

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
            chessbox.addEventListener("click", () =>{

                if(this._from === undefined){
                    chessbox.classList.add("selected");
                    this._from = [parseInt(chessbox.dataset.rowIndex),parseInt(chessbox.dataset.columnIndex)];
                    
                    //Pawn game mechanics:
                    // check if chessbox is corespondig to a Pawn
                    if(this.currentState[parseInt(chessbox.dataset.rowIndex)][parseInt(chessbox.dataset.columnIndex)] instanceof Pawn){
                        //Check the colour in order to make a move suggestion
                        if(this.currentState[parseInt(chessbox.dataset.rowIndex)][parseInt(chessbox.dataset.columnIndex)].color === "white"){
                            let chessboxArray = Array.from(document.getElementsByClassName("chessbox"));
                            //filter the chessbox so only the legal suggestions remain available
                            //Decide if next suggestion is an Attack or a Move
                            if(this.currentState[this._from[0]-1][this._from[1]] === "0"){
                                let possibleMoves = chessboxArray.filter( element => element.dataset.rowIndex === (parseInt(chessbox.dataset.rowIndex)-1).toString() && element.dataset.columnIndex === chessbox.dataset.columnIndex );
                                //draw the chessbox suggestion in green
                                possibleMoves.forEach( element => element.classList.add("suggest"));
                            }else{
                                let attackSuggestins = chessboxArray.filter(element => 
                                    (element.dataset.rowIndex === (parseInt(chessbox.dataset.rowIndex)-1).toString() && element.dataset.columnIndex === (parseInt(chessbox.dataset.columnIndex)-1).toString())
                                    ||
                                    (element.dataset.rowIndex === (parseInt(chessbox.dataset.rowIndex)-1).toString() && element.dataset.columnIndex === (parseInt(chessbox.dataset.columnIndex)+1).toString()));
                                attackSuggestins.forEach(element => element.classList.add("attack"));
                            }
                        }else{
                            let chessboxArray = Array.from(document.getElementsByClassName("chessbox"));
                            if(this.currentState[this._from[0]+1][this._from[1]] === "0"){
                                let possibleMoves = chessboxArray.filter( element => element.dataset.rowIndex === (parseInt(chessbox.dataset.rowIndex)+1).toString() && element.dataset.columnIndex === chessbox.dataset.columnIndex );
                                //draw the chessbox suggestion in green
                                possibleMoves.forEach( element => element.classList.add("suggest"));
                            }else{
                                let attackSuggestins = chessboxArray.filter(element => 
                                    (element.dataset.rowIndex === (parseInt(chessbox.dataset.rowIndex)+1).toString() && element.dataset.columnIndex === (parseInt(chessbox.dataset.columnIndex)-1).toString())
                                    ||
                                    (element.dataset.rowIndex === (parseInt(chessbox.dataset.rowIndex)+1).toString() && element.dataset.columnIndex === (parseInt(chessbox.dataset.columnIndex)+1).toString()));
                                attackSuggestins.forEach(element => element.classList.add("attack"));
                            }
                        }
                    }

                }else if(this._from !== undefined){
                    chessbox.classList.add("selected");
                    this._to = [parseInt(chessbox.dataset.rowIndex),parseInt(chessbox.dataset.columnIndex)];


                    //Pawn game mecanics:
                    //check if LAST SELECTED element was a Pawn
                    if(this.currentState[this._from[0]][this._from[1]] instanceof Pawn){
                        //Check the color
                        if(this.currentState[this._from[0]][this._from[1]].color === "black"){
                            //Decide what type of move Pawn will do: Attack or Move
                            if(this.currentState[this._to[0]][this._to[1]] === "0"){
                                //move rule
                                //check if distance between LAST SELECTED row index and CURRENT SELECTED row index is 1
                                //in less words check if it can move forward acording to their move direction
                                if((this._to[0] - this._from[0]) !== 1 || this._to[1] !== this._from[1]){
                                    console.log("ilegal move!");
                                }else{
                                    //Change position
                                    this.currentState[this._to[0]][this._to[1]] = this.currentState[this._from[0]][this._from[1]];
                                    this.currentState[this._from[0]][this._from[1]] = "0";
                                    console.log(this._to[1] +" and"+ this._from[1]);
                                }
                            }else{
                                //attack rule
                                //if _to position is in fron of the Pawn or distance on the vertical axis is greater than 1 than ilegal
                                if(this._to[1] === this._from[1] || (this._to[0] - this._from[0]) !== 1){
                                    console.log("ilegal move!");    
                                }else{
                                    //Change position
                                    this.currentState[this._to[0]][this._to[1]] = this.currentState[this._from[0]][this._from[1]];
                                    this.currentState[this._from[0]][this._from[1]] = "0";
                                    console.log(this._to[1] +" and"+ this._from[1]);
                                }
                            }
                            
                        }
                        else{
                            //white Pawn
                            if(this.currentState[this._to[0]][this._to[1]] === "0"){
                                //move rule
                                if((this._from[0] - this._to[0]) !== 1 || this._to[1] !== this._from[1]){
                                    console.log("ilegal move!");
                                }else{
                                    //Change position
                                    this.currentState[this._to[0]][this._to[1]] = this.currentState[this._from[0]][this._from[1]];
                                    this.currentState[this._from[0]][this._from[1]] = "0";
                                    console.log(this._to[1] +" and"+ this._from[1]);
                                }
                            }else{
                                //attack rule
                                if(this._to[1] === this._from[1] || (this._from[0] -this._to[0]) !== 1){
                                    console.log("ilegal move!");    
                                }else{
                                    //Change position
                                    this.currentState[this._to[0]][this._to[1]] = this.currentState[this._from[0]][this._from[1]];
                                    this.currentState[this._from[0]][this._from[1]] = "0";
                                    console.log(this._to[1] +" and"+ this._from[1]);
                                }
                            }
                        }
                        
                    }
                    
                    this._from = undefined;
                    this._to = undefined;
                    this.clear();
                    this.draw();
                    
                    let selectedChessboxes = Array.from(document.getElementsByClassName("selected"));
                    selectedChessboxes.forEach(element => element.classList.remove("selected"));

                    let suggestedChessboxes = Array.from(document.getElementsByClassName("chessbox"));
                    suggestedChessboxes.forEach( element => element.classList.remove("suggest"));
                    
                    let attackChessboxes = Array.from(document.getElementsByClassName("chessbox"));
                    suggestedChessboxes.forEach( element => element.classList.remove("attack"));


                }
            });

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
        return;
    }
}

function app() {

    let game = new Board();
    game.generateBoard();
    game.draw();

}


//event listeners
