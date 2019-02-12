import React, { Component } from "react";
import styled, { ThemeProvider } from 'styled-components';

import { createTheme, createThemes, Themes } from '../../../themes';

const themes: Themes = createThemes();


const Div = styled.div`
    background-color: ${props => props.theme.backgroundColor};
    box-shadow: inset 0 5px 10px 0 rgba(0, 0, 0, 0.7);
    border: none;
    color: ${props => props.theme.textColor};
    padding: 10px 15px;
    transition: box-shadow 250ms linear, color 250ms linear;
    font-size: 16px;
`;


interface CarvedStratumProperties {
    className?: string;
    children: any;
    depth?: string;
    stratum?: object;
    onClick?: any;
    theme?: string;
}

interface CarvedStratumState {
}


class CarvedStratum extends Component<CarvedStratumProperties, CarvedStratumState> {
    constructor(props: CarvedStratumProperties) {
        super(props);

        this.state = {
        };
    }

    render() {
        const { theme, depth, children, onClick, stratum, className } = this.props;
        const currentTheme = getTheme(theme, depth);
        console.log('AAAA', currentTheme);

        return (
            <ThemeProvider theme={currentTheme}>
                <Div className={className} onClick={onClick} style={stratum}>
                    {children}
                </Div>
            </ThemeProvider>
        );
    }
}

export default CarvedStratum;


function getTheme(theme: string = 'ponton', depth: string = '0') {
    const hslRegex = /hsl/;
    let currentTheme: any = {};

    if (hslRegex.test(theme)) {
        currentTheme = createTheme(theme)[depth];
    } else {
        currentTheme = themes[theme][depth];
    }

    return currentTheme;
}
