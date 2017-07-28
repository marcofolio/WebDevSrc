/*
* Author:      Marco Kuiper (http://www.marcofolio.net/)
*/

// Speed of the dropping orbs
var DROPPINGSPEED = 5000;

// Time when a new orb gets created
var NEWORBTIME = 1300;

// The minimum top margin when an orb is still correct
var MINTOPMARGIN_CORR = 430;

// The maximum top margin when an orb is still correct
var MAXTOPMARGIN_CORR = 460;

// The minimum top margin when an orb is wrong
var MINTOPMARGIN_WRNG = 390;

// The maximium margin when an orb is wrong
var MAXTOPMARGIN_WRNG = 470;

// The gametime (in seconds) this game will be played
var GAMETIMER = 91;

// Amount of missed orbs before it slows back
var DROPAMOUNT = 5;

// One out of X is a bonus orb
var BONUSAMOUNT = 30;

// How much is one bonus orb worth?
var BONUSWORTH = 10;

var orbsmiss;
var orbhit;
var secondsleft;
var creationtime;
var currtimer;
var gameisplaying;
var nrdropped;

google.load("jquery", "1.3.1");
google.setOnLoadCallback(function()
{
	$("#jheroboard").fadeTo("slow", 0.33);
	
	$("#jherostart").click(function() {
		startNewGame();
	});
});

/**
* Main function to start the game.
*/
function startNewGame() {
	$("#jheroboard").fadeTo("slow", 1);
	$("#startscreen").hide();
	
	nrdropped = 0;
	orbsmiss = 0;
	orbhit = 0;
	secondsleft = GAMETIMER;
	creationtime = NEWORBTIME;
	gameisplaying = true;
	
	$("#jherostart").hide();
	$(".stats").fadeIn();

	startTimer();
	createNewOrb();
	
	// Register keypress events on the whole document
	// From: http://www.marcofolio.net/webdesign/advanced_keypress_navigation_with_jquery.html
	$(document).keydown(function(e) {
		$("#jherocharcontainer ul li:eq(" + (e.keyCode - 65) + ")").css({'color' : '#497161',
			'text-shadow' : '#EEE 0 2px 0', 'background-image' : 'url(images/pressed.png)'});
				
		$(".droppingchar").each(function(){
			if($(this).data("charcode") == e.keyCode) {
				var topmargin = retrieveMargin($(this).css("margin-top"));
				if(topmargin > MINTOPMARGIN_WRNG && topmargin < MAXTOPMARGIN_WRNG){
					if(topmargin > MINTOPMARGIN_CORR && topmargin < MAXTOPMARGIN_CORR) {
						correctOrb($(this));
					} else {
						missedOrb($(this), true);
					}
				}
			}
		});
		
	});
	
	$(document).keyup(function(e) {
		$("#jherocharcontainer ul li:eq(" + (e.keyCode - 65) + ")").css({'color' : '#EEEEEE',
			'text-shadow' : '#000 0 2px 0', 'background-image' : 'url(images/plain.png)'});
	});
}

/**
* Starts the timer
*/
function startTimer() {
	var timer = setTimeout("startTimer()", 1000);
	secondsleft--;
	$("#timerstats").html(secondsleft);
	
	if(secondsleft <= 0) {
		window.clearTimeout(timer);
		stopGame();
	}
	
	return false;
}

function stopGame() {
	gameisplaying = false;
	window.clearTimeout(currtimer);
	
	$(".droppingchar").each(function(){
		$(this).stop();
		$(this).remove();
	});
	
	var gameover = document.createElement("div");
	$(gameover).attr("class", "gameoverscreen");
	$(gameover).html("<img src='images/game-over.png' /><h2>Time up</h2><p>Final Score:</p>" + 
		"<table align='center'><tr><td width='250' align='center'><p class='counter'>"+orbhit+"</p><p>hits</p></td>" + 
		" <td width='250' align='center'><p class='counter'>"+orbsmiss+"</p><p>misses</p></td></tr></table>" +
		"<h2>Retry?</h2>");
	$(gameover).css("cursor", "pointer");
	$(gameover).slideDown("slow");
	
	$(gameover).click(function() {
		location.reload(true);
	});
	
	$(gameover).prependTo("#jheroboard");
}

