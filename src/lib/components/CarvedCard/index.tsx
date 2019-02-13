import React, { Component } from "react";
import classNames from 'classnames/bind';

const styles = require('./styles.module.scss')

const cx = classNames.bind(styles);



interface CarvedCardProperties {
    onClick?: any,
}

interface CarvedCardState {
}


class CarvedCard extends Component<CarvedCardProperties, CarvedCardState> {
    constructor(props: CarvedCardProperties) {
        super(props);

        this.state = {
        };
    }

    render() {
        const { children } = this.props;

        return (
            <div className={ cx(styles.carvedFormGroup) }>
                <div className={ cx(styles.carvedCard) }>
                    {children}
                </div>
            </div>
        );
    }
}

export default CarvedCard;
