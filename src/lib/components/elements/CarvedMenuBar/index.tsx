import React, { Component, ReactChildren } from "react";
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
    min-height: 70px;
    padding: 0 15px;

    div {
        font-size: 2rem;
        text-transform: uppercase;
        cursor: pointer;
        user-select: none;
    }

    ul {
        list-style: none;
        display: flex;
        padding: 0;
        height: 100%;
        margin: 0;
        user-select: none;
        justify-self: right;
    }

    ul li {
        align-self: center;
        justify-items: center;
        cursor: pointer;
        height: 100%;
        display: grid;
        align-items: center;
        min-width: 80px;
        padding: 0 15px;
        text-align: center;
        /* border-bottom: 2px solid transparent; */
        font-size: 1rem;
    }

    ul li:hover {
        box-shadow: inset ${
                        props => {
                            const { currentTheme, depth } = props.theme;
                            return currentTheme[depth].shadowPosition;
                        }} 10px 0 rgba(0, 0, 0, 0.5),
                    inset 0px -1px 10px -3px rgba(0, 0, 0, 0.5),
                    inset 0px 1px 10px -3px rgba(0, 0, 0, 0.5);
        background-color: ${props =>  {
            const { currentTheme, depth, incrementDepth } = props.theme;
            return currentTheme[incrementDepth(depth)].backgroundColor;
        }};
        /* border-bottom: 2px solid ${props => {
            const { currentTheme, depth } = props.theme;
            return currentTheme[depth].textColor;
        }}; */
    }
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
    static contextType = ThemeContext;

    constructor(props: CarvedMenuBarProperties) {
        super(props);

        const { theme, depth, depthComputed, themeComputed } = this.props;

        this.state = {
            depth: depth || depthComputed || '0',
            theme: theme || themeComputed || 'ponton',
        };
    }

    render() {
        const { children } = this.props;
        const { depth } = this.state;
        const context = { ...this.context };
        context.depth = depth;

        return (
            <StyledCarvedMenuBar theme={context}>
                {children}
            </StyledCarvedMenuBar>
        );
    }
}

export default CarvedMenuBar;
