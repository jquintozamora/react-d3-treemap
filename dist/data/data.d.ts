export declare const data: {
    "name": string;
    "children": ({
        "name": string;
        "link": string;
        "children": {
            "name": string;
            "children": ({
                "name": string;
                "value": number;
                "link": string;
            } | {
                "name": string;
                "value": number;
                "link"?: undefined;
            })[];
        }[];
    } | {
        "name": string;
        "children": ({
            "name": string;
            "children": ({
                "name": string;
                "value": number;
                "children"?: undefined;
            } | {
                "name": string;
                "children": {
                    "name": string;
                    "value": number;
                }[];
                "value"?: undefined;
            })[];
            "value"?: undefined;
        } | {
            "name": string;
            "value": number;
            "children"?: undefined;
        })[];
        "link"?: undefined;
    })[];
};
