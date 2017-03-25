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

}
