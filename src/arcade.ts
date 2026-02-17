import { Game } from './game';
import { Snake } from './snake';

type GameName = 'snake';

class Arcade {
    public ctx: CanvasRenderingContext2D;
    public readonly WIDTH = 500;
    public readonly HEIGHT = 500;

    protected el: HTMLDivElement;
    protected canvas: HTMLCanvasElement;

    public constructor(el: HTMLDivElement | null) {
        if (el === null) {
            throw new Error('Arcade element not found');
        }

        this.el = el;
        this.canvas = this.createCanvas();

        this.el.appendChild(this.canvas);
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            this.createControls();
        }

        let tempCtx = this.canvas.getContext('2d');
        if (tempCtx === null || tempCtx === undefined) {
            throw new Error('Could not get canvas context');
        }

        this.ctx = tempCtx;
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

        this.el.appendChild(container);
    }

    public selectGame(gameName: GameName): Game {
        switch (gameName) {
            case 'snake': return new Snake(this);
        }
    }
}

export { Arcade };