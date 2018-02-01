export declare class Utils {
    static getDepth(obj: any): number;
    static getRGBColor(color: string): {
        r: number;
        g: number;
        b: number;
    };
    static getHighContrastColor(r: number, g: number, b: number): "white" | "black";
    static getHighContrastColorFromString(backgroundColor: string): string;
}
