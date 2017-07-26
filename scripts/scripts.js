$(document).ready(function () {
    init_board();
    init_game();
});

function toggle_blocks() {
    if (enable_blocks) {
        // Turn blocks off
        enable_blocks = false;

        var blocks = $("div.block:visible");
        // Flash and delete the blocks
        blocks.css({ opacity: 0.8 });
        blocks.fadeOut();

        var html = "You are currently playing <b>without</b> blocks<br />";
        html += "<a href=\"\" onclick=\"toggle_blocks(); return false;\">Turn blocks on</a>";
        $("#blocks").html(html);
    }
    else {
        // Turn blocks on
        enable_blocks = true;

        var html = "You are currently playing <b>with</b> blocks<br />";
        html += "<a href=\"\" onclick=\"toggle_blocks(); return false;\">Turn blocks off</a>";
        $("#blocks").html(html);
    }
}

function init_board() {
    // Put DOM objects into variables to decrease performance
    board = $("#board");
    trace = $("#trace");
    player = $("#player");
    ball = $("#ball");
    opponent = $("#opponent");

    // Set the initial game status
    started = false;

    // Play with power up blocks?
    enable_blocks = true;  // Will be toggled to false
    toggle_blocks();

    // Get board size
    width = board.width();
    height = board.height();

    // Set initial score
    score_player = 0;
    score_opponent = 0;

    // Draw the board lines
    num_lines = 3;
    target_size = 150;  // The size of the opponent's field
    side_size = (width - target_size) / 2;
    draw_board();

    // Hide the cursor on the board (only firefox supports this)
    if ($.browser.mozilla) {
        board.mouseover(function () {
            $(this).css({ cursor: 'none' });
        });
    }
}

function draw_board() {
    // The number of pixels between the horizontal and vertical lines
    var line_distance = side_size / (num_lines + 1);

    // Draw diagonals
    board.drawLine(0, 0, side_size, side_size);
    board.drawLine(0, height, side_size, height - side_size);
    board.drawLine(width, height, width - side_size, height - side_size);
    board.drawLine(width, 0, width - side_size, side_size);

    // Draw horizontal and vertical lines
    for (i = 0; i <= num_lines + 1; i++) {
        var start = i * line_distance;
        var end = height - i * line_distance;

        var offset = i * line_distance;
        board.drawLine(offset, start, offset, end);   // Left side
        board.drawLine(start, offset, end, offset);   // Top side

        var offset = width - offset;
        board.drawLine(offset, start, offset, end);   // Right side
        board.drawLine(start, offset, end, offset);   // Bottom side
    }
}

function init_game() {
    // Set tracer dimension variables
    tracer_left = 0;
    tracer_top = 0;
    tracer_height = height;
    tracer_width = width;

    // Set ball dimension variables
    ball_left = 47.5;
    ball_top = 47.5;
    ball_vertical = 0;     // Track ball vertical movement
    ball_horizontal = 0;   // Track ball horizontal movement

    // Keep track of spin
    spin_horizontal = 0;
    spin_vertical = 0;

    // Set the initial ball speed
    game_speed = 1;
    // Set the initial direction of the ball (1 = away from player, -1 is towards player)
    direction = 1;

    // Have the player div track the mouse cursor
    $("#game").mousemove(function (e) {
        player_x = e.clientX - board.offset().left - 50;
        if (player_x < 0) {
            player_x = 0;
        }
        else if (player_x > width - 100) {
            player_x = width - 100;
        }

        player_y = e.clientY + $(window).scrollTop() - board.offset().top - 50;
        if (player_y < 0) {
            player_y = 0;
        }
        else if (player_y > height - 100) {
            player_y = height - 100;
        }

        player.css({ left: player_x, top: player_y });
    });

    // Setup start game event
    $("#game").click(start_game);
}

function start_game() {
    // Player clicked
    // Check if the player collides with the ball and the game hasn't started yet
    if (player.collidesWith(ball).length == 1 && !started) {
        // Flash player
        player.css({ opacity: 0.9 });
        player.animate({ opacity: 0.5 }, 300);

        // Set random initial ball direction
        ball_horizontal = (Math.random() - 0.5);
        ball_vertical = (Math.random() - 0.5);
        ball_x = parseInt(ball.css("left"));
        ball_y = parseInt(ball.css("top"));

        // Start game loop
        started = true;
        game_tick();
    }
}

