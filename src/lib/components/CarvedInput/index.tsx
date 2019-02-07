import React, { Component } from "react";

import "./styles.scss";



interface CarvedInputProperties {
    type?: string,
    label: string,
    placeholder?: string,
    value?: string,
    onChange?: any,
    helpText?: string,
}


class CarvedInput extends Component<CarvedInputProperties, {}> {
    render() {
        const { type, label, placeholder, value, onChange, helpText} = this.props;

        return (
            <div className="carved-form-group">
                {label && <label className="carved-text-label">{label}</label>}

                <input
                    type={type}
                    className="carved-text-input"
                    value={value}
                    onChange={e => onChange && onChange(e.target.value)}
                    placeholder={placeholder}
                />

                {helpText && <small className="carved-form-text">{helpText}</small>}
            </div>
        );
    }
}

export default CarvedInput;
