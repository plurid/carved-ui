import React, { Component } from "react";
import classNames from 'classnames/bind';

import styles from './styles.module.scss';

const cx = classNames.bind(styles);



interface CarvedButtonProperties {
    text: string,
    onClick?: any,
}

interface CarvedButtonState {
}


class CarvedButton extends Component<CarvedButtonProperties, CarvedButtonState> {
    constructor(props: CarvedButtonProperties) {
        super(props);

        this.state = {
        };
    }

    render() {
        const { text } = this.props;

        return (
            <div className={ cx(styles.carvedFormGroup) }>
                <button className={ cx(styles.carvedButton) }>
                    {text}
                </button>
            </div>
        );
    }
}

export default CarvedButton;
