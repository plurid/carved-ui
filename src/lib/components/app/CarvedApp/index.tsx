import React, { Component, ReactNode } from "react";
import styled, { ThemeProvider } from 'styled-components';

import '../../../styles/reboot.css';


import { createDefaultThemes, getTheme, ThemeLevel, Themes, Theme } from '../../../themes';



export const ThemeContext = React.createContext({});

const Div = styled.div`
`;


interface CarvedAppProperties {
    autoDepth: string | boolean;
    depth: string;
    depthDifference: string | undefined;
    lightnessInversionLimit: string | undefined;
    lightnessInversionLow: string | undefined;
    lightnessInversionHigh: string | undefined;
    shadowAngle: string;
    shadowDistance: string;
    theme: string;
}

interface CarvedAppState {
    autoDepth: boolean;
    currentTheme?: Theme;
    currentThemeLevel?: ThemeLevel;
    defaultThemes: Themes;
    depth: string;
    depthDifference: number;
    lightnessInversionLimit: number;
    lightnessInversionLow: number;
    lightnessInversionHigh: number;
    incrementDepth: any;
    decrementDepth: any;
    shadowAngle: number;
    shadowDistance: number;
    themeColor: string;
}


class CarvedApp extends Component<Partial<CarvedAppProperties>, CarvedAppState> {
    public static displayName = "Carved.App";

    constructor(props: CarvedAppProperties) {
        super(props);

        const defaultParameters = this.setDefaultParameters();
        const defaultFunctionality = this.setDefaultFunctionality();
        const currentTheme = this.setTheme(defaultParameters);

        this.state = {
            ...defaultParameters,
            ...defaultFunctionality,
            ...currentTheme,
        };
    }

    setDefaultParameters = () => {
        const defaultThemes = createDefaultThemes();

        const floatOrDefault: any = (val: any, def: number) => val ? parseFloat(val) : def;

        let {
            autoDepth,
            depth,
            depthDifference,
            lightnessInversionLimit,
            lightnessInversionLow,
            lightnessInversionHigh,
            shadowAngle,
            shadowDistance,
            theme,
        } = this.props;

        theme = !theme ? 'ponton' : theme;
        depth = !depth ? '0' : depth;
        autoDepth = autoDepth === 'false' ? false : true;
        let depthDiff = floatOrDefault(depthDifference, 0.3);
        let lightnessInvLimit = floatOrDefault(lightnessInversionLimit, 50);
        let lightnessInvLow = floatOrDefault(lightnessInversionLow, 10);
        let lightnessInvHigh = floatOrDefault(lightnessInversionHigh, 90);

        let shAngle = floatOrDefault(shadowAngle, 90);
        let shDistance = floatOrDefault(shadowDistance, 5);

        const state = {
            autoDepth,
            defaultThemes,
            depth,
            depthDifference: depthDiff,
            lightnessInversionLimit: lightnessInvLimit,
            lightnessInversionLow: lightnessInvLow,
            lightnessInversionHigh: lightnessInvHigh,
            shadowAngle: shAngle,
            shadowDistance: shDistance,
            themeColor: theme,
        }

        return state;
    }

    setTheme = (defaultParameters: any) => {
        const { currentTheme, currentThemeLevel } = getTheme(defaultParameters);

        this.setHTMLBodyColors(currentThemeLevel);
        return {
            currentTheme,
            currentThemeLevel,
        }
    }

    setDefaultFunctionality = () => {
        const incrementDepth = (depth: string): string  => {
            return (parseInt(depth) + 1) + '';
        }

        const decrementDepth = (depth: string): string  => {
            return (parseInt(depth) - 1) + '';
        }

        return {
            incrementDepth,
            decrementDepth
        }
    }

    setHTMLBodyColors = (currentTheme: ThemeLevel) => {
        document.querySelector('html')!.style.backgroundColor = currentTheme.backgroundColor;
        document.body.style.backgroundColor = currentTheme.backgroundColor;
        document.body.style.color = currentTheme.textColor;
    }

    setChildrenProps = (children: ReactNode, nestingLevel: string = this.state.depth) => {
        const { theme } = this.props;
        const { autoDepth } = this.state;
        // console.log('nestingLevel', nestingLevel);

        const childrenWithProps = React.Children.map(children, (child: any) => {
            if (child.type) {
                // console.log('CHILD NO PROPS', child);
                let childWithProps = child;
                const name = child.type.displayName;
                // console.log('NAME', name);
                if (name) {
                    const carvedRegex = /Carved/;
                    const carvedTest = carvedRegex.test(name);

                    if (carvedTest) {
                        if (autoDepth) {
                            if (!child.props.depth) {
                                // console.log('childWithProps NESTING', childWithProps);
                                childWithProps = React.cloneElement(childWithProps, {
                                    depthComputed: (parseInt(nestingLevel) + 1) + '',
                                });
                                // console.log('childWithProps NESTED', childWithProps);
                            }
                        }

                        if (!child.props.theme) {
                            childWithProps = React.cloneElement(childWithProps, {
                                themeComputed: theme,
                            });
                        }
                    }
                }

                if (child.props.children && typeof child.props.children !== 'string') {
                    let nesting;
                    if (name) {
                        nesting = (parseInt(nestingLevel) + 1) + '';
                    } else {
                        nesting = nestingLevel;
                    }

                    let childChildrenWithProps = child.props.children;
                    childChildrenWithProps = this.setChildrenProps(childChildrenWithProps, nesting);
                    childWithProps = React.cloneElement(childWithProps, {
                        children: childChildrenWithProps,
                    });
                }

                return childWithProps;
            }
            // console.log('CHILDDDD', child);

            return child;
        });
        // console.log('AAAAA', childrenWithProps);

        return childrenWithProps;
    }

    render() {
        const { currentThemeLevel } = this.state;
        const { children } = this.props;
        const childrenWithProps = this.setChildrenProps(children);

        // console.log('children', children);
        // console.log(childrenWithProps);

        return (
            <ThemeContext.Provider value={this.state}>
                <ThemeProvider theme={currentThemeLevel}>
                    <Div>
                        {childrenWithProps}
                    </Div>
                </ThemeProvider>
            </ThemeContext.Provider>
        );
    }
}

export default CarvedApp;
