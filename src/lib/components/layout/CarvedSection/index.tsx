import React, { Component } from "react";
import styled, { ThemeProvider } from 'styled-components';

import { ThemeContext } from '../../app/CarvedApp';



const Div = styled.div`
    width: 100%;
`;


interface CarvedSectionProperties {
    depth: string;
    depthComputed: string;
    theme: string;
    themeComputed: string;
}

interface CarvedSectionState {
    depth: string;
    theme: string;
}


class CarvedSection extends Component<Partial<CarvedSectionProperties>, CarvedSectionState> {
    static contextType = ThemeContext;

    constructor(props: CarvedSectionProperties) {
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
                <Div>
                    {children}
                </Div>
            </ThemeProvider>
        );
    }
}

export default CarvedSection;
