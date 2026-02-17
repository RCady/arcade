import type { Arcade } from "./arcade";

abstract class Game {
    protected arcade: Arcade;
    protected intervalId: number | null = null;
    protected animationFrameId: number | null = null;

    protected readonly enableDebugging = false;

    public constructor(arcade: Arcade) {
        this.arcade = arcade;
    }

    public init(): void {
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            this.onKeyDown(event.key);
        });

        this.start();
    }

    protected start(): void {
        this.debug('starting game');
        this.intervalId = setInterval(() => this.tick(), 100);

        this.renderLoop();
    }

    private renderLoop(): void {
        this.draw();
        this.animationFrameId = requestAnimationFrame(() => this.renderLoop());
    }

    protected stop(): void {
        this.debug('stopping game');

        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
        }

        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
        }
    }

    protected abstract tick(): void;   // game logic
    protected abstract draw(): void;   // rendering
    protected abstract onKeyDown(key: string): void;  // input

    protected debug(message: string): void {
        if (this.enableDebugging) {
            console.log(message);
        }
    }
}

export { Game };