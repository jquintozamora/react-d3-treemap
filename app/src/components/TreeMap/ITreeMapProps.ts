export interface ITreeMapProps {
    width: number;
    height: number;
    data: any;

    /*
     * Format for the values
     * https://github.com/d3/d3-format#format
     */
    valueFormat?: string;
};
