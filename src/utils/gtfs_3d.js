import { lineString, point, featureCollection, nearestPointOnLine, along, lineDistance } from "@turf/turf";
import { json } from "d3";
import { hoge } from "distance"
import { Clock } from "Clock";
import mapboxgl from "mapbox-gl";
import * as THREE from "three"

export class GTFS_3D {
    constructor(folder_path, prefix, gtfs_rt=false) {
        this.folder_path = folder_path;
        this.prefix = prefix;

        // ルートのデータ
        json(this.folder_path + "/routes.json").then(data => {
            this.route_layer = featureCollection(
                data.map((v) => {
                    let { coord } = v;
                    return lineString(coord);
                })
            );

            // key: shape_id, value: ルートの座標のMapデータ
            this.routes = new Map(
                data.map(v => {
                    let { shape_id, coord } = v;
                    return [shape_id, lineString(coord)];
                })
            );
        });
        // 駅のデータ
        json(this.folder_path + "/stops.json").then(data => {
            this.stop_layer = featureCollection(
                data.map(v => {
                    let { stop_name, coord } = v;
                    return point(coord, { name: stop_name });
                })
            );
            // key: stop_id, value: 駅の座標のMapデータ
            this.stops = new Map(
                data.map(v => {
                    let { stop_id, coord } = v;
                    return [stop_id, point(coord)];
                })
            );
        });

        // 時刻表のデータ
        json(this.folder_path + "/timetable.json").then(data => {
            this.timetable = data;
        });

        // 車両のデータ
        this.vehicles = new Map();
        this.vehicles_position = [];

        // 最後に車両を描画した時刻
        this.time = null;
    }

