import React, { Component } from "react";
import classNames from 'classnames/bind';

import styles from './styles.module.scss';

const cx = classNames.bind(styles);



interface CarvedCardProperties {
    text: string,
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
        const { text } = this.props;

        return (
            <div className={ cx(styles.carvedFormGroup) }>
                <div className={ cx(styles.carvedCard) }>
                    {text}
                </div>
            </div>
        );
    }
}

export default CarvedCard;
