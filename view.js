var View = (function () {
    function View(canvas) {
        this.canvas = canvas;
        // game-space coords
        this.x = 0;
        this.y = 0;
        this.scale = 50;
        this.rotation = -Math.PI / 2;
        this.ctx = canvas.getContext("2d");
        this.ctx.imageSmoothingEnabled = false;
        this.onResize();
    }
    Object.defineProperty(View.prototype, "width", {
        get: function () { return this.canvas.width; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, "height", {
        get: function () { return this.canvas.height; },
        enumerable: true,
        configurable: true
    });
    View.prototype.setTranslation = function (x, y) {
        this.x = x;
        this.y = y;
    };
    View.prototype.setRotation = function (r) {
        this.ctx.rotate(r - this.rotation);
        this.rotation = r;
    };
    View.prototype.onResize = function () {
        this.ctx.rotate(-this.rotation);
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx.rotate(Math.PI / 2);
        this.ctx.rotate(this.rotation);
    };
    View.prototype.mapX = function (x) {
        //return x* this.scale;
        return (x - this.x) * this.scale + Math.cos(this.rotation) * this.height / 2 - Math.sin(this.rotation) * this.width / 2;
    };
    View.prototype.mapY = function (y) {
        //return -y* this.scale;
        return -(y - this.y) * this.scale - Math.sin(this.rotation) * this.height / 2 - Math.cos(this.rotation) * this.width / 2;
    };
    View.prototype.draw = function (world) {
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
                    if (userData == "bouncer")
                        this.ctx.fillStyle = "rgba(255,0,0,0.2)";
                    if (userData == "ball")
                        this.ctx.fillStyle = "rgba(0,0,0,0.2)";
                    var r = shape.m_radius;
                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, r * this.scale, 0, Math.PI * 2);
                    this.fill();
                    this.stroke();
                }
                else if (userData == "goal") {
                    this.ctx.fillStyle = "rgba(0,255,0,0.2)";
                    this.createPath(shape.m_vertices);
                    this.fill();
                }
                else if (userData == "pusher") {
                    this.ctx.fillStyle = "rgba(255,0,128,0.2)";
                    this.createPath(shape.m_vertices);
                    this.fill();
                    this.ctx.fillStyle = "rgba(0,0,255,0.2)";
                    this.createPath(b.userData.direction.innerArrow);
                    this.fill();
                }
                else if (userData == "breakWall") {
                    this.ctx.fillStyle = "rgba(196,92,0,0.2)";
                    this.createPath(shape.m_vertices);
                    this.fill();
                    this.stroke();
                }
                else {
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
    };
    View.prototype.createPath = function (vertices) {
        this.ctx.beginPath();
        var last = vertices[vertices.length - 1];
        this.ctx.moveTo(last.x * this.scale, -last.y * this.scale);
        for (var _i = 0, vertices_1 = vertices; _i < vertices_1.length; _i++) {
            var v = vertices_1[_i];
            this.ctx.lineTo(v.x * this.scale, -v.y * this.scale);
        }
    };
    View.prototype.fill = function () {
        this.ctx.lineWidth = 1;
        this.ctx.fill();
    };
    View.prototype.stroke = function () {
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = this.ctx.fillStyle.toString().replace("0.2", "0.5");
        this.ctx.stroke();
    };
    return View;
}());
var view = null;
//# sourceMappingURL=view.js.map