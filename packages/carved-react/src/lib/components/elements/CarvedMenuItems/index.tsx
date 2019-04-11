import React, { Component } from "react";
import styled from 'styled-components';

import CarvedStratum from '../../primitives/CarvedStratum';

import { ThemeContext } from '../../app/CarvedApp';



const StyledCarvedMenuItems = styled(CarvedStratum)`
    display: flex;
    color: ${props => {
        const { currentTheme, depth } = props.theme;
        return currentTheme[depth].textColor;
    }};
    background-color: transparent;
    box-shadow: none;
    height: 100%;
    min-height: 60px;
    justify-self: right;
    align-items: center;
`;


interface CarvedMenuItemsProperties {
    children: any;
    depth: string;
    depthComputed: string;
    theme: string;
    themeComputed: string;
}

interface CarvedMenuItemsState {
    depth: string;
    theme: string;
}


class CarvedMenuItems extends Component<Partial<CarvedMenuItemsProperties>, CarvedMenuItemsState> {
    public static displayName = "Carved.MenuItems";

    static contextType = ThemeContext;

    constructor(props: CarvedMenuItemsProperties) {
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
            <StyledCarvedMenuItems theme={context}>
                {children}
            </StyledCarvedMenuItems>
        );
    }
}

export default CarvedMenuItems;
