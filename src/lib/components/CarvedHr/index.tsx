import React, { Component } from "react";
import classNames from 'classnames/bind';

import styles from './styles.module.scss';

const cx = classNames.bind(styles);



interface CarvedHrProperties {
}

interface CarvedHrState {
}


class CarvedHr extends Component<CarvedHrProperties, CarvedHrState> {
    constructor(props: CarvedHrProperties) {
        super(props);

        this.state = {
        };
    }

    render() {
        return (
            <hr className={ cx(styles.carvedHr) }>
            </hr>
        );
    }
}

export default CarvedHr;
