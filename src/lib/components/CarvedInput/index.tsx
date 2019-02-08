import React, { Component } from "react";
import classNames from 'classnames/bind';

import styles from './styles.module.scss';

const cx = classNames.bind(styles);



interface CarvedInputProperties {
    type?: string,
    label: string,
    placeholder?: string,
    value?: string,
    onChange?: any,
}

interface CarvedInputState {
    inputFocused: boolean,
    value: string | undefined,
}


class CarvedInput extends Component<CarvedInputProperties, CarvedInputState> {
    constructor(props: CarvedInputProperties) {
        super(props);

        const { value } = this.props;

        this.state = {
            inputFocused: false,
            value: value ? value : ''
        };
    }

    onChangeProper = (onChange: any, event: any) => {
        if (onChange) {
            onChange(event)
        }

        this.setState({
            value: event.target.value,
        });
    }

    onFocus = () => {
        this.setState( {
            inputFocused: true,
        });
    }

    onBlur = () => {
        this.setState( {
            inputFocused: false,
        });
    }

    render() {
        const { type, label, placeholder, onChange} = this.props;
        const inputType = type ? type : 'text';
        const { inputFocused } = this.state;

        return (
            <div className={ cx(styles.carvedFormGroup) }>
                <div className={ cx(styles.carvedInputContainer) }>
                    {
                        label && (
                            <label
                                className={ cx(styles.carvedLabel, {
                                    [styles.animate]: inputFocused
                                }) }
                            >
                                { this.state.value === '' ? label : ''}
                            </label>
                        )
                    }

                    <input
                        type={inputType}
                        className={ cx(styles.carvedInput) }
                        value={this.state.value}
                        onChange={this.onChangeProper.bind(this, onChange)}
                        onFocus={this.onFocus}
                        onBlur={this.onBlur}
                        placeholder={placeholder}
                    />
                </div>
            </div>
        );
    }
}

export default CarvedInput;
