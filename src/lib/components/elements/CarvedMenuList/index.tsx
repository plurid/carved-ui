import React, { Component } from "react";
import styled from 'styled-components';

import CarvedStratum from '../../primitives/CarvedStratum';

import { ThemeContext } from '../../app/CarvedApp';



const StyledCarvedMenuList = styled(CarvedStratum)`
    /* display: flex; */
    color: ${props => {
        const { currentTheme, depth } = props.theme;
        return currentTheme[depth].textColor;
    }};
    background-color: transparent;
    box-shadow: none;
    height: 100%;
    min-height: 45px;
    justify-self: left;
    align-items: center;

    div {
        justify-items: left;
        min-height: 45px;
    }
`;


interface CarvedMenuListProperties {
    children: any;
    depth: string;
    depthComputed: string;
    theme: string;
    themeComputed: string;
}

interface CarvedMenuListState {
    depth: string;
    theme: string;
}


class CarvedMenuList extends Component<Partial<CarvedMenuListProperties>, CarvedMenuListState> {
    static contextType = ThemeContext;

    constructor(props: CarvedMenuListProperties) {
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
            <StyledCarvedMenuList theme={context}>
                {children}
            </StyledCarvedMenuList>
        );
    }
}

export default CarvedMenuList;
