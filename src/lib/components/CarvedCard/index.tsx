import React, { Component } from "react";
import styled, { ThemeProvider } from 'styled-components';
import CarvedStratum from '../metaprimitive/CarvedStratum';

import { ThemeContext } from '../CarvedApp';



const StyledCarvedCard= styled(CarvedStratum)`
    color: ${props => props.theme.textColor};
    background-color: ${props => props.theme.backgroundColor};
`;


interface CarvedCardProperties {
    depth: string;
    depthComputed: string;
    text: string;
    theme: string;
    themeComputed: string;
    stratum: object;
}

interface CarvedCardState {
    depth: string;
    theme: string;
}


class CarvedCard extends Component<Partial<CarvedCardProperties>, CarvedCardState> {
    static contextType = ThemeContext;

    constructor(props: CarvedCardProperties) {
        super(props);

        const { depth, depthComputed, theme, themeComputed } = this.props;

        this.state = {
            depth: depth || depthComputed || '0',
            theme: theme || themeComputed || 'ponton',
        };
    }

    render() {
        const { text, children } = this.props;
        const { depth, theme } = this.state;
        const { currentTheme } = this.context;
        const themeDepthed = parseInt(depth) < 6 ? currentTheme[depth] : currentTheme['5'];

        return (
            <ThemeProvider theme={themeDepthed}>
                <StyledCarvedCard>
                    {text || children}
                </StyledCarvedCard>
            </ThemeProvider>
        );
    }
}

export default CarvedCard;
