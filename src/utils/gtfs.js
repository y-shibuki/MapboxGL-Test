import CSV_reader from "./csv_reader";

import shapes_txt from "assets/kanto_GTFS/shapes.txt";
import { lineString } from "@turf/turf";

export class GTFS {
    constructor(folder_path) {
        this.folder_path = folder_path;
        this.shapes_linedata_dict = this.set_shape_linestring_dict();
        this.shapes_linestring_dict = {}
        for(let key in this.shapes_linedata_dict){
            this.shapes_linestring_dict[key] = lineString(this.shapes_linedata_dict[key])
        }
    }

    set_shape_linestring_dict() {
        let res = {}
        let arr = CSV_reader(shapes_txt, true);

        arr.forEach((v) => {
            let [k, px, py, , ] = v
            if(k in res){
                res[k].push([parseFloat(py), parseFloat(px)])
            }else {
                res[k] = [[parseFloat(py), parseFloat(px)]]
            }
        })

        return res;
    }
}