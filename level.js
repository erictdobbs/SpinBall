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
        if (this.ball) {
            var cp = this.ball.getPosition();
            view.setTranslation(cp.x, cp.y);
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
    return Direction;
}());
Direction.Left = new Direction(-1, 0);
Direction.Right = new Direction(1, 0);
Direction.Up = new Direction(0, 1);
Direction.Down = new Direction(0, -1);
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
            var ball = level.world.createDynamicBody(planck.Vec2(x, y));
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
        new LevelTile(":", "Pin Vertical Pair", function (level, x, y) {
            level.AddPin(x + 0.5, y);
            level.AddPin(x + 0.5, y + 1);
        }),
        new LevelTile("…", "Pin Horizontal Pair", function (level, x, y) {
            level.AddPin(x, y + 0.5);
            level.AddPin(x + 1, y + 0.5);
        }),
        new LevelTile("+", "Pin Cross", function (level, x, y) {
            level.AddPin(x, y + 0.5);
            level.AddPin(x + 1, y + 0.5);
            level.AddPin(x + 0.5, y + 1);
            level.AddPin(x + 0.5, y);
        }),
        new LevelTile("◣", "Diagonal Up Left", function (level, x, y) {
            level.AddTriangle(x, y, 0);
        }),
        new LevelTile("◢", "Diagonal Up Right", function (level, x, y) {
            level.AddTriangle(x, y, Math.PI / 2);
        }),
        new LevelTile("◥", "Diagonal Down Right", function (level, x, y) {
            level.AddTriangle(x, y, Math.PI);
        }),
        new LevelTile("◤", "Diagonal Down Left", function (level, x, y) {
            level.AddTriangle(x, y, -Math.PI / 2);
        }),
        new LevelTile("◟", "Curve Up Left", function (level, x, y) {
            level.AddCurve(x, y, 0);
        }),
        new LevelTile("◞", "Curve Up Right", function (level, x, y) {
            level.AddCurve(x, y, Math.PI / 2);
        }),
        new LevelTile("◝", "Curve Down Right", function (level, x, y) {
            level.AddCurve(x, y, Math.PI);
        }),
        new LevelTile("◜", "Curve Down Left", function (level, x, y) {
            level.AddCurve(x, y, -Math.PI / 2);
        }),
        new LevelTile(">", "Pusher Right", function (level, x, y) {
            level.AddPusher(x, y, Direction.Right);
        }),
        new LevelTile("^", "Pusher Up", function (level, x, y) {
            level.AddPusher(x, y, Direction.Up);
        }),
        new LevelTile("<", "Pusher Left", function (level, x, y) {
            level.AddPusher(x, y, Direction.Left);
        }),
        new LevelTile("v", "Pusher Down", function (level, x, y) {
            level.AddPusher(x, y, Direction.Down);
        }),
        new LevelTile("m", "Breakwall Pair Bottom", function (level, x, y) {
            level.AddBreakWall(x, y);
            level.AddBreakWall(x + 1, y);
        })
    ];
}
//# sourceMappingURL=level.js.map