/**
* Function to create a new, random orb
*/
function createNewOrb() {
	currtimer = setTimeout("createNewOrb()", creationtime);
	
	var newchar = document.createElement("p");
	$(newchar).attr("class", "orb");
	var newcharcode = getRandomCharCode();
	$(newchar).html(String.fromCharCode(newcharcode));
	var neworb = document.createElement("div");
	$(neworb).attr("class", "droppingchar");
	$(neworb).data("charcode", newcharcode);
	$(neworb).css({ marginLeft: ((newcharcode - 65) * 24) + "px", 'display' : 'none' });
	
	var randomBonus = Math.floor(Math.random()*BONUSAMOUNT);
	if(randomBonus == 1) {
		$(neworb).data("bonus", true);
	}

	$(newchar).appendTo(neworb);
	$(neworb).appendTo("#droppingcharcontainer");
	dropOrb($(neworb));
	return false;
}

/**
* Animate a dropping orb
*/
function dropOrb(orb){
	
	if(orb.data("bonus")){
		orb.children().css({'background-image' : 'url(images/bonus.png)'});
	}
	
	orb
		.fadeIn()
		.animate({
			marginTop : (orb.parent().parent().height() - orb.height() - 7) + 'px'
		}, {
			duration: DROPPINGSPEED,
			easing: 'linear',
			complete: function() {
				missedOrb(orb, false)
			}
		});
	return false;
}

/**
* Happens when the user missed an orb (too late) or was too early
*/
function missedOrb(orb, falling){
	nrdropped++;
	
	if(nrdropped > DROPAMOUNT) {
		if (creationtime > NEWORBTIME - 100) {
			creationtime = creationtime + 75;
		} else if (creationtime > NEWORBTIME - 250) {
			creationtime = creationtime + 50;
		} else if (creationtime > NEWORBTIME - 500) {
			creationtime = creationtime + 25;
		} else if (creationtime > NEWORBTIME - 700) {
			creationtime = creationtime + 10;
		} else if (creationtime > NEWORBTIME - 800) {
			creationtime = creationtime + 5;
		}
	}
	
	if(falling) {
		orb.stop();
	}
	
	if(gameisplaying){
		orbsmiss++;
	}
	orb.children().css({'background-image' : 'url(images/miss.png)'});
	orb.fadeOut(function() {
		orb.remove();
	});
	
	$("#missedstats").html(orbsmiss);
	
	return false;
}

/**
*  When the user pressed the correct character matching the orb, this function should be called
*/
function correctOrb(orb) {
	nrdropped = 0;
	if (creationtime > NEWORBTIME - 100) {
		creationtime = creationtime - 75;
	} else if (creationtime > NEWORBTIME - 250) {
		creationtime = creationtime - 50;
	} else if (creationtime > NEWORBTIME - 500) {
		creationtime = creationtime - 25;
	} else if (creationtime > NEWORBTIME - 700) {
		creationtime = creationtime - 10;
	}
	
	if(orb.data("bonus")) {
		orbhit = orbhit + BONUSWORTH;
	} else {
		orbhit++;
	}
	
	orb.stop();
	orb.children().css({'background-image' : 'url(images/correct.png)'});
	orb.fadeOut(function() {
		orb.remove();
	});
	$("#hitstats").html(orbhit);
	return false;
}

/**
* Get a random char code
* From: http://www.marcofolio.net/games/jcharacterfall_a_small_addictive_jquery_game.html
*/
function getRandomCharCode() {
	return 65 + Math.round(Math.random() * 25);
}

/*
* When retrieving "margin-top", a "#px" will be returned.
* This function strips the "px" to only retrieve the number.
*/
function retrieveMargin(margin) {
	return parseInt(margin.substring(0, margin.length - 2));
}