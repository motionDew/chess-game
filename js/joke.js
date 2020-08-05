
$("#joke-btn").click(requestJoke)

function requestJoke(){

    // jQuery.get( url [, data ] [, success ] [, dataType ] )
    $.get( "https://sv443.net/jokeapi/v2/joke/Programming", function( data ) {
 	    $( "#joke-text" ).html( data );
         alert( "Load was performed." );
         console.log(data);
    });

}