export function hoge(geo_distance, min_pixel=1, lat = 36.5594) {

    const res = [
        "interpolate", ["linear"], ["zoom"]
    ];

    // C 赤道半径(m)
    const C = 40075016.686
    for (let i = 0; i <= 22; i++) {
        res.push(i)
        // r 任意緯度における1pxが表す地理的距離 = C * cos(緯度) / 2**zoomレベル / 512
        let r = C * Math.cos(lat * Math.PI / 180) / (2 ** i) / 512
        res.push(Math.max((geo_distance / r).toFixed(), min_pixel))
    }

    return res
};