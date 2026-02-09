import './style.css'

import { Snake } from './snake';

const canvas: HTMLCanvasElement | null = document.querySelector<HTMLCanvasElement>('#arcade');

const snake = new Snake(
    canvas,
    [{x: 240, y: 240}],
    {x: 240, y: 100},
    "up",
    false
);

snake.init();
