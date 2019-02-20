import React, { Component, ReactChild } from "react";
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
            return currentTheme['4'].textColor;
        }
    }};
    cursor: pointer;
    display: grid;
    font-size: 0.9rem;
    justify-items: center;
    position: relative;
    height: ${props => {
        let val;
        props.theme.component.pill === true ? val = '60%' : val = '100%';
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
                return currentTheme['4'].backgroundColor;
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

    .expand {
        cursor: default;
        display: none;
        position: absolute;
        top: 60px;
        right: 0;
        min-width: 200px;
        background-color: ${props =>  {
            const { currentTheme, depth } = props.theme;
            return currentTheme[depth].backgroundColor;
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
    expand: ReactChild;
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

        return (
            <StyledCarvedMenuItem
                role="button"
                theme={context}
            >
                {children}
                <span className="expand">
                    {expand}
                </span>
            </StyledCarvedMenuItem>
        );
    }
}

export default CarvedMenuItem;