function game_tick() {
    if (tracer_width < 1) {
        // This should never happen.. check anyway to prevent an endless loop
        return;
    }

    // Check if the ball is moving towards or away from the player
    if (direction == 1) {
        // Move away from the player

        // Set new tracer dimensions
        tracer_left += game_speed;
        tracer_top += game_speed;
        tracer_width -= game_speed * 2;
        tracer_height -= game_speed * 2;

        // Check if the ball has reached the opponent
        if (tracer_left >= side_size) {
            // Check if the opponent collides with the ball (bounce it back)
            if (opponent.collidesWith(ball).length == 0) {
                // The opponent missed the ball
                // Stop the game
                started = false;

                // Move the tracer and the ball
                update_tracer_and_ball();

                // Update score
                score_player = score_player + 1;
                $("#scoreboard").text(score_player + " - " + score_opponent);

                // Reset the game in 2 seconds
                window.setTimeout(reset_game, 2000);
                return;
            }
            else {
                // Flash opponent
                opponent.css({ opacity: 1 });
                opponent.animate({ opacity: 0.5 }, 200);

                // Change ball direction and increase game speed
                direction = -1;
                game_speed += 0.5;
            }
        }
    }
    else {
        // Move towards the player

        // Set new tracer dimensions
        tracer_left -= game_speed;
        tracer_top -= game_speed;
        tracer_width += game_speed * 2;
        tracer_height += game_speed * 2;

        // Check if the ball has reached the player
        if (tracer_left <= 0) {
            // Check if the player collides with the ball (bounce it back)
            if (player.collidesWith(ball).length == 0) {
                // Check if there are any blocks bouncing the ball back
                var blocks = ball.collidesWith($("div.block:visible"));
                if (blocks.length == 0) {
                    // Stop the game
                    started = false;

                    // Update score
                    score_opponent = score_opponent + 1;
                    $("#scoreboard").text(score_player + " - " + score_opponent);

                    // Reset the game in 2 seconds
                    window.setTimeout(reset_game, 2000);
                    return;
                }
                else {
                    // The ball hit a block

                    // If the ball hit multiple blocks, pick just one
                    if (blocks.length > 1) {
                        blocks = blocks.eq(0);
                    }

                    // Flash and delete the block
                    blocks.css({ opacity: 0.6 });
                    blocks.fadeOut();

                    // Bounce the ball back
                    direction = 1;
                }
            }
            else {
                // Flash player
                player.css({ opacity: 0.9 });
                player.animate({ opacity: 0.5 }, 300);

                // Calculate ball spin
                spin_horizontal = (player_x - old_x) / 20;
                spin_vertical = (player_y - old_y) / 20;
                // Add the spin to the ball movement
                ball_horizontal = ball_horizontal + spin_horizontal;
                ball_vertical = ball_vertical + spin_vertical;

                // If the player did alot of spin, add a block
                if (player_x - old_x > 5 || player_x - old_x < -5 ||
                    player_y - old_y > 5 || player_y - old_y < -5) {
                    add_block();
                }

                // Bounce the ball back
                direction = 1;
            }
        }
    }

    // Move the tracer and the ball
    update_tracer_and_ball();

    // Collision detection
    // Left
    if (ball_left < 0 && ball_horizontal < 0) {
        ball_horizontal = ball_horizontal * -1;
    }
    // Right
    if (ball.position().left + ball.width() > tracer_width && ball_horizontal > 0) {
        ball_horizontal = ball_horizontal * -1;
    }
    // Top
    if (ball_top < 0 && ball_vertical < 0) {
        ball_vertical = ball_vertical * -1;
    }
    // Bottom
    if (ball.position().top + ball.height() > tracer_height && ball_vertical > 0) {
        ball_vertical = ball_vertical * -1;
    }

    // Keep track of previous mouse location to calculate spin
    old_x = player_x;
    old_y = player_y;

    // Process spin
    spin_horizontal = spin_horizontal * 0.8;
    spin_vertical = spin_vertical * 0.8;
    ball_horizontal = ball_horizontal - spin_horizontal;
    ball_vertical = ball_vertical - spin_vertical;

    // Move opponent
    var cur_left = parseInt(opponent.css("left"));
    var target_x = ((ball_left / 100 * tracer_width) + (ball.width() / 2)) / tracer_width;
    var current_x = (cur_left + 15) / 150;
    var delta_x = (target_x - current_x) * -150;
    if (delta_x < -1) delta_x = -1;
    if (delta_x > 1) delta_x = 1;
    var new_x = cur_left - delta_x;
    if (new_x > 117) new_x = 117;
    if (new_x < 0) new_x = 0;

    var cur_top = parseInt(opponent.css("top"));
    var target_y = ((ball_top / 100 * tracer_height) + (ball.height() / 2)) / tracer_height;
    var current_y = (parseInt(opponent.css("top")) + 15) / 150;
    var delta_y = (target_y - current_y) * -150;
    if (delta_y < -1) delta_y = -1;
    if (delta_y > 1) delta_y = 1;
    var new_y = cur_top - delta_y;
    if (new_y > 117) new_y = 117;
    if (new_y < 0) new_y = 0;
    
    opponent.css({ left: new_x, top: new_y });

    // If the game is still going, set a timeout for the next game tick
    if (started) {
        window.setTimeout(game_tick, 10);
    }
}

function update_tracer_and_ball() {
    // Move the tracer
    trace.css({ left: tracer_left, top: tracer_top, width: tracer_width, height: tracer_height });

    // Update ball position
    ball_left = ball_left + ball_horizontal;
    ball_top = ball_top + ball_vertical;
    var left = ball_left + "%";
    var top = ball_top + "%";
    ball.css({ left: left, top: top });
}

function reset_game() {
    // Reset the ball, tracer and opponent
    ball.css({ left: "47.5%", top: "47.5%" });
    trace.css({ left: "0px", top: "0px", width: "498px", height: "498px" });
    opponent.css({ left: "40%", top: "40%" });

    // Initialize a new game round
    init_game();
}

function add_block() {
    // Is the blocks power up enabled?
    if (enable_blocks) {
        // Add a random block
        var blocks = $("div.block:hidden");
        if (blocks.length > 0) {
            var random = parseInt(Math.random() * blocks.length);
            blocks = blocks.eq(random);
            blocks.show();
            blocks.css({ opacity: 0.8 });
            blocks.animate({ opacity: 0.25 });
        }
    }
}