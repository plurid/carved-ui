import React, { Component } from "react";
import styled from 'styled-components';


const HR = styled.hr`
    width: 100%;
    background-color: hsla(0, 0%, 0%, 0.3);
    border: none;
    height: 15px;
    margin: 80px 0;
    box-shadow: inset 0 5px 10px 0 rgba(0, 0, 0, 0.7);
`;


interface CarvedHRProperties {
}

interface CarvedHRState {
}


class CarvedHR extends Component<CarvedHRProperties, CarvedHRState> {
    public static displayName = "Carved.HR";

    constructor(props: CarvedHRProperties) {
        super(props);

        this.state = {
        };
    }

    render() {
        return (
            <HR>
            </HR>
        );
    }
}

export default CarvedHR;
