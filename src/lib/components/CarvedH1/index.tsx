import React, { Component } from "react";
import styled, { ThemeProvider } from 'styled-components';


const H1 = styled.h1`
    text-transform: uppercase;
    font-family: sans-serif;
    font-size: 72pt;
    background-color: hsl(0, 0%, 0%);
    -webkit-background-clip: text;
    -moz-background-clip: text;
    background-clip: text;
    color: transparent;
    text-shadow: ${props => props.theme.carvedH1.textShadow.color} 0px 3px 3px;
    text-align: center;

    ::selection {
        color: ${props => props.theme.carvedH1.textShadow.colorSelection};
        text-shadow: none;
    }
`;

H1.defaultProps = {
    theme: {
        carvedH1: {
            textShadow: {
                color: 'hsla(220, 20%, 20%, 0.5)',
                colorSelection: 'hsl(0, 0%, 0%)',
            },
        },
    },
};

const furorTheme = {
    carvedH1: {
        textShadow: {
            color: 'hsla(360, 90%, 30%, 0.5)',
            colorSelection: 'hsl(0, 0%, 0%)',
        },
    },
}


interface CarvedH1Properties extends React.Props<any> {
    text: string,
    onClick?: any,
}

interface CarvedH1State {
}


class CarvedH1 extends Component<CarvedH1Properties, CarvedH1State> {
    constructor(props: CarvedH1Properties) {
        super(props);

        this.state = {
        };
    }

    render() {
        const { text, onClick } = this.props;

        return (
            <React.Fragment>
                <H1 onClick={onClick}>
                    {text}
                </H1>

                <ThemeProvider theme={furorTheme}>
                    <H1>
                        {text}
                    </H1>
                </ThemeProvider>
            </React.Fragment>
        );
    }
}

export default CarvedH1;
