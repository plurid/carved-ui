import React, { Component } from "react";
import styled, { ThemeProvider } from 'styled-components';

import CarvedStratum from '../../primitives/CarvedStratum';

import { ThemeContext } from '../../app/CarvedApp';



const StyledCarvedRow = styled(CarvedStratum)`
    padding: 0;
    display: grid;
    justify-content: center;
    align-items: center;
    color: ${props => props.theme.textColor};
    background-color: ${props => props.theme.backgroundColor};
    background-image: linear-gradient(0deg, ${props => props.theme.backgroundColor}, ${props => props.theme.backgroundColorGradient});
`;


interface CarvedRowProperties {
    depth: string;
    depthComputed: string;
    theme: string;
    themeComputed: string;
}

interface CarvedRowState {
    depth: string;
    theme: string;
}


class CarvedRow extends Component<Partial<CarvedRowProperties>, CarvedRowState> {
    public static displayName = "Carved.Row";

    static contextType = ThemeContext;

    constructor(props: CarvedRowProperties) {
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
        const { currentTheme } = this.context;
        const themeDepthed = parseInt(depth) < 6 ? currentTheme[depth] : currentTheme['5'];

        return (
            <ThemeProvider theme={themeDepthed}>
                <StyledCarvedRow>
                    {children}
                </StyledCarvedRow>
            </ThemeProvider>
        );
    }
}

export default CarvedRow;
