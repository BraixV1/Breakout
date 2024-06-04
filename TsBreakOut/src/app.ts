import Brain from "./brain";
import UI from "./ui";


/**
 * This is the main program that runs the whole game.
 */

/**
 * Ensures that the index.html page has only one base div with id 'app'.
 * Throws an error if more or less than one div is found.
 */


function validateIndexHtml() {
    if (document.querySelectorAll("#app").length != 1) {
        throw Error("More or less than one div with id 'app' found!");
    }
    if (document.querySelectorAll("div").length != 1) {
        throw Error("More or less than one div found in index.html!");
    }
}



/**
 * 
 * @param {number} health - helps to create illusion of game having levels by increasing brick health
 * @param {number} maxScore - saving the maximum score achieved after restart. Also implies that there could be a file reading function
 * to find the best achieved score. Right now has only temporary saving
 */
function main(health: number, maxScore: number, currentScore: number | null = null) {
    validateIndexHtml(); // error checking
    let appDiv = document.querySelector("#app"); // find app div
    
    if (appDiv == null || !(appDiv instanceof HTMLElement)){
        throw  Error("Check index.html because app div is missing or is not HTMLELEMENT");
    }
    let brain = new Brain(health, maxScore); // generates game
    brain.currentScore.addScore(currentScore ?? 0);
    let ui = new UI(brain, appDiv); // generates ui into the app div using data from brain
    let isPaused = true; // game pause check
    let  bounce = new Audio('audio/WallHit.mp3'); // wall bounce sound
    bounce.load(); // preload the sound effect because without it there is like 2 second delay

    /**
     * Main function that initializes and runs the game.
     * @param {number} health - The initial health of the bricks.
     */
    function gameLoop() {
        if (!isPaused) {
            brain.ball.left += brain.ball.velocityX;
            brain.ball.top += brain.ball.velocityY;

            // Perform collision detection
            let result = brain.ball.detectCollisions(brain.leftPaddle, brain.bricks, brain.borderThickness, bounce, brain.currentScore, brain.bestScore);
            console.log(brain.currentScore.points);
            if (result == 'failed'){ // restarts the game
                let points = brain.bestScore.points;
                health = 1;
                ui.appContainer.innerHTML = '';
                main(health, points);
            }
            if (result == 'continue'){ // game continues as usual
                ui.draw(result);

                requestAnimationFrame(gameLoop);
            }
            if (result == 'win'){ // all bricks are destroyed generate new level by adding one hp to all the bricks
                health += 1;
                let points = brain.bestScore.points;
                let currentPoints = brain.currentScore.points;
                ui.appContainer.innerHTML = '';
                main(health, points, currentPoints);
            }

        } else {
            ui.draw('paused');
            let button = document.getElementById('StartButton');
            if (button == null){
                throw Error ('Start button not found problem proably with UI.ts')
            }
        
            /**
             * Handles key press events to pause/unpause the game.
             * @param {KeyboardEvent} e - The keyboard event object.
             */
            button.addEventListener('click', (e) => {
                isPaused = !isPaused;
                if (!isPaused) {
                    gameLoop();
                }
                console.log(e);
            })
        }
    }


    /**
     * Handles key press events to pause/unpause the game.
     * @param {KeyboardEvent} e - The keyboard event object.
     */
    document.addEventListener('keypress', (e) => {
        if (e.key === 'p') {
            isPaused = !isPaused;
        }
    });

    /**
     * Handles key down events to move the paddle.
     * @param {KeyboardEvent} e - The keyboard event object.
     */
    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'a':
                brain.startMovePaddle(brain.leftPaddle, -1);
                break;
            case 'd':
                brain.startMovePaddle(brain.leftPaddle, 1);
                break;
        }
    });


    /**
     * Handles key up events to stop the paddle movement.
     * @param {KeyboardEvent} e - The keyboard event object.
     */
    document.addEventListener('keyup', (e) => {
        switch (e.key) {
            case 'a':
                brain.stopMovePaddle(brain.leftPaddle);
                break;
            case 'd':
                brain.stopMovePaddle(brain.leftPaddle);
                break;
        }

    });

    // Initial call to the game loop
    gameLoop();


}


// https://stackoverflow.com/questions/64752006/calculate-a-position-based-on-an-angle-a-speed-and-a-starting-position

// =============== ENTRY POINT ================
console.log("App startup...");

main(1, 0); // Entry point to start the game with initial health

