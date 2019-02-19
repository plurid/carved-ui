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
    height: 100%;
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
    theme: string;
    themeComputed: string;
}

interface CarvedMenuItemState {
    depth: string;
    theme: string;
}


class CarvedMenuItem extends Component<Partial<CarvedMenuItemProperties>, CarvedMenuItemState> {
    static contextType = ThemeContext;

    constructor(props: CarvedMenuItemProperties) {
        super(props);

        const { theme, depth, depthComputed, themeComputed } = this.props;

        this.state = {
            depth: depth || depthComputed || '0',
            theme: theme || themeComputed || 'ponton',
        };
    }

    render() {
        const { children } = this.props;
        const { depth } = this.state;
        const context = { ...this.context };
        context.depth = depth;

        return (
            <StyledCarvedMenuItem theme={context}>
                {children}
            </StyledCarvedMenuItem>
        );
    }
}

export default CarvedMenuItem;
