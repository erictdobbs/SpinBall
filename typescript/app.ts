
var currentLevels: LevelSet;
var soundHandler: SoundHandler;
window.onload = () => {
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

    window.onresize = () => {view.onResize();};
    //loadLevels();
    //currentLevels = new LevelSet(levels, 40);
    //StartEditor();
    MainMenu();
    MainLoop();
}

var lastUpdate = +(new Date());
var framesPerSecond = 60;
var msPerUpdate = 1000 / framesPerSecond;
function MainLoop() {
    mouseHandler.UpdateMouseDelta();
    UITick();
    var now = +(new Date());
    if (now >= lastUpdate + msPerUpdate) {

        view.clear();
        keyboardState.cycleKeyState();
        if (currentLevels) currentLevels.Step((now - lastUpdate)/1000);
        if (currentLevels) currentLevels.Draw(view);
        
        DrawUI();
        lastUpdate = now;
    }
    requestAnimationFrame(() => {
        MainLoop();
    })
}
/* typescript */ if (false) { var planck; }

var gravityStrength = 10;

function StartMainMenu(): void {

}