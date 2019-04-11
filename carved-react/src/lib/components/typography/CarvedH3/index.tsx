import React, { Component } from "react";
import styled, { ThemeProvider } from 'styled-components';
import { ThemeContext } from '../../app/CarvedApp';



const H3 = styled.h3`
    text-transform: uppercase;
    font-family: sans-serif;
    font-size: 4rem;
    word-break: break-all;
    background-color: hsla(0, 0%, 0%, 0.8);
    -webkit-background-clip: text;
    -moz-background-clip: text;
    background-clip: text;
    color: transparent;
    text-shadow: ${props => props.theme.textColorCarved} 0px 2px 2px;
    text-align: left;
    line-height: 1;

    ::selection {
        color: ${props => props.theme.textColor};
        text-shadow: none;
    }

    @media (max-width: 1200px) {
        font-size: 3rem;
    }

    @media (max-width: 800px) {
        font-size: 2rem;
    }
`;


interface CarvedH3Properties extends React.Props<any> {
    text: string,
    depth: string,
    depthComputed: string;
    theme: string;
    themeComputed: string;
    onClick: any,
}

interface CarvedH3State {
    depth: string;
    theme: string;
}


class CarvedH3 extends Component<Partial<CarvedH3Properties>, CarvedH3State> {
    public static displayName = "Carved.H3";

    static contextType = ThemeContext;

    constructor(props: CarvedH3Properties) {
        super(props);

        const { theme, depth, depthComputed, themeComputed } = this.props;

        this.state = {
            depth: depth || depthComputed || '0',
            theme: theme || themeComputed || 'ponton',
        };
    }

    render() {
        const { text, children } = this.props;
        const { depth } = this.state;
        const { currentTheme } = this.context;
        const themeDepthed = parseInt(depth) < 6 ? currentTheme[parseInt(depth) - 2 + ''] : currentTheme['5'];

        return (
            <React.Fragment>
                <ThemeProvider theme={themeDepthed}>
                    <H3>
                        {children || text}
                    </H3>
                </ThemeProvider>
            </React.Fragment>
        );
    }
}

export default CarvedH3;
