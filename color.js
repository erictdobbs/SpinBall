var Color = (function () {
    function Color(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
    Color.FromHex = function (hex) {
        var bigint = parseInt(hex.replace("#", ""), 16);
        var r = (bigint >> 16) & 255;
        var g = (bigint >> 8) & 255;
        var b = bigint & 255;
        return new Color(r, g, b);
    };
    Color.FromHsl = function (h, s, l) {
        var r = 1, g = 1, b = 1;
        if (s !== 0) {
            var hue2rgb = function hue2rgb(p, q, t) {
                if (t < 0)
                    t += 1;
                if (t > 1)
                    t -= 1;
                if (t < 1 / 6)
                    return p + (q - p) * 6 * t;
                if (t < 1 / 2)
                    return q;
                if (t < 2 / 3)
                    return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = Math.floor(hue2rgb(p, q, h + 1 / 3) * 255);
            g = Math.floor(hue2rgb(p, q, h) * 255);
            b = Math.floor(hue2rgb(p, q, h - 1 / 3) * 255);
        }
        return new Color(r, g, b);
    };
    Color.prototype.toHsl = function () {
        var r = this.r / 255, g = this.g / 255, b = this.b / 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;
        if (max == min) {
            h = s = 0;
        }
        else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }
        return { h: h, s: s, l: l };
    };
    Color.prototype.toHex = function () {
        return "#" + [this.r, this.g, this.b].map(function (c) {
            var a = Math.floor(c).toString(16);
            if (a.length < 2)
                a = "0" + a;
            return a;
        }).join("");
    };
    return Color;
}());
function RgbToHex(r, g, b) {
    return "#" + [r, g, b].map(function (c) {
        var a = Math.floor(c).toString(16);
        if (a.length < 2)
            a = "0" + a;
        return a;
    }).join("");
}
//# sourceMappingURL=color.js.map