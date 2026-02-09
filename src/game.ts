abstract class Game {
    protected canvas: HTMLCanvasElement;
    protected ctx: CanvasRenderingContext2D;
    protected intervalId: number | null = null;
    protected animationFrameId: number | null = null;
    protected enableDebugging: boolean | undefined;

    protected constructor(canvas: HTMLCanvasElement | null, enableDebugging?: boolean) {
        if (canvas === null) {
            throw new Error('Canvas element not found');
        }

        this.canvas = canvas;

        let tempCtx = canvas.getContext('2d');
        if (tempCtx === null || tempCtx === undefined) {
            throw new Error('Could not get canvas context');
        }

        this.ctx = tempCtx;
        this.enableDebugging = enableDebugging;
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