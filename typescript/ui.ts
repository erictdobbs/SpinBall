
// class MenuRow {
//     constructor(public elements: BaseMenuElement[]) {}
//     draw(view: View): void { for (let e of this.elements) e.draw(view); }
// }

// class Menu {
//     constructor(public elements: BaseMenuElement[], public margin: number) {}
// }



class BaseMenuElement {
    constructor(
        public x: number,
        public y: number,
        public width: number,
        public height: number,
        public text: string,
        public contentCentered: boolean = true
    ) { }
    labelOnly: boolean = false;
    isMouseWithin(): boolean {
        if (mouseHandler.mouseX < this.x) return false;
        if (mouseHandler.mouseX > this.x + this.width) return false;
        if (mouseHandler.mouseY < this.y) return false;
        if (mouseHandler.mouseY > this.y + this.height) return false;
        return true;
    }
    draw(view: View): void {
        if (!this.labelOnly) {
            view.ctx.fillStyle = "rgba(70,70,85,0.55)";
            if (this.isMouseWithin()) {
                view.ctx.fillStyle = "rgba(75,75,100,0.85)";
                if (this instanceof EditorButtonElement && this.isActive) {
                    view.ctx.fillStyle = "rgba(85,85,100,0.85)";
                }
            }
            view.ctx.fillRect(this.x, this.y, this.width, this.height);
            if (this instanceof EditorButtonElement && this.isActive) {
                view.ctx.lineWidth = 3;
                view.ctx.strokeStyle = "rgba(75,75,100,1)";
                view.ctx.strokeRect(this.x, this.y, this.width, this.height);
            }
        }

        view.ctx.font = this.height / 2 + "px Arial";
        let maxWidth = this.width - 10;
        view.ctx.fillStyle = "rgba(45,45,63,1)";

        let x = this.x + 5;
        let y = this.y + this.height * .75;
        if (this.contentCentered) {
            let textWidth = Math.min(maxWidth, view.ctx.measureText(this.text).width);
            let extraSpace = maxWidth - textWidth;
            x += extraSpace / 2;
        }

        view.ctx.fillText(this.text, x + 2, y + 2, maxWidth);
        view.ctx.fillStyle = "rgba(110,110,145,1)";
        view.ctx.fillText(this.text, x, y, maxWidth);
    }
    onClick(): void { };
}

class MenuLabel extends BaseMenuElement {
    constructor(
        public x: number,
        public y: number,
        public width: number,
        public height: number,
        public text: string
    ) { super(x, y, width, height, text); this.labelOnly = true; }
}

class EditorButtonElement extends BaseMenuElement {
    constructor(
        public x: number,
        public y: number,
        public width: number,
        public height: number,
        public index: number,
        public text: string,
        public isActive: boolean
    ) {
        super(x, y, width, height, text);
    }
    onClick(): void {
        for (let b of editorButtons) if (b instanceof EditorButtonElement) b.isActive = false;
        this.isActive = true;
    }
}

class EditorButton extends BaseMenuElement {
    constructor(
        public x: number,
        public y: number,
        public width: number,
        public height: number,
        public text: string,
        public action: () => void
    ) {
        super(x, y, width, height, text);
    }
    onClick(): void {
        if (mouseHandler.isMouseLeftChanged) {
            mouseHandler.isMouseLeftChanged = false;
            mouseHandler.isMouseLeftClicked = false;
            mouseHandler.m_isMouseLeftClicked = false;
            this.action();
        }
    }
}



var currentMenu: BaseMenuElement[] = [];


function MainMenu() {
    view.setRotation(-Math.PI/2);
    currentLevels = null;
    currentMenu = [];
    currentMenu.push(new MenuLabel(30, 30, 240, 60, "New Game"));
    let y = 95;
    let difficulties = ["Practice", "Easy", "Medium", "Hard", "Special"/*, "Debug"*/];
    for (let i = 0; i < difficulties.length; i++) {
        let b = new BaseMenuElement(50, y, 200, 40, difficulties[i], false);
        b.onClick = () => {
            currentMenu = [];
            loadLevels();
            currentLevels = new LevelSet(levels.filter(l => l.difficulty == i + 1));
        }
        currentMenu.push(b);
        y += 45;
    }
    currentMenu.push(new MenuLabel(30, y, 240, 120, ""));
    y += 65;
    let editor = new BaseMenuElement(50, y, 200, 40, "Level Editor", false);
    editor.onClick = () => {
        currentMenu = [];
        StartEditor();
    }
    currentMenu.push(editor);
}

function UITick(): void {
    if (mouseHandler.isMouseLeftClicked) {
        for (let b of currentMenu) {
            if (b.isMouseWithin()) {
                b.onClick();
            }
        }
    }
}

function DrawUI(): void {
    if (currentMenu.length) {
        var border = 5;
        var minX = Math.min.apply(null, currentMenu.map(a => a.x)) - border;
        var maxX = Math.max.apply(null, currentMenu.map(a => a.x + a.width)) + border;
        var minY = Math.min.apply(null, currentMenu.map(a => a.y)) - border;
        var maxY = Math.max.apply(null, currentMenu.map(a => a.y + a.height)) + border;

        view.ctx.fillStyle = "rgba(45,45,63,0.3)";
        view.ctx.fillRect(minX + 5, minY + 5, maxX - minX, maxY - minY);
        view.ctx.fillStyle = "rgba(45,45,63,1)";
        view.ctx.fillRect(minX, minY, maxX - minX, maxY - minY);
        for (let b of currentMenu) b.draw(view);

        
        view.drawCenteredText("Spinball", 0.08, 0.65);
        view.drawCenteredText("An unfinished game", 0.05, 0.75);
    }
}