export class Utils {

    public static shade(hex: string, percent: number): string {
        let red;
        let green;
        let blue;
        const min = Math.min;
        const round = Math.round;
        if (hex.length !== 7) { return hex; }
        const number = parseInt(hex.slice(1), 16);
        const R = number >> 16;
        const G = number >> 8 & 0xFF;
        const B = number & 0xFF;
        red = min(255, round((1 + percent) * R)).toString(16);
        if (red.length === 1) {
            red = `0${red}`;
        }
        green = min(255, round((1 + percent) * G)).toString(16);
        if (green.length === 1) {
            green = `0${green}`;
        }
        blue = min(255, round((1 + percent) * B)).toString(16);
        if (blue.length === 1) {
            blue = `0${blue}`;
        }
        return `#${red}${green}${blue}`;
    }

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

}
