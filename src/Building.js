import { MapboxLayer } from "@deck.gl/mapbox"
import { Tile3DLayer } from '@deck.gl/geo-layers';
import { Tiles3DLoader } from '@loaders.gl/3d-tiles';
import { AmbientLight, DirectionalLight, LightingEffect } from "deck.gl";

// 建物レイヤ
// https://deck.gl/docs/api-reference/geo-layers/tile-3d-layer
// Plateauのデータ：https://github.com/Project-PLATEAU/plateau-streaming-tutorial/blob/main/3d-tiles/plateau-3dtiles-streaming.md
const buildingLayer = {
    "3d-buildings-MapboxGL": {
        "id": "3d-buildings-MapboxGL",
        "source": "composite",
        "source-layer": "building",
        'filter': ['==', 'extrude', 'true'],
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
        loader: Tiles3DLoader,
        onTileLoad: d => {
            const {content} = d;
            content.cartographicOrigin.z -= 40;
        }
    }),
    "3d-buildings-PLATEAU_LOD2": new MapboxLayer({
        id: '3d-buildings-PLATEAU_LOD2',
        type: Tile3DLayer,
        pointSize: 1,
        data: "https://assets.cms.plateau.reearth.io/assets/1f/45fa88-ab0e-45b8-bf59-61ef54d7a723/09201_utsunomiya-shi_2020_3dtiles_3_op_bldg_lod2/tileset.json",
        loader: Tiles3DLoader,
        onTileLoad: d => {
            const {content} = d;
            content.cartographicOrigin.z -= 40;
        }
    }),
    "3d-buildings-PLATEAU_LOD2_notexture": new MapboxLayer({
        id: '3d-buildings-PLATEAU_LOD2_notexture',
        type: Tile3DLayer,
        pointSize: 1,
        data: 'https://assets.cms.plateau.reearth.io/assets/9a/161408-d44f-427a-b296-c1f3c58669a7/09201_utsunomiya-shi_2020_3dtiles_3_op_bldg_lod2_no_texture/tileset.json',
        loader: Tiles3DLoader,
        onTileLoad: d => {
            const {content} = d;
            content.cartographicOrigin.z -= 40;
        }
    })
};

const radioButtons = [
    {
        label: "非表示",
        value: "null"
    },
    {
        label: "LOD1 建物モデル（MapboxGL）",
        value: "3d-buildings-MapboxGL"
    },
    {
        label: "LOD1 建物モデル（Project PLATEAU）",
        value: "3d-buildings-PLATEAU_LOD1"
    },
    {
        label: "LOD2 建物モデル（Project PLATEAU）",
        value: "3d-buildings-PLATEAU_LOD2"
    },
    {
        label: "LOD2 建物モデル-テクスチャ無し-（Project PLATEAU）",
        value: "3d-buildings-PLATEAU_LOD2_notexture"
    }
];

// 建物のレイヤを管理するクラス
// このクラスで、データの読み込み・表示・切り替えを行うことが可能
export class Building {
    constructor() {
        const me = this;

        me.visibleLayerID = "3d-buildings-MapboxGL";
    }

    static add(map) {
        const me = this;
        me.map = map;

        for (let key in buildingLayer) {
            map.addLayer(buildingLayer[key]);
            map.setLayoutProperty(key, 'visibility', key === me.visibleLayerID ? "visible" : "none");
        };

        me.ambientLight = new AmbientLight({
            color: "#fff",
            intensity: 3.0
        });
        me.directionalLight = new DirectionalLight({
            color: "#fff",
            intensity: 9.0,
            direction: [0, 0, -1]
        });

        map.__deck.props.effect = [new LightingEffect({
            ambientLight: me.ambientLight,
            directionalLight: me.directionalLight
        })];
    }

    static toggleVisibility(layerID) {
        const me = this, { map } = me;
        me.visibleLayerID = layerID;

        for (let key in buildingLayer) {
            map.setLayoutProperty(key, 'visibility', key === me.visibleLayerID ? "visible" : "none");
        };
    }
};

export const BuildingLayerModal = ({ visibleLayerID, setVisibleLayerID }) => {
    const changeValue = (e) => {
        setVisibleLayerID(e.target.value);
    };

    return (
        <fieldset className="BuilidingLayers_RadioButtonContainer">
            {radioButtons.map(radio => {
                return (
                    <div key={radio.value}>
                        <input id={radio.value} type="radio" name="building-layers"
                            value={radio.value} checked={radio.value === visibleLayerID} onChange={changeValue} className="visually-hidden"/>
                        <label htmlFor={radio.value}>
                            <span>{radio.label}</span>
                        </label>
                    </div>
                )
            })}
        </fieldset>
    )
}