export interface CarvedMenuItemProperties {
    children: any;
    depth: string;
    depthComputed: string;
    decarved: boolean;
    expand: any;
    theme: string;
    themeComputed: string;
    pill: boolean;
    preIcon: string;
    preIconAlt: string;
    preIconStyle: object;
    preIconHeight: string;
    preIconWidth: string;
    postIcon: string;
    postIconAlt: string;
    postIconStyle: object;
    postIconHeight: string;
    postIconWidth: string;
    tooltip: string;
    tooltipDelay: number | string;
}


export interface CarvedMenuItemState {
    depth: string;
    decarved: boolean;
    hasPreIcon: boolean;
    hasPostIcon: boolean;
    pill: boolean;
    showTooltip: boolean;
    theme: string;
}
