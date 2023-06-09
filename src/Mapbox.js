import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';

import "css/Map.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLayerGroup, faBuilding, faSpinner } from '@fortawesome/free-solid-svg-icons';

import { transit_realtime } from 'gtfs-realtime-bindings';
import axios from 'axios';
import { featureCollection, point } from '@turf/turf';

import Modal from 'components/Modal';
import { Clock, ClockComponent } from 'Clock';

import { hoge } from "distance"
import { Fuga } from "fuga"
import { GTFS } from 'utils/gtfs';
import { graduated_colors, graduated_option } from 'utils/graduated_colors';
import Color from 'utils/Color'

import { Building, BuildingLayerModal } from 'Building';
import { LayerModal } from 'components/LayerModal'

import station_json from "assets/station.json"

// データの読み込み
import lrt_route_geojson from "assets/LRT_route_single.geojson";
import lrt_stop_geojson from "assets/LRT_stop.geojson";
import population_2020_geojson from "assets/250mメッシュ_栃木県_2020年人口.geojson"

// マップボックスのアクセストークン（吉田のアカウント）
mapboxgl.accessToken = 'pk.eyJ1Ijoic2hpYnVraSIsImEiOiJjbGRhZGJmd28waHNrM29ubjg3cjFhZWczIn0.sYAMGbs9eB0HdpDAmhz5aA';

const gtfs_list = [
    new GTFS("/assets/kanto_GTFS", "kanto_bus"),
    new GTFS("/assets/ToyamaChitetsu", "toyama_chitetsu"),
];

const lrtVehiclePositionLayer = {
    'type': 'FeatureCollection',
    'features': [
        {
            'type': 'Feature',
            'properties': {},
            'geometry': {
                'type': 'Point',
                'coordinates': [139.899260236867036, 36.559057305578094]
            }
        }
    ]
};

const route = [[139.899260236867036, 36.559057305578094], [139.899215692827994, 36.558725608249745], [139.899221717711697, 36.558672374076878], [139.899281966551285, 36.558630431975551], [139.899346231980218, 36.558601395122857], [139.899446646713074, 36.558594942487623], [139.903532425486247, 36.558294688222681], [139.907667285614508, 36.557968696100879], [139.912135052356632, 36.557643172882329], [139.91567895401306, 36.557541521398974], [139.922741692124902, 36.557316601107999], [139.929734342425036, 36.557077438742184], [139.934781738684023, 36.556920125339538], [139.935591637879043, 36.556891841041654], [139.935915584084768, 36.556880526247198], [139.936203153570318, 36.556827727423602], [139.936498939326725, 36.556728729531628], [139.936671481017584, 36.556563732762569], [139.936802941353278, 36.55635913627949], [139.936950834229009, 36.555593544632742], [139.937164457274548, 36.555303145817291], [139.937427377946534, 36.555111746001558], [139.937821758955238, 36.55501274591132], [139.939482422077617, 36.554976639491322], [139.944875245989039, 36.554860943692951], [139.949356785530654, 36.55476198190366], [139.949798610355288, 36.554755528948448], [139.950312733787371, 36.554671640471561], [139.950682260003845, 36.554529675148395], [139.951027686684455, 36.554374803589226], [139.954176692702219, 36.552813164690228], [139.963477071486835, 36.548349923890498], [139.969182670359487, 36.545746676896755], [139.971319495871683, 36.544739891812775], [139.971705088445304, 36.544539823984302], [139.972195112341353, 36.544436562967569], [139.972653003523135, 36.544397840051232], [139.973231392384577, 36.544410747693526], [139.975843108273551, 36.544909860231428], [139.976211701657661, 36.544980295222217], [139.978428858961735, 36.545398175867426], [139.978585505945176, 36.545443352017955], [139.978677887499629, 36.545514343057995], [139.978830517896398, 36.546327508501001], [139.978874700379293, 36.546453354769511], [139.978967081933774, 36.546527571703756], [139.979256276364794, 36.546617922658271], [139.981774677866468, 36.547139051997185], [139.984405543869627, 36.547653724273765], [139.984662605586038, 36.547729553441563], [139.984823269159079, 36.547850557278196], [139.984933725365835, 36.5480344827468], [139.984943766839706, 36.548207114147964], [139.983256799347316, 36.553839203778878], [139.982324950638429, 36.557414101284074], [139.982228552498185, 36.558382005369836], [139.982903339517804, 36.562679353083446], [139.983545993820087, 36.566150609583389], [139.983610259250128, 36.566453853207229], [139.983786989180857, 36.566711931949577], [139.983995851825739, 36.566860326836185], [139.984349311685946, 36.566989365636594], [139.985313293120896, 36.56702323828754], [139.985554288480728, 36.567060336886847], [139.985815366785516, 36.567103887393479], [139.986772520847609, 36.567348038637121], [139.987924076177592, 36.56757487648882], [139.989104953437646, 36.567744238304833], [139.98994442060382, 36.567791014360814], [139.990779871182241, 36.567795853263036], [139.992443206804495, 36.567731469933946], [139.998263390783762, 36.567579659059575], [140.000889626487606, 36.567534552217005], [140.002249242801128, 36.56730067099577], [140.00592867191898, 36.566240617491353], [140.01105360573905, 36.564815033124283], [140.01121226101688, 36.564785998596165], [140.01131066745512, 36.564794063744216], [140.011388990948092, 36.564815033125001], [140.011433173430731, 36.56485374581267], [140.0114813725028, 36.564944075341678], [140.014642428316023, 36.571434620710143], [140.01469615019721, 36.571669699188334], [140.01472024973404, 36.571943889305999], [140.014684100430998, 36.572176143702869], [140.01460778523537, 36.57257936148288], [140.01193163209004, 36.5787916243872]];

