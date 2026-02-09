class r {
  canvas;
  ctx;
  intervalId = null;
  animationFrameId = null;
  enableDebugging;
  constructor(t, s) {
    if (t === null)
      throw new Error("Canvas element not found");
    this.canvas = t;
    let e = t.getContext("2d");
    if (e == null)
      throw new Error("Could not get canvas context");
    this.ctx = e, this.enableDebugging = s;
  }
  init() {
    document.addEventListener("keydown", (t) => {
      this.onKeyDown(t.key);
    }), this.start();
  }
  start() {
    this.debug("starting game"), this.intervalId = setInterval(() => this.tick(), 100), this.renderLoop();
  }
  renderLoop() {
    this.draw(), this.animationFrameId = requestAnimationFrame(() => this.renderLoop());
  }
  stop() {
    this.debug("stopping game"), this.intervalId !== null && clearInterval(this.intervalId), this.animationFrameId !== null && cancelAnimationFrame(this.animationFrameId);
  }
  // input
  debug(t) {
    this.enableDebugging && console.log(t);
  }
}
class i extends r {
  dirX;
  dirY;
  food;
  snake;
  static WIDTH = 500;
  static HEIGHT = 500;
  static PLAYER_SIZE = 20;
  constructor(t, s, e, h, o) {
    super(t, o), this.snake = s, this.food = e, this.dirX = h === "left" ? -1 : h === "right" ? 1 : 0, this.dirY = h === "up" ? -1 : h === "down" ? 1 : 0;
  }
  tick() {
    if (this.updatePosition(), this.checkCollisions(this.snake)) {
      this.stop();
      return;
    }
    this.checkEatenFood(this.snake, this.food) && (this.debug("food eaten"), this.addSegment(), this.spawnFood());
  }
  draw() {
    this.debug("drawing game"), this.ctx?.clearRect(0, 0, i.WIDTH, i.HEIGHT);
    for (let t = 0; t < this.snake.length; t++)
      this.ctx.beginPath(), this.ctx.rect(this.snake[t].x, this.snake[t].y, i.PLAYER_SIZE, i.PLAYER_SIZE), this.ctx.fillStyle = "white", this.ctx.fill(), this.ctx.closePath();
    this.ctx.beginPath(), this.ctx.rect(this.food.x, this.food.y, i.PLAYER_SIZE, i.PLAYER_SIZE), this.ctx.fillStyle = "#FF007F", this.ctx.fill(), this.ctx.closePath();
  }
  onKeyDown(t) {
    const s = this.keyToDirection(t);
    s !== null && (s === "up" && this.dirY !== 1 ? (this.dirX = 0, this.dirY = -1) : s === "down" && this.dirY !== -1 ? (this.dirX = 0, this.dirY = 1) : s === "left" && this.dirX !== 1 ? (this.dirX = -1, this.dirY = 0) : s === "right" && this.dirX !== -1 && (this.dirX = 1, this.dirY = 0));
  }
  checkCollisions(t) {
    if (t[0].x < 0 || t[0].x >= i.WIDTH || t[0].y < 0 || t[0].y >= i.HEIGHT)
      return this.debug("collision with edges"), !0;
    for (let s of t.slice(1))
      if (t[0].x === s.x && t[0].y === s.y)
        return this.debug("collision with body"), !0;
    return !1;
  }
  updatePosition() {
    this.debug(`moving snake (${this.dirX}, ${this.dirY})`);
    for (let t = this.snake.length - 1; t > 0; t--)
      this.snake[t] = { ...this.snake[t - 1] };
    this.snake[0] = {
      x: this.snake[0].x + this.dirX * i.PLAYER_SIZE,
      y: this.snake[0].y + this.dirY * i.PLAYER_SIZE
    };
  }
  checkEatenFood(t, s) {
    return t[0].x === s.x && t[0].y === s.y;
  }
  addSegment() {
    this.snake.push({
      x: this.snake[this.snake.length - 1].x,
      y: this.snake[this.snake.length - 1].y
    });
  }
  spawnFood() {
    this.food.x = Math.floor(Math.random() * (i.WIDTH / i.PLAYER_SIZE)) * i.PLAYER_SIZE, this.food.y = Math.floor(Math.random() * (i.HEIGHT / i.PLAYER_SIZE)) * i.PLAYER_SIZE;
  }
  keyToDirection(t) {
    switch (t) {
      case "w":
      case "ArrowUp":
        return "up";
      case "s":
      case "ArrowDown":
        return "down";
      case "a":
      case "ArrowLeft":
        return "left";
      case "d":
      case "ArrowRight":
        return "right";
      default:
        return null;
    }
  }
}
export {
  i as Snake
};
