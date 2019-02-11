import React, { Component } from "react";
import classNames from 'classnames/bind';

import styles from './styles.module.scss';

const cx = classNames.bind(styles);



interface CarvedFjordProperties {
}

interface CarvedFjordState {
}


class CarvedFjord extends Component<CarvedFjordProperties, CarvedFjordState> {
    constructor(props: CarvedFjordProperties) {
        super(props);

        this.state = {
        };
    }

    render() {
        const { children } = this.props;

        return (
            <div className={ cx(styles.carvedFjord) }>
                {children}
            </div>
        );
    }
}

export default CarvedFjord;
