import React, { Component } from "react";

import './styles.scss';


import {
    CarvedApp,

    CarvedStratum,

    CarvedSection,
    CarvedContainer,
    CarvedTile,
    CarvedRow,

    CarvedKarst,
    CarvedPolje,
    CarvedDoline,
    CarvedFjord,

    CarvedButton,
    CarvedCard,

    CarvedH1,
    CarvedH2,
    CarvedH3,
    CarvedH4,
    CarvedH5,
    CarvedH6,

    CarvedInput,
    CarvedHR,
    CarvedMenuBar,
    CarvedSelector,
} from '../lib';




class App extends Component {
    click = () => {
        console.log('clicked');
    }

    render() {
        return (
            <CarvedApp
                theme="hsl(220, 40%, 40%)"
            >
                <CarvedMenuBar>
                    <div>
                        Carved
                    </div>
                    <ul>
                        <li>About</li>
                        <li>Documentation</li>
                        <li>Support</li>
                    </ul>
                </CarvedMenuBar>
            </CarvedApp>
        );
    }
}

export default App;
