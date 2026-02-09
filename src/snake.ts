import { Game } from './game';

interface Point {
    x: number;
    y: number;
}

type Direction = 'up' | 'down' | 'left' | 'right';

class Snake extends Game {
    private dirX: number;
    private dirY: number;
    private readonly food: Point;
    private readonly snake: Point[];

    private static readonly WIDTH = 500;
    private static readonly HEIGHT = 500;
    private static readonly PLAYER_SIZE = 20;

    constructor(canvas: HTMLCanvasElement | null, snake: Point[], food: Point, startingDir: Direction, enableDebugging?: boolean) {
        super(canvas, enableDebugging);

        this.snake = snake;
        this.food = food;

        this.dirX = startingDir === 'left' ? -1 : startingDir === 'right' ? 1 : 0;
        this.dirY = startingDir === 'up' ? -1 : startingDir === 'down' ? 1 : 0;
    }

    protected tick(): void {
        this.updatePosition();
        let hasCollided: boolean = this.checkCollisions(this.snake);

        if (hasCollided) {
            this.stop();
            return;
        }

        if (this.checkEatenFood(this.snake, this.food)) {
            this.debug('food eaten');

            this.addSegment();
            this.spawnFood();
        }
    }

    protected draw(): void {
        this.debug('drawing game');

        this.ctx?.clearRect(0, 0, Snake.WIDTH, Snake.HEIGHT);

        // Draw snake
        for (let i = 0; i < this.snake.length; i++) {
            this.ctx.beginPath();
            this.ctx.rect(this.snake[i].x, this.snake[i].y, Snake.PLAYER_SIZE, Snake.PLAYER_SIZE);
            this.ctx.fillStyle = 'white';
            this.ctx.fill();
            this.ctx.closePath();
        }

        // Draw food
        this.ctx.beginPath();
        this.ctx.rect(this.food.x, this.food.y, Snake.PLAYER_SIZE, Snake.PLAYER_SIZE);
        this.ctx.fillStyle = '#FF007F';
        this.ctx.fill();
        this.ctx.closePath();
    }

    protected onKeyDown(key: string): void {
        const direction = this.keyToDirection(key);

        if (direction === null) {
            return;
        }

        // Prevent 180-degree turns
        if (direction === 'up' && this.dirY !== 1) {
            this.dirX = 0;
            this.dirY = -1;
        } else if (direction === 'down' && this.dirY !== -1) {
            this.dirX = 0;
            this.dirY = 1;
        } else if (direction === 'left' && this.dirX !== 1) {
            this.dirX = -1;
            this.dirY = 0;
        } else if (direction === 'right' && this.dirX !== -1) {
            this.dirX = 1;
            this.dirY = 0;
        }
    }

    private checkCollisions(snake: Point[]): boolean {
        if (snake[0].x < 0 || snake[0].x >= Snake.WIDTH || snake[0].y < 0 || snake[0].y >= Snake.HEIGHT) {
            this.debug('collision with edges');
            return true;
        }

        for (let point of snake.slice(1)) {
            if (snake[0].x === point.x && snake[0].y === point.y) {
                this.debug('collision with body');
                return true;
            }
        }

        return false;
    }

    private updatePosition(): void {
        this.debug(`moving snake (${this.dirX}, ${this.dirY})`);

        for (let i = this.snake.length - 1; i > 0; i--) {
            this.snake[i] = { ...this.snake[i - 1] };
        }

        this.snake[0] = {
            x: this.snake[0].x + this.dirX * Snake.PLAYER_SIZE,
            y: this.snake[0].y + this.dirY * Snake.PLAYER_SIZE
        }
    }

    private checkEatenFood(snake: Point[], food: Point): boolean {
        return snake[0].x === food.x && snake[0].y === food.y;
    }

    private addSegment(): void {
        this.snake.push({
            x: this.snake[this.snake.length - 1].x,
            y: this.snake[this.snake.length - 1].y
        });
    }

    private spawnFood(): void {
        this.food.x = Math.floor(Math.random() * (Snake.WIDTH / Snake.PLAYER_SIZE)) * Snake.PLAYER_SIZE;
        this.food.y = Math.floor(Math.random() * (Snake.HEIGHT / Snake.PLAYER_SIZE)) * Snake.PLAYER_SIZE;
    }

    private keyToDirection(key: string): Direction | null {
        switch (key) {
            case 'w':
            case 'ArrowUp': return 'up';
            case 's':
            case 'ArrowDown': return 'down';
            case 'a':
            case 'ArrowLeft': return 'left';
            case 'd':
            case 'ArrowRight': return 'right';
            default: return null
        }
    }
}

export { Snake };
