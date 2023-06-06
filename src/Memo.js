import population_2020_geojson from "assets/250mメッシュ_栃木県_2020年人口.geojson"

import { graduated_colors, graduated_option } from 'utils/graduated_colors';
import Color from 'utils/Color'

// 250mメッシュ
map.addSource("population_2020", {
    type: "geojson",
    data: population_2020_geojson
});
// 人口データ
map.addLayer({
    id: "population_2020",
    type: "fill-extrusion",
    source: "population_2020",
    filter: ["to-boolean", ["get", "Population_2020"]],
    paint: {
        'fill-extrusion-color': graduated_option(
            graduated_colors([new Color(255, 255, 255), new Color(255, 0, 0)], 5), 0, 5, 100, "Population_2020"
        ),
        "fill-extrusion-opacity": 0.8,
        "fill-extrusion-height": ["get", "Population_2020"]
    },
});

            let station_layer = {
                'type': 'FeatureCollection',
                'features': []
            };

            /** 電車の駅を読み込む **/
            /* あとで別ファイルに切り分け */
            const loadStationData = (datas) => {
                for (const data of datas) {
                    station_layer.features.push(point(data.coord, { id: data.id }));
                    station_data[data.id] = {
                        lngLat: { lng: data.coord[0], lat: data.coord[1] },
                        railway: data.railway
                    }
                }
                map.addSource("station", {
                    type: "geojson",
                    data: station_layer
                });

                map.addLayer({
                    id: "station",
                    type: "circle",
                    source: "station",
                    paint: {
                        'circle-color': "#ffffff",
                        "circle-radius": hoge(12, 6),      // 地図上で半径を12mで固定する。
                        "circle-stroke-color": "#000000",
                        "circle-stroke-width": hoge(2, 1),
                        "circle-pitch-alignment": "map", // カメラの角度に応じて、円の角度を変える。要するに、地面に円が貼り付いている様に見える。
                    }
                });
            }

            loadStationData(station_json);