class SaveFile {

    constructor() {
        let save = localStorage.getItem("Spinball");
        if (save) this.Load(save)
    }

    version: string = "0.3";
    bestTimes: BestTime[] = [];

    GetBestTime(levelId: number): number {
        let timeObj = this.bestTimes.find(x => x.levelId === levelId);
        if (timeObj) return timeObj.time;
        return null;
    }

    SetBestTime(levelId: number, time: number) {
        let timeObj = this.bestTimes.find(x => x.levelId === levelId);
        if (timeObj) {
            timeObj.time = time;
        } else {
            timeObj = new BestTime(levelId, time);
            this.bestTimes.push(timeObj);
        }
        this.CommitSave();
    }

    private Serialize(): string {
        let obj = {v: this.version, b: this.bestTimes.map(x => {return {id: x.levelId, t: x.time}})}
        return JSON.stringify(obj);
    }

    private Load(str: string): void {
        let obj = JSON.parse(str);
        this.version = obj.v;
        this.bestTimes = obj.b.map(x => new BestTime(x.id, x.t));
    }

    private CommitSave(): void {
        localStorage.setItem("Spinball", this.Serialize());
    }

}

class BestTime {
    constructor(public levelId: number, public time: number) {}
}