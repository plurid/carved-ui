import React, { Component } from "react";
import CarvedStratum from '../metaprimitive/CarvedStratum';
import styled, { ThemeProvider } from 'styled-components';

import { createThemes, Themes } from '../../themes';

const themes: Themes = createThemes();
console.log(themes);


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
    depth?: string;
    onClick?: any;
    text: string;
    theme?: string;
    stratum?: object;
}

interface CarvedButtonState {
}


class CarvedButton extends Component<CarvedButtonProperties, CarvedButtonState> {
    constructor(props: CarvedButtonProperties) {
        super(props);

        this.state = {
        };
    }

    render() {
        const { theme, depth, text, onClick, stratum } = this.props;
        const themeApp = theme ? theme : 'ponton';
        const depthApp = depth ? depth : '0';

        return (
            <ThemeProvider theme={ themes[themeApp][depthApp] }>
                <StyledCarvedButton onClick={onClick} stratum={stratum}>
                    {text}
                </StyledCarvedButton>
            </ThemeProvider>
        );
    }
}

export default CarvedButton;
