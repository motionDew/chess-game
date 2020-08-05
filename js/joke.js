
$("#joke-btn").click(requestJoke)

function requestJoke(){
    // jQuery.get( url [, data ] [, success ] [, dataType ] )
    $.get( "https://sv443.net/jokeapi/v2/joke/Programming?type=single", function( data ) {
        showJoke(data);
    });
}
function requestJokeAjax(){
    $.ajax({
        method: "GET",
        url: "https://sv443.net/jokeapi/v2/joke/Programming?type=single",
        data: {}
       }).done(function( data ) {
           showJoke(data);
    });
}
function showJoke(data){
    if(data.error === false){
        $( "#joke-text" ).text( data.joke );
    }else{
        let jokeUrl = "https://i.imgflip.com/1belx6.jpg"
        $( "#joke-text img" ).remove();
        $( "#joke-text" ).append(`<img src=\"${jokeUrl}\" alt="Waiting meme" width="50%">`)
    }
}