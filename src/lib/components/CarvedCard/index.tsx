import React, { Component } from "react";
import styled, { ThemeProvider } from 'styled-components';
import CarvedStratum from '../metaprimitive/CarvedStratum';

import { createThemes, Themes, getTheme } from '../../themes';


const themes: Themes = createThemes();


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
        const currentTheme = getTheme(themes, theme, depth);

        return (
            <ThemeProvider theme={currentTheme}>
                <StyledCarvedCard>
                    {text || children}
                </StyledCarvedCard>
            </ThemeProvider>
        );
    }
}

export default CarvedCard;
