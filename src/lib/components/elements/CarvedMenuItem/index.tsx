import React, { Component } from "react";
import styled from 'styled-components';

import { ThemeContext } from '../../app/CarvedApp';



const StyledCarvedMenuItem = styled.div`
    align-items: center;
    background-color: transparent;
    box-shadow: none;
    color: ${props => {
        const { currentTheme, depth, decrementDepth } = props.theme;
        if (parseInt(decrementDepth(depth)) > 0) {
            return currentTheme[decrementDepth(depth)].textColor;
        } else {
            return currentTheme[depth].textColor;
        }
    }};
    cursor: pointer;
    display: grid;
    grid-template-columns: ${props => {
        let val = '';
        props.theme.component.hasPreIcon === true ? val += '30px ' : val += '';
        val += 'auto ';
        props.theme.component.hasPostIcon === true ? val += '30px ' : val += '';
        return val;
    }};
    font-size: 0.9rem;
    justify-items: center;
    position: relative;
    height: ${props => {
        let val;
        props.theme.component.pill === true ? val = '36px' : val = '100%';
        return val;
    }};
    border-radius: ${props => {
        let val;
        props.theme.component.pill === true ? val = '10000px' : val = '0px';
        return val;
    }};
    min-width: 60px;
    padding: 0 15px;
    text-align: center;
    user-select: none;


    /* TODO focus needs behavior */
    /* :focus {
        outline-offset: -1px;
        outline: 1px solid ${props =>  {
            const { currentTheme, depth } = props.theme;
            return currentTheme[depth].textColor;
        }};
    } */

    :hover {
        background-color: ${props =>  {
            const { currentTheme, depth, decrementDepth,  } = props.theme;
            if (parseInt(decrementDepth(depth)) > 0) {
                return currentTheme[decrementDepth(depth)].backgroundColor;
            } else {
                return currentTheme[depth].backgroundColor;
            }
        }};
        box-shadow: ${props => {
                        const val = props.theme.component.decarved === true ? '' : 'inset';
                        return val;
                    }} ${props => {
                            const { currentTheme, depth } = props.theme;
                            return currentTheme[depth].shadowPosition;
                        }} 10px 0 rgba(0, 0, 0, 0.5),
                    ${props => {
                        const val = props.theme.component.decarved === true ? '' : 'inset';
                        return val;
                    }} 0px -1px 10px -3px rgba(0, 0, 0, 0.5),
                    ${props => {
                        const val = props.theme.component.decarved === true ? '' : 'inset';
                        return val;
                    }} 0px 1px 10px -3px rgba(0, 0, 0, 0.5);

        .expand {
            display: block;
        }

        .tooltip {
            display: block;
        }
    }

    .expand::before {
        position: absolute;
        content: '';
        right: 20px;

        top: ${props => {
            const val = props.theme.component.pill === true ? '-12px' : '-10px';
            return val;
        }};
        height: 10px;
        width: 20px;

        border-left: 10px solid transparent;
        border-right: 10px solid transparent;

        border-bottom: ${props => {
                            const val = props.theme.component.pill === true ? '12px' : '10px';
                            return val;
                        }}
                        solid
                        ${props =>  {
                            const { currentTheme, depth, decrementDepth,  } = props.theme;
                            if (parseInt(decrementDepth(depth)) > 0) {
                                return currentTheme[decrementDepth(depth)].backgroundColor;
                            } else {
                                return currentTheme[depth].backgroundColor;
                            }
                        }};
    }

    .expand::after {
        position: absolute;
        content: '';
        right: 0;
        top: ${props => {
            const val = props.theme.component.pill === true ? '-12px' : '-10px';
            return val;
        }};
        height: ${props => {
            const val = props.theme.component.pill === true ? '12px' : '10px';
            return val;
        }};
        width: 100%;
    }

    .expand {
        cursor: default;
        display: none;
        z-index: 1000;
        position: absolute;
        top: ${props => {
            const val = props.theme.component.pill === true ? '48px' : '70px';
            return val;
        }};
        right: 0;
        min-width: 200px;
        background-color: ${props =>  {
            const { currentTheme, depth, decrementDepth } = props.theme;
            return currentTheme[decrementDepth(depth)].backgroundColor;
        }};
        /* background-color: inherit; */
        box-shadow: inherit;
    }

    .preIcon {
        justify-self: left;
    }

    .postIcon {
        justify-self: right;
    }

    .tooltip {
        display: none;
        position: absolute;
        z-index: 1000;
        padding: 10px;
        top: ${props => {
            return props.theme.component.pill === true ? '60px' : '70px';
        }};
        background-color: ${props =>  {
            const { currentTheme, depth, decrementDepth } = props.theme;
            return currentTheme[decrementDepth(depth)].backgroundColor;
        }};
        box-shadow: inherit;
    }
`;


