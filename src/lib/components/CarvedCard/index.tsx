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
    depth?: string;
    depthLevel?: string;
    text?: string;
    theme?: string;
    stratum?: object;
}

interface CarvedCardState {
    depth: string;
}


class CarvedCard extends Component<CarvedCardProperties, CarvedCardState> {
    constructor(props: CarvedCardProperties) {
        super(props);

        const { depth, depthLevel } = this.props;

        this.state = {
            depth: depth || depthLevel || '0',
        };
    }

    render() {
        const { theme, text, children, stratum } = this.props;
        const { depth } = this.state;
        const currentTheme = getTheme(themes, theme, depth);

        return (
            <ThemeProvider theme={currentTheme}>
                <StyledCarvedCard>
                    {children}
                </StyledCarvedCard>
            </ThemeProvider>
        );
    }
}

export default CarvedCard;
