import mapboxgl from "mapbox-gl";
import * as THREE from "three"
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

export class ThreeLayer{
    constructor(layer_id, file_path){
        this.layer_id = layer_id;
        this.file_path = file_path;
    }

    onAdd(map){
        const me = this;
        me.map = map;

        const modelOrigin = [139.899260236867036, 36.559057305578094];   // 緯度経度
        let modelAltitude = 0                                            // 高度

        const modelRotate = [Math.PI / 2, 0, 0];                         // ？
        const mercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
            modelOrigin, modelAltitude
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
    
                const loader = new GLTFLoader();
                loader.load(
                    me.file_path,
                    (obj) => {
                        this.scene.add(obj.scene);
                    }
                );
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
                modelAltitude = Math.floor(map.queryTerrainElevation(modelOrigin, {exaggerated: false}));
                const updateMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
                    modelOrigin, modelAltitude
                );
                modelTransform.translateX = updateMercatorCoordinate.x;
                modelTransform.translateY = updateMercatorCoordinate.y;
                modelTransform.translateZ = updateMercatorCoordinate.z;
            }
        };

        // マップに追加
        map.addLayer(me.customLayer);
    }

    setAltitude(){
        const me = this;

        me.customLayer.setAltitude();
    }
}