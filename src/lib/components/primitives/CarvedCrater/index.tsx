import React, { Component } from "react";
import classNames from 'classnames/bind';

const styles = require('./styles.module.scss')

const cx = classNames.bind(styles);



interface CarvedCraterProperties {
}

interface CarvedCraterState {
}


class CarvedCrater extends Component<CarvedCraterProperties, CarvedCraterState> {
    constructor(props: CarvedCraterProperties) {
        super(props);

        this.state = {
        };
    }

    render() {
        const { children } = this.props;

        return (
            <div className={ cx(styles.carvedFormGroup) }>
                <button className={ cx(styles.carvedButton) }>
                    {children}
                </button>
            </div>
        );
    }
}

export default CarvedCrater;
