import React, { Component } from "react";
import styled, { ThemeProvider } from 'styled-components';

import {
    Themes,
    createThemes,
    getTheme
} from '../../../themes';

const themes: Themes = createThemes();


const Div = styled.div`
    background-color: ${props => props.theme.backgroundColor};
    box-shadow: inset 0 5px 10px 0 rgba(0, 0, 0, 0.7);
    border: none;
    color: ${props => props.theme.textColor};
    padding: 50px;
    padding-bottom: 30px;
    transition: box-shadow 250ms linear, color 250ms linear;
    font-size: 16px;

    @media (max-width: 700px) {
        padding: 15px;
    }
`;


interface CarvedStratumProperties {
    className?: string;
    children: any;
    depth?: string;
    parentDepthLevel?: string;
    depthLevel?: string;
    stratum?: object;
    onClick?: any;
    theme?: string;
}

interface CarvedStratumState {
    depthLevel: string;
}


class CarvedStratum extends Component<CarvedStratumProperties, CarvedStratumState> {
    constructor(props: CarvedStratumProperties) {
        super(props);

        const { parentDepthLevel, depth } = this.props;
        let d = '0';

        if (parentDepthLevel) {
            d = (parseInt(parentDepthLevel) + 1) + '';
        }

        if (depth) {
            d = depth;
        }

        this.state = {
            depthLevel: d
        };
    }

    render() {
        const { theme, depth, children, onClick, stratum, className } = this.props;
        const currentTheme = getTheme(themes, theme, depth);

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
