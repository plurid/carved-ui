import React, { Component } from "react";
import CarvedStratum from '../metaprimitive/CarvedStratum';
import styled, { ThemeProvider } from 'styled-components';

import { ThemeContext } from '../CarvedApp';



const StyledCarvedButton = styled(CarvedStratum)`
    width: 100px;
    height: 50px;
    border: none;
    outline: none;
    color: ${props => props.theme.textColor};
    cursor: pointer;
    background-color: ${props => {
        switch(props.kind) {
            case 'accept':
                return props.theme.backgroundColorAccept;
            case 'acceptThemed':
                return props.theme.backgroundColorAcceptThemed;
            case 'decline':
                return props.theme.backgroundColorDecline;
            case 'declineThemed':
                return props.theme.backgroundColorDeclineThemed;
            case 'warning':
                return props.theme.backgroundColorWarning;
            case 'warningThemed':
                return props.theme.backgroundColorWarningThemed;
            case 'hazard':
                return props.theme.backgroundColorHazard;
            case 'hazardThemed':
                return props.theme.backgroundColorHazardThemed;
            default:
                return props.theme.backgroundColor;
        }
    }};
    user-select: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 25px;
    padding: 10px 15px;
    margin: 10px;
    margin-top: 0;
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
    kind: string;
    text: string;
    theme: string;
    themeComputed: string;
    stratum: object;
}

interface CarvedButtonState {
    depth: string;
    theme: string;
    kind?: string;
}


class CarvedButton extends Component<Partial<CarvedButtonProperties>, CarvedButtonState> {
    static contextType = ThemeContext;

    constructor(props: CarvedButtonProperties) {
        super(props);

        const { theme, depth, depthComputed, themeComputed, kind } = this.props;

        this.state = {
            depth: depth || depthComputed || '0',
            theme: theme || themeComputed || 'ponton',
            kind,
        };
    }

    render() {
        const { text, children, onClick, stratum } = this.props;
        const { depth, kind } = this.state;
        const { currentTheme } = this.context;
        const themeDepthed = parseInt(depth) < 6 ? currentTheme[depth] : currentTheme['5'];

        return (
            <ThemeProvider theme={themeDepthed}>
                <StyledCarvedButton onClick={onClick} kind={kind} stratum={stratum}>
                    {text || children}
                </StyledCarvedButton>
            </ThemeProvider>
        );
    }
}

export default CarvedButton;
