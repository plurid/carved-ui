import React, { Component } from "react";
import styled, { ThemeProvider } from 'styled-components';

import { ThemeContext } from '../../app/CarvedApp';



const Div = styled.div`
    background-color: ${props => props.theme.backgroundColor};
    /* box-shadow: inset 0 5px 10px 0 rgba(0, 0, 0, 0.7); */
    box-shadow: inset ${props => props.theme.shadowPosition} 10px 0 rgba(0, 0, 0, 0.5),
                inset 0px -1px 10px -3px rgba(0, 0, 0, 0.5),
                inset 0px 1px 10px -3px rgba(0, 0, 0, 0.5);
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
    kind?: string
}

interface CarvedStratumState {
    depthLevel: string;
}


class CarvedStratum extends Component<CarvedStratumProperties, CarvedStratumState> {
    static contextType = ThemeContext;

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
        const { children, onClick, stratum, className } = this.props;
        const { depthLevel } = this.state;
        const { currentTheme } = this.context;
        const themeDepthed = parseInt(depthLevel) < 6 ? currentTheme[depthLevel] : currentTheme['5'];

        return (
            <ThemeProvider theme={themeDepthed}>
                <Div className={className} onClick={onClick} style={stratum}>
                    {children}
                </Div>
            </ThemeProvider>
        );
    }
}

export default CarvedStratum;
