import Color from "utils/Color"

export const graduated_option = (colors, min_value, n, step, attribution) => {
    // ["case", 条件1, 色1, 条件2, 色2, ..., それ以外の時の色]
    let res = ["case"]

    for(let i = 0; i < n ; i++){
        // 0 <= x < 400, 400 <= x < 800, x <= 800みたいな感じ
        res.push(["all", [">=", ["get", attribution], min_value + i * step], ["<", ["get", attribution], min_value + (i + 1) * step]]);
        res.push(colors[i].hex)
    }

    res.push(colors[n - 1].hex)

    return res;
};

export const graduated_colors = (colors, n) => {
    // colorsは2色以上の複数色を指定可能ですが、2色か3色が限界だと思います
    if(colors.length === 1){
        return
    }

    let res = [];

    let step = (n - 1) / (colors.length - 1);

    for(let i = 0; i < n; i++){
        let k = Math.floor(i / step);
        let t = (i / step) - k;

        let [r1, g1, b1] = colors[k].rgb;
        let [r2, g2, b2] = (i !== (n - 1)) ? colors[k + 1].rgb: colors[k].rgb;

        let r = parseInt((r1 * (1 - t) + r2 * t));
        let g = parseInt((g1 * (1 - t) + g2 * t));
        let b = parseInt((b1 * (1 - t) + b2 * t));

        res.push(new Color(r, g, b));
    }

    return res;
}