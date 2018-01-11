
class Tileset {
    constructor(domId: string) {
        this.load(domId);
    }
    image: HTMLImageElement;
    loaded: boolean = false;
    private load(domId: string): void {
        this.image = <HTMLImageElement>document.getElementById(domId);
        if (!this.image || !this.image.width) setTimeout(() => { this.load(domId) });
        else this.init();
    }
    private init(): void {
        this.loaded = true;
    }

    private drawTile(tileIndex: number) {
        if (this.loaded) {
            var sx = this.image.width / 3 * tileIndex;
            var sy = 0;
            var sWidth = this.image.width / 3;
            var sHeight = this.image.height;
            view.ctx.drawImage(this.image, sx, sy, sWidth, sHeight, -view.scale, -view.scale, view.scale * 2, view.scale * 2);
        }
    }

    drawSolid(): void {
        this.drawTile(0);
    }

    drawTriangle(): void {
        this.drawTile(1);
    }

    drawCurve(): void {
        this.drawTile(2);
    }
}

var testTileset = new Tileset("testImage");
