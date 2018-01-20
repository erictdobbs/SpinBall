type LevelSpecial = (l:Level, x:number, y:number) => void;

class Level {
    constructor(
        public difficulty: number,
        public time: number,
        public levelString: string,
        public tip: string = ""
    ) {
    }

    fullRotation: boolean = true;
    ball: any;
    world: any;
    pushers: any[] = [];
    startTime: number;
    complete: boolean = false;
    secondsToComplete: number = 0;

    Step(delta): void {
        if (gameMode == Mode.edit) {
            EditorTick();
            return;
        }
        if (this.world) {
            this.world.step(delta);
            this.OnWorldStep(this.world);
        }
    }

    OnWorldStep(world) {
        if (!this.startTime) this.startTime = +(new Date());

        var secondsPerRotation = 2.0;
        var framesPerSecond = 60;
        var framesPerRotation = framesPerSecond * secondsPerRotation;
        var rotateSpeed = (2 * Math.PI) / framesPerRotation;
        if (keyboardState.isLeftPressed() && keyboardState.isRightPressed()) {
        } else if (keyboardState.isRightPressed()) {
            this.RotateGrav(world, rotateSpeed);
        } else if (keyboardState.isLeftPressed()) {
            this.RotateGrav(world, -rotateSpeed);
        } else {
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
            for (var pusher of this.pushers) {
                var ud = pusher.userData;
                if (ud.active && pushedDirections.indexOf(ud.direction) == -1) {
                    var strength = 0.2;
                    var impulseVector = planck.Vec2(strength * ud.direction.x, strength * ud.direction.y);
                    this.ball.applyLinearImpulse(impulseVector, cp, true);
                    pushedDirections.push(ud.direction);
                }
            }
        }
    }

    RotateGrav(world, r): void {
        var gravityVec = world.getGravity();
        var angle = Math.atan2(gravityVec.y, gravityVec.x);
        var newAngle = angle + r;
        if (!this.fullRotation) {
            if (newAngle < -Math.PI * 3 / 4) newAngle = -Math.PI * 3 / 4;
            if (newAngle > -Math.PI * 1 / 4) newAngle = -Math.PI * 1 / 4;
        }
        var gravX = Math.cos(newAngle) * gravityStrength;
        var gravY = Math.sin(newAngle) * gravityStrength;
        world.setGravity(planck.Vec2(gravX, gravY));
        view.setRotation(newAngle);
    }

    loadWorld(): any {
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


        world.on('pre-solve', function (contact) {
            var currentLevel = currentLevels.currentLevel;
            var fA = contact.getFixtureA(), bA = fA.getBody();
            var fB = contact.getFixtureB(), bB = fB.getBody();
            var myBall = fA.getUserData() == fds.ball.userData && bA || fB.getUserData() == fds.ball.userData && bB;
            var myBreakWall = fA.getUserData() == fds.breakWall.userData && bA || fB.getUserData() == fds.breakWall.userData && bB;

            if (myBall && myBreakWall) {
                var velocity = myBall.getLinearVelocity();
                var ballPos = myBall.getPosition();
                var wallPos = myBreakWall.getPosition();
                var offset = {x: wallPos.x - ballPos.x, y: wallPos.y - ballPos.y};

                var speed = myBall.getLinearVelocity().length();
                var angleOffWall = Math.atan2(velocity.y, velocity.x) - Math.atan2(offset.y, offset.x);
                var speedTowardsWall = speed * Math.cos(angleOffWall);

                if (speedTowardsWall > 4) {
                    setTimeout(() => {try { 
                        let timerBonus = myBreakWall.getUserData();
                        currentLevels.timer += timerBonus;
                        currentLevels.currentLevel.ball.setLinearVelocity(Vec2(0,0));
                        currentLevel.world.destroyBody(myBreakWall);
                    } catch (e) { }}, 1);
                }
            }
        });


        world.on('post-solve', function (contact) {
            var currentLevel = currentLevels.currentLevel;
            var fA = contact.getFixtureA(), bA = fA.getBody();
            var fB = contact.getFixtureB(), bB = fB.getBody();
            var myBouncer = fA.getUserData() == fds.bouncer.userData && bA || fB.getUserData() == fds.bouncer.userData && bB;
            var myBall = fA.getUserData() == fds.ball.userData && bA || fB.getUserData() == fds.ball.userData && bB;
            var myGoal = fA.getUserData() == fds.goal.userData && bA || fB.getUserData() == fds.goal.userData && bB;
            
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

                var lt = levelTiles.find(l => l.character == cha);
                if (lt) lt.addToLevel(this, x, y);
            }
        }
    }

