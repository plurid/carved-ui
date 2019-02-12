import React, { Component } from "react";
import CarvedStratum from '../metaprimitive/CarvedStratum';
import styled from 'styled-components';



const StyledCarvedButton = styled(CarvedStratum)`
    width: 100px;
    height: 50px;
    border: none;
    outline: none;
    color: white;
    cursor: pointer;
    user-select: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 25px;
    padding: 10px 15px;
    margin: 10px;
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
    text: string;
    stratum?: object;
    onClick?: any;
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
        const { text, onClick, stratum } = this.props;

        return (
            <StyledCarvedButton onClick={onClick} stratum={stratum}>
                {text}
            </StyledCarvedButton>
        );
    }
}

export default CarvedButton;
