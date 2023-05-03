import shapes_json from "assets/kanto_GTFS/shapes.json";
import { lineString, featureCollection } from "@turf/turf";

export class GTFS {
    constructor(folder_path) {
        this.folder_path = folder_path;
        this.route_layer = featureCollection(
            shapes_json.map((v) => {
                let {id, coord} = v
                return lineString(coord,{id: id});
            })
        );
    }
}