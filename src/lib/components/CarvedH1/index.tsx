import React, { Component } from "react";
import classNames from 'classnames/bind';
import styled from 'styled-components';

import styles from './styles.module.scss';

const cx = classNames.bind(styles);

const H1 = styled.h1`
    text-transform: uppercase;
    font-family: sans-serif;
    font-size: 50px;
    background-color: hsl(220, 20%, 10%);
    -webkit-background-clip: text;
    -moz-background-clip: text;
    background-clip: text;
    color: transparent;
    text-shadow: hsla(220, 20%, 20%, 0.5) 0px 3px 3px;
    text-align: center;

    ::selection {
        color: hsl(220, 20%, 5%);
        text-shadow: none;
    }
`;



interface CarvedH1Properties {
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
        const { text } = this.props;

        return (
            <H1>
                {text}
            </H1>
        );
    }
}

export default CarvedH1;
