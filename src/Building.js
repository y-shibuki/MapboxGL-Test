import { MapboxLayer } from "@deck.gl/mapbox"
import { Tile3DLayer } from '@deck.gl/geo-layers';
import { Tiles3DLoader } from '@loaders.gl/3d-tiles';

// 建物レイヤ
// https://deck.gl/docs/api-reference/geo-layers/tile-3d-layer
// Plateauのデータ：https://github.com/Project-PLATEAU/plateau-streaming-tutorial/blob/main/3d-tiles/plateau-3dtiles-streaming.md
const buildingLayer = {
    "3d-buildings-MapboxGL": {
        "id": "3d-buildings-MapboxGL",
        "source": "composite",
        "source-layer": "building",
        "filter": ["==", "extrude", "true"],
        "type": "fill-extrusion",
        "minzoom": 8,
        "paint": {
            "fill-extrusion-color": "#aaa",
            "fill-extrusion-height": [
                "interpolate", ["linear"], ["zoom"],
                8, 0,
                14.05, ["get", "height"]
            ],
            "fill-extrusion-base": [
                "interpolate", ["linear"], ["zoom"],
                8, 0,
                14.05, ["get", "min_height"]
            ],
            "fill-extrusion-opacity": 0.8
        }
    },
    "3d-buildings-PLATEAU_LOD1": new MapboxLayer({
        id: '3d-buildings-PLATEAU_LOD1',
        type: Tile3DLayer,
        pointSize: 1,
        data: 'https://assets.cms.plateau.reearth.io/assets/d2/7214a9-e4a1-427f-8d02-9abfbff75e05/09201_utsunomiya-shi_2020_3dtiles_3_op_bldg_lod1/tileset.json',
        loader: Tiles3DLoader
    }),
    "3d-buildings-PLATEAU_LOD2": new MapboxLayer({
        id: '3d-buildings-PLATEAU_LOD2',
        type: Tile3DLayer,
        pointSize: 1,
        data: "https://assets.cms.plateau.reearth.io/assets/1f/45fa88-ab0e-45b8-bf59-61ef54d7a723/09201_utsunomiya-shi_2020_3dtiles_3_op_bldg_lod2/tileset.json",
        loader: Tiles3DLoader
    }),
    "3d-buildings-PLATEAU_LOD2_notexture": new MapboxLayer({
        id: '3d-buildings-PLATEAU_LOD2_notexture',
        type: Tile3DLayer,
        pointSize: 1,
        data: 'https://assets.cms.plateau.reearth.io/assets/9a/161408-d44f-427a-b296-c1f3c58669a7/09201_utsunomiya-shi_2020_3dtiles_3_op_bldg_lod2_no_texture/tileset.json',
        loader: Tiles3DLoader
    })
};

// 建物のレイヤを管理するクラス
// このクラスで、データの読み込み・表示・切り替えを行うことが可能
export class Building {
    constructor() {
        const me = this;

        me.visibleLayerID = "3d-buildings-MapboxGL";
    }

    add(map) {
        const me = this;
        me.map = map;

        for(let key in buildingLayer){
            map.addLayer(buildingLayer[key]);
            map.setLayoutProperty(key, 'visibility', key === me.visibleLayerID ? "visible" : "none");
        };
    }

    toggleVisibility(layerID) {
        const me = this, {map} = me;
        me.visibleLayerID = layerID;

        for(let key in buildingLayer){
            map.setLayoutProperty(key, 'visibility', key === me.visibleLayerID ? "visible" : "none");
        };
    }
};