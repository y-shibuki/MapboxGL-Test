export default class Color{
    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.rgb = [r, g, b];
        this.hex = "#" + ("0" + r.toString(16)).slice(-2) + ("0" + g.toString(16)).slice(-2) + ("0" + b.toString(16)).slice(-2);
    }
}