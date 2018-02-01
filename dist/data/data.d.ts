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
            })[];
        }[];
    } | {
        "name": string;
        "children": ({
            "name": string;
            "children": ({
                "name": string;
                "value": number;
            } | {
                "name": string;
                "children": {
                    "name": string;
                    "value": number;
                }[];
            })[];
        } | {
            "name": string;
            "value": number;
        })[];
    })[];
};
