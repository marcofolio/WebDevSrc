/*
* Author:      Marco Kuiper (http://www.marcofolio.net/)
*/

$(document).ready(function()
{
	// Set the nescesarry data
	$("#jquerynav li a").each(function(){
		var backgroundPositions = $(this).css('background-position').split(" "); // Returns "##px" and "##px"
		$(this).data("originalXpos", backgroundPositions[0].slice(0, -2)); // Retrieve the original X position
		$(this).data("newYpos", 0); // Set the new Y position to 0
	});
	
	// Capture the "hover" events
	$("#jquerynav li a").hover(function(){
		$(this)
			.data("newYpos", $(this).data("newYpos") + 1)
			.stop()
			.animate({
				backgroundPosition: $(this).data("originalXpos") + "px " + $(this).data("newYpos") * 75 + "px"
			}, 600, "easeOutCirc");
	}, function(){
		$(this)
			.data("newYpos", $(this).data("newYpos") + 1)
			.stop()
			.animate({
				backgroundPosition: $(this).data("originalXpos") + "px " + $(this).data("newYpos") * 75 + "px"
			}, 400, "easeInCirc");
	});
});