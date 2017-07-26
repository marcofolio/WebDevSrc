/*
* Author:      Marco Kuiper (http://www.marcofolio.net/)
* Color palette: http://www.colourlovers.com/palette/1256638/hate_syringes
*/

$(document).ready(function() {
	
	// Two dimensional array that represents the playing field
	// A "x" stands for "on"
	// A "o" stands for "off"
	var lightField =
	[
		[ "x", "o", "o", "x", "x" ],
		[ "o", "o", "x", "o", "x" ],
		[ "o", "x", "o", "x", "o" ],
		[ "x", "o", "x", "o", "o" ],
		[ "x", "x", "o", "o", "x" ]
	];
	
	// Paint the panel
	repaintPanel();
	
	// User can click until the game is finished
	var userCanClick = true;
	
	// Attach a mouse click event listener
	$("#lightpanel").click(function(e) {
		
		if(!userCanClick) {
			return false;	
		}
		
		// e will give us absolute x, y so we need to calculate relative to canvas position
		var pos = $("#lightpanel").position();
		var ox = e.pageX - pos.left;
		var oy = e.pageY - pos.top;
		
		// Check which fields we need to flip
		var yField = Math.floor(oy / 100);
		var xField = Math.floor(ox / 100);
		
		// The field itself
		lightField[yField][xField] = lightField[yField][xField] == "x" ? "o" : "x";
		
		// The field above
		if(yField-1 >= 0) {
			lightField[yField-1][xField] = lightField[yField-1][xField] == "x" ? "o" : "x";
		}
		
		// The field underneath
		if(yField+1 < 5) {
			lightField[yField+1][xField] = lightField[yField+1][xField] == "x" ? "o" : "x";
		}
		
		// The field to the left
		if(xField-1 >= 0) {
			lightField[yField][xField-1] = lightField[yField][xField-1] == "x" ? "o" : "x";	
		}
		
		// The field to the right
		if(xField+1 < 5) {
			lightField[yField][xField+1] = lightField[yField][xField+1] == "x" ? "o" : "x";	
		}
		
		repaintPanel();
	});
	
	/*
	* Repaints the panel
	*/
	function repaintPanel() {
		
		// Retrieve the canvas
		var canvas = document.getElementById("lightpanel");
		
		// Check if the browser supports <canvas>
		if (!canvas.getContext){
			alert("This demo requires a browser that supports the <canvas> element.");
			return;
		} else {
			clear();
			
			// Get the context to draw on
			var ctx = canvas.getContext("2d");
			
			// Create the fields
			var allLightsAreOff = true;
			for(var i = 0; i < lightField.length; i++) { // Rows
				for (var j = 0; j < lightField[i].length; j++) { // Columns
					
					// Set up the brush
					ctx.lineWidth = 3;
					ctx.strokeStyle = "#83BD08";
					
					// Start drawing
	        		ctx.beginPath();
	        		
	        		// arc( x, y, radius, startAngle, endAngle, anticlockwise)
			        ctx.arc(j * 100 + 50, i * 100 + 50, 40, 0, Math.PI*2, true);
			        
			        // Actual draw of the border
	         		ctx.stroke();
	         		
	         		// Check if we need to fill the border
	         		if(lightField[i][j] == "x") {
	         			ctx.fillStyle = "#FFBD38";
	         			ctx.beginPath();
	         			ctx.arc(j * 100 + 50, i * 100 + 50, 38, 0, Math.PI*2, true);
	         			ctx.fill();
	         			
	         			// Since we need to fill this field, not all the lights are off
	         			allLightsAreOff = false;
	         		}
					
				}
			}
			
			// Check if all the lights are off
			if(allLightsAreOff) {
				// User can't click anymore
				userCanClick = false;
				
				// Show message
				alert("All lights are off, you finished the game!");
			}
		}
	}
	
	/*
	* Clears the canvas
	*/
	function clear() {
		var canvas = document.getElementById("lightpanel");
		var ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, 500, 500);
	}
	
});