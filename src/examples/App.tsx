import React, { Component } from "react";

import './styles.scss';


import {
    CarvedStratum,

    CarvedCrater,
    CarvedFjord,
    CarvedKarst,

    CarvedApp,

    CarvedButton,
    DeCarvedButton,
    CarvedCard,
    CarvedH1,
    CarvedHr,
    CarvedInput,
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
                theme="hsl(300, 40%, 30%)"
            >
                <CarvedButton
                    text="Submit"
                />

                <CarvedCard>
                    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolore, nulla inventore maxime asperiores praesentium, nisi quae at modi voluptatem porro officiis vel. Minus quod eos qui dolore est sequi nihil!</p>
                </CarvedCard>
            </CarvedApp>
        );
    }
}

export default App;
