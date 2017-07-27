/*
* Author:      Marco Kuiper (http://www.marcofolio.net/)
*/

$(document).ready(function()
{
	// Paint with default settings
	repaint();
	
	// Paint when button has been clicked
	$("#changeEffects").click(function(){
		repaint();
	});
	
	// Clear when button has been clicked
	$("#clearBokeh").click(function(){
		// Remove all child elements from the bokeh container
		$("#bokehs").empty();
	});
	
	// Hide the title when button has been clicked
	$("#hideTitle").click(function(){
		$("#title").remove();
		$(this).remove();
	});
	
	// Hide/show options
	$("#hideOptions").toggle(function() {
		$(this).attr("value", "Show options");
		$("#configuration").animate({ top : '-320px' }, 300);
	}, function() {
		$(this).attr("value", "Hide options");
		$("#configuration").animate({ top : '0px' }, 300);
	});
	
});

// Master function that paints all the bokeh effects
function repaint() {
	
	// Retrieve all user submitted data
	var numberOfBokehs = $("#nrOfOrbs").val();
	var bokehMinSize = parseInt($("#orbMin").val());
	var bokehMaxSize = parseInt($("#orbMax").val());
	var orbColour = $("#orbColour").val();
	
	// Check if we need to create random colours
	var useRandomColours = false;
	if ( $("#orbRandom").is(":checked") ) {
		useRandomColours = true;
	}
	
	// Check if we need to create gradients
	var useGradients = false;
	if ( $("#orbGradient").is(":checked") ) {
		useGradients = true;
	}
	
	// Generate the bokeh orbs
	for(var i = 0; i < numberOfBokehs; i++) {
		
		// Generate a random bokeh size
		var bokehSize = randomXToY(bokehMinSize, bokehMaxSize);
		
		if(useRandomColours) {
			// Generate the random bokeh colour
			var bokehColour = randomColour();
		} else {
			// Use the given RGB code
			var bokehColour = orbColour;
		}
		
		// Create the bokeh
		var bokeh = $("<div />")
			.addClass("bokeh")
			.css({
					'left' : Math.floor(Math.random()* screen.width ) + 'px',
					'top' : Math.floor(Math.random()* screen.height ) + 'px',
					'width' : bokehSize + 'px',
					'height' : bokehSize + 'px',
					'-moz-border-radius' : Math.floor(bokehSize)/2 + 'px',
					'-webkit-border-radius' : Math.floor(bokehSize)/2 + 'px',
					'border' : '1px solid rgba(' + bokehColour + ', 0.7)'
				});
				
		if(useGradients){
			bokeh.css({
				// Gradients for Firefox
				'background' : '-moz-radial-gradient( contain, rgba('+ bokehColour +', 0.1), rgba(' + bokehColour + ',0.4))',
				// Freaking ugly workaround to make gradients work for Safari too, by applying it to the background-image
				'background-image' : '-webkit-gradient(radial, center center, 0, center center, 70.5, from(rgba('+ bokehColour +', 0.1)), to(rgba(' + bokehColour + ',0.4)))'
			});
		} else {
			bokeh.css({
				'background' : 'rgba(' + bokehColour + ', 0.3)'
			});
		}
	
		// Append to container
		bokeh.appendTo("#bokehs");
	}
}

// Function to get a random value between two values
// http://roshanbh.com.np/2008/09/get-random-number-range-two-numbers-javascript.html
function randomXToY(minVal,maxVal,floatVal) {
  var randVal = minVal+(Math.random()*(maxVal-minVal));
  return typeof floatVal=='undefined'?Math.round(randVal):randVal.toFixed(floatVal);
}

// Function to generate a random colour in RBA
// Modified from: http://develobert.blogspot.com/2008/06/random-color-generation-with-javascript.html
function randomColour() {
	var rint = Math.round(0xffffff * Math.random());
	return (rint >> 16) + ',' + (rint >> 8 & 255) + ',' + (rint & 255);
}