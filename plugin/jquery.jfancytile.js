/*
* Author:      Marco Kuiper (http://www.marcofolio.net/)
*/

(function($){
    $.jfancytile = function(el, options){
        var base = this;
        
        base.$el = $(el);
        base.el = el;
        
        base.$el.data("jfancytile", base);
        
        base.init = function(){
            base.options = $.extend({},$.jfancytile.defaultOptions, options);
            
            // Safari and Chrome load JS and CSS parallel. Therefor, image size can be wrong
			// since the JS can be finished, while the CSS isn't. The following lines waits
			// until the CSS is ready, so we can retrieve the correct data.
			// via StackOverflow: http://tinyurl.com/kp6lqj
			if (jQuery.browser.safari && document.readyState != "complete"){
				setTimeout( arguments.callee, 100 );
				return;
			}
			
			// Calculate the max container dimensions
			// and save the image data
			var imageData = { };
			var container = { width : 0, height : 0 };
			
			base.imageCounter = 0;
			$("ul li img", base.$el).each(function() {
				// Retrieve the image data
				imageData[base.imageCounter] = {
					src : $(this).attr("src"),
					title : $(this).attr("alt"),
					width : $(this).width(),
					height : $(this).height()
				};
				base.imageCounter++;

				// Get the max container dimensions
				if( $(this).width() > container.width ) {
					container.width = $(this).width();
				}
				
				if( $(this).height() > container.height ) {
					container.height = $(this).height();
				}
			});
			
			// Remove all list items
			$("ul", base.$el).remove();

			// Create backwards navigation
			var navBack = $("<div />")
								.attr("class", "jfancytilenav jfancytileBack")
								.css({
									height : container.height
								})
								.click(function(){
									navigate("back");
								})
								.appendTo(base.$el);
								
			// Create forwards navigation
			var navForward = $("<div />")
								.attr("class", "jfancytilenav jfancytileForward")
								.css({
									"height" : container.height,
									"margin-left" : container.width - 50,
								})
								.click(function(){
									navigate("forward");
								})
								.appendTo(base.$el);
			
			// Create host container
			var hostContainer = $("<div/>")
										.attr("class", "jfancytileContainer")
										.css({
											width : container.width,
											height : container.height
										})
										.appendTo(base.$el);

			// Calculate the number of tiles needed
			var totalNrOfTiles = base.options.rowCount * base.options.columnCount;
			
			// Create the tiles
			var first = true;
			for(var img in imageData) {
				
				// Create image container
				var imageContainer = $("<div />")
											.css({
												"width" : imageData[img].width,
												"height" : imageData[img].height,
												"position" : "absolute",
											});
											
				// Position it in the center of the container
				if(imageData[img].width < container.width) {
					var margin = Math.floor((container.width - imageData[img].width) / 2);
					imageContainer.css({ "margin-left" : margin + "px" });
				}
				
				if(imageData[img].height < container.height) {
					var margin = Math.floor((container.height - imageData[img].height) / 2);
					imageContainer.css({ "margin-top" : margin + "px" });			
				}
				
				
				// Easy handler for the first, since we need to hide the others					
				if(first) {
					imageContainer.attr("class", "jfancyfirst");
					first = false;
				}
				imageContainer.appendTo($(hostContainer));
				
				// Append the title
				var titleContainer = $("<h3 />")
											.html(imageData[img].title)
											.attr("class", "jfancytileTitle")
											.appendTo($(imageContainer));
				
				// Calculate tile size
				var tileDimension = { width : Math.floor((imageData[img].width / base.options.columnCount)), height : Math.floor((imageData[img].height / base.options.rowCount)) };
				
				// Create the tiles
				// Take note we record at which row and column we are, since we need to position the background position for each tile seperately
				var tilePosition = { x : 0, y : 0 };
				for(var i = 0; i < totalNrOfTiles; i++) {
					var tile = $("<div />")
									.css({
										"float" : "left",
										"position" : "relative",
										"width" : tileDimension.width,
										"height" : tileDimension.height,
										"background-image" : "url(" + imageData[img].src + ")",
										"background-position" : "-" + (tilePosition.x * tileDimension.width) + "px -" + (tilePosition.y * tileDimension.height) + "px"
									})
									.appendTo($(imageContainer));
		
					tilePosition.x++;
					if(tilePosition.x > base.options.columnCount - 1) { // Minus one, since tilePosition is zero based
						tilePosition.x = 0;
						tilePosition.y++;
					}
				}
			};
			
			// Hide all the images, except the first one
			base.$el.children().not("div.jfancytilenav").children().not(".jfancyfirst").children().not("h3").each(function() {
				// Place on random position
				var amount = Math.floor(Math.random() * base.options.maxTileShift+1);
				var tileDimension = { width : $(this).width() * amount, height : $(this).height() * amount };
				
				// Place on a random direction
				var direction = Math.floor(Math.random() * 4);
				switch (direction)
				{
					case 0:
						$(this).css({ top: tileDimension.height, opacity : 0 });
					break;
					case 1:
						$(this).css({ left: tileDimension.width, opacity : 0 });
					break;
					case 2:
						$(this).css({ top: '-' + tileDimension.height + 'px', opacity : 0 });
					break;
					case 3:
						$(this).css({ left: '-' + tileDimension.width + 'px', opacity : 0 });
					break;
				}
			});
			base.$el.children().not("div.jfancytilenav").children().not(".jfancyfirst").children().not("div").fadeOut(0);
        };
        
        var currentZindex = 1;
		var currentImageIndex = 0;
		var navigate = function(direction){
			
			// Search for the tiles we need to animate, by searching from the root
			base.$el.children().not("div.jfancytilenav").children().eq(currentImageIndex).children().not("h3").each(function() {
					
				// The tiles should only move a maximum of 'maxTileShift' times their dimension
				var amount = Math.floor(Math.random() * base.options.maxTileShift+1);
				var tileDimension = { width : $(this).width() * amount, height : $(this).height() * amount };
					
				// Animate to a random direction
				var direction = Math.floor(Math.random() * 4);
				switch (direction)
				{
					case 0:
						$(this).animate({ top: '+=' + tileDimension.height, opacity:0 }, base.options.outSpeed, base.options.outEasing);
					break;
					case 1:
						$(this).animate({ left: '+=' + tileDimension.width, opacity:0 }, base.options.outSpeed, base.options.outEasing);
					break;
					case 2:
						$(this).animate({ top: '-=' + tileDimension.height, opacity:0 }, base.options.outSpeed, base.options.outEasing);
					break;
					case 3:
						$(this).animate({ left: '-=' + tileDimension.width, opacity:0 }, base.options.outSpeed, base.options.outEasing);
					break;
				}
			});
				
			// Fade out the title
			base.$el.children().not("div.jfancytilenav").children().eq(currentImageIndex).children().not("div").fadeOut(base.options.outSpeed);
			
			// Show the next image based on the direction
			// We also check if we're at the end of the slideshow and show the first one
			// if we're at the first one and navigating back, we show the last one etc.
			if(direction == "back") {
				if(currentImageIndex != 0) {
					currentImageIndex--;
				} else {
					currentImageIndex = base.imageCounter -1;
				}
			} else if (direction == "forward") {
				if(currentImageIndex != base.imageCounter - 1) { // Minus one, zero based
					currentImageIndex++;
				} else {
					currentImageIndex = 0;
				}
			}

			// Bring the container to the foreground
			currentZindex++;
			base.$el.children().not("div.jfancytilenav").children().eq(currentImageIndex).css({ "z-index" : currentZindex });
			
			base.$el.children().not("div.jfancytilenav").children().eq(currentImageIndex).children().not("h3").each(function() {
				// Animate them back
				$(this).animate({ top : 0, left:0, opacity:1 }, base.options.inSpeed, base.options.inEasing);
			});
			
			base.$el.children().not("div.jfancytilenav").children().eq(currentImageIndex).children().not("div").fadeIn(base.options.inSpeed);
		};
        
        // Run initializer
        base.init();
    };
    
    $.jfancytile.defaultOptions = {
    	inEasing: "swing",
    	outEasing: "swing",
        inSpeed: 1000,
        outSpeed: 1000,
        rowCount: 8,
        columnCount: 13,
        maxTileShift: 3
    };
    
    $.fn.jfancytile = function(options){
        return this.each(function(){
            (new $.jfancytile(this, options));
        });
    };
    
})(jQuery);