    AddPin(x, y) {
        var pin = this.world.createBody(planck.Vec2(x, y));
        pin.createFixture(planck.Circle(0.25), fds.pin);
    }
    AddTriangle(x, y, rotation: number) {
        var wall = this.world.createBody(planck.Vec2(x, y), rotation);
        var vs = [planck.Vec2(1, -1), planck.Vec2(-1, 1), planck.Vec2(-1, -1)];
        wall.createFixture(planck.Polygon(vs), fds.wall);
    }
    AddPusher(x, y, direction: Direction) {
        var pusher = this.world.createBody(planck.Vec2(x, y));
        pusher.userData = { direction: direction, active: false };
        pusher.createFixture(fds.pusher);
        this.pushers.push(pusher);
    }
    AddCurve(x, y, rotation: number) {
        var wall = this.world.createBody(planck.Vec2(x, y), rotation);
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
    }
    AddBreakWall(x: number, y: number, timeValue: number) {
        var bWall = this.world.createBody(planck.Vec2(x, y));
        bWall.createFixture(planck.Box(0.5, 0.5), fds.breakWall);
        bWall.setUserData(timeValue);
    }
}

var fds = {
    ball: null,
    wall: null,
    curve: null,
    bouncer: null,
    pin: null,
    goal: null,
    pusher: null,
    breakWall: null,
    rotationLock: null
}

class Direction {
    constructor(public x: number, public y: number) {
        this.innerArrow.push({ x: x * 0.5, y: y * 0.5 });
        if (!x) this.innerArrow.push({ x: y * 0.5, y: 0 }, { x: -y * 0.5, y: 0 });
        if (!y) this.innerArrow.push({ x: 0, y: x * 0.5 }, { x: 0, y: -x * 0.5 });
    }
    innerArrow = [];
    static Left: Direction = new Direction(-1, 0);
    static Right: Direction = new Direction(1, 0);
    static Up: Direction = new Direction(0, 1);
    static Down: Direction = new Direction(0, -1);
}

class LevelTile {
    constructor(
        public character: string, 
        public name: string, 
        public addToLevel: (level: Level, x: number, y: number) => void
    ) {}
}

var levelTiles: LevelTile[] = [];

