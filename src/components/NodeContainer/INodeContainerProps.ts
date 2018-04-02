import { INodeProps } from "../Node/INodeProps";
export interface INodeContainerProps extends INodeProps {
    treemapId?: string;
    hideNumberOfChildren?: boolean;
    hideValue?: boolean;
}
