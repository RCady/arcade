class d {
  arcade;
  intervalId = null;
  animationFrameId = null;
  enableDebugging = !1;
  constructor(t) {
    this.arcade = t;
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
class s extends d {
  dirX = 0;
  dirY = -1;
  prevDirX = 0;
  prevDirY = -1;
  food = { x: 240, y: 100 };
  snake = [{ x: 240, y: 240 }];
  static PLAYER_SIZE = 20;
  isStarted = !1;
  tick() {
    if (!this.isStarted)
      return;
    if (this.updatePosition(), this.checkCollisions(this.snake)) {
      this.stop();
      return;
    }
    this.checkEatenFood(this.snake, this.food) && (this.debug("food eaten"), this.addSegment(), this.spawnFood());
  }
  draw() {
    if (this.debug("drawing game"), !this.isStarted) {
      this.drawWelcome();
      return;
    }
    this.drawGame();
  }
  onKeyDown(t) {
    const e = this.keyToDirection(t);
    if ((t === " " || e === "up") && !this.isStarted) {
      this.isStarted = !0;
      return;
    }
    e !== null && (e === "up" && this.dirY !== 1 && this.prevDirY !== 1 ? (this.dirX = 0, this.dirY = -1) : e === "down" && this.dirY !== -1 && this.prevDirY !== -1 ? (this.dirX = 0, this.dirY = 1) : e === "left" && this.dirX !== 1 && this.prevDirX !== 1 ? (this.dirX = -1, this.dirY = 0) : e === "right" && this.dirX !== -1 && this.prevDirX !== -1 && (this.dirX = 1, this.dirY = 0));
  }
  checkCollisions(t) {
    if (t[0].x < 0 || t[0].x >= this.arcade.WIDTH || t[0].y < 0 || t[0].y >= this.arcade.HEIGHT)
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
      x: this.snake[0].x + this.dirX * s.PLAYER_SIZE,
      y: this.snake[0].y + this.dirY * s.PLAYER_SIZE
    }, this.prevDirX = this.dirX, this.prevDirY = this.dirY;
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
    this.food.x = Math.floor(Math.random() * (this.arcade.WIDTH / s.PLAYER_SIZE)) * s.PLAYER_SIZE, this.food.y = Math.floor(Math.random() * (this.arcade.HEIGHT / s.PLAYER_SIZE)) * s.PLAYER_SIZE;
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
  drawWelcome() {
    this.arcade.ctx?.clearRect(0, 0, this.arcade.WIDTH, this.arcade.HEIGHT), this.arcade.ctx.font = "32px Arial", this.arcade.ctx.fillStyle = "#FFFFFF";
    const t = "Press space or up to start", e = this.arcade.ctx.measureText(t), r = e.width, i = e.fontBoundingBoxAscent + e.fontBoundingBoxDescent;
    this.arcade.ctx.fillText(t, (this.arcade.WIDTH - r) / 2, (this.arcade.HEIGHT - i / 2) / 2), this.arcade.ctx.font = "16px Arial", this.arcade.ctx.fillText("Use the arrow keys or w, a, s, d", (this.arcade.WIDTH - this.arcade.ctx.measureText("Use the arrow keys or w, a, s, d").width) / 2, (this.arcade.HEIGHT - i / 2) / 2 + i);
  }
  drawGame() {
    this.arcade.ctx?.clearRect(0, 0, this.arcade.WIDTH, this.arcade.HEIGHT);
    for (let t = 0; t < this.snake.length; t++)
      this.arcade.ctx.beginPath(), this.arcade.ctx.rect(this.snake[t].x, this.snake[t].y, s.PLAYER_SIZE, s.PLAYER_SIZE), this.arcade.ctx.fillStyle = "white", this.arcade.ctx.fill(), this.arcade.ctx.closePath();
    this.arcade.ctx.beginPath(), this.arcade.ctx.rect(this.food.x, this.food.y, s.PLAYER_SIZE, s.PLAYER_SIZE), this.arcade.ctx.fillStyle = "#FF007F", this.arcade.ctx.fill(), this.arcade.ctx.closePath();
  }
}
class o {
  ctx;
  WIDTH = 500;
  HEIGHT = 500;
  el;
  canvas;
  constructor(t) {
    if (t === null)
      throw new Error("Arcade element not found");
    this.el = t, this.canvas = this.createCanvas(), this.el.appendChild(this.canvas), /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && this.createControls();
    let e = this.canvas.getContext("2d");
    if (e == null)
      throw new Error("Could not get canvas context");
    this.ctx = e;
  }
  createCanvas() {
    let t = document.createElement("canvas");
    return t.width = 500, t.height = 500, t.style.width = "100%", t.style.height = "auto", t.style.maxWidth = "500px", t.style.aspectRatio = "1 / 1", t.style.display = "block", t.style.backgroundColor = "#000000", t;
  }
  createControls() {
    const t = document.createElement("div");
    t.id = "controls", t.style.padding = "10px", t.style.display = "grid", t.style.gridTemplateColumns = "repeat(3, auto)", t.style.gap = "5px", t.style.width = "fit-content", t.style.margin = "0 auto";
    const e = document.createElement("button");
    e.type = "button", e.style.gridColumn = "2", e.style.gridRow = "1", e.style.padding = "20px 30px", e.style.borderRadius = "5px", e.style.border = "0", e.textContent = "↑", e.onclick = () => document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }));
    const r = document.createElement("button");
    r.type = "button", r.style.gridColumn = "2", r.style.gridRow = "3", r.style.padding = "20px 30px", r.style.borderRadius = "5px", r.style.border = "0", r.textContent = "↓", r.onclick = () => document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
    const i = document.createElement("button");
    i.type = "button", i.style.gridColumn = "1", i.style.gridRow = "2", i.style.padding = "20px 30px", i.style.borderRadius = "5px", i.style.border = "0", i.textContent = "←", i.onclick = () => document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }));
    const a = document.createElement("button");
    a.type = "button", a.style.gridColumn = "3", a.style.gridRow = "2", a.style.padding = "20px 30px", a.style.borderRadius = "5px", a.style.border = "0", a.textContent = "→", a.onclick = () => document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" })), t.appendChild(e), t.appendChild(r), t.appendChild(i), t.appendChild(a), this.el.appendChild(t);
  }
  selectGame(t) {
    if (t === "snake")
      return new s(this);
  }
}
export {
  o as Arcade,
  s as Snake
};
