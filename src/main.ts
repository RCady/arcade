import './style.css'
import { Arcade } from "./arcade";

const el: HTMLDivElement | null = document.getElementById('arcade') as HTMLDivElement | null;

const arcade = new Arcade(el);

const snake = arcade.selectGame('snake');
snake.init();
