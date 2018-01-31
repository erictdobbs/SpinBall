type soundName = "box" | "death" | "gem1" | "jump" | "level1" | "level2" | "level3" | "level4" | "ouch" | "snare" | "title" | "victory";

function Mute() {
    let muteButton = document.getElementById("muteButton");
    muteButton.classList.add("no-show");
    soundHandler.muted = true;
    for (let s of soundHandler.sounds) s.htmlElement.muted = true;
}
function Unmute() {
    let muteButton = document.getElementById("muteButton");
    muteButton.classList.remove("no-show");
    soundHandler.muted = false;
    for (let s of soundHandler.sounds) s.htmlElement.muted = false;
}

class SoundHandler {
    constructor(public container: HTMLElement) {
        this.sounds = [
            new Sound(this, "box", 0.8, false),
            new Sound(this, "death", 1, false),
            new Sound(this, "gem1", 0.6, false),
            new Sound(this, "jump", 1, false),
            new Sound(this, "level1", 1, true),
            new Sound(this, "level2", 1, true),
            new Sound(this, "level3", 1, true),
            new Sound(this, "level4", 0.8, true),
            new Sound(this, "ouch", 1, false),
            new Sound(this, "snare", 1, false),
            new Sound(this, "title", 1, true),
            new Sound(this, "victory", 1, true)
        ]
    }
    sounds: Sound[] = [];
    muted: boolean = false;
    
    play(name: soundName): void {
        let sound = this.sounds.find(x => x.name == name);
        if (sound.loop) {
            if (sound.isPlaying) return;
            this.stopAll();
        }
        sound.play();
    }
    stopAll(): void {
        for (let s of this.sounds) s.stop();
    }
}

class Sound {
    constructor(soundHandler: SoundHandler, public name: soundName, public volume: number, public loop: boolean) {
        this.htmlElement = new Audio();
        this.htmlElement.src = "audio/" + name + ".mp3";
        this.htmlElement.loop = loop;
        if (name == "victory") this.htmlElement.loop = false;
        this.htmlElement.volume = volume;
        soundHandler.container.appendChild(this.htmlElement);
    }
    isPlaying: boolean = false;
    htmlElement: HTMLAudioElement;
    play(): void {
        this.htmlElement.currentTime = 0;
        this.isPlaying = true;
        this.htmlElement.play();
    }
    stop(): void {
        this.isPlaying = false;
        this.htmlElement.pause();
        this.htmlElement.currentTime = 0;
    }
}