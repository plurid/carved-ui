import React, { Component } from "react";
import classNames from 'classnames/bind';
import styled from 'styled-components';

const styles = require('./styles.module.scss')

import CarvedFjord from '../primitives/CarvedFjord';


const cx = classNames.bind(styles);

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
            <CarvedFjord>
                <MenuBar>
                    {children}
                </MenuBar>
            </CarvedFjord>
        );
    }
}

export default CarvedMenuBar;
