import Brain, { Ball, Brick, Paddle, Score } from "./brain.js";

/**
 * Class representing the user interface (UI) of the game.
 * Handles rendering of game elements on the screen.
 */

export default class UI {
    // real screen dimensions
    width: number = 1000;
    height: number = 1000;

    brain: Brain;
    appContainer: HTMLElement;

    scaleX = 1;
    scaleY = 1;


    /**
     * Constructs a new UI object.
     * @param {Brain} brain - The brain object containing game logic.
     * @param {HTMLElement} appContainer - The container element for the game UI.
     */
    constructor(brain: Brain, appContainer: HTMLElement) {
        this.brain = brain;
        this.appContainer = appContainer;
        this.setScreenDimensions(1000, 1000);

    }

    /**
     * Sets the dimensions of the game screen.
     * @param {number} [width] - The width of the game screen.
     * @param {number} [height] - The height of the game screen.
     */
    setScreenDimensions(width: number, height: number) {
        this.width = width || document.documentElement.clientWidth;
        this.height = height || document.documentElement.clientHeight;

        this.scaleX = this.width / this.brain.width;
        this.scaleY = this.height / this.brain.height;

    }

    setScreenDimensionsNew(): void {
        this.width = document.documentElement.clientWidth || window.innerWidth;
        this.height = document.documentElement.clientHeight || window.innerHeight;
    
        this.scaleX = this.width / this.brain.width;
        this.scaleY = this.height / this.brain.height;
    }

    /**
     * Calculates the scaled X-coordinate based on the screen dimensions.
     * @param {number} x - The X-coordinate to scale.
     * @returns {number} - The scaled X-coordinate.
     */
    calculateScaledX(x: number) {
        return x * this.scaleX | 0;
    }

    /**
     * Calculates the scaled Y-coordinate based on the screen dimensions.
     * @param {number} y - The Y-coordinate to scale.
     * @returns {number} - The scaled Y-coordinate.
     */
    calculateScaledY(y: number) {
        return y * this.scaleY | 0;
    }

    /**
     * Draws a single border element on the screen.
     * @param {number} left - The left position of the border.
     * @param {number} top - The top position of the border.
     * @param {number} width - The width of the border.
     * @param {number} height - The height of the border.
     * @param {string} color - The color of the border.
     */
    drawBorderSingle(left: number, top: number, width: number, height: number, color: string) {
        let border = document.createElement('div');

        border.style.zIndex = '10';
        border.style.position = 'fixed';

        border.style.left = left + 'px';
        border.style.top = top + 'px';

        border.style.width = width + 'px';
        border.style.height = height + 'px';
        border.style.backgroundColor = color;

        this.appContainer.append(border);
    }

    /**
     * Draws the borders around the game area.
     */
    drawBorder() {
        // top border
        this.drawBorderSingle(0, 0, this.width, this.calculateScaledY(this.brain.borderThickness), 'red');
        // left
        this.drawBorderSingle(0, 0, this.calculateScaledX(this.brain.borderThickness), this.height, 'red');
        // right
        this.drawBorderSingle(this.width - this.calculateScaledX(this.brain.borderThickness), 0, this.calculateScaledX(this.brain.borderThickness), this.height, 'red');
        this.drawBorderSingle(0, this.height - this.calculateScaledY(this.brain.borderThickness), this.width, this.calculateScaledY(this.brain.borderThickness), 'red');
    }

    /**
     * Draws the paddle on the screen.
     * @param {Paddle} paddle - The paddle object to draw.
     */
    drawPaddle(paddle: Paddle) {
        if (!paddle) return; // Check if paddle is null or undefined
    
        let div = document.createElement('div');
    
        div.style.zIndex = '10';
        div.style.position = 'fixed';
    
        div.style.left = this.calculateScaledX(paddle.left) + 'px';
        div.style.top = this.calculateScaledY(paddle.top) + 'px';
    
        div.style.width = this.calculateScaledX(paddle.width) + 'px';
        div.style.height = this.calculateScaledY(paddle.height) + 'px';
    
        div.style.backgroundColor = paddle.color;
    
        this.appContainer.append(div);
    }

