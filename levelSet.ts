class LevelSet {
    constructor(public levels: Level[], startingTimer: number) {
        this.currentLevel = levels[0];
        this.currentLevel.loadWorld();
        this.timer = startingTimer;
    }
    timer: number;
    currentLevel: Level;
    levelCompleteTimer: number = 0;
    canContinueToNext: boolean = false;
    showTimerExtend: boolean = false;
    levelStartTime: number = 3;
    get readableLevelNumber(): number {
        return this.levelIndex + 1;
    }
    get levelIndex(): number {
        return this.levels.indexOf(this.currentLevel);
    }
    get prettyTimeRemaining(): string {
        return (Math.floor(this.timer * 100) / 100).toFixed(2);
    }
    get prettyTimeElapsed(): string {
        if (!this.currentLevel) return '';
        var elapsed = (+(new Date()) - this.currentLevel.startTime) / 1000;
        return (Math.floor(elapsed * 100) / 100).toFixed(2);
    }
    get nextLevel(): Level {
        let newIndex = this.levelIndex + 1;
        return this.levels[newIndex];
    }

    Step(delta): void {
        if (!this.currentLevel) return;

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
            if (this.levelCompleteTimer > 4 /*seconds*/) {
                this.canContinueToNext = true;
            }
        } else if (gameMode == Mode.play && this.levelStartTime > 0) {
        } else {
            this.currentLevel.Step(delta);
            this.timer -= delta;
        }
        this.levelStartTime -= delta;

        if (this.canContinueToNext && keyboardState.isAnyPressed()) {
            this.StartNextLevel();
        }
    }

    StartNextLevel(): void {
        this.levelCompleteTimer = 0;
        this.canContinueToNext = false;
        this.currentLevel = this.nextLevel;

        if (this.currentLevel) {
            this.currentLevel.loadWorld();
            this.levelStartTime = 3;
            this.showTimerExtend = false;
        } else {
            MainMenu();
        }
    }

    Draw(view: View): void {
        let level = this.currentLevel;
        if (!level) return;
        view.draw(level);
        if (gameMode == Mode.test) {
            view.drawCenteredText(this.prettyTimeElapsed, 0.05, 0.05);
            view.drawCenteredText("S/Down to resume editing", 0.04, 0.95);
        }
        if (gameMode == Mode.edit) {
            if (editorTestCompleteTime) view.drawCenteredText("Last test play completed in: " + editorTestCompleteTime.toFixed(2), 0.03, 0.95);
        }
        if (gameMode == Mode.play) {
            view.drawCenteredText(this.prettyTimeRemaining, 0.05, 0.05);
            if (level.complete) {
                view.drawCenteredText("Level Complete!", 0.1, 0.35);
                view.drawCenteredText(level.secondsToComplete.toFixed(2) + " seconds", 0.08, 0.55);
                if (this.levelCompleteTimer > 2) {
                    if (this.nextLevel) {
                        let timerExtend = this.nextLevel.timerExtend;
                        if (timerExtend) {
                            view.drawCenteredText("+" + timerExtend + " seconds to timer", 0.06, 0.65);
                        }
                    } else {
                        view.drawCenteredText("Campaign Complete!", 0.08, 0.65);
                    }
                }
                if (this.canContinueToNext) {
                    view.drawCenteredText("Hit any key to continue", 0.06, 0.8);
                }
            } else {
                if (this.levelStartTime > 1.5) view.drawCenteredText("Get ready...", 0.1, 0.2);
                else if (this.levelStartTime > 0) view.drawCenteredText("Get set...", 0.15, 0.2);
                else if (this.levelStartTime > -0.5) view.drawCenteredText("Go!", 0.2, 0.2);
            }
        }
    }
}