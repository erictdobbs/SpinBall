var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Mode;
(function (Mode) {
    Mode[Mode["edit"] = 0] = "edit";
    Mode[Mode["test"] = 1] = "test";
    Mode[Mode["play"] = 2] = "play";
})(Mode || (Mode = {}));
var gameMode = Mode.play;
var levelString = "\n#####\n#   #\n# x #\n#####\n";
function StartEditor() {
    gameMode = Mode.edit;
    currentLevels = new LevelSet([
        new Level(0, levelString, true)
    ], 0);
}
function EditorTick() {
    if (mouseHandler.isMouseLeftClicked) {
        for (var _i = 0, editorButtons_1 = editorButtons; _i < editorButtons_1.length; _i++) {
            var b = editorButtons_1[_i];
            if (b.isMouseWithin()) {
                b.onClick();
            }
        }
        if (mouseHandler.mouseX <= editorPaneWidth)
            return;
        var activeButton = editorButtons.find(function (x) { return x instanceof EditorButtonElement && x.isActive; });
        var levelTile = levelTiles[activeButton.index];
        var char = levelTile.character;
        if (char == "x" && !mouseHandler.isMouseLeftChanged)
            return;
        var cell = view.getBottomLeftGameCoordOfMouseOverCell();
        var stringX = cell.x / 2;
        var stringY = -cell.y / 2;
        if (char == "x")
            levelString = levelString.replace('x', ' ');
        levelString = ReplaceChar(levelString, char, stringX, stringY);
        StartEditor();
    }
    else if (mouseHandler.isMouseRightChanged) {
        // pick
        var cell = view.getBottomLeftGameCoordOfMouseOverCell();
        var stringX = cell.x / 2;
        var stringY = -cell.y / 2;
        var char_1 = "_";
        try {
            char_1 = levelString.split('\n')[stringY][stringX];
            if (char_1 == " ")
                char_1 = "_";
        }
        catch (e) { }
        try {
            var tile = levelTiles.find(function (x) { return x.character == char_1; });
            var tileIndex = levelTiles.indexOf(tile);
            editorButtons[tileIndex].onClick();
        }
        catch (e) { }
    }
}
function ReplaceChar(str, newChar, stringX, stringY) {
    for (; stringY < 0; stringY++) {
        str = '\n' + str;
        view.y -= 2;
    }
    for (; stringX < 0; stringX++) {
        str = " " + str;
        str = str.replace(/\r?\n/g, '\n ');
        view.x += 2;
    }
    var lines = str.split('\n');
    for (; stringY >= lines.length; lines.push(''))
        ;
    var lineToChange = lines[stringY];
    for (; stringX >= lineToChange.length; lineToChange += ' ')
        ;
    lineToChange = lineToChange.substr(0, stringX) + newChar + lineToChange.substr(stringX + newChar.length);
    lines[stringY] = lineToChange;
    return lines.join('\n');
}
var EditorButtonElement = (function (_super) {
    __extends(EditorButtonElement, _super);
    function EditorButtonElement(x, y, width, height, index, text, isActive) {
        var _this = _super.call(this, x, y, width, height, text) || this;
        _this.x = x;
        _this.y = y;
        _this.width = width;
        _this.height = height;
        _this.index = index;
        _this.text = text;
        _this.isActive = isActive;
        return _this;
    }
    EditorButtonElement.prototype.onClick = function () {
        for (var _i = 0, editorButtons_2 = editorButtons; _i < editorButtons_2.length; _i++) {
            var b = editorButtons_2[_i];
            if (b instanceof EditorButtonElement)
                b.isActive = false;
        }
        this.isActive = true;
    };
    return EditorButtonElement;
}(ButtonBase));
var EditorButton = (function (_super) {
    __extends(EditorButton, _super);
    function EditorButton(x, y, width, height, text, action) {
        var _this = _super.call(this, x, y, width, height, text) || this;
        _this.x = x;
        _this.y = y;
        _this.width = width;
        _this.height = height;
        _this.text = text;
        _this.action = action;
        return _this;
    }
    EditorButton.prototype.onClick = function () {
        if (mouseHandler.isMouseLeftChanged) {
            mouseHandler.isMouseLeftChanged = false;
            mouseHandler.isMouseLeftClicked = false;
            mouseHandler.m_isMouseLeftClicked = false;
            this.action();
        }
    };
    return EditorButton;
}(ButtonBase));
var editorButtons = [];
var editorPaneWidth = 350;
var editorTestCompleteTime = 0;
function DrawEditorPane(view) {
    var width = editorPaneWidth;
    var margin = 10;
    var columns = 2;
    if (!editorButtons.length) {
        var editorItemCount = levelTiles.length;
        var height = view.height;
        var rows = Math.ceil(editorItemCount / columns) + 8; // leave space for extra rows for bonus margin
        var buttonWidth = (width - margin) / columns - margin;
        var buttonHeight = Math.min(50, (height - margin) / rows - margin);
        for (var tIdx = 0; tIdx < levelTiles.length; tIdx++) {
            var t = levelTiles[tIdx];
            var x = margin + (margin + buttonWidth) * (tIdx % columns);
            var y = margin + (margin + buttonHeight) * (1 + Math.floor(tIdx / columns));
            var b = new EditorButtonElement(x, y, buttonWidth, buttonHeight, tIdx, t.name, tIdx == 0);
            editorButtons.push(b);
        }
        var exportButton = new EditorButton(margin, height - (margin + 1.5 * buttonHeight) * 3, (width - margin) / 2 - margin, buttonHeight * 1.5, "Export", function () {
            prompt("Here's your level code:", levelString.replace(/\r?\n/g, '/'));
        });
        editorButtons.push(exportButton);
        var importButton = new EditorButton((width + margin) / 2, height - (margin + 1.5 * buttonHeight) * 3, (width - margin) / 2 - margin, buttonHeight * 1.5, "Import", function () {
            var code = prompt("Please enter your level code:");
            if (code && code.length) {
                levelString = code.replace(/[/]/g, "\n");
                StartEditor();
            }
        });
        editorButtons.push(importButton);
        var testButton = new EditorButton(margin, height - (margin + 1.5 * buttonHeight) * 4, width - margin * 2, buttonHeight * 1.5, "Test Level", function () { gameMode = Mode.test; });
        editorButtons.push(testButton);
        var mainMenuButton = new EditorButton(margin, height - (margin + 1.5 * buttonHeight) * 1, width - margin * 2, buttonHeight * 1.5, "Exit to Main Menu", function () { gameMode = Mode.play; MainMenu(); });
        editorButtons.push(mainMenuButton);
    }
    view.ctx.fillStyle = "rgba(45,45,63,0.3)";
    view.ctx.fillRect(width, 0, 5, view.height);
    view.ctx.fillStyle = "rgba(45,45,63,1)";
    view.ctx.fillRect(0, 0, width, view.height);
    for (var _i = 0, editorButtons_3 = editorButtons; _i < editorButtons_3.length; _i++) {
        var b = editorButtons_3[_i];
        b.draw(view);
    }
}
//# sourceMappingURL=editor.js.map