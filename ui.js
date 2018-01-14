var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ButtonBase = (function () {
    function ButtonBase(x, y, width, height, text, centered) {
        if (centered === void 0) { centered = true; }
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.text = text;
        this.centered = centered;
        this.labelOnly = false;
    }
    ButtonBase.prototype.isMouseWithin = function () {
        if (mouseHandler.mouseX < this.x)
            return false;
        if (mouseHandler.mouseX > this.x + this.width)
            return false;
        if (mouseHandler.mouseY < this.y)
            return false;
        if (mouseHandler.mouseY > this.y + this.height)
            return false;
        return true;
    };
    ButtonBase.prototype.draw = function (view) {
        if (!this.labelOnly) {
            view.ctx.fillStyle = "rgba(70,70,85,0.55)";
            if (this.isMouseWithin()) {
                view.ctx.fillStyle = "rgba(75,75,100,0.85)";
                if (this instanceof EditorButtonElement && this.isActive)
                    view.ctx.fillStyle = "rgba(85,85,100,0.85)";
            }
            view.ctx.fillRect(this.x, this.y, this.width, this.height);
            if (this instanceof EditorButtonElement && this.isActive) {
                view.ctx.lineWidth = 3;
                view.ctx.strokeStyle = "rgba(75,75,100,1)";
                view.ctx.strokeRect(this.x, this.y, this.width, this.height);
            }
        }
        view.ctx.font = this.height / 2 + "px Arial";
        var maxWidth = this.width - 10;
        view.ctx.fillStyle = "rgba(45,45,63,1)";
        var x = this.x + 5;
        var y = this.y + this.height * .75;
        if (this.centered) {
            var textWidth = Math.min(maxWidth, view.ctx.measureText(this.text).width);
            var extraSpace = maxWidth - textWidth;
            x += extraSpace / 2;
        }
        view.ctx.fillText(this.text, x + 2, y + 2, maxWidth);
        view.ctx.fillStyle = "rgba(110,110,145,1)";
        view.ctx.fillText(this.text, x, y, maxWidth);
    };
    ButtonBase.prototype.onClick = function () { };
    ;
    return ButtonBase;
}());
var MenuLabel = (function (_super) {
    __extends(MenuLabel, _super);
    function MenuLabel(x, y, width, height, text) {
        var _this = _super.call(this, x, y, width, height, text) || this;
        _this.x = x;
        _this.y = y;
        _this.width = width;
        _this.height = height;
        _this.text = text;
        _this.labelOnly = true;
        return _this;
    }
    return MenuLabel;
}(ButtonBase));
var currentMenu = [];
function MainMenu() {
    view.setRotation(-Math.PI / 2);
    currentLevels = null;
    currentMenu = [];
    currentMenu.push(new MenuLabel(30, 30, 240, 60, "New Game"));
    var y = 95;
    var difficulties = ["Training", "Easy", "Medium", "Hard", "Special"];
    var _loop_1 = function (i) {
        var b = new ButtonBase(50, y, 200, 40, difficulties[i], false);
        b.onClick = function () {
            currentMenu = [];
            currentLevels = new LevelSet(levels.filter(function (l) { return l.difficulty == i + 1; }), 40);
        };
        currentMenu.push(b);
        y += 45;
    };
    for (var i = 0; i < difficulties.length; i++) {
        _loop_1(i);
    }
    currentMenu.push(new MenuLabel(30, y, 240, 120, ""));
    y += 65;
    var editor = new ButtonBase(50, y, 200, 40, "Level Editor", false);
    editor.onClick = function () {
        currentMenu = [];
        StartEditor();
    };
    currentMenu.push(editor);
}
function UITick() {
    if (mouseHandler.isMouseLeftClicked) {
        for (var _i = 0, currentMenu_1 = currentMenu; _i < currentMenu_1.length; _i++) {
            var b = currentMenu_1[_i];
            if (b.isMouseWithin()) {
                b.onClick();
            }
        }
    }
}
function DrawUI() {
    if (currentMenu.length) {
        var border = 5;
        var minX = Math.min.apply(null, currentMenu.map(function (a) { return a.x; })) - border;
        var maxX = Math.max.apply(null, currentMenu.map(function (a) { return a.x + a.width; })) + border;
        var minY = Math.min.apply(null, currentMenu.map(function (a) { return a.y; })) - border;
        var maxY = Math.max.apply(null, currentMenu.map(function (a) { return a.y + a.height; })) + border;
        view.ctx.fillStyle = "rgba(45,45,63,0.3)";
        view.ctx.fillRect(minX + 5, minY + 5, maxX - minX, maxY - minY);
        view.ctx.fillStyle = "rgba(45,45,63,1)";
        view.ctx.fillRect(minX, minY, maxX - minX, maxY - minY);
        for (var _i = 0, currentMenu_2 = currentMenu; _i < currentMenu_2.length; _i++) {
            var b = currentMenu_2[_i];
            b.draw(view);
        }
        view.drawCenteredText("Spinball", 0.08, 0.65);
        view.drawCenteredText("An unfinished game", 0.05, 0.75);
    }
}
//# sourceMappingURL=ui.js.map