let fuga;

const building = new Building();

let map;

let station_layer = {
    'type': 'FeatureCollection',
    'features': []
};

let station_data = {}

let layerGroup = {
    "population_2020": { layers: ["population_2020"], description: "宇都宮市の人口(2020年・250mメッシュ)" },
}

const Mapbox = () => {
    const mapContainer = useRef(null);
    const [mapLoadedFlag, setMapLoadedFlag] = useState(false);

    // 3D建物の表示に関する変数
    const [isBuildingModalVisible, setBuildingModalVisibility] = useState(false);
    const [visibleBuildingLayerID, setVisibleBuildingLayerID] = useState("3d-buildings-MapboxGL");

    // レイヤの表示に関する変数
    const [isLayerModalVisible, setLayerModalVisibility] = useState(false);
    const [visibleLayerIDs, setVisibleLayerIDs] = useState({"population_2020": false});

    const reqIdRef = useRef(); // アニメーションの管理ID

    const [lng, setLng] = useState(139.8987);
    const [lat, setLat] = useState(36.5594);
    const [zoom, setZoom] = useState(15);

    // HTMLページのDOMツリーにアプリが挿入された直後に呼び出されます。
    useEffect(() => {
        (async () => {
            // MapBoxの初期化
            map = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/light-v10',//'mapbox://styles/mapbox/satellite-streets-v12',// 
                center: [lng, lat],
                zoom: zoom
            });
            // 地図のコントロールを追加
            map.addControl(
                new mapboxgl.NavigationControl()
            );
            // 縮尺を追加
            map.addControl(new mapboxgl.ScaleControl({
                maxWidth: 250,
                unit: 'metric'
            }));

            // mapが読み込まれるまで待機
            await map.once("load");

            // GeoJsonデータの登録
            // addSource：
            //  第1引数：ID
            //  第2引数：詳細

            // LRTの路線
            map.addSource("lrt_route", {
                type: "geojson",
                data: lrt_route_geojson
            });
            // LRTのバス停
            map.addSource("lrt_stop", {
                type: "geojson",
                data: lrt_stop_geojson
            });
            // 250mメッシュ
            map.addSource("population_2020", {
                type: "geojson",
                data: population_2020_geojson
            });

            // 地形情報
            map.addSource('mapbox-dem', {
                'type': 'raster-dem',
                'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
                'tileSize': 512,
                'maxzoom': 14
            });

            /**
            // PLATEAUの地形画像を表示
            // 高解像度です。さすが国交省。
            // 一番最初に読み込まないと、他のレイヤに重なっちゃいます。
            // 本家の解説：https://github.com/Project-PLATEAU/plateau-streaming-tutorial/blob/main/terrain/plateau-terrain-streaming.md
            // ただ、データがない場所を読み込むと、コンソールログにエラーが大量に発生します。無視していいエラーらしいけど、なんか不安。
            map.addSource("plateau_tile", {
                "type": "raster",
                "tiles": [
                    "https://gic-plateau.s3.ap-northeast-1.amazonaws.com/2020/ortho/tiles/{z}/{x}/{y}.png"
                ],
                maxzoom: 19,
                minzoom: 10,
                attribution: '<a href="https://www.mlit.go.jp/plateau/">国土交通省Project PLATEAU</a>'
            })
            map.addLayer({
                "id": "plateau_tile",
                "type": "raster",
                "source": "plateau_tile",
                minzoom: 10,
            });**/

            // 地形情報を登録
            map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1 });

            // 空の情報を登録
            map.addLayer({
                'id': 'sky',
                'type': 'sky',
                'paint': {
                    'sky-type': 'atmosphere',
                    'sky-atmosphere-sun': [0.0, 0.0],
                    'sky-atmosphere-sun-intensity': 15
                }
            });

            map.addSource("point", {
                type: "geojson",
                data: lrtVehiclePositionLayer
            });

            map.addLayer({
                id: "lrt_route",
                type: "line",
                source: "lrt_route",
                paint: {
                    'line-color': '#FFA500',
                    'line-width': hoge(5, 5),
                }
            });

            map.addLayer({
                id: "lrt_stop",
                type: "circle",
                source: "lrt_stop",
                minzoom: 10,
                paint: {
                    'circle-color': "#ffffff",
                    "circle-radius": hoge(12, 6),      // 地図上で半径を12mで固定する。
                    "circle-stroke-color": "#000000",
                    "circle-stroke-width": hoge(2, 1),
                    "circle-pitch-alignment": "map", // カメラの角度に応じて、円の角度を変える。要するに、地面に円が貼り付いている様に見える。
                }
            });

            map.addLayer({
                id: "point",
                type: "circle",
                source: "point",
                paint: {
                    'circle-color': "#f77",
                    "circle-radius": hoge(4, 6),      // 地図上で半径を4mで固定する。
                    "circle-stroke-color": "#f99",
                    "circle-stroke-width": hoge(1, 1),
                    "circle-pitch-alignment": "map", // カメラの角度に応じて、円の角度を変える。要するに、地面に円が貼り付いている様に見える。
                }
            });

            /*
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
            });*/

            gtfs_list.forEach(x => {
                x.onAdd(map);
            })

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

            map.on('click', 'station', function (e) {
                const { id } = e.features[0].properties,
                    { lngLat } = station_data[id];

                new mapboxgl.Popup()
                    .setLngLat(lngLat)
                    .setHTML(id)
                    .addTo(map);
            });
            map.on('mouseenter', 'station', () => {
                map.getCanvas().style.cursor = 'pointer';
            });
            map.on('mouseleave', 'station', () => {
                map.getCanvas().style.cursor = '';
            });

            /** GTFS-RTをお試し **/
            /* https://github.com/MobilityData/gtfs-realtime-bindings/blob/master/nodejs/README.md */
            await axios.get("/toyama/chitetsu_tram/VehiclePositions.pb", { responseType: "arraybuffer" })
                .then(response => {
                    const { data } = response,
                        feed = transit_realtime.FeedMessage.decode(new Uint8Array(data));

                    map.addSource("ToyamaLRTVehicle", {
                        type: 'geojson',
                        data: featureCollection(
                            feed.entity.map(e => {
                                const { trip, position } = e.vehicle;
                                return point([position.longitude, position.latitude], { tripId: trip.tripId });
                            })
                        )
                    });
                    map.addLayer({
                        id: "ToyamaLRTVehicle",
                        type: "circle",
                        source: "ToyamaLRTVehicle",
                        paint: {
                            'circle-color': "#f77",
                            "circle-radius": hoge(4, 6),      // 地図上で半径を4mで固定する。
                            "circle-stroke-color": "#f99",
                            "circle-stroke-width": hoge(1, 1),
                            "circle-pitch-alignment": "map", // カメラの角度に応じて、円の角度を変える。要するに、地面に円が貼り付いている様に見える。
                        }
                    })
                }).catch(error => {
                    console.log(error);
                    console.log("GTFSデータの取得に失敗しました");
                });


            // 建物データの読み込み
            building.add(map);

            await map.once("idle");

            setMapLoadedFlag(true);

            // Mapがユーザーによって動かされたとき、緯度経度を更新する。
            map.on('move', () => {
                setLng(map.getCenter().lng.toFixed(4));
                setLat(map.getCenter().lat.toFixed(4));
                setZoom(map.getZoom().toFixed(2));
            });

            fuga = new Fuga(0.2, route, "point");

            /*
            let d = new Date();
            d.setHours(10);
            Clock.setDate(d);
            */

            gtfs_list.forEach(x => {
                x.onTick();
            });

            // アニメーションを開始
            reqIdRef.current = requestAnimationFrame(animate);
        })()

        return () => {
            map.remove();   // React.StrictModeのせいで、Localhostで実行すると、2回レンダリングされます。
            // その際に、mapを解放していないと、IDが重複しているってエラーが出ます。
            cancelAnimationFrame(reqIdRef); //アニメーションの解除
        }
        // ESLintを一行だけ解除
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const animate = () => {
        const [id, point] = fuga.animate();
        map.getSource(id).setData(point);

        gtfs_list.forEach(x => {
            x.animate();
        });

        reqIdRef.current = requestAnimationFrame(animate);
    }


    // 3D建物の表示切り替え
    useEffect(() => {
        if (!mapLoadedFlag) return;

        building.toggleVisibility(visibleBuildingLayerID);
    }, [mapLoadedFlag, visibleBuildingLayerID]);


    // レイヤの表示切り替え
    useEffect(() => {
        if (!mapLoadedFlag) return;

    }, [mapLoadedFlag, visibleLayerIDs])


    return (
        <div>
            {!mapLoadedFlag ? (
                <div className='loader'>
                    <span>データを読み込んでいます。しばらくお待ちください！</span>
                    <FontAwesomeIcon icon={faSpinner} size="4x" />
                </div>
            ) : (<></>)}
            <div className='BasicButtonContainer'>
                <div className='BasicButton' onClick={() => setBuildingModalVisibility(true)}>
                    <span>3D建物</span>
                    <FontAwesomeIcon icon={faBuilding} size="2x" />
                </div>
                <div className='BasicButton' onClick={() => setLayerModalVisibility(true)}>
                    <span>レイヤ<br />切り替え</span>
                    <FontAwesomeIcon icon={faLayerGroup} size="2x" />
                </div>
            </div>

            <Modal Title={"レイヤー"} isOpen={isBuildingModalVisible} setShow={setBuildingModalVisibility}>
                <BuildingLayerModal visibleLayerID={visibleBuildingLayerID} setVisibleLayerID={setVisibleBuildingLayerID} />
            </Modal>

            <Modal Title={"レイヤー"} isOpen={isLayerModalVisible} setShow={setLayerModalVisibility}>

            </Modal>

            <ClockComponent />

            <div className="DebugComponent">
                Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
            </div>
            <div ref={mapContainer} className="map-container" />
        </div>
    );
};

export default Mapbox;