    onAdd(map) {
        const me = this;
        me.map = map;

        const geometry = new THREE.SphereGeometry( 5, 12, 12 );
        const material = new THREE.MeshBasicMaterial( {color: 0xFF0000} );

        // 3Dカスタムレイヤとして定義
        this.customLayer = {
            id: me.layer_id,
            type: 'custom',
            renderingMode: '3d',
            onAdd: function (map, gl) {
                this.camera = new THREE.Camera();
                this.scene = new THREE.Scene();
    
                // create two three.js lights to illuminate the model
                const directionalLight = new THREE.DirectionalLight(0xffffff);
                directionalLight.position.set(0, -70, 100).normalize();
                this.scene.add(directionalLight);
    
                const directionalLight2 = new THREE.DirectionalLight(0xffffff);
                directionalLight2.position.set(0, 70, 100).normalize();
                this.scene.add(directionalLight2);
                
                me.vehicles_position.forEach(x => {
                    const sphere = new THREE.Mesh( geometry, material );

                    const modelRotate = [Math.PI / 2, 0, 0];
                    const mercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
                        me.modelOrigin, 0
                    );
                    // transformation parameters to position, rotate and scale the 3D model onto the map
                    const modelTransform = {
                        translateX: mercatorCoordinate.x,
                        translateY: mercatorCoordinate.y,
                        translateZ: mercatorCoordinate.z,
                        rotateX: modelRotate[0],
                        rotateY: modelRotate[1],
                        rotateZ: modelRotate[2],
                        // 3Dモデルは現実世界のメートル単位だが、CustomLayerInterfaceがメルカトル座標での単位を想定しているため、スケール変換を適用する必要がある。
                        scale: mercatorCoordinate.meterInMercatorCoordinateUnits()
                    };

                    this.scene.add( sphere );
                });
                this.map = map;
    
                // use the Mapbox GL JS map canvas for three.js
                this.renderer = new THREE.WebGLRenderer({
                    canvas: map.getCanvas(),
                    context: gl,
                    antialias: true
                });
    
                this.renderer.autoClear = false;
            },
            render: function (gl, matrix) {
                const rotationX = new THREE.Matrix4().makeRotationAxis(
                    new THREE.Vector3(1, 0, 0),
                    modelTransform.rotateX
                );
                const rotationY = new THREE.Matrix4().makeRotationAxis(
                    new THREE.Vector3(0, 1, 0),
                    modelTransform.rotateY
                );
                const rotationZ = new THREE.Matrix4().makeRotationAxis(
                    new THREE.Vector3(0, 0, 1),
                    modelTransform.rotateZ
                );
    
                const m = new THREE.Matrix4().fromArray(matrix);
                const l = new THREE.Matrix4()
                    .makeTranslation(
                        modelTransform.translateX,
                        modelTransform.translateY,
                        modelTransform.translateZ
                    )
                    .scale(
                        new THREE.Vector3(
                            modelTransform.scale,
                            -modelTransform.scale,
                            modelTransform.scale
                        )
                    )
                    .multiply(rotationX)
                    .multiply(rotationY)
                    .multiply(rotationZ);
    
                this.camera.projectionMatrix = m.multiply(l);
                this.renderer.resetState();
                this.renderer.render(this.scene, this.camera);
                this.map.triggerRepaint();
            },
            setAltitude(){
                const modelAltitude = Math.floor(map.queryTerrainElevation(me.modelOrigin, {exaggerated: false}));
                const updateMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
                    me.modelOrigin, modelAltitude
                );
                modelTransform.translateX = updateMercatorCoordinate.x;
                modelTransform.translateY = updateMercatorCoordinate.y;
                modelTransform.translateZ = updateMercatorCoordinate.z;
            },
            animate(){

            }
        };

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
                'line-width': hoge(2, 2),
                "line-opacity": 0.5
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
            id: me.prefix + "_stop_label",
            type: "symbol",
            source: me.prefix + "_stop",
            minzoom: 10,
            paint: {
                "text-halo-blur": 5,
                "text-halo-color": "#fff",
                "text-halo-width": 10,
                "text-opacity": 0.8,
            },
            layout: {
                "text-field": ["get", "name"],
                "text-anchor": "bottom",
                "text-pitch-alignment": "viewport",
                "text-size": 14,
            }
        });

        // マップに追加
        map.addLayer(me.customLayer);

        map.on('click', me.prefix + "_vehicle", function (e) {
            const { id } = e.features[0].properties;
            /*
            new mapboxgl.Popup()
                .setLngLat(lngLat)
                .setHTML(id)
                .addTo(map);*/
        });
        map.on('mouseenter', me.prefix + "_vehicle", () => {
            map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', me.prefix + "_vehicle", () => {
            map.getCanvas().style.cursor = '';
        });
    }

    onTick() {
        const me = this;
        const now = Clock.getDate();

        me.vehicles = new Map();
        this.timetable.forEach((trip) => {
            const { trip_id, tt, shape_id } = trip;
            for (let i = 0; i < tt.length - 1; i++) {
                const _d = tt[i]["d"],
                    _a = tt[i + 1]["a"],
                    {s} = tt[i],
                    d_hms = _d.split(":"),
                    a_hms = _a.split(":"),
                    d = new Date(),
                    a = new Date();
                d.setDate(now.getDate());
                d.setHours(...d_hms);
                a.setDate(now.getDate());
                a.setHours(...a_hms)
                if (d <= now & now <= a) {
                    // velocityはkm/ms単位です
                    const line = me.routes.get(shape_id),
                        start_point = me.stops.get(tt[i]["s"]),
                        end_point = me.stops.get(tt[i + 1]["s"]),
                        start_distance = nearestPointOnLine(line, start_point, {units: "kilometers"}).properties.location,
                        end_distance = nearestPointOnLine(line, end_point, {units: "kilometers"}).properties.location,
                        velocity = (end_distance - start_distance) / (a - d);
                    me.vehicles.set(trip_id, {
                        "time": d.getTime(),
                        "line": line,
                        "line_distance": lineDistance(line, {units: "kilometers"}),
                        "distance": start_distance,
                        "velocity": velocity
                    });
                }
            }
        });

        me.animate();
    }

    animate(){
        const me = this;
        const now = Clock.getDate();

        // Mapでmapを使う方法：https://stackoverflow.com/questions/31084619/map-a-javascript-es6-map
        
        me.vehicles_position = Array.from(me.vehicles).map(([, v]) => {
            const offset = now.getTime() - v["time"];
            v["time"] = now.getTime();
            v["distance"] = Math.min(v["distance"] + v["velocity"] * offset, v["line_distance"]);
            return along(v["line"], v["distance"], {units: "kilometers"}).geometry.coordinates;
        });
        console.log(me.vehicles_position)
    }
}