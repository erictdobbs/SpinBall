
var saveFile: SaveFile;
var currentLevels: LevelSet;
var soundHandler: SoundHandler;
window.onload = () => {
    saveFile = new SaveFile();
    let canvas = <HTMLCanvasElement>document.getElementById("canvas");
    view = new View(canvas);
    soundHandler = new SoundHandler(document.getElementById("audio"));

    document.onkeydown = keyboardState.handleKeyDown;
    document.onkeyup = keyboardState.handleKeyUp;

    canvas.addEventListener("mousedown", mouseHandler.onMouseDown, false);
    canvas.addEventListener("mouseup", mouseHandler.onMouseUp, false);
    canvas.addEventListener("mousemove", mouseHandler.onMouseMove, false);
    canvas.addEventListener("touchstart", mouseHandler.onMouseDown, false);
    canvas.addEventListener("touchmove", mouseHandler.onMouseMove, false);
    canvas.addEventListener("touchend", mouseHandler.onMouseUp, false);
    //canvas.addEventListener("wheel", mouseHandler.onMouseScroll, false);
    canvas.oncontextmenu = function (e) { e.preventDefault(); };

    window.onresize = () => { view.onResize(); };
    //loadLevels();
    //currentLevels = new LevelSet(levels, 40);
    //StartEditor();
    MainMenu();
    MainLoop();
}

//var lastUpdate = +(new Date());
var framesPerSecond = 60;
var msPerUpdate = 1000 / framesPerSecond;
function MainLoop() {
    HandleMusic();
    mouseHandler.UpdateMouseDelta();
    UITick();
    //var now = +(new Date());
    //if (now >= lastUpdate + msPerUpdate) {

    view.clear();
    keyboardState.cycleKeyState();
    //if (currentLevels) currentLevels.Step((now - lastUpdate)/1000);
    if (currentLevels) currentLevels.Step(msPerUpdate / 1000);
    if (currentLevels) currentLevels.Draw(view);

    DrawUI();
    //    lastUpdate = now;
    //}
    setTimeout(() => {
        MainLoop();
    }, msPerUpdate)
}
/* typescript */ if (false) { var planck; }

var gravityStrength = 10;

function HandleMusic(): void {

    if (editorButtons.length) {
        soundHandler.play("level4");
    } else if (currentLevels && currentLevels.currentLevel) {
        let level = currentLevels.currentLevel;
        if (level.complete && !currentLevels.nextLevel) {
            soundHandler.play("victory");
        } else if (!currentLevels.timeOut) {
            if (level.difficulty === 1) soundHandler.play("level4");
            if (level.difficulty === 2) soundHandler.play("level1");
            if (level.difficulty === 3) soundHandler.play("level2");
            if (level.difficulty === 4) soundHandler.play("level3");
            if (level.difficulty === 5) soundHandler.play("title");
        }
    } else {
        soundHandler.play("title");
    }

}