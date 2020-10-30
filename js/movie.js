function getMovie(){
    var URL = "";
    var filter = $('#d').val();
    
    if ( filter == 1) {
        var query = $('#info').val();
        URL += "./in_theaters";
    }
    if ( filter == 2) {
        var query = $('#info').val();
        URL += "./year";
    }
    if ( filter == 3) {
        var query = $('#info').val();
        URL += "./keyword";
    }
    if ( filter == 4) {
        var query = getLanguage();
        URL += "./language";
    }
    if ( filter == 5) {
        var query = $('#info').val();
        URL += "./actor";
    }
    if ( filter == 6) { 
        var query = getGenre();
        URL += "./genre";
    }
    
    $.ajax({
            type: "POST",
            url: URL,
            dataType: "text",
            data: { q: query },
            success: function(msg) {
                $("#response").html(msg);
            },

            error: function(jgXHR, textStatus, errorThrown) {
                document.getElementById("response").innerHTML = "Error: " + errorThrown;
            }
        });(jQuery);
}

//Convert user's desired language into ISO code.
function getLanguage(){
    var query = {};
    var language = $('#info').val();
    var dict = {"English" : "en", "Spanish" : "es", "Arabic": "ar", "Chinese": "zh", "French": "fr", "German": "de", "Italian": "it", "Portugese": "pt", "Japanese": "ja", "Korean": "ko", "Danish": "da", "Russian": "ru"};
    query = dict[language];
    return query;
}

//Convert user's desired genre into genre id used in API
function getGenre(){
    var query = {};
    var genre = $('#info').val();
    var dict = { "Action" : 28, "Adventure" : 12, "Animation" : 16, "Comedy" : 35, "Crime" : 80, "Documentary" : 99, "Drama" : 18, "Family" : 10751, "Fantasy" : 14, "History" : 27, "Music" : 10402, "Mystery" : 9648, "Romance" : 10749, "Sci-Fi" : 878, "TV Movie" : 10770, "Thriller" : 53, "War" : 10752, "Western" : 37 };
    query = dict[genre];
    return query;
}

