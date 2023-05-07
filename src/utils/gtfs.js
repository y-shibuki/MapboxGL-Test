import { lineString, point, featureCollection } from "@turf/turf";
import { json } from "d3";
import { hoge } from "distance"

export class GTFS {
    constructor(folder_path, prefix) {
        this.folder_path = folder_path;
        this.prefix = prefix;

        // ルートのデータ
        json(this.folder_path + "/shapes.json").then((data) => {
            this.route_layer = featureCollection(
                data.map((v) => {
                    let { id, coord } = v;
                    return lineString(coord, { id: id });
                })
            );
        });
        // 駅のデータ
        json(this.folder_path + "/stops.json").then((data) => {
            this.stop_layer = featureCollection(
                data.map((v) => {
                    let { id, coord } = v;
                    return point(coord, { id: id });
                })
            );
        });
    }

    onAdd(map) {
        const me = this;

        map.addSource(me.prefix + "_route", {
            type: "geojson",
            data: me.route_layer
        });
        map.addSource(me.prefix + "_stop", {
            type: "geojson",
            data: me.stop_layer
        });

        map.addLayer({
            id: me.prefix + "_route",
            type: "line",
            source: me.prefix + "_route",
            minzoom: 10,
            paint: {
                'line-color': '#000',
                'line-width': hoge(3, 3),
            }
        });
        map.addLayer({
            id: me.prefix + "_stop",
            type: "circle",
            source: me.prefix + "_stop",
            minzoom: 10,
            paint: {
                'circle-color': "#ffffff",
                "circle-radius": hoge(12, 6),      // 地図上で半径を12mで固定する。
                "circle-stroke-color": "#000000",
                "circle-stroke-width": hoge(2, 1),
                "circle-pitch-alignment": "map", // カメラの角度に応じて、円の角度を変える。要するに、地面に円が貼り付いている様に見える。
            }
        });
    }
}