const ICON_DEFAULT_WIDTH = '20px';
const ICON_DEFAULT_HEIGHT = '20px';
const PRE_ICON_DEFAULT_ALT = 'PreIcon';
const POST_ICON_DEFAULT_ALT = 'PostIcon';


interface CarvedMenuItemProperties {
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

interface CarvedMenuItemState {
    depth: string;
    decarved: boolean;
    theme: string;
    pill: boolean;
    hasPreIcon: boolean;
    hasPostIcon: boolean;
    showTooltip: boolean;
}


class CarvedMenuItem extends Component<Partial<CarvedMenuItemProperties>, CarvedMenuItemState> {
    public static defaultProps = {
        decarved: false,
        pill: false,
    };

    static contextType = ThemeContext;

    constructor(props: CarvedMenuItemProperties) {
        super(props);

        const { theme, depth, depthComputed, themeComputed, decarved, pill, preIcon, postIcon } = this.props;

        this.state = {
            depth: depth || depthComputed || '0',
            theme: theme || themeComputed || 'ponton',
            decarved: decarved ? true : false,
            pill: pill ? true : false,
            hasPreIcon: preIcon ? true : false,
            hasPostIcon: postIcon ? true : false,
            showTooltip: false,
        };
    }


    onMouseEnter = () => {
        const { tooltip } = this.props;
        if (tooltip) {
            const { tooltipDelay } = this.props;
            let delay = 700;
            if (tooltipDelay) {
                delay = typeof tooltipDelay === 'string'
                    ? parseInt(tooltipDelay)
                    : tooltipDelay;
            }
            setTimeout(() => {
                this.setState( {
                    showTooltip: true
                });
            }, delay);
        }
    }

    onMouseLeave = () => {
        const { tooltip } = this.props;
        if (tooltip) {
            this.setState( {
               showTooltip: false
           });
        }
    }

    render() {
        const {
            children,
            expand,
            preIcon,
            preIconAlt,
            preIconStyle,
            preIconHeight,
            preIconWidth,
            postIcon,
            postIconAlt,
            postIconStyle,
            postIconHeight,
            postIconWidth,
            tooltip,
         } = this.props;

        const {
            depth,
            decarved,
            pill,
            hasPreIcon,
            hasPostIcon,
            showTooltip,
        } = this.state;

        const context = { ...this.context };
        context.depth = depth;
        context.component = {
            decarved,
            pill,
            hasPreIcon,
            hasPostIcon,
        };

        let expandWithProps;
        if (expand) {
            expandWithProps = React.Children.map(expand, child =>
                React.cloneElement(child, { depth: depth })
            );
        }

        return (
            <StyledCarvedMenuItem
                role="button"
                theme={context}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
            >
                {preIcon &&
                    <img
                        className="preIcon"
                        src={preIcon}
                        style={preIconStyle}
                        alt={preIconAlt || PRE_ICON_DEFAULT_ALT}
                        height={preIconHeight || preIconWidth || ICON_DEFAULT_HEIGHT}
                        width={preIconWidth || preIconHeight || ICON_DEFAULT_WIDTH}
                    />
                }
                {children}
                {postIcon &&
                    <img
                        className="postIcon"
                        src={postIcon}
                        style={postIconStyle}
                        alt={postIconAlt || POST_ICON_DEFAULT_ALT}
                        height={postIconHeight || postIconWidth || ICON_DEFAULT_HEIGHT}
                        width={postIconWidth || postIconHeight || ICON_DEFAULT_WIDTH}
                    />
                }

                {tooltip && showTooltip &&
                    <span className="tooltip">
                        {tooltip}
                    </span>
                }

                {expandWithProps &&
                    <span className="expand">
                        {expandWithProps}
                    </span>
                }
            </StyledCarvedMenuItem>
        );
    }
}

export default CarvedMenuItem;
