
class View {
    constructor(private canvas: HTMLCanvasElement) {
        this.ctx = canvas.getContext("2d");
        (<any>this.ctx).imageSmoothingEnabled = false;
        this.onResize();
    }
    ctx: CanvasRenderingContext2D;

    // game-space coords
    x: number = 0;
    y: number = 0;
    targetX: number = 0;
    targetY: number = 0;
    offsetX: number = 0;
    offsetY: number = 0;

    get width(): number { return this.canvas.width; }
    get height(): number { return this.canvas.height; }
    targetScale: number = 50;
    scale: number = 50;
    private rotation: number = -Math.PI / 2;

    setTranslation(x: number, y: number) {
        this.targetX = x;
        this.targetY = y;
    }

    setRotation(r: number) {
        this.ctx.rotate(r - this.rotation);
        this.rotation = r;
    }

    onResize() {
        this.ctx.rotate(-this.rotation);
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx.rotate(Math.PI / 2);
        this.ctx.rotate(this.rotation);
        editorButtons = [];
    }

    tickCamera(): void {
        if (currentLevels && currentLevels.currentLevel && currentLevels.currentLevel.ball) {
            var cp = currentLevels.currentLevel.ball.getPosition();
            if (gameMode == Mode.edit) {
                this.setTranslation(cp.x - editorPaneWidth / 2 / this.scale, cp.y);
            } else {
                this.setTranslation(cp.x, cp.y);
            }
        }
        //}

        if (gameMode == Mode.edit) this.targetScale = 15;
        if (gameMode == Mode.test || gameMode == Mode.play) this.targetScale = Math.max(this.canvas.width / 40, this.canvas.height / 20);
        var diff = this.targetScale - this.scale;
        this.scale += diff * 0.04;
        if (Math.abs(diff) < 0.1) this.scale = this.targetScale;

        if (gameMode !== Mode.edit) {
            this.offsetX = 0;
            this.offsetY = 0;
        }
        this.x += (this.targetX + this.offsetX - this.x) * 0.1;
        this.y += (this.targetY + this.offsetY - this.y) * 0.1;
    }


    getMapCoordsFromScreenCoords(x: number, y: number): { x: number, y: number } {
        var mapX = (x - this.width / 2) / this.scale + this.x;
        var mapY = (y - this.height / 2) / -this.scale + this.y;
        return { x: mapX, y: mapY };
    }

    getBottomLeftGameCoordOfMouseOverCell(): { x: number, y: number } {
        let mouse = this.getMapCoordsFromScreenCoords(mouseHandler.mouseX, mouseHandler.mouseY);
        let left = mouse.x+1;
        let bottom = mouse.y+1;
        left = Math.floor(left / 2) * 2;
        bottom = Math.floor(bottom / 2) * 2;
        return { x: left, y: bottom };
    }

    mapX(x: number): number {
        //return x* this.scale;
        return (x - this.x) * this.scale + Math.cos(this.rotation) * this.height / 2 - Math.sin(this.rotation) * this.width / 2;
    }
    mapY(y: number): number {
        //return -y* this.scale;
        return -(y - this.y) * this.scale - Math.sin(this.rotation) * this.height / 2 - Math.cos(this.rotation) * this.width / 2;
    }

    clear() {
        this.ctx.clearRect(-this.width - this.height, -this.width - this.height, 2 * (this.width + this.height), 2 * (this.width + this.height));
    }

