/*
* Author:      Marco Kuiper (http://www.marcofolio.net/)
*/

$(document).ready(function()
{
	// Default
	$("#demo1").jfancytile();
	
	// With options
	$("#demo2").jfancytile({
    	inEasing: "easeOutBounce", // from jQuery Easing Plugin
    	outEasing: "easeInCirc",   // from jQuery Easing Plugin
        inSpeed: 2000,
        outSpeed: 3500,
        rowCount: 5,
        columnCount: 10,
        maxTileShift: 5
    });
});