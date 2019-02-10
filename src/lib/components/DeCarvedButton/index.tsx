import React, { Component } from "react";
import classNames from 'classnames/bind';

import styles from './styles.module.scss';

const cx = classNames.bind(styles);



interface DeCarvedButtonProperties {
    text: string,
    onClick?: any,
}

interface DeCarvedButtonState {
}


class DeCarvedButton extends Component<DeCarvedButtonProperties, DeCarvedButtonState> {
    constructor(props: DeCarvedButtonProperties) {
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

export default DeCarvedButton;
