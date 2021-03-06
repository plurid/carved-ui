import React, { Component } from "react";
import styled from 'styled-components';

import CarvedStratum from '../../primitives/CarvedStratum';

import { ThemeContext } from '../../app/CarvedApp';


const StyledCarvedMenuBar = styled(CarvedStratum)`
    color: ${props => {
        const { currentTheme, depth } = props.theme;
        return currentTheme[depth].textColor;
    }};
    background-color: ${props =>  {
        const { currentTheme, depth } = props.theme;
        return currentTheme[depth].backgroundColor;
    }};
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    min-height: 60px;
    padding: 0 15px;
`;


interface CarvedMenuBarProperties {
    children: any;
    depth: string;
    depthComputed: string;
    theme: string;
    themeComputed: string;
}

interface CarvedMenuBarState {
    depth: string;
    theme: string;
}


class CarvedMenuBar extends Component<Partial<CarvedMenuBarProperties>, CarvedMenuBarState> {
    public static displayName = "Carved.MenuBar";
    static contextType = ThemeContext;

    constructor(props: CarvedMenuBarProperties) {
        super(props);

        const { theme, depth, depthComputed, themeComputed } = this.props;
        // console.log('depth', depth);
        // console.log('depthComputed', depthComputed);

        this.state = {
            depth: depth || depthComputed || '1',
            theme: theme || themeComputed || 'ponton',
        };
    }

    componentDidMount() {
        console.log(this.context.addToDepthTree('a'));
        console.log(this.context);
    }


    render() {
        const { children } = this.props;
        const { depth } = this.state;
        const context = { ...this.context };
        context.depth = depth;

        // console.log('depth RENDER', depth);
        // console.log('context', context);

        return (
            <StyledCarvedMenuBar theme={context}>
                {children}
            </StyledCarvedMenuBar>
        );
    }
}

export default CarvedMenuBar;
