import React, { Component } from "react";
import classNames from 'classnames/bind';
import styled from 'styled-components';

import styles from './styles.module.scss';


const cx = classNames.bind(styles);

const Button = styled.button`
    width: auto;
    height: 50px;
    background-color: hsla(0, 0%, 0%, 0.3);
    box-shadow: inset 0 5px 10px 0 rgba(0, 0, 0, 0.7);
    border: none;
    outline: none;
    color: white;
    cursor: pointer;
    user-select: none;
    border-radius: 25px;
    padding: 10px 15px;
    min-width: 150px;
    transition: box-shadow 250ms linear, color 250ms linear;
    font-size: 16px;

    :hover {
        color: hsla(0, 0%, 100%, 0.75);
        box-shadow: inset 0 10px 15px 0 rgba(0, 0, 0, 0.7);
    }

    :active {
        color: hsla(0, 0%, 100%, 0.50);
        box-shadow: inset 0 20px 20px 0 rgba(0, 0, 0, 0.7);
    }
`;


interface CarvedButtonProperties {
    text: string,
    onClick?: any,
}

interface CarvedButtonState {
}


class CarvedButton extends Component<CarvedButtonProperties, CarvedButtonState> {
    constructor(props: CarvedButtonProperties) {
        super(props);

        this.state = {
        };
    }

    render() {
        const { text, onClick } = this.props;

        return (
            <Button onClick={onClick}>
                {text}
            </Button>
        );
    }
}

export default CarvedButton;
