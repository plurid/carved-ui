import React, { Component } from "react";



interface CarvedHrProperties {
}

interface CarvedHrState {
}


class CarvedHr extends Component<CarvedHrProperties, CarvedHrState> {
    constructor(props: CarvedHrProperties) {
        super(props);

        this.state = {
        };
    }

    render() {
        return (
            <hr>
            </hr>
        );
    }
}

export default CarvedHr;
