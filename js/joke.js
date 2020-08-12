
$("#joke-btn").click(requestJoke)

function requestJoke(){
    let randomUrl = urlGenerator.next().value;
    // jQuery.get( url [, data ] [, success ] [, dataType ] )
    $.get( randomUrl, function( data ) {
        showJoke(data);
    });
}

export function requestJokeAjax(){
    let randomUrl = urlGenerator.next().value;
    $.ajax({
        method: "GET",
        url: randomUrl,
        data: {}
       }).done(function( data ) {
           showJoke(data);
    });
}
function showJoke(data){
    if(data.error === false){
        $( "#joke-text").text( "Here's a "+ data.category+" joke: "+data.joke );
    }else{
        let jokeUrl = "https://i.imgflip.com/1belx6.jpg"
        $( "#joke-text img" ).remove();
        $( "#joke-text" ).append(`<img src=\"${jokeUrl}\" alt="Waiting meme" width="50%">`)
    }
}

function* generateRandomCategory(){

    let catergories = ["Programming","Miscellaneous","Dark","Pun"];

    while(true){

        let randomIndex = Math.floor(Math.random() * catergories.length);

        let apiRandomUrl = `https://sv443.net/jokeapi/v2/joke/${catergories[randomIndex]}?type=single`;

        yield apiRandomUrl;
    }
}

let urlGenerator = generateRandomCategory();