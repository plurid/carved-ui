import React, { Component } from "react";
import styled from 'styled-components';


const Div = styled.div`
    background-color: hsla(0, 0%, 0%, 0.3);
    box-shadow: inset 0 5px 10px 0 rgba(0, 0, 0, 0.7);
    border: none;
    color: white;
    padding: 10px 15px;
    transition: box-shadow 250ms linear, color 250ms linear;
    font-size: 16px;
`;


interface CarvedStratumProperties {
    stratum?: object;
    onClick?: any;
    children: any;
    className?: string;
}

interface CarvedStratumState {
}


class CarvedStratum extends Component<CarvedStratumProperties, CarvedStratumState> {
    constructor(props: CarvedStratumProperties) {
        super(props);

        this.state = {
        };
    }

    render() {
        const { children, onClick, stratum, className } = this.props;

        return (
            <Div className={className} onClick={onClick} style={stratum}>
                {children}
            </Div>
        );
    }
}

export default CarvedStratum;
