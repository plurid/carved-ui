import React, { Component } from "react";
import styled, { ThemeProvider } from 'styled-components';

import CarvedStratum from '../../primitives/CarvedStratum';

import { ThemeContext } from '../../app/CarvedApp';



const StyledCarvedTile = styled(CarvedStratum)`
    color: ${props => props.theme.textColor};
    background-color: ${props => props.theme.backgroundColor};
    background-image: linear-gradient(0deg, ${props => props.theme.backgroundColor}, ${props => props.theme.backgroundColorGradient});
`;



interface CarvedTileProperties {
    depth: string;
    depthComputed: string;
    theme: string;
    themeComputed: string;
}

interface CarvedTileState {
    depth: string;
    theme: string;
}


class CarvedTile extends Component<Partial<CarvedTileProperties>, CarvedTileState> {
    static contextType = ThemeContext;

    constructor(props: CarvedTileProperties) {
        super(props);

        const { theme, depth, depthComputed, themeComputed } = this.props;

        this.state = {
            depth: depth || depthComputed || '0',
            theme: theme || themeComputed || 'ponton',
        };

        console.log(this.state.depth)
    }


    render() {
        const { children } = this.props;
        const { depth } = this.state;
        const { currentTheme } = this.context;
        const themeDepthed = parseInt(depth) < 6 ? currentTheme[depth] : currentTheme['5'];

        return (
            <ThemeProvider theme={themeDepthed}>
                <StyledCarvedTile>
                    {children}
                </StyledCarvedTile>
            </ThemeProvider>
        );
    }
}

export default CarvedTile;
