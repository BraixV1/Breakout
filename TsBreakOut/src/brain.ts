
/**
 * Class paddle class that is used to represent the paddle that will move left to write when pressing a key and then 
 * 
 * paddle has following base parameters
 * 
 * width - reprsenting the width of the paddle
 * height - representing the height of the paddle
 * left - how many pixel is the paddle from left side of the screen
 * top - how many pixels is the paddle from top side of the screen
 * color - what color is the paddle
 */

export class Paddle {
    width = 150;
    height = 25;
    left: number;
    top: number;

    color: string;

    #intervalId: number | null = null;
;

    /**
     * this is the constructor for the paddle that takes in following parameters to overwrite the base values
     * @param {number} left 
     * @param {number} top 
     * @param {string} color 
     */

    constructor(left: number, top: number, color: string) {
        this.left = left;
        this.top = top;
        this.color = color;
    }

    /**
     * Validates and fixes the position of the paddle.
     * @param {number} borderThickness - The thickness of the game border.
     */
    validateAndFixPosition(borderThickness: number) {
        if (this.left < borderThickness) {
            this.left = borderThickness;
            clearInterval(this.#intervalId as number);
            this.#intervalId = null;
        }

        if ((this.left + this.width) > 1000 - borderThickness) {
            this.left = (1000 - borderThickness) - (this.width);
            clearInterval(this.#intervalId as number);
            this.#intervalId = null;
        }

    }


    /**
     * Starts moving the paddle by a specified step.
     * @param {number} step - The step by which the paddle moves.
     * @param {number} borderThickness - The thickness of the game border.
     */
    startMove(step: number, borderThickness: number) {
        if (this.#intervalId !== null) return;

        //this.top += step * 10;
        //this.validateAndFixPosition(borderThickness);

        this.#intervalId = setInterval(() => {
            this.left += step * 30;
            // 0 - border
            this.validateAndFixPosition(borderThickness);

        }, 40);

        //step = undefined;
    }

    /**
     * Stops the movement of the paddle.
     * @param {number} borderThickness - The thickness of the game border.
     */
    stopMove(borderThickness: number) {
        console.log(this.#intervalId);
        if (!this.#intervalId) return;
        clearInterval(this.#intervalId);
        this.#intervalId = null;
        this.validateAndFixPosition(borderThickness);
    }
}

/**
 * Class representing a Ball within the game.
 * The ball moves within the game area and interacts with other game elements.
 */
export class Ball {
    // Properties
    width = 25; // width of the ball
    height = 25; // height of the ball
    radius = 15; // radius of the ball
    left = 450; // how many pixels from left of the screen
    top = 600; // how many pixels from top of the screen
    color = 'blue';
    velocityX = 5;
    velocityY = -5;

    /**
     * Constructs a new Ball object.
     * @param {number} left - The left position of the ball.
     * @param {number} top - The top position of the ball.
     * @param {string} color - The color of the ball.
     */
    constructor(left: number, top: number, color: string) {
        this.left = left;
        this.top = top;
        this.color = color;
    }

    /**
     * Detects collisions with the paddle, bricks, and game borders.
     * @param {Paddle} paddle - The paddle object.
     * @param {Array<Brick>} bricks - An array of brick objects.
     * @param {number} borderThickness - The thickness of the game border.
     * @param {Audio} audio - The audio object used for collision sound effects.
     * @returns {string} - The result of the collision detection.
     */
  
    detectCollisions(paddle: Paddle, bricks: Array<Brick>, borderThickness: number, audio: HTMLAudioElement, scoreCurrent: Score, scoreMax: Score) {
        this.detectPaddleCollision(paddle);
        let result = this.detectBrickCollision(bricks, scoreCurrent, scoreMax);
        if (result === "win") {
            return "win";
        }
        result = this.detectWallCollision(borderThickness, audio, scoreCurrent);
        return result;

    }

    /**
     * Detects collision with the paddle.
     * @param {Paddle} paddle - The paddle object.
     */
    detectPaddleCollision(paddle: Paddle){
        if (
            this.left + this.radius > paddle.left &&
            this.left - this.radius < paddle.left + paddle.width &&
            this.top + this.radius > paddle.top &&
            this.top - this.radius < paddle.top + paddle.height
        ) {
            let speed = 5;
    
            let relativeImpactPoint = (this.left - paddle.left) / paddle.width;
    
            let angleDegrees = 45 * (2 * relativeImpactPoint - 1);
    
            let angleRadians = angleDegrees * Math.PI / 180;
    
            this.velocityX = Math.cos(angleRadians) * speed;
            this.velocityY = -Math.sin(angleRadians) * speed;
        }
    }
    
    /**
     * Detects collision with the game borders.
     * @param {number} borderThickness - The thickness of the game border.
     * @param {Audio} audio - The audio object used for collision sound effects.
     * @returns {string} - The result of the wall collision detection.
     */
    detectWallCollision(borderThickness: number, audio: HTMLAudioElement, scoreCurrent: Score){
        let result = 'continue';
        if (this.left < borderThickness || this.left + this.radius > 1000 - borderThickness) {
            audio.play();
            this.velocityX = -this.velocityX;
        }
        if (this.top - this.radius < borderThickness) {
            this.velocityY = -this.velocityY;
        }
        if (this.top + this.radius > 1000 - borderThickness) {
            scoreCurrent.points = 0;
            result = 'failed';
        }
        return result;
    }

    /**
     * Detects collision with bricks.
     * @param {Array<Brick>} bricks - An array of brick objects.
     * @param {Score} scoreCurrent - Score object for displaying current score
     * @param {Score} scoreMax - Score object for displaying maximum score
     * @returns {string} - The result of the brick collision detection.
     */
    detectBrickCollision(bricks: Array<Brick>, scoreCurrent: Score, scoreMax: Score) {
        let result = 'win';
        bricks.forEach(brick => {
            if (
                this.left + this.radius >= brick.left &&
                this.left - this.radius <= brick.left + brick.width &&
                this.top + this.radius >= brick.top &&
                this.top - this.radius <= brick.top + brick.height &&
                brick.health > 0
            ) {
                this.velocityY = -this.velocityY;
                brick.health--;
                brick.recolor();
                scoreCurrent.points += 10;
                if (scoreCurrent.points > scoreMax.points){
                    scoreMax.points = scoreCurrent.points;
                }
                
            }
            if (brick.health > 0){
                result = 'continue';
            }
        });
        return result;
    } 
}

/**
 * Class representing a Brick within the game.
 * The bricks are obstacles for the ball and can be destroyed.
 */
export class Brick {
    width = 75; // brick width
    height = 30; // brick height
    left: number // brick x coordinate
    top: number // brick y coordinate
    health: number // brick health
    static colors = ['#e51f1f', '#f2a134', '#f7e379', '#bbdb44', '#44ce1b'];
    color: string; // health colors


    /**
     * Constructs a new Brick object.
     * @param {number} left - The left position of the brick.
     * @param {number} top - The top position of the brick.
     * @param {number} health - The health/ durability of the brick.
     */
    constructor(left: number, top: number, health: number) {
        this.left = left;
        this.top = top;
        this.health = health;
        this.color = Brick.colors[this.health-1]; // Access colors array using class name
    }

    /**
     * Recolors the brick based on its health.
     */
    recolor() {
        this.color = Brick.colors[this.health-1];
    }
}

/**
 * Class used to display the scores we have
 */
export class Score{

    top = 10;
    left = 10;
    points = 0;


    /**
     * 
     * @param {number} top 
     * @param {number} left 
     * @param {number} points - for displaying how much score is in the object
     */
    constructor(top: number, left: number, points: number){
        this.top = top;
        this.left = left;
        this.points = points;
    }

    /**
     * really only for adding boiler plate because why not :D
     * @param {number} added 
     */
    addScore(added: number){
        this.points += added;
    }


}


/**
 * Class representing the game's logic and state.
 * Manages the game elements and their interactions.
 */
export default class Brain {
    width = 1000; // max game size x coordinates
    height = 1000; // max game size y coordinates
    borderThickness = 30; // border thickness of the game

    bricks: Array<Brick>= []; // bricks in the game
    brickBaseLeft  = 0; // base left where the brick laying starts
    brickbaseTop = 40; // base top where brick laying starts

    leftPaddle = new Paddle(400, 800, 'green'); // paddle for the game
    ball = new Ball(450, 500, 'yellow'); // ball for the game

    bestScore = new Score(30, 10, 0);
    currentScore = new Score(900, 10, 0);

    
    /**
     * Constructs a new Brain object.
     * @param {number} health - The initial health of the bricks.
     * @param {number} maxScore - Highest score achieved in this game
     */
    constructor(health: number, maxScore: number) {
        console.log("Brain ctor");
        for (let index = 0; index < 10; index++) {
            if (index % 10 === 0) {
                this.brickBaseLeft = 75;
                this.brickbaseTop += 50;
            }
            this.bricks.push(new Brick(this.brickBaseLeft, this.brickbaseTop, health));
            this.brickBaseLeft += 90;
        }
        this.bestScore.points = maxScore;
    }

    /**
     * Initiates the movement of the paddle.
     * @param {Paddle} paddle - The paddle object to move.
     * @param {number} step - The step size for the paddle movement.
     */
    startMovePaddle(paddle: Paddle, step: number) {
        paddle.startMove(step, this.borderThickness);
    }

    /**
     * Stops the movement of the paddle.
     * @param {Paddle} paddle - The paddle object to stop.
     */
    stopMovePaddle(paddle: Paddle) {
        paddle.stopMove(this.borderThickness);
    }

    
}
