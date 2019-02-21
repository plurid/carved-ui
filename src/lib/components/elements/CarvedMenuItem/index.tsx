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
`;


interface CarvedMenuItemProperties {
    children: any;
    depth: string;
    depthComputed: string;
    decarved: boolean;
    theme: string;
    themeComputed: string;
    pill: boolean;
    expand: any;
}

interface CarvedMenuItemState {
    depth: string;
    decarved: boolean;
    theme: string;
    pill: boolean;
}


class CarvedMenuItem extends Component<Partial<CarvedMenuItemProperties>, CarvedMenuItemState> {
    public static defaultProps = {
        decarved: false,
        pill: false,
    };

    static contextType = ThemeContext;

    constructor(props: CarvedMenuItemProperties) {
        super(props);

        const { theme, depth, depthComputed, themeComputed, decarved, pill } = this.props;

        this.state = {
            depth: depth || depthComputed || '0',
            theme: theme || themeComputed || 'ponton',
            decarved: decarved ? true : false,
            pill: pill ? true : false,
        };
    }

    render() {
        const { children, expand } = this.props;
        const { depth, decarved, pill } = this.state;
        const context = { ...this.context };
        context.depth = depth;
        context.component = {
            decarved,
            pill,
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
            >
                {children}

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
