import React, { Component, ReactNode } from "react";
import styled, { ThemeProvider } from 'styled-components';

import { ThemeContext } from '../../app/CarvedApp';



const Div = styled.div`
    width: 1200px;
    margin: 0 auto;

    @media (max-width: 1200px) {
        width: 100%;
    }
`;


interface CarvedContainerProperties {
    depth: string;
    depthComputed: string;
    theme: string;
    themeComputed: string;
}

interface CarvedContainerState {
    depth: string;
    theme: string;
}


class CarvedContainer extends Component<Partial<CarvedContainerProperties>, CarvedContainerState> {
    static contextType = ThemeContext;

    constructor(props: CarvedContainerProperties) {
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

export default CarvedContainer;
