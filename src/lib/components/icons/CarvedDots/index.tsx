import React, { Component } from "react";
import classNames from 'classnames/bind';

import styles from './styles.module.scss';
// const styles = require('./styles.scss');

const cx = classNames.bind(styles);



interface CarvedDotsProperties {
}

interface CarvedDotsState {
}


class CarvedDots extends Component<CarvedDotsProperties, CarvedDotsState> {
    public static displayName = "Carved.Dots";

    constructor(props: CarvedDotsProperties) {
        super(props);

        this.state = {
        };
    }

    render() {
        return (
            <ul className={cx(styles.carvedDots)}>
                <li></li>
                <li></li>
                <li></li>
            </ul>
        );
    }
}

export default CarvedDots;
