import React, { Component } from "react";
import styled from 'styled-components';



const MenuBar = styled.div`
    display: grid;
    align-items: center;
`;


interface CarvedMenuBarProperties {
}

interface CarvedMenuBarState {
}


class CarvedMenuBar extends Component<CarvedMenuBarProperties, CarvedMenuBarState> {
    constructor(props: CarvedMenuBarProperties) {
        super(props);

        this.state = {
        };
    }

    render() {
        const { children } = this.props;

        return (
            <MenuBar>
                {children}
            </MenuBar>
        );
    }
}

export default CarvedMenuBar;
