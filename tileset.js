var Tileset = (function () {
    function Tileset(domId) {
        this.loaded = false;
        this.load(domId);
    }
    Tileset.prototype.load = function (domId) {
        var _this = this;
        this.image = document.getElementById(domId);
        if (!this.image || !this.image.width)
            setTimeout(function () { _this.load(domId); });
        else
            this.init();
    };
    Tileset.prototype.init = function () {
        this.loaded = true;
    };
    Tileset.prototype.drawTile = function (tileIndex) {
        if (this.loaded) {
            var sx = this.image.width / 3 * tileIndex;
            var sy = 0;
            var sWidth = this.image.width / 3;
            var sHeight = this.image.height;
            view.ctx.drawImage(this.image, sx, sy, sWidth, sHeight, -view.scale, -view.scale, view.scale * 2, view.scale * 2);
        }
    };
    Tileset.prototype.drawSolid = function () {
        this.drawTile(0);
    };
    Tileset.prototype.drawTriangle = function () {
        this.drawTile(1);
    };
    Tileset.prototype.drawCurve = function () {
        this.drawTile(2);
    };
    return Tileset;
}());
var testTileset = new Tileset("testImage");
//# sourceMappingURL=tileset.js.map