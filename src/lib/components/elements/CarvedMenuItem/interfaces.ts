export interface CarvedMenuItemProperties {
    children: any;
    depth: string;
    depthComputed: string;
    decarved: boolean;
    theme: string;
    themeComputed: string;
    pill: boolean;
    expand: any;
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
    theme: string;
    pill: boolean;
    hasPreIcon: boolean;
    hasPostIcon: boolean;
    showTooltip: boolean;
}
