/*
* Author:      Marco Kuiper (http://www.marcofolio.net/)
*/

$(function() {

    // Two dimensional array that represents the logo
    // Each number represents a different shade, which is referred to in the CSS
    var techcrunchLogo =
    [
        [1,1,1,1,1,1,1,2,1,2,2,2,0,0,0,0,3,3,4,4,4,4,4,3],
        [1,1,1,1,1,1,1,2,2,2,2,2,0,0,0,0,3,4,4,3,4,4,3,3],
        [1,1,1,1,1,1,2,1,1,2,2,3,0,0,0,0,4,4,4,4,3,2,2,3],
        [1,1,2,2,1,2,1,2,2,2,1,1,0,0,0,0,3,4,4,3,2,2,3,2],
        [0,0,0,0,2,2,2,2,0,0,0,0,2,2,2,3,0,0,0,0,0,0,0,0],
        [0,0,0,0,1,1,2,3,0,0,0,0,2,3,3,3,0,0,0,0,0,0,0,0],
        [0,0,0,0,1,2,3,3,0,0,0,0,2,3,3,4,0,0,0,0,0,0,0,0],
        [0,0,0,0,2,2,2,2,0,0,0,0,4,3,4,4,0,0,0,0,0,0,0,0],
        [0,0,0,0,2,3,2,2,0,0,0,0,3,4,4,4,4,3,4,3,3,2,3,3],
        [0,0,0,0,2,2,2,3,0,0,0,0,4,4,4,3,4,3,3,3,3,3,2,2],
        [0,0,0,0,2,3,3,3,0,0,0,0,4,4,4,4,3,3,2,3,3,2,2,2],
        [0,0,0,0,3,2,3,3,0,0,0,0,4,4,3,4,4,3,3,2,2,2,2,2]
    ];
	
    // Generate the logo by iterating over the techcrunchLogo arrays
    for(var i = 0; i < techcrunchLogo.length; i++) { // Rows
        for (var j = 0; j < techcrunchLogo[i].length; j++) { // Columns
            $("<div />")
               .addClass("pixel")
               .addClass("shade" + techcrunchLogo[i][j])
               .appendTo($("#techcrunch"));
        }
    }
});