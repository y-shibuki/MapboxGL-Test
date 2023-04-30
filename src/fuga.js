import { lineString, along, length } from "@turf/turf"

export class Fuga {
    constructor(kph, line, id) {
        this.time = new Date().getTime();
        this.kph = kph;
        this.distance = 0;
        this.line = lineString(line);
        this.lineLength = length(this.line, { units: 'kilometers' });
        this.reverse = false
        this.id = id
    }

    animate(map) {
        // 1フレームで移動する距離を算出
        const now = new Date().getTime();
        const offset = now - this.time;
        this.time = now;
        const movingInMeters = ((this.kph / 60 / 60 / 1000) * offset) * 1000;

        // 移動距離加算
        this.distance += movingInMeters;

        // 移動した点を計算
        const movedPoint = along(this.line, this.distance, {units: "kilometers"});

        return [this.id, movedPoint]

        // 
        if (this.distance >= this.lineLength) {
            // 終点に到達した時の処理
        }
    }

}