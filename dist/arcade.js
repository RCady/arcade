class r {
  element;
  canvas;
  ctx;
  intervalId = null;
  animationFrameId = null;
  enableDebugging;
  constructor(t, e) {
    if (t === null)
      throw new Error("Arcade element not found");
    this.element = t, this.canvas = this.createCanvas(), this.element.appendChild(this.canvas), /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && this.createControls();
    let n = this.canvas.getContext("2d");
    if (n == null)
      throw new Error("Could not get canvas context");
    this.ctx = n, this.enableDebugging = e;
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
  createCanvas() {
    let t = document.createElement("canvas");
    return t.width = 500, t.height = 500, t.style.width = "100%", t.style.height = "auto", t.style.maxWidth = "500px", t.style.aspectRatio = "1 / 1", t.style.display = "block", t;
  }
  createControls() {
    const t = document.createElement("div");
    t.id = "controls", t.style.padding = "10px", t.style.display = "grid", t.style.gridTemplateColumns = "repeat(3, auto)", t.style.gap = "5px", t.style.width = "fit-content", t.style.margin = "0 auto";
    const e = document.createElement("button");
    e.type = "button", e.style.gridColumn = "2", e.style.gridRow = "1", e.textContent = "↑", e.onclick = () => document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }));
    const n = document.createElement("button");
    n.type = "button", n.style.gridColumn = "2", n.style.gridRow = "3", n.textContent = "↓", n.onclick = () => document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
    const s = document.createElement("button");
    s.type = "button", s.style.gridColumn = "1", s.style.gridRow = "2", s.textContent = "←", s.onclick = () => document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }));
    const o = document.createElement("button");
    o.type = "button", o.style.gridColumn = "3", o.style.gridRow = "2", o.textContent = "→", o.onclick = () => document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" })), t.appendChild(e), t.appendChild(n), t.appendChild(s), t.appendChild(o), this.element.appendChild(t);
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
  constructor(t, e, n, s, o) {
    super(t, o), this.snake = e, this.food = n, this.dirX = s === "left" ? -1 : s === "right" ? 1 : 0, this.dirY = s === "up" ? -1 : s === "down" ? 1 : 0;
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
    const e = this.keyToDirection(t);
    e !== null && (e === "up" && this.dirY !== 1 ? (this.dirX = 0, this.dirY = -1) : e === "down" && this.dirY !== -1 ? (this.dirX = 0, this.dirY = 1) : e === "left" && this.dirX !== 1 ? (this.dirX = -1, this.dirY = 0) : e === "right" && this.dirX !== -1 && (this.dirX = 1, this.dirY = 0));
  }
  checkCollisions(t) {
    if (t[0].x < 0 || t[0].x >= i.WIDTH || t[0].y < 0 || t[0].y >= i.HEIGHT)
      return this.debug("collision with edges"), !0;
    for (let e of t.slice(1))
      if (t[0].x === e.x && t[0].y === e.y)
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
  checkEatenFood(t, e) {
    return t[0].x === e.x && t[0].y === e.y;
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
