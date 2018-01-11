var currentLevel;
window.onload = function () {
    var canvas = document.getElementById("canvas");
    view = new View(canvas);
    document.onkeydown = keyboardState.handleKeyDown;
    document.onkeyup = keyboardState.handleKeyUp;
    window.onresize = function () { view.onResize(); };
    loadLevels();
    currentLevel = levels[levels.length - 1];
    DrawLoop();
};
var lastUpdate = +(new Date());
var framesPerSecond = 60;
var msPerUpdate = 1000 / framesPerSecond;
function DrawLoop() {
    var now = +(new Date());
    if (now >= lastUpdate + msPerUpdate) {
        keyboardState.cycleKeyState();
        currentLevel.Step((now - lastUpdate) / 1000);
        lastUpdate = now;
        if (currentLevel.world)
            view.draw(currentLevel.world);
    }
    requestAnimationFrame(function () {
        DrawLoop();
    });
}
if (false) {
    var planck;
}
var gravityStrength = 10;
//# sourceMappingURL=app.js.map