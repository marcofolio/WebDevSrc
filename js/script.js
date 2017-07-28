/*
* Author:      Marco Kuiper (http://www.marcofolio.net/)
*/

var currentDroplet;
var curDropletID;
var newDropletSpeed;
var nrlives;
var score;
var charIsFalling;
var gamedifficulty;

$(document).ready(function()
{	
	$("#waterfall").fadeTo("slow", 0.33);
	
	$("#diffeasy").click(function() {
		gamedifficulty = 'easy';
		startNewGame();
	});
	
	$("#diffhard").click(function() {
		gamedifficulty = 'hard';
		startNewGame();
	});
	
});

/**
* Main function to start the game.
*/
function startNewGame() {
	$("#waterfall").fadeTo("slow", 1);
	$(".stats").fadeIn();
	
	$("#gamestart").hide();
	
	currentDroplet = '';
	curDropletID = '';
	newDropletSpeed = 2000;
	nrlives = 5;
	score = 0;
	charIsFalling = false;
	
	updateStats();

	// Register keypress events on the whole document
	// From: http://www.marcofolio.net/webdesign/advanced_keypress_navigation_with_jquery.html
	$(document).keydown(function(e) {
		if(e.keyCode == currentDroplet) {
			corrDropletChar();
		} else {
			if(gamedifficulty == 'hard' && charIsFalling) {
				wrongDropletChar();
			}
		}
	});
	
	
}

/**
* Updates the current character in the droplet into a random character.
*/
function changeCurrentDroplet() {
   currentDroplet = 65 + Math.round(Math.random() * 25);
}

/**
* Created a unique droplet.
*/
function createDroplet() {
	changeCurrentDroplet();
	
	var newdroplet = document.createElement("div");
	$(newdroplet).attr("class", "fallingchar");
	var tempId = "waterdrop" + Math.floor(Math.random()*3003);
	$(newdroplet).attr("id", tempId);
	curDropletID = tempId;
	
	var leftMargin = (Math.ceil(Math.random() * ($("#waterfall").width() - 31)));
	$(newdroplet).css({ marginLeft: leftMargin + "px" });
	
	var dropletchar = document.createElement("p");
	$(dropletchar).html(String.fromCharCode(currentDroplet));
	$(dropletchar).appendTo(newdroplet);
	$(newdroplet).appendTo("#waterfall");
	
	charFall(tempId, newDropletSpeed);
}

/**
* Animates a character falling.
*/
function charFall(id, fallingtime) {
	charIsFalling = true;
	var droplet = $("#" + id);
	droplet.animate({
			marginTop : (droplet.parent().height() - droplet.height()) + 'px'
		}, {
			duration: fallingtime,
			easing: "easeInCubic",
			complete: function() {
				splashChar(id);	
			}
	});
}

/**
* When a droplet hits the ground, this function is called.
* The number of lives goes down.
*/
function splashChar(id){
	charIsFalling = false;
	currentDroplet = '';
	nrlives--;
	$("#" + id).effect('puff');
	
	updateStats();
}

/**
* Called when the user pressed the correct character.
* Score goes up and determines next droplet speed.
*/
function corrDropletChar() {
	charIsFalling = false;
	score++;
	
	$("#" + curDropletID)
		.stop()
		.fadeOut();
	
	if (newDropletSpeed > 1500) {
		newDropletSpeed = newDropletSpeed - 75;
	} else if (newDropletSpeed > 1000) {
		newDropletSpeed = newDropletSpeed - 50;
	} else {
		newDropletSpeed = newDropletSpeed - 25;
	}
	
	updateStats();
}

/**
* Called when the user pressed the wrong character in hard mode
* removing one life.
*/
function wrongDropletChar() {
	currentDroplet = '';
	charIsFalling = false;
	nrlives--;
   
   	$("#" + curDropletID)
		.stop()
		.effect('explode');
		
	updateStats();
}

/**
* Needed to update all the current stats and create new droplets.
*/
function updateStats(){
	
	$("#lifestats").html(nrlives);
	$("#pointstats").html(score);
	
	if(nrlives > 0) {	
		setTimeout("createDroplet()", 500);
	} else {
		charIsFalling = false;
		
		var gameover = document.createElement("div");
		$(gameover).attr("class", "gameoverscreen");
		$(gameover).attr("id", "gameoverscreen");
		$(gameover).html("<img src='images/game-over.png' /><h2>Game Over</h2><p>You managed to save</p><p class='counter'>"+score+"</p><p>characters.</p><h2>Retry?</h2>");
		$(gameover).css("cursor", "pointer");
		
		$(gameover).click(function() {
			location.reload(true);
		});
		
		$(gameover).prependTo("#waterfall");
	}
}
