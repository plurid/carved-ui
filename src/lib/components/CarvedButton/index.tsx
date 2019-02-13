import React, { Component } from "react";
import CarvedStratum from '../metaprimitive/CarvedStratum';
import styled, { ThemeProvider } from 'styled-components';

import { createThemes, Themes, getTheme } from '../../themes';

const themes: Themes = createThemes();
// console.log(themes);


const StyledCarvedButton = styled(CarvedStratum)`
    width: 100px;
    height: 50px;
    border: none;
    outline: none;
    color: ${props => props.theme.textColor};
    cursor: pointer;
    background-color: ${props => props.theme.backgroundColor};
    user-select: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 25px;
    padding: 10px 15px;
    margin: 10px;
    min-width: 150px;
    transition: box-shadow 250ms linear, color 250ms linear;
    font-size: 16px;

    :hover {
        color: hsla(0, 0%, 100%, 0.75);
        box-shadow: inset 0 10px 15px 0 rgba(0, 0, 0, 0.7);
    }

    :active {
        color: hsla(0, 0%, 100%, 0.50);
        box-shadow: inset 0 20px 20px 0 rgba(0, 0, 0, 0.7);
    }
`;


interface CarvedButtonProperties {
    depth: string;
    depthComputed: string;
    onClick: any;
    text: string;
    theme: string;
    themeComputed: string;
    stratum: object;
}

interface CarvedButtonState {
    depth: string;
    theme: string;
}


class CarvedButton extends Component<Partial<CarvedButtonProperties>, CarvedButtonState> {
    constructor(props: CarvedButtonProperties) {
        super(props);

        const { theme, depth, depthComputed, themeComputed } = this.props;

        this.state = {
            depth: depth || depthComputed || '0',
            theme: theme || themeComputed || 'ponton',
        };
    }

    render() {
        const { text, children, onClick, stratum } = this.props;
        const { theme, depth } = this.state;
        const currentTheme = getTheme(themes, theme, depth);

        return (
            <ThemeProvider theme={currentTheme}>
                <StyledCarvedButton onClick={onClick} stratum={stratum}>
                    {text || children}
                </StyledCarvedButton>
            </ThemeProvider>
        );
    }
}

export default CarvedButton;
