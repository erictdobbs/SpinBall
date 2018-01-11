var Level = (function () {
    function Level(difficulty, levelString, fullRotation) {
        this.difficulty = difficulty;
        this.levelString = levelString;
        this.fullRotation = fullRotation;
        this.pushers = [];
        this.loadWorld();
        view.setRotation(-Math.PI / 2);
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
            // if (keyboardState.isDownPressed()) {
            //     this.ball.getFixtureList().setRestitution(0);
            // } else {
            //     this.ball.getFixtureList().setRestitution(0.8);
            // }
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
        var pl = planck, Vec2 = pl.Vec2;
        var world = new pl.World({
            gravity: Vec2(0, -gravityStrength)
        });
        var ballFD = {
            userData: 'ball',
            density: 1.0,
            friction: 0.9,
            restitution: 0.0
        };
        function AddBall(x, y) {
            view.setTranslation(x, y);
            var ball = world.createDynamicBody(Vec2(x, y));
            ball.setSleepingAllowed(false);
            ball.createFixture(pl.Circle(0.45), ballFD);
            return ball;
        }
        var wallFD = { density: 0.0, friction: 0.2, restitution: 0.5 };
        function AddWall(x, y, big) {
            if (big) {
                x += 0.5;
                y += 0.5;
            }
            var size = big ? 1 : 0.5;
            var wall = world.createBody(Vec2(x, y));
            wall.createFixture(pl.Box(size, size), wallFD);
        }
        function AddTriangle(x, y, rotation, big) {
            if (big) {
                x += 0.5;
                y += 0.5;
            }
            var size = big ? 1 : 0.5;
            // if (big) {
            //     if (rotation == 0) {
            //         AddTriangle(x, y+1, rotation, false);
            //         AddTriangle(x+1, y, rotation, false);
            //         AddWall(x, y, false);
            //     } else if (rotation == Math.PI/2) {
            //         AddTriangle(x+1, y+1, rotation, false);
            //         AddTriangle(x, y, rotation, false);
            //         AddWall(x+1, y, false);
            //     } else if (rotation == Math.PI) {
            //         AddTriangle(x+1, y, rotation, false);
            //         AddTriangle(x, y+1, rotation, false);
            //         AddWall(x+1, y+1, false);
            //     } else {
            //         AddTriangle(x, y, rotation, false);
            //         AddTriangle(x+1, y+1, rotation, false);
            //         AddWall(x, y+1, false);
            //     }
            // } else {
            var wall = world.createBody(Vec2(x, y), rotation);
            var vs = [Vec2(size, -size), Vec2(-size, size), Vec2(-size, -size)];
            wall.createFixture(pl.Polygon(vs), wallFD);
            //}
        }
        var curveFD = { density: 0.0, friction: 0.2, restitution: 0.1 };
        function AddCurve(x, y, rotation) {
            var wall = world.createBody(Vec2(x + 0.5, y + 0.5), rotation);
            var vs = [];
            var segments = 10;
            for (var i = 0; i <= segments; i++) {
                var theta = i / segments * Math.PI / 2 + Math.PI;
                var cx = 2 * Math.cos(theta) + 1;
                var cy = 2 * Math.sin(theta) + 1;
                vs.push(Vec2(cx, cy));
            }
            for (var i = 0; i < segments; i++) {
                var ps = [Vec2(-1, -1), Vec2(vs[i].x, vs[i].y), Vec2(vs[i + 1].x, vs[i + 1].y)];
                wall.createFixture(pl.Polygon(ps), curveFD);
            }
        }
        var bouncerFD = { density: 0.0, friction: 0.2, userData: 'bouncer' };
        function AddBouncer(x, y, size) {
            var bouncer = world.createBody(Vec2(x, y));
            bouncer.createFixture(pl.Circle(size), bouncerFD);
        }
        var pinFD = { density: 0.0, friction: 0.2, restitution: 0.9 };
        function AddPin(x, y) {
            var pin = world.createBody(Vec2(x, y));
            pin.createFixture(pl.Circle(0.25), pinFD);
        }
        var goalFD = { density: 0.0, friction: 0.2, userData: 'goal' };
        function AddGoal(x, y, big) {
            if (big) {
                x += 0.5;
                y += 0.5;
            }
            var size = big ? 1 : 0.5;
            var goal = world.createBody(Vec2(x, y));
            goal.createFixture(pl.Box(size, size), goalFD);
        }
        var pusherFD = { shape: pl.Box(1, 1), isSensor: true, userData: "pusher" };
        function AddPusher(x, y, direction) {
            var pusher = world.createBody(Vec2(x + 0.5, y + 0.5));
            pusher.userData = { direction: direction, active: false };
            pusher.createFixture(pusherFD);
            return pusher;
        }
        var breakWallFD = { density: 0.0, friction: 0.2, restitution: 0.1, userData: "breakWall" };
        function AddBreakWall(x, y) {
            var bWall = world.createBody(Vec2(x, y));
            bWall.createFixture(pl.Box(0.5, 0.5), breakWallFD);
        }
        world.on('post-solve', function (contact) {
            var fA = contact.getFixtureA(), bA = fA.getBody();
            var fB = contact.getFixtureB(), bB = fB.getBody();
            var myBouncer = fA.getUserData() == bouncerFD.userData && bA || fB.getUserData() == bouncerFD.userData && bB;
            var myBall = fA.getUserData() == ballFD.userData && bA || fB.getUserData() == ballFD.userData && bB;
            var myGoal = fA.getUserData() == goalFD.userData && bA || fB.getUserData() == goalFD.userData && bB;
            var myBreakWall = fA.getUserData() == breakWallFD.userData && bA || fB.getUserData() == breakWallFD.userData && bB;
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
                console.log('Compelted in ' + completionTime / 1000 + ' seconds');
                currentLevel = new Level(currentLevel.difficulty, currentLevel.levelString, currentLevel.fullRotation);
            }
            if (myBall && myBreakWall) {
                var speed = myBall.getLinearVelocity().length();
                if (speed > 3) {
                    setTimeout(function () {
                        try {
                            currentLevel.world.destroyBody(myBreakWall);
                        }
                        catch (e) { }
                    }, 1);
                }
            }
        });
        world.on('begin-contact', function (contact) {
            var fA = contact.getFixtureA(), bA = fA.getBody();
            var fB = contact.getFixtureB(), bB = fB.getBody();
            var myBall = fA.getUserData() == ballFD.userData && bA || fB.getUserData() == ballFD.userData && bB;
            var myPusher = fA.getUserData() == pusherFD.userData && bA || fB.getUserData() == pusherFD.userData && bB;
            if (myBall && myPusher) {
                myPusher.userData.active = true;
            }
        });
        world.on('end-contact', function (contact) {
            var fA = contact.getFixtureA(), bA = fA.getBody();
            var fB = contact.getFixtureB(), bB = fB.getBody();
            var myBall = fA.getUserData() == ballFD.userData && bA || fB.getUserData() == ballFD.userData && bB;
            var myPusher = fA.getUserData() == pusherFD.userData && bA || fB.getUserData() == pusherFD.userData && bB;
            if (myBall && myPusher) {
                myPusher.userData.active = false;
            }
        });
        for (var lineNum = 0; lineNum < this.levelString.split('\n').length; lineNum++) {
            var line = this.levelString.split('\n')[lineNum];
            var line2 = this.levelString.split('\n')[lineNum + 1];
            for (var charNum = 0; charNum < line.length; charNum++) {
                var x = charNum * 2;
                var y = -lineNum * 2;
                var cha = line[charNum];
                if (cha == '#')
                    AddWall(x, y, true);
                if (cha == 'o')
                    AddBouncer(x + 0.5, y + 0.5, 1);
                if (cha == '.')
                    AddPin(x + 0.5, y + 0.5);
                if (cha == ':') {
                    AddPin(x + 0.5, y);
                    AddPin(x + 0.5, y + 1);
                }
                if (cha == '…') {
                    AddPin(x, y + 0.5);
                    AddPin(x + 1, y + 0.5);
                }
                if (cha == '+') {
                    AddPin(x, y + 0.5);
                    AddPin(x + 1, y + 0.5);
                    AddPin(x + 0.5, y + 1);
                    AddPin(x + 0.5, y);
                }
                if (cha == 'x')
                    this.ball = AddBall(x + 0.5, y + 0.5);
                if (cha == '◢')
                    AddTriangle(x, y, Math.PI / 2, true);
                if (cha == '◣')
                    AddTriangle(x, y, 0, true);
                if (cha == '◤')
                    AddTriangle(x, y, -Math.PI / 2, true);
                if (cha == '◥')
                    AddTriangle(x, y, Math.PI, true);
                if (cha == 'g')
                    AddGoal(x, y, true);
                if (cha == '^')
                    this.pushers.push(AddPusher(x, y, Direction.Up));
                if (cha == 'v')
                    this.pushers.push(AddPusher(x, y, Direction.Down));
                if (cha == '>')
                    this.pushers.push(AddPusher(x, y, Direction.Right));
                if (cha == '<')
                    this.pushers.push(AddPusher(x, y, Direction.Left));
                if (cha == 'm') {
                    AddBreakWall(x, y);
                    AddBreakWall(x + 1, y);
                }
                if (cha == '◞')
                    AddCurve(x, y, Math.PI / 2);
                if (cha == '◟')
                    AddCurve(x, y, 0);
                if (cha == '◜')
                    AddCurve(x, y, -Math.PI / 2);
                if (cha == '◝')
                    AddCurve(x, y, Math.PI);
            }
        }
        this.world = world;
    };
    return Level;
}());
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
//# sourceMappingURL=level.js.map