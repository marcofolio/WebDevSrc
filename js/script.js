/*
* Author:      Marco Kuiper (http://www.marcofolio.net/)
*/

// Speed of the animation
var animationSpeed = 600;

// Type of easing to use; http://gsgd.co.uk/sandbox/jquery/easing/
var easing = "easeOutCubic";

// Variable to store the images we need to set as background
// which also includes some text and url's.
var photos = [ {
		"title" : "Aperture",
		"cssclass" : "cam",
		"image" : "bg_cam.jpg",
		"text" : "In optics, an aperture is a hole or an opening through which light travels. More specifically, the aperture of an optical system is the opening that determines the cone angle of a bundle of rays that come to a focus in the image plane. The aperture determines how collimated the admitted rays are, which is of great importance for the appearance at the image plane. If an aperture is narrow, then highly collimated rays are admitted, resulting in a sharp focus at the image plane.",
		"url" : 'http://www.sxc.hu/photo/1270466',
		"urltext" : 'View picture'
	}, {
		"title" : "Clouds",
		"cssclass" : "clouds",
		"image" : "bg_clouds.jpg",
		"text" : "A cloud is a visible mass of water droplets or frozen ice crystals suspended in the Earth's atmosphere above the surface of the Earth or other planetary body. Clouds in the Earth's atmosphere are studied in the nephology or cloud physics branch of meteorology. Two processes, possibly acting together, can lead to air becoming saturated: cooling the air or adding water vapor to the air. Generally, precipitation will fall to the surface; an exception is virga which evaporates before reaching the surface.",
		"url" : 'http://en.wikipedia.org/wiki/Cloud',
		"urltext" : 'More info'
	}, {
		"title" : "Keyboard",
		"cssclass" : "key",
		"image" : "bg_key.jpg",
		"text" : "The incredibly thin Apple Wireless Keyboard sits on your desk surrounded by nothing but glorious space. It’s cable-free, so you’re free to type wherever you like — with the keyboard in front of your computer or even on your lap. Not only does the Apple Wireless Keyboard come standard with the new iMac, it’s perfect for any Mac with Bluetooth wireless technology.",
		"url" : 'http://www.apple.com/keyboard/',
		"urltext" : 'Get it now'
	}, {
		"title" : "Flowers",
		"cssclass" : "flowers",
		"image" : "bg_flowers.jpg",
		"text" : "A flower, sometimes known as a bloom or blossom, is the reproductive structure found in flowering plants (plants of the division Magnoliophyta, also called angiosperms). The biological function of a flower is to effect reproduction, usually by providing a mechanism for the union of sperm with eggs. Flowers may facilitate outcrossing (fusion of sperm and eggs from different individuals in a population) or allow selfing (fusion of sperm and egg from the same flower).",
		"url" : 'http://www.sxc.hu/photo/1339442',
		"urltext" : 'View picture'
	}
];

// 0-based index to set which picture to show first
var activeIndex = 0;

$(function() {

	// Variable to store if the animation is playing or not
	var isAnimating = false;

	// Register keypress events on the whole document
	$(document).keypress(function(e) {
		
		// Keypress navigation
		// More info: http://stackoverflow.com/questions/302122/jquery-event-keypress-which-key-was-pressed
		if (!e.which && ((e.charCode || e.charCode === 0) ? e.charCode: e.keyCode)) {
		    e.which = e.charCode || e.keyCode;
		}
		
		var imageIndex = e.which - 49; // The number "1" returns the keycode 49. We need to retrieve the 0-based index.
		startAnimation(imageIndex);
	});

	// Add the navigation boxes
	$.template("navboxTemplate", "<div class='navbox ${cssclass}'><ul></ul><h2>${title}</h2><p>${text}</p><p class='bottom'><a href='${url}' title='${title}'>${urltext}</a></p></div>");
	$.tmpl("navboxTemplate", photos).appendTo("#navigationBoxes");

	// Add the navigation, based on the Photos
	// We can't use templating here, since we need the index + append events etc.
	var cache = [];
 	for(var i = 1; i < photos.length + 1; i++) {
		$("<a />")
			.html(i)
			.data("index", i-1)
			.attr("title", photos[i-1].title)
			.click(function() {
				showImage($(this));
			})
			.appendTo(
				$("<li />")
					.appendTo(".navbox ul")
			);
			
		// Preload the images
		// More info: http://engineeredweb.com/blog/09/12/preloading-images-jquery-and-javascript
		var cacheImage = $("<img />").attr("src", "images/" + photos[i-1]);
		cache.push(cacheImage);
	}
	
	// Set the correct "Active" classes to determine which navbox we're currently showing
	$(".navbox").each(function(index) {
		var parentIndex = index + 1;
		$("ul li a", this).each(function(index) {
			if(parentIndex == (index + 1)) {
				$(this).addClass("active");
			}
		});
	});
	
	// Hide all the navigation boxes, except the one from current index
	$(".navbox:not(:eq(" + activeIndex +"))").css('left', '-450px');
	
	// Set the proper background image, based on the active index
	$("<div />")
		.css({ 'background-image' : "url(images/" + photos[activeIndex].image + ")" } )
		.prependTo("#pictureSlider");
	
	//
	// Shows an image and plays the animation
	//
	var showImage = function(docElem) {
		// Retrieve the index we need to use
		var imageIndex = docElem.data("index");
		
		startAnimation(imageIndex);
	};
	
	//
	// Starts the animation, based on the image index
	//
	var startAnimation = function(imageIndex) {
		// If the same number has been chosen, or the index is outside the
		// photos range, or we're already animating, do nothing
		if(activeIndex == imageIndex ||
			imageIndex > photos.length - 1 ||
			imageIndex < 0 ||
			isAnimating) {
			return;
		}
		
		isAnimating = true;
		animateNavigationBox(imageIndex);
		slideBackgroundPhoto(imageIndex);
		
		// Set the active index to the used image index
		activeIndex = imageIndex;		
	};
	
	//
	// Animate the navigation box
	//
	var animateNavigationBox = function(imageIndex) {
	
		// Hide the current navigation box
		$(".navbox").eq(activeIndex)
			.css({ 'z-index' : '998' }) // Push back
			.animate({ left : '-450px' }, animationSpeed, easing);
		
		// Show the accompanying navigation box
		$(".navbox").eq(imageIndex)
			.css({ 'z-index' : '999' }) // Push forward
			.animate({ left : '0px' }, animationSpeed, easing);
	};
	
	//
	// Slides the background photos
	//
	var slideBackgroundPhoto = function(imageIndex) {
		// Retrieve the accompanying photo based on the index
		var photo = photos[imageIndex];

		// Create a new div and apply the CSS
		$("<div />")
			.css(
				{ 	'left' : '-2000px',
					'background-image' : "url(images/" + photo.image + ")" } )
			.addClass(photo.cssclass)
			.prependTo("#pictureSlider");

		// Slide all the pictures to the right
		$("#pictureSlider div").animate({ left : '+=2000px' }, animationSpeed, easing, function() {
			// Remove any picture that is currently outside the screen, only the first is visible
			$("#pictureSlider div:not(:first)").remove();
			
			// Animation is complete
			isAnimating = false;
		});
	};
	
});