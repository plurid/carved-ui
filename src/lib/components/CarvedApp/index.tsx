import React, { Component, ReactNode, ReactElement } from "react";
import styled, { ThemeProvider } from 'styled-components';

import { createThemes, getTheme, ThemeLevel, Themes } from '../../themes';
import { ReactNodeLike } from "prop-types";



const themes: Themes = createThemes();

const Div = styled.div`
    /* min-height: 100vh; */
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

    setChildrenProps = (children: ReactNode, nestingLevel: string = '1') => {
        const { theme } = this.props;

        const childrenWithProps = React.Children.map(children, (child: any) => {
            if (child.type) {
                let childWithProps = child;
                const name = child.type.name;
                // console.log(name);

                if (name) {
                    const carvedRegex = /Carved/;
                    const carvedTest = carvedRegex.test(name);
                    // console.log(name, carvedTest);

                    if (carvedTest) {
                        if (!child.props.depth) {
                            childWithProps = React.cloneElement(childWithProps, {
                                depthComputed: nestingLevel,
                            });
                        }

                        if (!child.props.theme) {
                            childWithProps = React.cloneElement(childWithProps, {
                                themeComputed: theme,
                            });
                        }
                    }
                }

                if (child.props.children && typeof child.props.children !== 'string') {
                    console.log(child.props.children);
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

        // console.log(childrenWithProps);
        return childrenWithProps;
    }

    render() {
        const { theme, children } = this.props;
        const { depth } = this.state;
        const currentTheme = getTheme(themes, theme, depth);
        this.setHTMLBodyColors(currentTheme);

        const childrenWithProps = this.setChildrenProps(children);

        return (
            <ThemeProvider theme={ currentTheme }>
                <Div>
                    { childrenWithProps }
                </Div>
            </ThemeProvider>
        );
    }
}

export default CarvedApp;
