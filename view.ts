
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

    get width(): number { return this.canvas.width; }
    get height(): number { return this.canvas.height; }
    scale: number = 50;
    private rotation: number = -Math.PI / 2;

    setTranslation(x: number, y: number) {
        this.x = x;
        this.y = y;
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
    }


    mapX(x: number): number {
        //return x* this.scale;
        return (x - this.x) * this.scale + Math.cos(this.rotation) * this.height / 2 - Math.sin(this.rotation) * this.width / 2;
    }
    mapY(y: number): number {
        //return -y* this.scale;
        return -(y - this.y) * this.scale - Math.sin(this.rotation) * this.height / 2 - Math.cos(this.rotation) * this.width / 2;
    }

    draw(world: any) {
        this.ctx.clearRect(-this.width - this.height, -this.width - this.height, 2 * (this.width + this.height), 2 * (this.width + this.height));
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
                    this.ctx.fillStyle = "rgba(0,0,255,0.2)";
                    if (userData == "bouncer") this.ctx.fillStyle = "rgba(255,0,0,0.2)";
                    if (userData == "ball") this.ctx.fillStyle = "rgba(0,0,0,0.2)";
                    var r = shape.m_radius;
                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, r * this.scale, 0, Math.PI * 2);
                    this.fill();
                    this.stroke();
                } else if (userData == "goal") {
                    this.ctx.fillStyle = "rgba(0,255,0,0.2)";
                    this.createPath(shape.m_vertices);
                    this.fill();
                } else if (userData == "pusher") {
                    this.ctx.fillStyle = "rgba(255,0,128,0.2)";
                    this.createPath(shape.m_vertices);
                    this.fill();
                    this.ctx.fillStyle = "rgba(0,0,255,0.2)";
                    this.createPath(b.userData.direction.innerArrow);
                    this.fill();
                } else if (userData == "breakWall") {
                    this.ctx.fillStyle = "rgba(196,92,0,0.2)";
                    this.createPath(shape.m_vertices);
                    this.fill();
                    this.stroke();
                } else {
                    // need rotate to handle rotated bodies
                    this.ctx.rotate(-r);
                    this.createPath(shape.m_vertices);
                    this.ctx.fillStyle = "rgba(0,0,255,0.2)";
                    this.fill();
                    this.stroke();
                    this.ctx.rotate(r);
                }
            }
            this.ctx.translate(-this.mapX(p.x), -this.mapY(p.y));
        }
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
        this.ctx.strokeStyle = this.ctx.fillStyle.toString().replace("0.2","0.5");
        this.ctx.stroke();
    }

}


var view: View = null;