function loadLevelTiles() {
    fds = {
        ball: {userData: 'ball',density: 1.0,friction: 0.9,restitution: 0.0},
        wall: { density: 0.0, friction: 0.2, restitution: 0.5 },
        curve: { density: 0.0, friction: 0.2, restitution: 0.1 },
        bouncer: { density: 0.0, friction: 0.2, userData: 'bouncer' },
        pin: { density: 0.0, friction: 0.2, restitution: 0.9 },
        goal: { density: 0.0, friction: 0.2, userData: 'goal' },
        pusher: { shape: planck.Box(1, 1), isSensor: true, userData: "pusher" },
        breakWall: { density: 0.0, friction: 0.2, restitution: 0.1, userData: "breakWall" },
        rotationLock: { density: 0.0, friction: 0.2, restitution: 0.5, userData: "rotationLock" }
    }

    levelTiles = [
        new LevelTile("x", "Ball Start", (level,x,y) => {
            view.setTranslation(x, y);
            var ball = level.world.createDynamicBody(planck.Vec2(x, y-0.5));
            ball.setSleepingAllowed(false);
            ball.createFixture(planck.Circle(0.45), fds.ball);
            level.ball = ball;
        }),
        new LevelTile("#", "Wall", (level,x,y) => {
            var wall = level.world.createBody(planck.Vec2(x, y));
            wall.createFixture(planck.Box(1, 1), fds.wall);
        }),
        new LevelTile("g", "Goal", (level,x,y) => {
            var goal = level.world.createBody(planck.Vec2(x, y));
            goal.createFixture(planck.Box(1, 1), fds.goal);
        }),
        new LevelTile("o", "Bouncer", (level,x,y) => {
            var bouncer = level.world.createBody(planck.Vec2(x, y));
            bouncer.createFixture(planck.Circle(1), fds.bouncer);
        }),
        new LevelTile(".", "Pin", (level,x,y) => {
            level.AddPin(x, y);
        }),
        new LevelTile("+", "Pin Cross", (level,x,y) => {
            level.AddPin(x - 0.5, y); 
            level.AddPin(x + 0.5, y); 
            level.AddPin(x, y + 0.5); 
            level.AddPin(x, y - 0.5);
        }),
        new LevelTile(":", "Pin Vertical Pair", (level,x,y) => {
            level.AddPin(x, y - 0.5); 
            level.AddPin(x, y + 0.5);
        }),
        new LevelTile("…", "Pin Horizontal Pair", (level,x,y) => {
            level.AddPin(x - 0.5, y); 
            level.AddPin(x + 0.5, y);
        }),
        new LevelTile("◣", "Diagonal Up Left", (level,x,y) => {
            level.AddTriangle(x, y, 0);
        }),
        new LevelTile("◢", "Diagonal Up Right", (level,x,y) => {
            level.AddTriangle(x, y, Math.PI / 2);
        }),
        new LevelTile("◤", "Diagonal Down Left", (level,x,y) => {
            level.AddTriangle(x, y, -Math.PI / 2);
        }),
        new LevelTile("◥", "Diagonal Down Right", (level,x,y) => {
            level.AddTriangle(x, y, Math.PI);
        }),
        new LevelTile("◟", "Curve Up Left", (level,x,y) => {
            level.AddCurve(x, y, 0);
        }),
        new LevelTile("◞", "Curve Up Right", (level,x,y) => {
            level.AddCurve(x, y, Math.PI / 2);
        }),
        new LevelTile("◜", "Curve Down Left", (level,x,y) => {
            level.AddCurve(x, y, -Math.PI / 2);
        }),
        new LevelTile("◝", "Curve Down Right", (level,x,y) => {
            level.AddCurve(x, y, Math.PI);
        }),
        new LevelTile("<", "Pusher Left", (level,x,y) => {
            level.AddPusher(x, y, Direction.Left)
        }),
        new LevelTile(">", "Pusher Right", (level,x,y) => {
            level.AddPusher(x, y, Direction.Right)
        }),
        new LevelTile("^", "Pusher Up", (level,x,y) => {
            level.AddPusher(x, y, Direction.Up)
        }),
        new LevelTile("v", "Pusher Down", (level,x,y) => {
            level.AddPusher(x, y, Direction.Down)
        }),
        new LevelTile("m", "Breakwall Pair Bottom", (level,x,y) => {
            level.AddBreakWall(x - 0.5, y - 0.5, 0); 
            level.AddBreakWall(x + 0.5, y - 0.5, 0);
        }),
        new LevelTile("B", "Breakwall Bonus Time", (level,x,y) => {
            level.AddBreakWall(x - 0.5, y - 0.5, 3); 
            level.AddBreakWall(x + 0.5, y - 0.5, 1); 
            level.AddBreakWall(x - 0.5, y + 0.5, 1); 
            level.AddBreakWall(x + 0.5, y + 0.5, 0);
        }),
        new LevelTile("P", "Breakwall Penalty Time", (level,x,y) => {
            level.AddBreakWall(x - 0.5, y - 0.5, -2); 
            level.AddBreakWall(x + 0.5, y - 0.5, 0); 
            level.AddBreakWall(x - 0.5, y + 0.5, 0); 
            level.AddBreakWall(x + 0.5, y + 0.5, -2);
        }),
        new LevelTile("q", "Lock Rotation", (level,x,y) => {
            level.fullRotation = false;
            var rotationLock = level.world.createBody(planck.Vec2(x, y));
            rotationLock.createFixture(planck.Box(1, 1), fds.rotationLock);
        }),
        
        new LevelTile("_", "ERASER", (level,x,y)=>{})
    ];
}