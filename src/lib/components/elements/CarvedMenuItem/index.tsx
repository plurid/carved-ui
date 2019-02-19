import React, { Component } from "react";
import styled from 'styled-components';

import CarvedStratum from '../../primitives/CarvedStratum';

import { ThemeContext } from '../../app/CarvedApp';



const StyledCarvedMenuItem = styled(CarvedStratum)`
    align-items: center;
    background-color: transparent;
    box-shadow: none;
    color: ${props => {
        const { currentTheme, depth } = props.theme;
        return currentTheme[depth].textColor;
    }};
    cursor: pointer;
    display: grid;
    font-size: 0.9rem;
    justify-items: center;
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

    :hover {
        background-color: ${props =>  {
            const { currentTheme, depth, decrementDepth } = props.theme;
            return currentTheme[decrementDepth(depth)].backgroundColor;
        }};
        box-shadow: inset ${
                        props => {
                            const { currentTheme, depth } = props.theme;
                            return currentTheme[depth].shadowPosition;
                        }} 10px 0 rgba(0, 0, 0, 0.5),
                    inset 0px -1px 10px -3px rgba(0, 0, 0, 0.5),
                    inset 0px 1px 10px -3px rgba(0, 0, 0, 0.5);
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
        const { children } = this.props;
        const { depth, decarved, pill } = this.state;
        const context = { ...this.context };
        context.depth = depth;
        context.component = {
            decarved,
            pill,
        }

        return (
            <StyledCarvedMenuItem theme={context}>
                {children}
            </StyledCarvedMenuItem>
        );
    }
}

export default CarvedMenuItem;
