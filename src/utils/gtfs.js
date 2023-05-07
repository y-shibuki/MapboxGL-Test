import { lineString, point, featureCollection } from "@turf/turf";
import { json } from "d3";
import { hoge } from "distance"

export class GTFS {
    constructor(folder_path, prefix) {
        this.folder_path = folder_path;
        this.prefix = prefix;

        // ルートのデータ
        json(this.folder_path + "/shapes.json").then(data => {
            this.route_layer = featureCollection(
                data.map((v) => {
                    let { stop_id, coord } = v;
                    return lineString(coord, { id: stop_id });
                })
            );
        });
        // 駅のデータ
        json(this.folder_path + "/stops.json").then(data => {
            this.stop_layer = featureCollection(
                data.map(v => {
                    let { stop_id, coord } = v;
                    return point(coord, { id: stop_id });
                })
            );
            // key: stop_id, value: 駅の座標のMapデータ
            this.stops = new Map(
                data.map(v => {
                    let { stop_id, coord } = v;
                    return [stop_id, coord];
                })
            );
        });

        // 時刻表のデータ
        json(this.folder_path + "/timetable.json").then(data => {
            this.timetable = data;
        });

        // 車両のデータ
        this.vehicles = new Map();
        // 車両を描画するレイヤ
        this.vehicle_layer = null;
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
        map.addSource(me.prefix + "_vehicle", {
            type: "geojson",
            data: me.vehicle_layer
        })

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
                "circle-radius": hoge(4, 6),      // 地図上で半径を12mで固定する。
                "circle-stroke-color": "#000000",
                "circle-stroke-width": hoge(2, 1),
                "circle-pitch-alignment": "map", // カメラの角度に応じて、円の角度を変える。要するに、地面に円が貼り付いている様に見える。
            }
        });
        map.addLayer({
            id: me.prefix + "_vehicle",
            type: "circle",
            source: me.prefix + "_vehicle",
            paint: {
                'circle-color': "#f77",
                "circle-radius": hoge(4, 6),      // 地図上で半径を4mで固定する。
                "circle-stroke-color": "#f99",
                "circle-stroke-width": hoge(1, 1),
                "circle-pitch-alignment": "map", // カメラの角度に応じて、円の角度を変える。要するに、地面に円が貼り付いている様に見える。
            }
        })
    }

    onTick(map) {
        const me = this;
        const now = new Date();
        now.setHours(10);
        now.setMinutes(57);
        now.setSeconds(0);

        me.vehicles = new Map();
        this.timetable.forEach((trip) => {
            const { trip_id, tt } = trip;
            for (let i = 0; i < tt.length - 1; i++) {
                const _d = tt[i]["d"], _a = tt[i + 1]["a"],
                    d_hms = _d.split(":"),
                    a_hms = _a.split(":"),
                    d = new Date(),
                    a = new Date();
                d.setHours(d_hms[0]);
                d.setMinutes(d_hms[1]);
                d.setSeconds(d_hms[2]);
                a.setHours(a_hms[0]);
                a.setMinutes(a_hms[1]);
                a.setSeconds(a_hms[2]);
                if (d <= now & now <= a) {
                    me.vehicles.set(trip_id, me.stops.get(tt[i]["s"]));
                }
            }
        });

        // Mapでmapを使う方法：https://stackoverflow.com/questions/31084619/map-a-javascript-es6-map
        map.getSource(me.prefix + "_vehicle").setData(
            featureCollection(
                Array.from(me.vehicles).map(([k, v]) => {
                    return point(v);
                })
            )
        );
    }
}