    draw(level: Level) {
        this.tickCamera();
        let world = level.world;
        
        // draw a planck js world to screen

        for (var b = world.getBodyList(); b; b = b.getNext()) {
            var p = b.getPosition();
            this.ctx.translate(this.mapX(p.x), this.mapY(p.y));
            var r = b.getAngle();
            for (var f = b.getFixtureList(); f; f = f.getNext()) {
                var type = f.getType();
                var shape = f.getShape();
                var userData = f.getUserData();

                if (type == "circle") {
                    this.ctx.fillStyle = "rgba(0,0,200,0.6)";
                    if (userData == "bouncer") this.ctx.fillStyle = "rgba(200,0,200,0.6)";
                    if (userData == "ball") {
                        this.ctx.fillStyle = "rgba(0,0,0,0.6)";
                        if (level.hurtTimer > 0) this.ctx.fillStyle = "rgba(60,0,0,0.6)";
                    }
                    var r = shape.m_radius;
                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, r * this.scale, 0, Math.PI * 2);
                    this.fill();
                    this.stroke();
                } else if (userData == "goal") {
                    this.ctx.fillStyle = "rgba(0,200,0,0.6)";
                    this.createPath(shape.m_vertices);
                    this.fill();
                } else if (userData == "timerPenalty") {
                    this.ctx.fillStyle = "rgba(200,0,0,0.6)";
                    this.createPath(shape.m_vertices);
                    this.fill();
                    this.stroke();
                } else if (userData == "rotationLock" && gameMode == Mode.edit) {
                    this.ctx.fillStyle = "rgba(255,255,255,0.6)";
                    this.createPath(shape.m_vertices);
                    this.fill();
                } else if (userData == "pusher") {
                    this.ctx.fillStyle = "rgba(200,0,128,0.6)";
                    this.createPath(shape.m_vertices);
                    this.fill();
                    this.ctx.fillStyle = "rgba(0,0,200,0.6)";
                    this.createPath(b.userData.direction.innerArrow);
                    this.fill();
                } else if (userData == "breakWall") {
                    this.ctx.fillStyle = "rgba(196,92,0,0.6)";
                    this.createPath(shape.m_vertices);
                    this.fill();
                    this.stroke();
                    let timeVal = b.getUserData();
                    if (timeVal) {
                        let timeLabel = (timeVal > 0 ? "+" : "") + timeVal;
                        this.ctx.font = this.scale*.75 + "px Arial";
                        let textWidth = this.ctx.measureText(timeLabel).width;
                        this.ctx.fillStyle = timeVal > 0 ? "green" : "red";
                        this.ctx.fillText(timeLabel, -textWidth/2 + x0, this.scale/4);
                    }
                } else {
                    // need rotate to handle rotated bodies
                    this.ctx.rotate(-r);
                    this.createPath(shape.m_vertices);
                    this.ctx.fillStyle = "rgba(0,0,200,0.6)";
                    this.fill();
                    this.stroke();
                    this.ctx.rotate(r);
                }
            }
            this.ctx.translate(-this.mapX(p.x), -this.mapY(p.y));
        }

        let cell = this.getBottomLeftGameCoordOfMouseOverCell();
        if (gameMode == Mode.edit) {
            this.highlightCell(cell.x, cell.y);
            DrawEditorPane(this);
        }

        if (level.tip.length && currentLevels.levelStartTime <= 0 && !level.complete) {
            this.drawCenteredText(level.tip, 0.05, 0.95);
        }
    }

    highlightCell(x: number, y: number) {
        let vs = [{ x: x-1, y: y-1 }, { x: x + 1, y: y-1 }, { x: x + 1, y: y + 1 }, { x: x-1, y: y + 1 }];
        this.ctx.fillStyle = "rgba(255,255,255,0.6)";
        this.ctx.translate(this.mapX(0), this.mapY(0));
        this.ctx.beginPath();
        this.createPath(vs);
        this.fill();
        this.stroke();
        this.ctx.translate(-this.mapX(0), -this.mapY(0));
    }

    createPath(vertices: any[]): void {
        this.ctx.beginPath();
        var last = vertices[vertices.length - 1];
        this.ctx.moveTo(last.x * this.scale, -last.y * this.scale);
        for (var v of vertices) {
            this.ctx.lineTo(v.x * this.scale, -v.y * this.scale);
        }
    }

    fill(): void {
        this.ctx.lineWidth = 1;
        this.ctx.fill();
    }
    stroke(): void {
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = this.ctx.fillStyle.toString().replace("0.6", "1.0");
        this.ctx.stroke();
    }

    drawCenteredText(text: string, percentSize: number, percentDownScreen: number) {
        var textHeight = this.height * percentSize;
        this.ctx.font = textHeight + "px Arial";
        var textWidth = this.ctx.measureText(text).width;
        let screenWidth = this.width - (Mode.edit == gameMode ? editorPaneWidth : 0);
        let xOffset = (Mode.edit == gameMode ? editorPaneWidth : 0);
        if (textWidth > screenWidth) {
            var newSize = percentSize * screenWidth / textWidth - 0.01;
            if (newSize < 0) return;
            this.drawCenteredText(text, newSize, percentDownScreen);
            return;
        }
        var x = screenWidth / 2 - textWidth / 2 + xOffset;
        var y = (this.height - textHeight) * percentDownScreen + textHeight;

        this.ctx.rotate(-this.rotation - Math.PI / 2);
        this.ctx.fillStyle = "black";
        this.ctx.fillText(text, x + 2, y + 2);
        this.ctx.fillStyle = "white";
        this.ctx.fillText(text, x, y);
        this.ctx.rotate(this.rotation + Math.PI / 2);
    }

}
var x0 = 0;
var y0 = 0;

var view: View = null;