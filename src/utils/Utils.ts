export class Utils {

    public static getDepth(obj: any) {
        let depth = 0;
        if (obj.children) {
            obj.children.forEach((d: any) => {
                const tmpDepth = this.getDepth(d);
                if (tmpDepth > depth) {
                    depth = tmpDepth;
                }
            });
        }
        return 1 + depth;
    }

    public static getRGBColor(color: string) {
        if (color === "white" || color === "papayawhip") {
            return {
                r: 255,
                g: 255,
                b: 255
            };
        }
        if (color === "black") {
            return {
                r: 0,
                g: 0,
                b: 0
            };
        }
        // format: "rgb(254, 214, 118)"
        const ret = color.replace(/[^\d,]/g, "").split(",");
        if (ret
            && ret.length === 3) {
            return {
                r: parseInt(ret[0], 10),
                g: parseInt(ret[1], 10),
                b: parseInt(ret[2], 10)
            };
        }
    }

    public static getHighContrastColor(r: number, g: number, b: number) {
        // based on
        // http://stackoverflow.com/questions/407793/programmatically-choose-high-contrast-colors
        // http://stackoverflow.com/questions/3942878/how-to-decide-font-color-in-white-or-black-depending-on-background-color
        const c = [r / 255, g / 255, b / 255];
        for (let i = 0; i < c.length; ++i) {
            if (c[i] <= 0.03928) {
                c[i] = c[i] / 12.92;
            } else {
                c[i] = Math.pow((c[i] + 0.055) / 1.055, 2.4);
            }
        }
        const luminance = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
        return (luminance > 0.179) ? 'black' : 'white';
    }

    public static getHighContrastColorFromString(backgroundColor: string): string {
        const rgbColor = Utils.getRGBColor(backgroundColor);
        if (rgbColor) {
            // console.log("background: " + backgroundColor);
            // console.log("color: " + Utils.getHighContrastColor(rgbColor.r, rgbColor.g, rgbColor.b));
            return Utils.getHighContrastColor(rgbColor.r, rgbColor.g, rgbColor.b);
        }
    }
}
