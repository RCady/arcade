abstract class Game {
    protected element: HTMLDivElement;
    protected canvas: HTMLCanvasElement;
    protected ctx: CanvasRenderingContext2D;
    protected intervalId: number | null = null;
    protected animationFrameId: number | null = null;
    protected enableDebugging: boolean | undefined;

    protected constructor(el: HTMLDivElement | null, enableDebugging?: boolean) {
        if (el === null) {
            throw new Error('Arcade element not found');
        }

        this.element = el;
        this.canvas = this.createCanvas();

        this.element.appendChild(this.canvas);
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            this.createControls();
        }

        let tempCtx = this.canvas.getContext('2d');
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

        // this.ctx.font = "24px sans-serif";
        // this.ctx.fillStyle = 'white';
        // let txt = "Press any key to start";
        // const width = this.ctx.measureText(txt).width;
        // const height = this.ctx.measureText(txt).actualBoundingBoxAscent + this.ctx.measureText(txt).actualBoundingBoxDescent;
        // this.ctx.fillText(txt, this.canvas.width / 2 - (width / 2), this.canvas.height / 2);

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

    protected createCanvas(): HTMLCanvasElement {
        let canvas = document.createElement('canvas');
        canvas.width = 500;
        canvas.height = 500;

        canvas.style.width = '100%';
        canvas.style.height = 'auto';
        canvas.style.maxWidth = '500px';
        canvas.style.aspectRatio = '1 / 1';
        canvas.style.display = 'block';
        canvas.style.backgroundColor = '#000000';

        return canvas;
    }

    protected createControls(): void {
        const container = document.createElement('div');
        container.id = 'controls';
        container.style.padding = '10px';
        container.style.display = 'grid';
        container.style.gridTemplateColumns = 'repeat(3, auto)';
        container.style.gap = '5px';
        container.style.width = 'fit-content';
        container.style.margin = '0 auto';

        const upButton = document.createElement('button');
        upButton.type = 'button';
        upButton.style.gridColumn = '2';
        upButton.style.gridRow = '1';
        upButton.style.padding = '20px 30px';
        upButton.style.borderRadius = '5px';
        upButton.style.border = '0';
        upButton.textContent = '↑';
        upButton.onclick = () => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));

        const downButton = document.createElement('button');
        downButton.type = 'button';
        downButton.style.gridColumn = '2';
        downButton.style.gridRow = '3';
        downButton.style.padding = '20px 30px';
        downButton.style.borderRadius = '5px';
        downButton.style.border = '0';
        downButton.textContent = '↓';
        downButton.onclick = () => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

        const leftButton = document.createElement('button');
        leftButton.type = 'button';
        leftButton.style.gridColumn = '1';
        leftButton.style.gridRow = '2';
        leftButton.style.padding = '20px 30px';
        leftButton.style.borderRadius = '5px';
        leftButton.style.border = '0';
        leftButton.textContent = '←';
        leftButton.onclick = () => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));

        const rightButton = document.createElement('button');
        rightButton.type = 'button';
        rightButton.style.gridColumn = '3';
        rightButton.style.gridRow = '2';
        rightButton.style.padding = '20px 30px';
        rightButton.style.borderRadius = '5px';
        rightButton.style.border = '0';
        rightButton.textContent = '→';
        rightButton.onclick = () => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

        container.appendChild(upButton);
        container.appendChild(downButton);
        container.appendChild(leftButton);
        container.appendChild(rightButton);

        this.element.appendChild(container);
    }
}

export { Game };