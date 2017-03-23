export interface ITreeMapProps {
    width: number;
    height: number;
    data: any;

    /*
     * Format for the values
     * https://github.com/d3/d3-format#format
     */
    valueFormat?: string;

    /*
     * Create and interpolates a background color range
     */
    bgColorRangeLow?: string;
    bgColorRangeHigh?: string;

    colorText?: string;

    borderColorHover?: string;
};