    /**
     * Draws the ball on the screen.
     * @param {Ball} ball - The ball object to draw.
     */
    drawBall(ball: Ball) {
        if (!ball) return;
    
        let div = document.createElement('div');
    
        div.style.zIndex = '10';
        div.style.position = 'fixed';
    
        div.style.left = this.calculateScaledX(ball.left) + 'px';
        div.style.top = this.calculateScaledY(ball.top) + 'px';
    
        div.style.width = this.calculateScaledX(ball.width) + 'px';
        div.style.height = this.calculateScaledY(ball.height) + 'px';
    
        div.style.borderRadius = 80 + '%';

        div.style.backgroundColor = ball.color;
    
        this.appContainer.append(div);
    }

    /**
     * Draws the bricks on the screen.
     * @param {Array<Brick>} bricks - An array of brick objects to draw.
     */
    drawBricks(bricks: Array<Brick>) {
        bricks.forEach(brick => {
            if (brick.health > 0) {
                let div = document.createElement('div');
                let health = document.createTextNode(brick.health.toString());
                div.style.zIndex = '10';
                div.style.position = 'fixed';
    
                div.style.left = this.calculateScaledX(brick.left) + 'px';
                div.style.top = this.calculateScaledY(brick.top) + 'px';
    
                div.style.width = this.calculateScaledX(brick.width) + 'px';
                div.style.height = this.calculateScaledY(brick.height) + 'px';
    
                div.style.backgroundColor = brick.color; // Access the color property of each Brick
    

                div.style.textAlign = 'center';
    
                div.append(health);
    
                this.appContainer.append(div);
            }
        });
    }

    /**
     * Draws the play button on the screen.
     */
    drawPlayButton(){
        let div = document.createElement('button');
        let text = document.createTextNode('PLAY');
        div.style.zIndex = '10';
        div.style.position = 'fixed';
        div.style.textAlign = 'center';
        div.id = 'StartButton';

        div.style.fontSize = (this.calculateScaledX(50) + 'px');

        div.style.left = this.calculateScaledX(400) + 'px';
        div.style.top = this.calculateScaledY(400) + 'px';

        div.style.width = this.calculateScaledX(200) + 'px';
        div.style.height = this.calculateScaledY(100) + 'px';
        div.append(text);

        this.appContainer.append(div);

    }

    /**
     * 
     * @param {Score} score 
     * This function draws both current score and max score... Actually any type of score no matter where
     */

    drawScrore(score: Score, inputText: string){
        let text = document.createTextNode(inputText + ": " + score.points);
        let div = document.createElement('div');

        div.style.zIndex = '100';
        div.style.position = 'fixed';
        div.style.textAlign = 'center';

        div.style.left = this.calculateScaledX(score.left) + 'px';
        div.style.top = this.calculateScaledY(score.top) + 'px';

        div.style.width = this.calculateScaledX(0) + 'px';
        div.style.height = this.calculateScaledY(0) + 'px';

        div.append(text);

        this.appContainer.append(div);




    }

    /**
     * Draws the entire game UI on the screen.
     * @param {string} [status] - The status of the game (e.g., paused).
     */
    draw(status: string) {
        // clear previous render
        this.appContainer.innerHTML = '';
        this.setScreenDimensionsNew();

        this.drawBorder();
        this.drawPaddle(this.brain.leftPaddle);
        this.drawBall(this.brain.ball)
        this.drawBricks(this.brain.bricks);

        this.drawScrore(this.brain.bestScore, "Best Score");
        this.drawScrore(this.brain.currentScore, "Current Score");

        if (status == 'paused'){
            this.drawPlayButton();
        }
        
    }
}
