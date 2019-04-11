import React, { Component } from "react";
import styled, { ThemeProvider } from 'styled-components';
import { ThemeContext } from '../../app/CarvedApp';



const H6 = styled.h6`
    text-transform: uppercase;
    font-family: sans-serif;
    font-size: 2.5rem;
    word-break: break-all;
    background-color: hsla(0, 0%, 0%, 0.8);
    -webkit-background-clip: text;
    -moz-background-clip: text;
    background-clip: text;
    color: transparent;
    text-shadow: ${props =>  {
                    console.log('props', props);
                    const { currentTheme, depth, decrementDepth } = props.theme;
                    return currentTheme[decrementDepth(depth)].textColorCarved;
                }} 0px 2px 2px;
    text-align: left;
    line-height: 1;


    ::selection {
        color: ${props =>  {
            const { currentTheme, depth, decrementDepth } = props.theme;
            return currentTheme[decrementDepth(depth)].textColor;
        }};
        text-shadow: none;
    }

    @media (max-width: 1200px) {
        font-size: 2.25rem;
    }

    @media (max-width: 800px) {
        font-size: 1.25rem;
    }
`;


interface CarvedH6Properties extends React.Props<any> {
    text: string,
    depth: string,
    depthComputed: string;
    theme: string;
    themeComputed: string;
    onClick: any;
    style: object;
}

interface CarvedH6State {
    depth: string;
    theme: string;
}


class CarvedH6 extends Component<Partial<CarvedH6Properties>, CarvedH6State> {
    public static displayName = "Carved.H6";

    static contextType = ThemeContext;

    constructor(props: CarvedH6Properties) {
        super(props);

        const { theme, depth, depthComputed, themeComputed } = this.props;

        this.state = {
            depth: depth || depthComputed || '2',
            theme: theme || themeComputed || 'ponton',
        };
    }

    render() {
        const { text, children, style } = this.props;
        const { depth } = this.state;
        // const { currentTheme } = this.context;
        // const themeDepthed = parseInt(depth) < 6 ? currentTheme[parseInt(depth) - 2 + ''] : currentTheme['5'];

        console.log('BBB', depth);
        const context = { ...this.context };
        context.depth = depth;

        // console.log('CONTEXT', context);


        return (
            <React.Fragment>
                <ThemeProvider theme={context}>
                    <H6 style={style}>
                        {children || text}
                    </H6>
                </ThemeProvider>
            </React.Fragment>
        );
    }
}

export default CarvedH6;
