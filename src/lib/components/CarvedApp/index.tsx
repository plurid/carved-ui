import React, { Component, ReactNode } from "react";
import styled, { ThemeProvider } from 'styled-components';

import { createDefaultThemes, getTheme, ThemeLevel, Themes } from '../../themes';



const themes: Themes = createDefaultThemes();

const Div = styled.div`
    /* min-height: 100vh; */
`;


interface CarvedAppProperties {
    depth: string;
    autoDepth: string | boolean;
    depthDifference: string | undefined;
    lightnessInversionLimit: string | undefined;
    lightnessInversionLow: string | undefined;
    lightnessInversionHigh: string | undefined;
    theme: string;
}

interface CarvedAppState {
    depth: string;
    autoDepth: boolean;
    depthDifference: number;
    lightnessInversionLimit: number;
    lightnessInversionLow: number;
    lightnessInversionHigh: number;
}


class CarvedApp extends Component<Partial<CarvedAppProperties>, CarvedAppState> {
    constructor(props: CarvedAppProperties) {
        super(props);

        this.state = {
            ...this.setDefaultParameters(),
        };
    }

    setDefaultParameters = () => {
        const floatOrDefault: any = (val: any, def: number) => val ? parseFloat(val) : def;

        let {
            depth,
            autoDepth,
            depthDifference,
            lightnessInversionLimit,
            lightnessInversionLow,
            lightnessInversionHigh,
        } = this.props;

        depth = !depth ? '0' : depth;
        autoDepth = autoDepth === 'false' ? false : true;
        let depthDiff = floatOrDefault(depthDifference, 0.3);
        let lightnessInvLimit = floatOrDefault(lightnessInversionLimit, 50);
        let lightnessInvLow = floatOrDefault(lightnessInversionLow, 10);
        let lightnessInvHigh = floatOrDefault(lightnessInversionHigh, 90);

        const state: CarvedAppState = {
            depth,
            autoDepth,
            depthDifference: depthDiff,
            lightnessInversionLimit: lightnessInvLimit,
            lightnessInversionLow: lightnessInvLow,
            lightnessInversionHigh: lightnessInvHigh,
        }

        return state;
    }


    setHTMLBodyColors = (currentTheme: ThemeLevel) => {
        document.body.style.backgroundColor = currentTheme.backgroundColor;
        document.body.style.color = currentTheme.textColor;
        document.querySelector('html')!.style.backgroundColor = currentTheme.backgroundColor;
    }

    setChildrenProps = (children: ReactNode, nestingLevel: string = this.state.depth) => {
        const { theme } = this.props;
        const { autoDepth } = this.state;

        const childrenWithProps = React.Children.map(children, (child: any) => {
            if (child.type) {
                let childWithProps = child;
                const name = child.type.name;

                if (name) {
                    const carvedRegex = /Carved/;
                    const carvedTest = carvedRegex.test(name);

                    if (carvedTest) {
                        if (autoDepth) {
                            if (!child.props.depth) {
                                childWithProps = React.cloneElement(childWithProps, {
                                    depthComputed: (parseInt(nestingLevel) + 1) + '',
                                });
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
                    let nesting = (parseInt(nestingLevel) + 1) + '';
                    let childChildrenWithProps = child.props.children;
                    childChildrenWithProps = this.setChildrenProps(childChildrenWithProps, nesting);
                    childWithProps = React.cloneElement(childWithProps, {
                        children: childChildrenWithProps,
                    });
                }

                return childWithProps;
            }


            return child;
        });

        return childrenWithProps;
    }

    render() {
        const { theme, children } = this.props;
        const {
            depth,
            depthDifference,
            lightnessInversionLimit,
            lightnessInversionLow,
            lightnessInversionHigh,
        } = this.state;
        const currentTheme = getTheme(
            themes, theme, depth,
            depthDifference,
            lightnessInversionLimit,
            lightnessInversionLow,
            lightnessInversionHigh
            );
        this.setHTMLBodyColors(currentTheme);

        const childrenWithProps = this.setChildrenProps(children);

        return (
            <ThemeProvider theme={currentTheme}>
                <Div>
                    {childrenWithProps}
                </Div>
            </ThemeProvider>
        );
    }
}

export default CarvedApp;
