$(document).ready(function(){
    $(".search-box").keyup(function(){
        var search = $(".search-box").val();                  
        get_suggestions(search, print_suggestions);
        wiki_extract(search, display_summary);
    });

    $('body').click(function() {
        $('.input-suggestions').css("display", "none");
    });
});

function wiki_extract(word, callback) {
    $.getJSON("http://en.wikipedia.org/w/api.php?callback=?",
    {
        titles: word,
        action: "query",
        prop: "extracts",
        exintro: "",
        format: "json",
        redirects: ""
        //specify user agent
    }, function(data) {
        callback(data);
    }).fail(function() {
        $(".results").append("<div><h1 style='margin-top: 50px'><center>No content</center></h1></div>");
    });
};

function display_summary(data) {
    $.each(data.query.pages, function(i) {
        $.each(data.query.pages[i], function(j) {
            if (j == "extract") {
                if (data.query.pages[i][j].indexOf("may refer to or be used for:") > -1) {
                    $(".results").empty();
                    $(".results").append("<span><h1 class='content-title'>No Content</h1></span>");
                    $(".results").append("<span class='content-text'><p>Please be a bit more specific with your search query</p></span>");
                } 
                else {
                    $(".results").empty();
                    $(".results").append("<span><h1 class='content-title'>" + data.query.pages[i]['title'] + "</h1></span>");
                    $(".results").append("<span class='content-text'><p>" + data.query.pages[i][j] + "</p></span>");
                }
            }
        })
    });
};

function get_suggestions(word, callback) {
    $.getJSON("http://en.wikipedia.org/w/api.php?callback=?",
    {
        action: "opensearch",
        search: word,
        limit: 5,
        format: "json",
        redirects: "resolve"
        //specify user agent
    }, function(data) {
        for (var i = 0; i < data[1].length; i++) {
            if (data[2][i].indexOf("may refer to:") > -1 ) {
                data[1].splice(i, 1);
                data[2].splice(i, 1);
                data[3].splice(i, 1);
            }
        }
        callback(word, data[1]);
    });
};

function print_suggestions(search, suggestions) {
    $(".input-suggestions").empty();
    for (var i = 0; i < suggestions.length; i++) {
        $(".input-suggestions").append("<p class='suggest-content' onclick=" + '"' + "wiki_extract('" + suggestions[i] + "', display_summary)" + '"' + ">" + suggestions[i] + "</p>");
    }

    suggestions.map(function(value) {
        if (search != value.toLowerCase()) {
            $('.input-suggestions').css("display", "block");
        }
        else {
            $('.input-suggestions').css("display", "none");
        }
    });
}