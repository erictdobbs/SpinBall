type soundName = "box" | "death" | "gem1" | "jump" | "level1" | "level2" | "level3" | "level4" | "ouch" | "snare" | "title" | "victory";

class SoundHandler {
    constructor(public container: HTMLElement) {
        this.sounds = [
            new Sound(this, "box", 0.5, false),
            new Sound(this, "death", 1, false),
            new Sound(this, "gem1", 1, false),
            new Sound(this, "jump", 1, false),
            new Sound(this, "level1", 1, true),
            new Sound(this, "level2", 1, true),
            new Sound(this, "level3", 1, true),
            new Sound(this, "level4", 1, true),
            new Sound(this, "ouch", 1, false),
            new Sound(this, "snare", 1, false),
            new Sound(this, "title", 1, false),
            new Sound(this, "victory", 1, true)
        ]
    }
    sounds: Sound[] = [];
    
    play(name: soundName): void {
        let sound = this.sounds.find(x => x.name == name);
        if (sound.loop) {
            if (sound.isPlaying) return;
            for (let s of this.sounds) s.stop();
        }
        sound.play();
    }
}

class Sound {
    constructor(soundHandler: SoundHandler, public name: soundName, public volume: number, public loop: boolean) {
        this.htmlElement = new Audio();
        this.htmlElement.src = "audio/" + name + ".mp3";
        this.htmlElement.loop = loop;
        this.htmlElement.volume = volume;
        soundHandler.container.appendChild(this.htmlElement);
    }
    isPlaying: boolean = false;
    htmlElement: HTMLAudioElement;
    play(): void {
        this.isPlaying = true;
        this.htmlElement.play();
    }
    stop(): void {
        this.isPlaying = false;
        this.htmlElement.pause();
        this.htmlElement.currentTime = 0;
    }
}