import React, { Component } from "react";
import classNames from 'classnames/bind';

import styles from './styles.module.scss';

const cx = classNames.bind(styles);



interface CarvedKarstProperties {
}

interface CarvedKarstState {
}


class CarvedKarst extends Component<CarvedKarstProperties, CarvedKarstState> {
    constructor(props: CarvedKarstProperties) {
        super(props);

        this.state = {
        };
    }

    render() {
        const { children } = this.props;

        return (
            <div className={ cx(styles.carvedFormGroup) }>
                <div className={ cx(styles.carvedKarst) }>
                    {children}
                </div>
            </div>
        );
    }
}

export default CarvedKarst;
