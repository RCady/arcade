import { Game } from './game';

interface Point {
    x: number;
    y: number;
}

type Direction = 'up' | 'down' | 'left' | 'right';

class Snake extends Game {
    private dirX: number = 0;
    private dirY: number = -1;
    private prevDirX: number = 0;
    private prevDirY: number = -1;

    private readonly food: Point = {x: 240, y: 100};
    private readonly snake: Point[] = [{x: 240, y: 240}];

    private static readonly PLAYER_SIZE = 20;

    private isStarted: boolean = false;

    protected tick(): void {
        if (!this.isStarted) {
            return;
        }

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

        if (!this.isStarted) {
            this.drawWelcome();
            return;
        }

        this.drawGame();
    }

    protected onKeyDown(key: string): void {
        const direction = this.keyToDirection(key);

        if ((key === ' ' || direction === 'up') && !this.isStarted) {
            this.isStarted = true;
            return;
        }

        if (direction === null) {
            return;
        }

        // Prevent 180-degree turns
        if (direction === 'up' && this.dirY !== 1 && this.prevDirY !== 1) {
            this.dirX = 0;
            this.dirY = -1;
        } else if (direction === 'down' && this.dirY !== -1 && this.prevDirY !== -1) {
            this.dirX = 0;
            this.dirY = 1;
        } else if (direction === 'left' && this.dirX !== 1 && this.prevDirX !== 1) {
            this.dirX = -1;
            this.dirY = 0;
        } else if (direction === 'right' && this.dirX !== -1 && this.prevDirX !== -1) {
            this.dirX = 1;
            this.dirY = 0;
        }
    }

    private checkCollisions(snake: Point[]): boolean {
        if (snake[0].x < 0 || snake[0].x >= this.arcade.WIDTH || snake[0].y < 0 || snake[0].y >= this.arcade.HEIGHT) {
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

        this.prevDirX = this.dirX;
        this.prevDirY = this.dirY;
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
        this.food.x = Math.floor(Math.random() * (this.arcade.WIDTH / Snake.PLAYER_SIZE)) * Snake.PLAYER_SIZE;
        this.food.y = Math.floor(Math.random() * (this.arcade.HEIGHT / Snake.PLAYER_SIZE)) * Snake.PLAYER_SIZE;
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

    private drawWelcome(): void {
        this.arcade.ctx?.clearRect(0, 0, this.arcade.WIDTH, this.arcade.HEIGHT);

        this.arcade.ctx.font = '32px Arial';
        this.arcade.ctx.fillStyle = '#FFFFFF';

        const text = 'Press space or up to start';
        const textMetrics = this.arcade.ctx.measureText(text);

        const width = textMetrics.width;
        const height = textMetrics.fontBoundingBoxAscent + textMetrics.fontBoundingBoxDescent;

        this.arcade.ctx.fillText(text, (this.arcade.WIDTH - width) / 2, (this.arcade.HEIGHT - (height / 2)) / 2);
        this.arcade.ctx.font = '16px Arial';
        this.arcade.ctx.fillText('Use the arrow keys or w, a, s, d', (this.arcade.WIDTH - this.arcade.ctx.measureText('Use the arrow keys or w, a, s, d').width) / 2, (this.arcade.HEIGHT - (height / 2)) / 2 + height)
    }

    private drawGame(): void {
        this.arcade.ctx?.clearRect(0, 0, this.arcade.WIDTH, this.arcade.HEIGHT);

        // Draw snake
        for (let i = 0; i < this.snake.length; i++) {
            this.arcade.ctx.beginPath();
            this.arcade.ctx.rect(this.snake[i].x, this.snake[i].y, Snake.PLAYER_SIZE, Snake.PLAYER_SIZE);
            this.arcade.ctx.fillStyle = 'white';
            this.arcade.ctx.fill();
            this.arcade.ctx.closePath();
        }

        // Draw food
        this.arcade.ctx.beginPath();
        this.arcade.ctx.rect(this.food.x, this.food.y, Snake.PLAYER_SIZE, Snake.PLAYER_SIZE);
        this.arcade.ctx.fillStyle = '#FF007F';
        this.arcade.ctx.fill();
        this.arcade.ctx.closePath();
    }
}

export { Snake };
