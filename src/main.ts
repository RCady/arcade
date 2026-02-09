import './style.css'

import { Snake } from './snake';

const el: HTMLDivElement | null = document.getElementById('arcade') as HTMLDivElement | null;

const snake = new Snake(
    el,
    [{x: 240, y: 240}],
    {x: 240, y: 100},
    "up",
    false
);

snake.init();
