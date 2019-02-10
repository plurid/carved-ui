import React, { Component } from "react";
import classNames from 'classnames/bind';
import styled from 'styled-components';

import styles from './styles.module.scss';

const cx = classNames.bind(styles);


const Button = styled.button`
    width: auto;
    height: 50px;
    background-color: hsla(0, 0%, 0%, 0.3);
    box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.7);
    border: none;
    color: white;
    outline: none;
    cursor: pointer;
    user-select: none;
    border-radius: 25px;
    padding: 10px 15px;
    min-width: 150px;
    transition: all 250ms linear;
    font-size: 16px;

    :hover {
        color: hsla(0, 0%, 100%, 0.75);
        box-shadow: 0 10px 15px 0 rgba(0, 0, 0, 0.7);
    }

    :active {
        transform: translateY(5px);
        box-shadow: 0 20px 20px 0 rgba(0, 0, 0, 0.7);
    }
`;



interface DeCarvedButtonProperties {
    text: string,
    onClick?: any,
}

interface DeCarvedButtonState {
}



class DeCarvedButton extends Component<DeCarvedButtonProperties, DeCarvedButtonState> {
    constructor(props: DeCarvedButtonProperties) {
        super(props);

        this.state = {
        };
    }

    render() {
        const { text } = this.props;

        return (
            <div className={ cx(styles.carvedFormGroup) }>
                <Button>
                    {text}
                </Button>
            </div>
        );
    }
}

export default DeCarvedButton;
