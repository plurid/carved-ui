import React, { Component } from "react";
import classNames from 'classnames/bind';

import styles from './styles.module.scss';

const cx = classNames.bind(styles);



interface CarvedH1Properties {
    text: string,
    onClick?: any,
}

interface CarvedH1State {
}


class CarvedH1 extends Component<CarvedH1Properties, CarvedH1State> {
    constructor(props: CarvedH1Properties) {
        super(props);

        this.state = {
        };
    }

    render() {
        const { text } = this.props;

        return (
            <div className={ cx(styles.carvedFormGroup) }>
                <h1 className={ cx(styles.carvedH1) }>
                    {text}
                </h1>
            </div>
        );
    }
}

export default CarvedH1;
