import React, { Component } from "react";
import styled, { ThemeProvider } from 'styled-components';

import { createThemes, getTheme, ThemeLevel, Themes } from '../../themes';



const themes: Themes = createThemes();

const Div = styled.div`
    min-height: 100vh;
`;


interface CarvedAppProperties {
    depth?: string;
    theme?: string;
}

interface CarvedAppState {
    depth: string;
}


class CarvedApp extends Component<CarvedAppProperties, CarvedAppState> {
    constructor(props: CarvedAppProperties) {
        super(props);

        let { depth } = this.props;
        if (!depth) {
            depth = '0';
        }

        this.state = {
            depth
        };
    }

    setHTMLBodyColors = (currentTheme: ThemeLevel) => {
        document.body.style.backgroundColor = currentTheme.backgroundColor;
        document.body.style.color = currentTheme.textColor;
        document.querySelector('html')!.style.backgroundColor = currentTheme.backgroundColor;
    }

    setChildrenProps = (currentTheme: ThemeLevel) => {
    }

    render() {
        const { theme, children } = this.props;
        const { depth } = this.state;
        const currentTheme = getTheme(themes, theme, depth);
        this.setHTMLBodyColors(currentTheme);

        const childrenWithProps = this.setChildrenProps(currentTheme);

        return (
            <ThemeProvider theme={ currentTheme }>
                <Div>
                    { children }
                </Div>
            </ThemeProvider>
        );
    }
}

export default CarvedApp;
