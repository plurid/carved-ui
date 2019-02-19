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
    CarvedMenuItem,
    CarvedMenuItems,
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
                    <CarvedMenuItems>
                        <CarvedMenuItem pill decarved>
                            <img style={{ filter: 'invert(1)' }} src="https://image.flaticon.com/icons/png/512/64/64572.png" alt="User" height="20px" />
                        </CarvedMenuItem>
                        <CarvedMenuItem>
                            <img style={{ filter: 'invert(1)' }} src="https://pbs.twimg.com/media/DY6C2cQXUAAuiok.png" alt="Notification" height="20px" />
                        </CarvedMenuItem>
                        <CarvedMenuItem>About</CarvedMenuItem>
                        <CarvedMenuItem>Documentation</CarvedMenuItem>
                        <CarvedMenuItem>Support</CarvedMenuItem>
                    </CarvedMenuItems>
                </CarvedMenuBar>
            </CarvedApp>
        );
    }
}

export default App;
