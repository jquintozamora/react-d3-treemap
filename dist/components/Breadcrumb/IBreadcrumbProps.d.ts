/// <reference types="react" />
export interface IBreadcrumbProps {
    items: IBreadcrumbItem[];
    bgColor: string;
    hoverBgColor: string;
    currentBgColor: string;
    className?: string;
}
export interface IBreadcrumbItem {
    text: string;
    key: string;
    onClick?: (ev?: React.MouseEvent<HTMLElement>, item?: IBreadcrumbItem) => void;
    href?: string;
}
