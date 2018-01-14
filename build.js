var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var currentLevels;
window.onload = function () {
    var canvas = document.getElementById("canvas");
    view = new View(canvas);
    document.onkeydown = keyboardState.handleKeyDown;
    document.onkeyup = keyboardState.handleKeyUp;
    canvas.addEventListener("mousedown", mouseHandler.onMouseDown, false);
    canvas.addEventListener("mouseup", mouseHandler.onMouseUp, false);
    canvas.addEventListener("mousemove", mouseHandler.onMouseMove, false);
    canvas.addEventListener("touchstart", mouseHandler.onMouseDown, false);
    canvas.addEventListener("touchmove", mouseHandler.onMouseMove, false);
    canvas.addEventListener("touchend", mouseHandler.onMouseUp, false);
    canvas.oncontextmenu = function (e) { e.preventDefault(); };
    window.onresize = function () { view.onResize(); };
    loadLevels();
    MainMenu();
    MainLoop();
};
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
        if (currentLevels)
            currentLevels.Step((now - lastUpdate) / 1000);
        if (currentLevels)
            currentLevels.Draw(view);
        DrawUI();
        lastUpdate = now;
    }
    requestAnimationFrame(function () {
        MainLoop();
    });
}
if (false) {
    var planck;
}
var gravityStrength = 10;
function StartMainMenu() {
}
var Mode;
(function (Mode) {
    Mode[Mode["edit"] = 0] = "edit";
    Mode[Mode["test"] = 1] = "test";
    Mode[Mode["play"] = 2] = "play";
})(Mode || (Mode = {}));
var gameMode = Mode.play;
var levelString = "\n#####\n#___#\n#_x_#\n#####\n";
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
        str = "_" + str;
        str = str.replace(/\r?\n/g, '\n ');
        view.x += 2;
    }
    var lines = str.split('\n');
    for (; stringY >= lines.length; lines.push(''))
        ;
    var lineToChange = lines[stringY];
    for (; stringX >= lineToChange.length; lineToChange += '_')
        ;
    lineToChange = lineToChange.substr(0, stringX) + newChar + lineToChange.substr(stringX + newChar.length);
    lines[stringY] = lineToChange;
    return lines.join('\n');
}
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
        var rows = Math.ceil(editorItemCount / columns) + 8;
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
    for (var _i = 0, editorButtons_2 = editorButtons; _i < editorButtons_2.length; _i++) {
        var b = editorButtons_2[_i];
        b.draw(view);
    }
}
var Key = {
    None: 0, Enter: 13, Shift: 16, Ctrl: 17, Alt: 18, Pause: 19, Escape: 27, Space: 32, PageUp: 33, PageDown: 34,
    End: 35, Home: 36, Left: 37, Up: 38, Right: 39, Down: 40, Insert: 45, Delete: 46,
    Digit0: 48, Digit1: 49, Digit2: 50, Digit3: 51, Digit4: 52, Digit5: 53, Digit6: 54, Digit7: 55, Digit8: 56, Digit9: 57,
    A: 65, B: 66, C: 67, D: 68, E: 69, F: 70, G: 71, H: 72, I: 73, J: 74, K: 75, L: 76, M: 77, N: 78, O: 79,
    P: 80, Q: 81, R: 82, S: 83, T: 84, U: 85, V: 86, W: 87, X: 88, Y: 89, Z: 90,
    LWindow: 91, RWindow: 92, ContextMenu: 93,
    NumPad0: 96, NumPad1: 97, NumPad2: 98, NumPad3: 99, NumPad4: 100, NumPad5: 101, NumPad6: 102, NumPad7: 103, NumPad8: 104, NumPad9: 105,
    NumPadMultiply: 106, NumPadAdd: 107, NumPadEnter: 108, NumPadSubtract: 109, NumPadDecimal: 110, NumPadDivide: 111,
    F1: 112, F2: 113, F3: 114, F4: 115, F5: 116, F6: 117, F7: 118, F8: 119, F9: 120, F10: 121, F11: 122, F12: 123,
    NumLock: 144, ScrollLock: 145,
    SemiColon: 186, Equal: 187, Comma: 188, Minus: 189, Period: 190, Slash: 191, Backtick: 192,
    LeftBracket: 219, BackSlash: 220, RightBracket: 221, Quote: 222
};
var KeyboardHandler = (function () {
    function KeyboardHandler() {
        this.keyState = {};
        this.keyStateOld = {};
        this.handleKeyDown = function (e) {
            e = e || window.event;
            keyboardState.keyState[e.keyCode] = true;
        };
        this.handleKeyUp = function (e) {
            e = e || window.event;
            keyboardState.keyState[e.keyCode] = false;
        };
        this.isKeyChanged = function (key) { return this.keyState[key] !== this.keyStateOld[key]; };
    }
    KeyboardHandler.prototype.isLeftPressed = function () { return this.keyState[Key.Left] || this.keyState[Key.A]; };
    KeyboardHandler.prototype.isRightPressed = function () { return this.keyState[Key.Right] || this.keyState[Key.D]; };
    KeyboardHandler.prototype.isDownPressed = function () { return this.keyState[Key.Down] || this.keyState[Key.S]; };
    KeyboardHandler.prototype.isAnyPressed = function () {
        for (var k in this.keyState) {
            if (this.keyState[k])
                return true;
        }
        return false;
    };
    KeyboardHandler.prototype.cycleKeyState = function () {
        for (var key in this.keyState) {
            this.keyStateOld[key] = this.keyState[key];
        }
    };
    return KeyboardHandler;
}());
var keyboardState = new KeyboardHandler();
var Level = (function () {
    function Level(difficulty, levelString, fullRotation) {
        this.difficulty = difficulty;
        this.levelString = levelString;
        this.fullRotation = fullRotation;
        this.pushers = [];
        this.complete = false;
        this.secondsToComplete = 0;
        this.timerExtend = 30;
    }
    Level.prototype.Step = function (delta) {
        if (gameMode == Mode.edit) {
            EditorTick();
            return;
        }
        if (this.world) {
            this.world.step(delta);
            this.OnWorldStep(this.world);
        }
    };
    Level.prototype.OnWorldStep = function (world) {
        if (!this.startTime)
            this.startTime = +(new Date());
        var secondsPerRotation = 2.0;
        var framesPerSecond = 60;
        var framesPerRotation = framesPerSecond * secondsPerRotation;
        var rotateSpeed = (2 * Math.PI) / framesPerRotation;
        if (keyboardState.isLeftPressed() && keyboardState.isRightPressed()) {
        }
        else if (keyboardState.isRightPressed()) {
            this.RotateGrav(world, rotateSpeed);
        }
        else if (keyboardState.isLeftPressed()) {
            this.RotateGrav(world, -rotateSpeed);
        }
        else {
        }
        if (keyboardState.isDownPressed() && gameMode == Mode.test) {
            StartEditor();
        }
        if (this.ball) {
            var cp = this.ball.getPosition();
            var currentVelocity = this.ball.getLinearVelocity();
            var maxSpeed = 20;
            this.ball.setLinearVelocity(currentVelocity.clamp(maxSpeed));
            var pushedDirections = [];
            for (var _i = 0, _a = this.pushers; _i < _a.length; _i++) {
                var pusher = _a[_i];
                var ud = pusher.userData;
                if (ud.active && pushedDirections.indexOf(ud.direction) == -1) {
                    var strength = 0.2;
                    var impulseVector = planck.Vec2(strength * ud.direction.x, strength * ud.direction.y);
                    this.ball.applyLinearImpulse(impulseVector, cp, true);
                    pushedDirections.push(ud.direction);
                }
            }
        }
    };
    Level.prototype.RotateGrav = function (world, r) {
        var gravityVec = world.getGravity();
        var angle = Math.atan2(gravityVec.y, gravityVec.x);
        var newAngle = angle + r;
        if (!this.fullRotation) {
            if (newAngle < -Math.PI * 3 / 4)
                newAngle = -Math.PI * 3 / 4;
            if (newAngle > -Math.PI * 1 / 4)
                newAngle = -Math.PI * 1 / 4;
        }
        var gravX = Math.cos(newAngle) * gravityStrength;
        var gravY = Math.sin(newAngle) * gravityStrength;
        world.setGravity(planck.Vec2(gravX, gravY));
        view.setRotation(newAngle);
    };
    Level.prototype.loadWorld = function () {
        loadLevelTiles();
        view.setRotation(-Math.PI / 2);
        var pl = planck, Vec2 = pl.Vec2;
        var world = new pl.World({
            gravity: Vec2(0, -gravityStrength)
        });
        function AddBreakWall(x, y) {
            var bWall = world.createBody(Vec2(x, y));
            bWall.createFixture(pl.Box(0.5, 0.5), fds.breakWall);
        }
        world.on('post-solve', function (contact) {
            var currentLevel = currentLevels.currentLevel;
            var fA = contact.getFixtureA(), bA = fA.getBody();
            var fB = contact.getFixtureB(), bB = fB.getBody();
            var myBouncer = fA.getUserData() == fds.bouncer.userData && bA || fB.getUserData() == fds.bouncer.userData && bB;
            var myBall = fA.getUserData() == fds.ball.userData && bA || fB.getUserData() == fds.ball.userData && bB;
            var myGoal = fA.getUserData() == fds.goal.userData && bA || fB.getUserData() == fds.goal.userData && bB;
            var myBreakWall = fA.getUserData() == fds.breakWall.userData && bA || fB.getUserData() == fds.breakWall.userData && bB;
            if (myBouncer && myBall) {
                var pBall = myBall.getPosition();
                var pBouncer = myBouncer.getPosition();
                var pAngle = Math.atan2(pBall.y - pBouncer.y, pBall.x - pBouncer.x);
                var strength = 10;
                var impulseVector = Vec2(strength * Math.cos(pAngle), strength * Math.sin(pAngle));
                myBall.applyLinearImpulse(impulseVector, pBall, true);
            }
            if (myBall && myGoal) {
                var completionTime = +(new Date()) - currentLevel.startTime;
                currentLevel.complete = true;
                currentLevel.secondsToComplete = Math.floor(completionTime) / 1000;
            }
            if (myBall && myBreakWall) {
                var speed = myBall.getLinearVelocity().length();
                if (speed > 3) {
                    setTimeout(function () { try {
                        currentLevel.world.destroyBody(myBreakWall);
                    }
                    catch (e) { } }, 1);
                }
            }
        });
        world.on('begin-contact', function (contact) {
            var fA = contact.getFixtureA(), bA = fA.getBody();
            var fB = contact.getFixtureB(), bB = fB.getBody();
            var myBall = fA.getUserData() == fds.ball.userData && bA || fB.getUserData() == fds.ball.userData && bB;
            var myPusher = fA.getUserData() == fds.pusher.userData && bA || fB.getUserData() == fds.pusher.userData && bB;
            if (myBall && myPusher) {
                myPusher.userData.active = true;
            }
        });
        world.on('end-contact', function (contact) {
            var fA = contact.getFixtureA(), bA = fA.getBody();
            var fB = contact.getFixtureB(), bB = fB.getBody();
            var myBall = fA.getUserData() == fds.ball.userData && bA || fB.getUserData() == fds.ball.userData && bB;
            var myPusher = fA.getUserData() == fds.pusher.userData && bA || fB.getUserData() == fds.pusher.userData && bB;
            if (myBall && myPusher) {
                myPusher.userData.active = false;
            }
        });
        this.world = world;
        for (var lineNum = 0; lineNum < this.levelString.split('\n').length; lineNum++) {
            var line = this.levelString.split('\n')[lineNum];
            var line2 = this.levelString.split('\n')[lineNum + 1];
            for (var charNum = 0; charNum < line.length; charNum++) {
                var x = charNum * 2;
                var y = -lineNum * 2;
                var cha = line[charNum];
                var lt = levelTiles.find(function (l) { return l.character == cha; });
                if (lt)
                    lt.addToLevel(this, x, y);
            }
        }
    };
    Level.prototype.AddPin = function (x, y) {
        var pin = this.world.createBody(planck.Vec2(x, y));
        pin.createFixture(planck.Circle(0.25), fds.pin);
    };
    Level.prototype.AddTriangle = function (x, y, rotation) {
        x += 0.5;
        y += 0.5;
        var wall = this.world.createBody(planck.Vec2(x, y), rotation);
        var vs = [planck.Vec2(1, -1), planck.Vec2(-1, 1), planck.Vec2(-1, -1)];
        wall.createFixture(planck.Polygon(vs), fds.wall);
    };
    Level.prototype.AddPusher = function (x, y, direction) {
        var pusher = this.world.createBody(planck.Vec2(x + 0.5, y + 0.5));
        pusher.userData = { direction: direction, active: false };
        pusher.createFixture(fds.pusher);
        this.pushers.push(pusher);
    };
    Level.prototype.AddCurve = function (x, y, rotation) {
        var wall = this.world.createBody(planck.Vec2(x + 0.5, y + 0.5), rotation);
        var vs = [];
        var segments = 10;
        for (var i = 0; i <= segments; i++) {
            var theta = i / segments * Math.PI / 2 + Math.PI;
            var cx = 2 * Math.cos(theta) + 1;
            var cy = 2 * Math.sin(theta) + 1;
            vs.push(planck.Vec2(cx, cy));
        }
        for (var i = 0; i < segments; i++) {
            var ps = [planck.Vec2(-1, -1), planck.Vec2(vs[i].x, vs[i].y), planck.Vec2(vs[i + 1].x, vs[i + 1].y)];
            wall.createFixture(planck.Polygon(ps), fds.curve);
        }
    };
    Level.prototype.AddBreakWall = function (x, y) {
        var bWall = this.world.createBody(planck.Vec2(x, y));
        bWall.createFixture(planck.Box(0.5, 0.5), fds.breakWall);
    };
    return Level;
}());
var fds = {
    ball: null,
    wall: null,
    curve: null,
    bouncer: null,
    pin: null,
    goal: null,
    pusher: null,
    breakWall: null
};
var Direction = (function () {
    function Direction(x, y) {
        this.x = x;
        this.y = y;
        this.innerArrow = [];
        this.innerArrow.push({ x: x * 0.5, y: y * 0.5 });
        if (!x)
            this.innerArrow.push({ x: y * 0.5, y: 0 }, { x: -y * 0.5, y: 0 });
        if (!y)
            this.innerArrow.push({ x: 0, y: x * 0.5 }, { x: 0, y: -x * 0.5 });
    }
    Direction.Left = new Direction(-1, 0);
    Direction.Right = new Direction(1, 0);
    Direction.Up = new Direction(0, 1);
    Direction.Down = new Direction(0, -1);
    return Direction;
}());
var LevelTile = (function () {
    function LevelTile(character, name, addToLevel) {
        this.character = character;
        this.name = name;
        this.addToLevel = addToLevel;
    }
    return LevelTile;
}());
var levelTiles = [];
function loadLevelTiles() {
    fds = {
        ball: { userData: 'ball', density: 1.0, friction: 0.9, restitution: 0.0 },
        wall: { density: 0.0, friction: 0.2, restitution: 0.5 },
        curve: { density: 0.0, friction: 0.2, restitution: 0.1 },
        bouncer: { density: 0.0, friction: 0.2, userData: 'bouncer' },
        pin: { density: 0.0, friction: 0.2, restitution: 0.9 },
        goal: { density: 0.0, friction: 0.2, userData: 'goal' },
        pusher: { shape: planck.Box(1, 1), isSensor: true, userData: "pusher" },
        breakWall: { density: 0.0, friction: 0.2, restitution: 0.1, userData: "breakWall" }
    };
    levelTiles = [
        new LevelTile("x", "Ball Start", function (level, x, y) {
            view.setTranslation(x, y);
            var ball = level.world.createDynamicBody(planck.Vec2(x + 0.5, y));
            ball.setSleepingAllowed(false);
            ball.createFixture(planck.Circle(0.45), fds.ball);
            level.ball = ball;
        }),
        new LevelTile("#", "Wall", function (level, x, y) {
            var wall = level.world.createBody(planck.Vec2(x + 0.5, y + 0.5));
            wall.createFixture(planck.Box(1, 1), fds.wall);
        }),
        new LevelTile("g", "Goal", function (level, x, y) {
            var goal = level.world.createBody(planck.Vec2(x + 0.5, y + 0.5));
            goal.createFixture(planck.Box(1, 1), fds.goal);
        }),
        new LevelTile("o", "Bouncer", function (level, x, y) {
            var bouncer = level.world.createBody(planck.Vec2(x + 0.5, y + 0.5));
            bouncer.createFixture(planck.Circle(1), fds.bouncer);
        }),
        new LevelTile(".", "Pin", function (level, x, y) {
            level.AddPin(x + 0.5, y + 0.5);
        }),
        new LevelTile("+", "Pin Cross", function (level, x, y) {
            level.AddPin(x, y + 0.5);
            level.AddPin(x + 1, y + 0.5);
            level.AddPin(x + 0.5, y + 1);
            level.AddPin(x + 0.5, y);
        }),
        new LevelTile(":", "Pin Vertical Pair", function (level, x, y) {
            level.AddPin(x + 0.5, y);
            level.AddPin(x + 0.5, y + 1);
        }),
        new LevelTile("…", "Pin Horizontal Pair", function (level, x, y) {
            level.AddPin(x, y + 0.5);
            level.AddPin(x + 1, y + 0.5);
        }),
        new LevelTile("◣", "Diagonal Up Left", function (level, x, y) {
            level.AddTriangle(x, y, 0);
        }),
        new LevelTile("◢", "Diagonal Up Right", function (level, x, y) {
            level.AddTriangle(x, y, Math.PI / 2);
        }),
        new LevelTile("◤", "Diagonal Down Left", function (level, x, y) {
            level.AddTriangle(x, y, -Math.PI / 2);
        }),
        new LevelTile("◥", "Diagonal Down Right", function (level, x, y) {
            level.AddTriangle(x, y, Math.PI);
        }),
        new LevelTile("◟", "Curve Up Left", function (level, x, y) {
            level.AddCurve(x, y, 0);
        }),
        new LevelTile("◞", "Curve Up Right", function (level, x, y) {
            level.AddCurve(x, y, Math.PI / 2);
        }),
        new LevelTile("◜", "Curve Down Left", function (level, x, y) {
            level.AddCurve(x, y, -Math.PI / 2);
        }),
        new LevelTile("◝", "Curve Down Right", function (level, x, y) {
            level.AddCurve(x, y, Math.PI);
        }),
        new LevelTile("<", "Pusher Left", function (level, x, y) {
            level.AddPusher(x, y, Direction.Left);
        }),
        new LevelTile(">", "Pusher Right", function (level, x, y) {
            level.AddPusher(x, y, Direction.Right);
        }),
        new LevelTile("^", "Pusher Up", function (level, x, y) {
            level.AddPusher(x, y, Direction.Up);
        }),
        new LevelTile("v", "Pusher Down", function (level, x, y) {
            level.AddPusher(x, y, Direction.Down);
        }),
        new LevelTile("m", "Breakwall Pair Bottom", function (level, x, y) {
            level.AddBreakWall(x, y);
            level.AddBreakWall(x + 1, y);
        }),
        new LevelTile("_", "ERASER", function (level, x, y) { })
    ];
}
var levels = [];
function loadLevels() {
    levels.push(new Level(0, "\n     #########\n     #       #\n     # x     #\n     ##\u25E3g#   #\n          ggg \n", false));
    levels.push(new Level(1, "\n     #########\n     #       #\n     # x     #\n     #####   #######\n     #             #\n     #             #\n######  \u25E5#######\u25E4  ######\n#                       #\n#        #  g  #        #\n#  #######  g  #######  #\n#                       #\n#         \u25E2###\u25E3         #\n#########################\n", false));
    levels.push(new Level(4, "\n#######     ############\n#o    #     #          #\n#     #\u2026\u2026\u2026\u2026\u2026#  \u25E2 \u25E3     #\n#  #                   #\n#   o #\u2026\u2026\u2026\u2026\u2026#  \u25E5 \u25E4     #\n#    o#     #### #######\n### ###        : :\n  : :          : :\n  : :          : +\u2026\u2026\u2026\u2026+\n  : :          :      :\n  # ######     +\u2026\u2026\u2026\u2026+ :\n  #   .  #          : :\n  # .  . #\u2026\u2026\u2026####   : :\n  #             #   : :\n  # . . .#\u2026\u2026\u2026#  #   ggg\n  #      #   # x#   ggg\n  ########   ####   \n", true));
    levels.push(new Level(3, "\n##########################\n##########################\n##\u25DC        \u25E5###        \u25DD##\n##          \u25E5##         ##\n##      #\u25E3        ###   ##\n##      \u25E5#\u25E3       ##    ##\n#####    ###########    ##\n#####    ###########   ###\n##       ##       ##   ###\n##       ##       ##    ##\n##   o##### x ##  ##    ##\n##    ##########  ####  ##\n##mmmm##    ###    ###gg##\n##    ##    ####  ########\n##    ##  #####    #######\n##o   ##  ######  ########\n##    ##  ######       \u25DD##\n##    ##      ##\u25E3       ##\n##    ##      ###### o  ##\n##        ##            ##\n##       \u25E2##\u25DF          \u25DE##\n##########################\n##########################\n", true));
    levels.push(new Level(5, "\n##########################\n##########################\n##                   <<\u25DD##\n##                   << ##\n##        \u25E2#\u25E3        ##^##\n##   \u25DE\u25DF   \u25E5#\u25E4   \u25DE\u25DF   ##^##\n##    .         .    ##^##\n##      ..   ..      ##^##\n##  \u25DE\u25DF     .     \u25DE\u25DF  ##^##\n##        \u25E2#\u25E3        ##^##\n##    .         .    ##^##\n##o .    .   .    . o##^##\n##     .  <^>  .     ##^##\n##   o   <mmm>   o   ##^##\n##\u25E3      #ggg#      \u25E2##^##\n###\u25E3  .  \u25E5###\u25E4  .  \u25E2###^##\n##\u25E4  . .       . .  \u25E5##^##\n##  . o .     . o .  ##^##\n## . . . . . . . . . ##^##\n##. . . . . . . . . .##^##\n#\u25DC  <<< <<< <<< <<< \u25E2##^##\n#  x###################^##\n#\u25DF>>>>>>>>>>>>>>>>>>>>>\u25DE##\n##########################\n##########################\n", false));
    levels.push(new Level(2, "\n         #################\n         #################\n###########            \u25DD##\n###########             ##\n##       ##    #####    ##\n## x           #####    ##\n##    ##       ##       ##\n###########    ##      \u25DE##\n#################  #######\n##              #  #######\n##              #  ##\n##  ####### .. ##  ##\n##  ####### .. ##  ##\u25E3\n##  #######\u25E3  \u25E2##  \u25E5##\u25E3\n##   #######gg###\u25E3  \u25E5##\u25E3\n##      ##########\u25E3  \u25E5##\u25E3\n##  . .   #####  ##\u25E3  \u25E5###\n##     .  \u25E5##     \u25E5#\u25E3  \u25E5##\n##### .  . ##      \u25E5#\u25E3  ##\n #####\u25E3    ##  ##\u25E3  \u25E5#  ##\n  #####\u25E3   ##  ###\u25E3     ##\n   ######  ##  ####\u25E3   \u25E2##\n    #####  ##  ###########\n     ####  ##mm##\n      ###      ##\n       ##      ##\n        #########\n", true));
    levels.push(new Level(1, "\n##############\n#            #\n#            #\n# x          # ######\n##########   # #gggg#\n         #   # #    #\n         #   # #    #\n     #####   # #    #\n     #       # ###  #\n     #       # #    #\n     #       # #    #\n######   ##### #    #\n#        #     #  ###\n#        #     #    #\n#        #    #\u25E4    #\n#    #####   #\u25E4     #\n#    #      #\u25E4     \u25E2#\n#    #######\u25E4     \u25E2#\n#                \u25E2#\n#               \u25E2#\n#              \u25E2#\n################\n", true));
    levels.push(new Level(3, "\n#####################\n#                   #\n# x          #     \u25E2#\n##########^^^####  ##\n#g       #^^^      \u25E5#\n#g       #          #\n#g       #   ########\n#####\u2026\u2026  #   <<<<<<<#\n#        #   <<<<<<<#\n#        #   #      #\n#....#####   #      #\n#    >>>>>          #\n#    >>>>>    o    o#\n#    #########      #\n#\u25E3                 \u25E2#\n##\u25E3               \u25E2##\n#####################\n", true));
    levels.push(new Level(2, "\n#################\n#\u25DC   >  :  <   \u25DD#\n#    >  :  <    #\n#  ####\u25E3 \u25E2##.  .#\n#    ##ggg## .  #\n###  #######    #\n#    #\u25DC x \u25DD#  . #\n#    # ### #  . #\n#    #\u25DF   \u25DE#.   #\n#  ##### ###   .#\n#    #\u25DC   \u25DD# . .#\n###  #  o  #  . #\n#    #\u25DF   \u25DE# .  #\n#  ##### #####  #\n#     <   >     #\n#################\n", true));
    levels.push(new Level(3, "\n##################\n#x   \u25E5\u25E3    \u25E2\u25E4    #\n###\u25E3  \u25E5\u25E3  \u25E2\u25E4  .  #\n#g \u25E5\u25E3  \u25E5\u25E3\u25E2\u25E4  \u25E2\u25E4  #\n#g  \u25E5\u25E3  \u25E5\u25E4  \u25E2\u25E4  \u25E2#\n#\u25E2\u25E3  \u25E5\u25E3    \u25E2\u25E4  \u25E2\u25E4#\n#\u25E5\u25E4\u25E2\u25E3 \u25E5\u25E3  \u25E2\u25E4  \u25E2\u25E4 #\n#  \u25E5\u25E4\u25E2\u25E3\u25E5\u25E3\u25E2\u25E4. \u25E2\u25E4  #\n#  \u25E2\u25E3\u25E5\u25E4\u25E2\u25E4\u25E5\u25E3. \u25E5\u25E3  #\n#\u25E2\u25E3\u25E5\u25E4 \u25E2\u25E4..\u25E5\u25E3  \u25E5\u25E3 #\n#\u25E5\u25E4  \u25E2\u25E4    \u25E5\u25E3  \u25E5\u25E3#\n#   \u25E2\u25E4  \u25E2\u25E3  \u25E5\u25E3  \u25E5#\n#  \u25E2\u25E4  \u25E2\u25E4\u25E5\u25E3  \u25E5\u25E3  #\n#  .  \u25E2\u25E4  \u25E5\u25E3  .  #\n#    \u25E2\u25E4    \u25E5\u25E3    #\n##################\n", true));
    levels.push(new Level(3, "\n#############################\n##\u25E4                 o       #\n#\u25E4     \u25E2\u25E3     o             #\n#     \u25E2\u25E4\u25E5\u25E3                  #\n#     \u25E5\u25E3\u25E2################   #\n#      \u25E5#\u25E4    . : . : .     #\n# o     #                  \u25E2#\n#       #     . : . : .   \u25E2##\n#   o   #     ###############\n#       #   \u25E2\u25E3  \u25E2\u25E3  \u25E2\u25E3   #gg#\n#\u2026     \u2026#   \u25E5\u25E4  \u25E5\u25E4  \u25E5\u25E4   #  #\n#       # \u25E2\u25E3  \u25E2\u25E3  \u25E2\u25E3  \u25E2\u25E3 #  #\n#  #o#  # \u25E5\u25E4  \u25E5\u25E4  \u25E5\u25E4  \u25E5\u25E4 #. #\n#  # #  #   \u25E2\u25E3  \u25E2\u25E3  \u25E2\u25E3   #  #\n#  #x#  #   \u25E5\u25E4  \u25E5\u25E4  \u25E5\u25E4   # .#\n#  #m#  # \u25E2\u25E3  \u25E2\u25E3  \u25E2\u25E3  \u25E2\u25E3    #\n#       # \u25E5\u25E4  \u25E5\u25E4  \u25E5\u25E4  \u25E5\u25E4    #\n#############################\n", true));
    levels.push(new Level(4, "\n############################\n#     o     o           <  #\n#                       <  #\n#  ###o#####o############^^#\n#  #          :            #\n#  #          :           \u25DE#\n#  #  \u25E2#####\u25E3   \u25E2###########\n#  #\u25E3       \u25E5###\u25E4         \u25E5#\n#  ##\u25E3                     #\n#  # #\u25E3             \u25E2##\u25E3   #\n#  #  #\u25E3  <<<< .   \u25E2#  #\u25E3  #\n#gg######################^^#\n#  #        \u25E5\u25E4        .  ^^#\n#                  . . . ^^#\n# x  \u25E2\u25E3        #         ^^#\n#############o##############\n", false));
    levels.push(new Level(5, "\n############################\n##########       ###########\n#                .         #\n# x       \u25E2\u25E3         .     #\n#####^######   ###        \u25E2#\n#####\u25DF<<<<<<<<<###       \u25E2##\n##################  ########\n#  . . . . . . . . . . . . #\n# . . . . . . . . . . . .  #\n#  . . . . . . . . . . . . #\n# . . . . . . . . . . . .  #\n#  . . . . . . . . . . . . #\n# . . . . . . . . . . . .  #\n#  . . . . . . . . . . . . #\n#  # # # #^# # # # # # # #^#\n#  #o#v#v#^# # # #o# # # #^#\n#oo###v#v#^#o# #o### #v#v#^#\n######v#v#^##\u25E4 \u25E5#### #v#v#^#\n######\u25DF>>>\u25DE##gggggggg#\u25DF>>>\u25DE#\n############################\n", false));
    levels.push(new Level(3, "\n##################\n#          \u25DD#gggg#\n# x         #o   #\n##########  #    #\n#\u25DC      \u25DD#  #   \u25E5#\n#        #  #    #\n#  o  o  #  #\u25E4   #\n#  #  #     #    #\n#\u25DF\u25DE#  #\u25DF   \u25DE#   \u25E5#\n####  #######    #\n#\u25DC    #\u25DC   \u25DD#\u25E4   #\n#    \u25DE#     #    #\n#  ####  #  #   \u25E5#\n#        #       #\n#\u25DF      \u25DE#\u25DF     \u25DE#\n##################\n", true));
    levels.push(new Level(4, "\n   ###################\n   #\u25DC         ##ggggg#\n   # ####### ###\u25DD   \u25DC#\n####v##### : : #  o  #\n#\u25DC      \u25DD#     #\u25DD   \u25DC#\n# ## ### #     #  .  #\n# ## # # #  x  #\u25DD   \u25DC#\n#\u25DF  \u25DE# # #######     #\n########v##    .     #\n    #\u25DC          o    #\n    # ## ##    .    \u25DE#\n    # ## #############\n    #\u25DF  \u25DE#\n    ######\n", true));
    levels.push(new Level(1, "\n#########\n#       # ############# ############\n#       # #          o# #          #\n# x #   # #           # #          #\n#####   # #           # #          #\n    #   # #    ###    ###   ####   #\n    #   ###    # #          # #g   #\n    #          # #          # #g   #\n    #          # #         o# #g   #\n    #         o# ############ #g   #\n    ############              ######\n", true));
}
var LevelSet = (function () {
    function LevelSet(levels, startingTimer) {
        this.levels = levels;
        this.levelCompleteTimer = 0;
        this.canContinueToNext = false;
        this.showTimerExtend = false;
        this.levelStartTime = 3;
        this.currentLevel = levels[0];
        this.currentLevel.loadWorld();
        this.timer = startingTimer;
    }
    Object.defineProperty(LevelSet.prototype, "readableLevelNumber", {
        get: function () {
            return this.levelIndex + 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LevelSet.prototype, "levelIndex", {
        get: function () {
            return this.levels.indexOf(this.currentLevel);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LevelSet.prototype, "prettyTimeRemaining", {
        get: function () {
            return (Math.floor(this.timer * 100) / 100).toFixed(2);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LevelSet.prototype, "prettyTimeElapsed", {
        get: function () {
            if (!this.currentLevel)
                return '';
            var elapsed = (+(new Date()) - this.currentLevel.startTime) / 1000;
            return (Math.floor(elapsed * 100) / 100).toFixed(2);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LevelSet.prototype, "nextLevel", {
        get: function () {
            var newIndex = this.levelIndex + 1;
            return this.levels[newIndex];
        },
        enumerable: true,
        configurable: true
    });
    LevelSet.prototype.Step = function (delta) {
        if (!this.currentLevel)
            return;
        if (this.currentLevel.complete) {
            if (gameMode == Mode.test) {
                editorTestCompleteTime = (+(new Date()) - this.currentLevel.startTime) / 1000;
                StartEditor();
                return;
            }
            this.levelCompleteTimer += delta;
            if (this.levelCompleteTimer > 2 && !this.showTimerExtend && this.nextLevel) {
                this.timer += this.nextLevel.timerExtend;
                this.showTimerExtend = true;
            }
            if (this.levelCompleteTimer > 4) {
                this.canContinueToNext = true;
            }
        }
        else if (gameMode == Mode.play && this.levelStartTime > 0) {
        }
        else {
            this.currentLevel.Step(delta);
            this.timer -= delta;
        }
        this.levelStartTime -= delta;
        if (this.canContinueToNext && keyboardState.isAnyPressed()) {
            this.StartNextLevel();
        }
    };
    LevelSet.prototype.StartNextLevel = function () {
        this.levelCompleteTimer = 0;
        this.canContinueToNext = false;
        this.currentLevel = this.nextLevel;
        if (this.currentLevel) {
            this.currentLevel.loadWorld();
            this.levelStartTime = 3;
            this.showTimerExtend = false;
        }
        else {
            MainMenu();
        }
    };
    LevelSet.prototype.Draw = function (view) {
        var level = this.currentLevel;
        if (!level)
            return;
        view.draw(level);
        if (gameMode == Mode.test) {
            view.drawCenteredText(this.prettyTimeElapsed, 0.05, 0.05);
            view.drawCenteredText("S/Down to resume editing", 0.04, 0.95);
        }
        if (gameMode == Mode.edit) {
            if (editorTestCompleteTime)
                view.drawCenteredText("Last test play completed in: " + editorTestCompleteTime.toFixed(2), 0.03, 0.95);
        }
        if (gameMode == Mode.play) {
            view.drawCenteredText(this.prettyTimeRemaining, 0.05, 0.05);
            if (level.complete) {
                view.drawCenteredText("Level Complete!", 0.1, 0.35);
                view.drawCenteredText(level.secondsToComplete.toFixed(2) + " seconds", 0.08, 0.55);
                if (this.levelCompleteTimer > 2) {
                    if (this.nextLevel) {
                        var timerExtend = this.nextLevel.timerExtend;
                        if (timerExtend) {
                            view.drawCenteredText("+" + timerExtend + " seconds to timer", 0.06, 0.65);
                        }
                    }
                    else {
                        view.drawCenteredText("Campaign Complete!", 0.08, 0.65);
                    }
                }
                if (this.canContinueToNext) {
                    view.drawCenteredText("Hit any key to continue", 0.06, 0.8);
                }
            }
            else {
                if (this.levelStartTime > 1.5)
                    view.drawCenteredText("Get ready...", 0.1, 0.2);
                else if (this.levelStartTime > 0)
                    view.drawCenteredText("Get set...", 0.15, 0.2);
                else if (this.levelStartTime > -0.5)
                    view.drawCenteredText("Go!", 0.2, 0.2);
            }
        }
    };
    return LevelSet;
}());
var MouseHandler = (function () {
    function MouseHandler() {
        this.mouseX = 0;
        this.mouseY = 0;
        this.oldMouseX = 0;
        this.oldMouseY = 0;
        this.isMouseLeftClicked = false;
        this.oldIsMouseLeftClicked = false;
        this.isMouseLeftChanged = false;
        this.isMouseRightClicked = false;
        this.oldIsMouseRightClicked = false;
        this.isMouseRightChanged = false;
        this.mouseDeltaX = 0;
        this.mouseDeltaY = 0;
        this.m_isMouseLeftClicked = false;
        this.m_isMouseRightClicked = false;
        this.m_mouseX = 0;
        this.m_mouseY = 0;
    }
    MouseHandler.prototype.onMouseDown = function (e) {
        if (e.button === undefined || e.button === 0) {
            mouseHandler.m_isMouseLeftClicked = true;
            mouseHandler.m_mouseX = e.pageX;
            mouseHandler.m_mouseY = e.pageY;
        }
        else if (e.button == 2) {
            mouseHandler.m_isMouseRightClicked = true;
            mouseHandler.m_mouseX = e.pageX;
            mouseHandler.m_mouseY = e.pageY;
        }
    };
    MouseHandler.prototype.onMouseUp = function (e) {
        if (e.button === undefined || e.button === 0) {
            mouseHandler.m_isMouseLeftClicked = false;
        }
        else if (e.button == 2) {
            mouseHandler.m_isMouseRightClicked = false;
        }
    };
    MouseHandler.prototype.onMouseMove = function (e) {
        var pageX = e.pageX;
        var pageY = e.pageY;
        var x = pageX;
        var y = pageY;
        mouseHandler.mouseDeltaX = x - mouseHandler.m_mouseX;
        mouseHandler.mouseDeltaY = y - mouseHandler.m_mouseY;
        mouseHandler.m_mouseX = x;
        mouseHandler.m_mouseY = y;
    };
    MouseHandler.prototype.UpdateMouseDelta = function () {
        mouseHandler.mouseX = mouseHandler.m_mouseX;
        mouseHandler.mouseY = mouseHandler.m_mouseY;
        mouseHandler.isMouseLeftClicked = mouseHandler.m_isMouseLeftClicked;
        mouseHandler.isMouseRightClicked = mouseHandler.m_isMouseRightClicked;
        mouseHandler.mouseDeltaX = mouseHandler.mouseX - mouseHandler.oldMouseX;
        mouseHandler.mouseDeltaY = mouseHandler.mouseY - mouseHandler.oldMouseY;
        mouseHandler.oldMouseX = mouseHandler.mouseX;
        mouseHandler.oldMouseY = mouseHandler.mouseY;
        mouseHandler.isMouseLeftChanged = (mouseHandler.oldIsMouseLeftClicked != mouseHandler.isMouseLeftClicked);
        mouseHandler.oldIsMouseLeftClicked = mouseHandler.isMouseLeftClicked;
        mouseHandler.isMouseRightChanged = (mouseHandler.oldIsMouseRightClicked != mouseHandler.isMouseRightClicked);
        mouseHandler.oldIsMouseRightClicked = mouseHandler.isMouseRightClicked;
    };
    return MouseHandler;
}());
var mouseHandler = new MouseHandler();
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
var BaseMenuElement = (function () {
    function BaseMenuElement(x, y, width, height, text, contentCentered) {
        if (contentCentered === void 0) { contentCentered = true; }
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.text = text;
        this.contentCentered = contentCentered;
        this.labelOnly = false;
    }
    BaseMenuElement.prototype.isMouseWithin = function () {
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
    BaseMenuElement.prototype.draw = function (view) {
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
        if (this.contentCentered) {
            var textWidth = Math.min(maxWidth, view.ctx.measureText(this.text).width);
            var extraSpace = maxWidth - textWidth;
            x += extraSpace / 2;
        }
        view.ctx.fillText(this.text, x + 2, y + 2, maxWidth);
        view.ctx.fillStyle = "rgba(110,110,145,1)";
        view.ctx.fillText(this.text, x, y, maxWidth);
    };
    BaseMenuElement.prototype.onClick = function () { };
    ;
    return BaseMenuElement;
}());
var MenuLabel = (function (_super) {
    __extends(MenuLabel, _super);
    function MenuLabel(x, y, width, height, text) {
        _super.call(this, x, y, width, height, text);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.text = text;
        this.labelOnly = true;
    }
    return MenuLabel;
}(BaseMenuElement));
var EditorButtonElement = (function (_super) {
    __extends(EditorButtonElement, _super);
    function EditorButtonElement(x, y, width, height, index, text, isActive) {
        _super.call(this, x, y, width, height, text);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.index = index;
        this.text = text;
        this.isActive = isActive;
    }
    EditorButtonElement.prototype.onClick = function () {
        for (var _i = 0, editorButtons_3 = editorButtons; _i < editorButtons_3.length; _i++) {
            var b = editorButtons_3[_i];
            if (b instanceof EditorButtonElement)
                b.isActive = false;
        }
        this.isActive = true;
    };
    return EditorButtonElement;
}(BaseMenuElement));
var EditorButton = (function (_super) {
    __extends(EditorButton, _super);
    function EditorButton(x, y, width, height, text, action) {
        _super.call(this, x, y, width, height, text);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.text = text;
        this.action = action;
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
}(BaseMenuElement));
var currentMenu = [];
function MainMenu() {
    view.setRotation(-Math.PI / 2);
    currentLevels = null;
    currentMenu = [];
    currentMenu.push(new MenuLabel(30, 30, 240, 60, "New Game"));
    var y = 95;
    var difficulties = ["Training", "Easy", "Medium", "Hard", "Special"];
    var _loop_1 = function(i) {
        var b = new BaseMenuElement(50, y, 200, 40, difficulties[i], false);
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
    var editor = new BaseMenuElement(50, y, 200, 40, "Level Editor", false);
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
if (!Array.prototype.popRand) {
    Array.prototype.popRand = function () {
        var idx = Math.floor(Math.random() * this.length);
        return this.splice(idx, 1);
    };
}
if (!Array.prototype.rand) {
    Array.prototype.rand = function () {
        if (this.length)
            return this[Math.floor(Math.random() * this.length)];
        return null;
    };
}
if (!Array.prototype.sum) {
    Array.prototype.sum = function () {
        return this.reduce(function (a, b) { return a + b; }, 0);
    };
}
if (!Array.prototype.max) {
    Array.prototype.max = function () {
        if (this.length == 0)
            return null;
        var ret = this[0];
        for (var _i = 0, _a = this; _i < _a.length; _i++) {
            var x = _a[_i];
            if (x > ret)
                ret = x;
        }
        return ret;
    };
}
if (!Array.prototype.min) {
    Array.prototype.min = function () {
        if (this.length == 0)
            return null;
        var ret = this[0];
        for (var _i = 0, _a = this; _i < _a.length; _i++) {
            var x = _a[_i];
            if (x < ret)
                ret = x;
        }
        return ret;
    };
}
if (!Array.prototype.find) {
    Array.prototype.find = function (predicate) {
        if (this == null) {
            throw new TypeError('Array.prototype.find called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;
        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return value;
            }
        }
        return undefined;
    };
}
function GetSubClasses(type, ignoreExtendedClasses) {
    var allSubclasses = Object.keys(window).map(function (prop) { return window[prop]; }).filter(function (o) { return o && o.prototype && o.prototype instanceof type; });
    if (ignoreExtendedClasses) {
        allSubclasses = allSubclasses.filter(function (c) { return !HasSubClasses(c); });
    }
    return allSubclasses;
}
function HasSubClasses(type) {
    return Object.keys(window).map(function (prop) { return window[prop]; }).filter(function (o) { return o && o.prototype && o.prototype instanceof type; }).length > 0;
}
function RandBetween(min, max) {
    return Math.random() * (max - min) + min;
}
function WeightedAvg(a, b, weightToB) {
    return a * (1 - weightToB) + b * weightToB;
}
function GetFuncArgs(func) {
    return (func + '')
        .replace(/[/][/].*$/mg, '')
        .replace(/\s+/g, '')
        .replace(/[/][*][^/*]*[*][/]/g, '')
        .split('){', 1)[0].replace(/^[^(]*[(]/, '')
        .replace(/=[^,]+/g, '')
        .split(',').filter(Boolean);
}
function Create(objectName, args) {
    return new ((_a = window[objectName]).bind.apply(_a, [void 0].concat(args)))();
    var _a;
}
function NumRange(start, end, step) {
    if (end === void 0) { end = start; }
    if (step === void 0) { step = 1; }
    if (start === end)
        start = 0;
    if (step <= 0)
        throw "Invalid step: " + step;
    var ret = [];
    for (var i = start; i < end; i += step)
        ret.push(i);
    return ret;
}
function Nums(value, count) {
    return Array.from(new Array(count), function (x, i) { return value; });
}
var View = (function () {
    function View(canvas) {
        this.canvas = canvas;
        this.x = 0;
        this.y = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.targetScale = 50;
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
        this.targetX = x;
        this.targetY = y;
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
        editorButtons = [];
    };
    View.prototype.tickCamera = function () {
        if (currentLevels && currentLevels.currentLevel && currentLevels.currentLevel.ball) {
            var cp = currentLevels.currentLevel.ball.getPosition();
            if (gameMode == Mode.edit) {
                this.setTranslation(cp.x - editorPaneWidth / 2 / this.scale, cp.y);
            }
            else {
                this.setTranslation(cp.x, cp.y);
            }
        }
        if (gameMode == Mode.edit)
            this.targetScale = 15;
        if (gameMode == Mode.test || gameMode == Mode.play)
            this.targetScale = Math.max(this.canvas.width / 40, this.canvas.height / 20);
        var diff = this.targetScale - this.scale;
        this.scale += diff * 0.04;
        if (Math.abs(diff) < 0.1)
            this.scale = this.targetScale;
        this.x += (this.targetX - this.x) * 0.1;
        this.y += (this.targetY - this.y) * 0.1;
    };
    View.prototype.getMapCoordsFromScreenCoords = function (x, y) {
        var mapX = (x - this.width / 2) / this.scale + this.x;
        var mapY = (y - this.height / 2) / -this.scale + this.y;
        return { x: mapX, y: mapY };
    };
    View.prototype.getBottomLeftGameCoordOfMouseOverCell = function () {
        var mouse = this.getMapCoordsFromScreenCoords(mouseHandler.mouseX, mouseHandler.mouseY);
        var left = mouse.x + 0.5;
        var bottom = mouse.y + 0.5;
        left = Math.floor(left / 2) * 2;
        bottom = Math.floor(bottom / 2) * 2;
        return { x: left, y: bottom };
    };
    View.prototype.mapX = function (x) {
        return (x - this.x) * this.scale + Math.cos(this.rotation) * this.height / 2 - Math.sin(this.rotation) * this.width / 2;
    };
    View.prototype.mapY = function (y) {
        return -(y - this.y) * this.scale - Math.sin(this.rotation) * this.height / 2 - Math.cos(this.rotation) * this.width / 2;
    };
    View.prototype.clear = function () {
        this.ctx.clearRect(-this.width - this.height, -this.width - this.height, 2 * (this.width + this.height), 2 * (this.width + this.height));
    };
    View.prototype.draw = function (level) {
        this.tickCamera();
        var world = level.world;
        for (var b = world.getBodyList(); b; b = b.getNext()) {
            var p = b.getPosition();
            this.ctx.translate(this.mapX(p.x), this.mapY(p.y));
            var r = b.getAngle();
            for (var f = b.getFixtureList(); f; f = f.getNext()) {
                var type = f.getType();
                var shape = f.getShape();
                var userData = f.getUserData();
                if (type == "circle") {
                    this.ctx.fillStyle = "rgba(0,0,200,0.6)";
                    if (userData == "bouncer")
                        this.ctx.fillStyle = "rgba(200,0,0,0.6)";
                    if (userData == "ball")
                        this.ctx.fillStyle = "rgba(0,0,0,0.6)";
                    var r = shape.m_radius;
                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, r * this.scale, 0, Math.PI * 2);
                    this.fill();
                    this.stroke();
                }
                else if (userData == "goal") {
                    this.ctx.fillStyle = "rgba(0,200,0,0.6)";
                    this.createPath(shape.m_vertices);
                    this.fill();
                }
                else if (userData == "pusher") {
                    this.ctx.fillStyle = "rgba(200,0,128,0.6)";
                    this.createPath(shape.m_vertices);
                    this.fill();
                    this.ctx.fillStyle = "rgba(0,0,200,0.6)";
                    this.createPath(b.userData.direction.innerArrow);
                    this.fill();
                }
                else if (userData == "breakWall") {
                    this.ctx.fillStyle = "rgba(196,92,0,0.6)";
                    this.createPath(shape.m_vertices);
                    this.fill();
                    this.stroke();
                }
                else {
                    this.ctx.rotate(-r);
                    this.createPath(shape.m_vertices);
                    this.ctx.fillStyle = "rgba(0,0,200,0.6)";
                    this.fill();
                    this.stroke();
                    this.ctx.rotate(r);
                }
            }
            this.ctx.translate(-this.mapX(p.x), -this.mapY(p.y));
        }
        var cell = this.getBottomLeftGameCoordOfMouseOverCell();
        if (gameMode == Mode.edit) {
            this.highlightCell(cell.x - 0.5, cell.y - 0.5);
            DrawEditorPane(this);
        }
    };
    View.prototype.highlightCell = function (x, y) {
        var vs = [{ x: x, y: y }, { x: x + 2, y: y }, { x: x + 2, y: y + 2 }, { x: x, y: y + 2 }];
        this.ctx.fillStyle = "rgba(255,255,255,0.6)";
        this.ctx.translate(this.mapX(0), this.mapY(0));
        this.ctx.beginPath();
        this.createPath(vs);
        this.fill();
        this.stroke();
        this.ctx.translate(-this.mapX(0), -this.mapY(0));
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
        this.ctx.strokeStyle = this.ctx.fillStyle.toString().replace("0.6", "1.0");
        this.ctx.stroke();
    };
    View.prototype.drawCenteredText = function (text, percentSize, percentDownScreen) {
        var textHeight = this.height * percentSize;
        this.ctx.font = textHeight + "px Arial";
        var textWidth = this.ctx.measureText(text).width;
        var screenWidth = this.width - (Mode.edit == gameMode ? editorPaneWidth : 0);
        var xOffset = (Mode.edit == gameMode ? editorPaneWidth : 0);
        if (textWidth > screenWidth) {
            var newSize = percentSize * screenWidth / textWidth - 0.01;
            if (newSize < 0)
                return;
            this.drawCenteredText(text, newSize, percentDownScreen);
            return;
        }
        var x = screenWidth / 2 - textWidth / 2 + xOffset;
        var y = (this.height - textHeight) * percentDownScreen + textHeight;
        this.ctx.rotate(-this.rotation - Math.PI / 2);
        this.ctx.fillStyle = "black";
        this.ctx.fillText(text, x + 2, y + 2);
        this.ctx.fillStyle = "white";
        this.ctx.fillText(text, x, y);
        this.ctx.rotate(this.rotation + Math.PI / 2);
    };
    return View;
}());
var view = null;
//# sourceMappingURL=build.js.map