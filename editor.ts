enum Mode {
    edit,
    test,
    play
}

var gameMode = Mode.play;
var levelString = `
#####
#___#
#_x_#
#####
`;

function StartEditor() {
    gameMode = Mode.edit;
    currentLevels = new LevelSet([
        new Level(0, levelString, true)
    ], 0)
}

function EditorTick() {
    if (mouseHandler.isMouseLeftClicked) {
        for (let b of editorButtons) {
            if (b.isMouseWithin()) {
                b.onClick();
            }
        }
        if (mouseHandler.mouseX <= editorPaneWidth) return;

        var activeButton = <EditorButtonElement>editorButtons.find(x => x instanceof EditorButtonElement && x.isActive);
        var levelTile = levelTiles[activeButton.index];
        let char = levelTile.character;
        if (char == "x" && !mouseHandler.isMouseLeftChanged) return;
        let cell = view.getBottomLeftGameCoordOfMouseOverCell();
        let stringX = (cell.x) / 2;
        let stringY = -(cell.y) / 2;

        if (char == "x") levelString = levelString.replace('x', ' ');
        levelString = ReplaceChar(levelString, char, stringX, stringY);
        StartEditor();
    } else if (mouseHandler.isMouseRightChanged) {
        // pick
        let cell = view.getBottomLeftGameCoordOfMouseOverCell();
        let stringX = cell.x / 2;
        let stringY = -cell.y / 2;
        let char = "_";
        try {
            char = levelString.split('\n')[stringY][stringX];
            if (char == " ") char = "_";
        } catch (e) { }
        try {
            let tile = levelTiles.find(x => x.character == char);
            let tileIndex = levelTiles.indexOf(tile);
            editorButtons[tileIndex].onClick();
        } catch (e) { }
    }
    if (keyboardState.isLeftPressed()) view.offsetX -= 1;
    if (keyboardState.isRightPressed()) view.offsetX += 1;
    if (keyboardState.isDownPressed()) view.offsetY -= 1;
    if (keyboardState.isUpPressed()) view.offsetY += 1;
}

function ReplaceChar(str: string, newChar: string, stringX: number, stringY: number): string {
    for (; stringY < 0; stringY++) {
        str = '\n' + str;
        view.y -= 2;
    }
    for (; stringX < 0; stringX++) {
        str = "_" + str;
        str = str.replace(/\r?\n/g, '\n ');
        view.x += 2;
    }
    let lines = str.split('\n');

    for (; stringY >= lines.length; lines.push(''));
    let lineToChange = lines[stringY];
    for (; stringX >= lineToChange.length; lineToChange += '_');
    lineToChange = lineToChange.substr(0, stringX) + newChar + lineToChange.substr(stringX + newChar.length);
    lines[stringY] = lineToChange;
    return lines.join('\n');
}



var editorButtons: BaseMenuElement[] = [];
var editorPaneWidth: number = 350;
var editorTestCompleteTime: number = 0;
function DrawEditorPane(view: View) {
    let width = editorPaneWidth;
    let margin = 10;
    let columns = 2;
    if (!editorButtons.length) {
        let editorItemCount = levelTiles.length;
        let height = view.height;
        let rows = Math.ceil(editorItemCount / columns) + 8; // leave space for extra rows for bonus margin
        let buttonWidth = (width - margin) / columns - margin;
        let buttonHeight = Math.min(50, (height - margin) / rows - margin);

        for (let tIdx = 0; tIdx < levelTiles.length; tIdx++) {
            let t = levelTiles[tIdx];
            let x = margin + (margin + buttonWidth) * (tIdx % columns);
            let y = margin + (margin + buttonHeight) * (1 + Math.floor(tIdx / columns));
            let b = new EditorButtonElement(x, y, buttonWidth, buttonHeight, tIdx, t.name, tIdx == 0);
            editorButtons.push(b);
        }

        let exportButton = new EditorButton(
            margin, height - (margin + 1.5 * buttonHeight)*3, (width - margin) / 2 - margin, buttonHeight * 1.5,
            "Export", () => {
                prompt("Here's your level code:", levelString.replace(/\r?\n/g, '/'));
            });
        editorButtons.push(exportButton);

        let importButton = new EditorButton(
            (width + margin) / 2, height - (margin + 1.5 * buttonHeight)*3, (width - margin) / 2 - margin, buttonHeight * 1.5,
            "Import", () => {
                let code = prompt("Please enter your level code:");
                if (code && code.length) {
                    levelString = code.replace(/[/]/g, "\n");
                    StartEditor();
                }
            });
        editorButtons.push(importButton);

        let testButton = new EditorButton(
            margin, height - (margin + 1.5 * buttonHeight) * 4, width - margin * 2, buttonHeight * 1.5,
            "Test Level", () => { gameMode = Mode.test });
        editorButtons.push(testButton);

        let mainMenuButton = new EditorButton(
            margin, height - (margin + 1.5 * buttonHeight) * 1, width - margin * 2, buttonHeight * 1.5,
            "Exit to Main Menu", () => { gameMode = Mode.play; MainMenu(); });
        editorButtons.push(mainMenuButton);
    }

    view.ctx.fillStyle = "rgba(45,45,63,0.3)";
    view.ctx.fillRect(width, 0, 5, view.height);
    view.ctx.fillStyle = "rgba(45,45,63,1)";
    view.ctx.fillRect(0, 0, width, view.height);
    for (let b of editorButtons) b.draw(view);
}