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
    CarvedMenuList,
    CarvedSelector,
} from '../lib';


const Expansion = (
    <CarvedMenuList>
        <CarvedMenuItem
            preIcon="https://image.flaticon.com/icons/png/512/64/64572.png"
            preIconStyle={{ filter: 'invert(1)' }}
            postIcon="https://image.flaticon.com/icons/png/512/64/64572.png"
            postIconStyle={{ filter: 'invert(1)' }}
        >About</CarvedMenuItem>
        <CarvedMenuItem>Documentation</CarvedMenuItem>
        <CarvedMenuItem>Support</CarvedMenuItem>
        <CarvedMenuItem>Support</CarvedMenuItem>
    </CarvedMenuList>
);



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
                        <CarvedMenuItem pill expand={Expansion}>
                            <img style={{ filter: 'invert(1)' }} src="https://image.flaticon.com/icons/png/512/64/64572.png" alt="User" height="20px" />
                        </CarvedMenuItem>

                        <CarvedMenuItem
                            tooltip="Notification"
                        >
                            <img style={{ filter: 'invert(1)' }} src="https://pbs.twimg.com/media/DY6C2cQXUAAuiok.png" alt="Notification" height="20px" />
                        </CarvedMenuItem>

                        <CarvedMenuItem
                            preIcon="https://image.flaticon.com/icons/png/512/64/64572.png"
                            preIconStyle={{ filter: 'invert(1)' }}
                            postIcon="https://pbs.twimg.com/media/DY6C2cQXUAAuiok.png"
                            postIconStyle={{ filter: 'invert(1)' }}
                        >
                            About
                        </CarvedMenuItem>

                        <CarvedMenuItem
                            preIcon="https://image.flaticon.com/icons/png/512/64/64572.png"
                            preIconStyle={{ filter: 'invert(1)' }}
                            postIcon="https://pbs.twimg.com/media/DY6C2cQXUAAuiok.png"
                            postIconStyle={{ filter: 'invert(1)' }}
                            expand={Expansion}
                        >
                            Documentation
                        </CarvedMenuItem>
                        <CarvedMenuItem>Support</CarvedMenuItem>
                        <CarvedMenuItem>
                            <CarvedSelector
                                selectors={
                                [
                                    {value: 'en', label: 'English'},
                                    {value: 'ro', label: 'Română'},
                                    {value: 'fr', label: 'Français'},
                                ]
                            } />
                        </CarvedMenuItem>
                    </CarvedMenuItems>
                </CarvedMenuBar>

                <CarvedSelector
                    selectors={
                    [
                        {value: 'en', label: 'English'},
                        {value: 'ro', label: 'Română'},
                        {value: 'fr', label: 'Français'},
                    ]
                } />
            </CarvedApp>
        );
    }
}

export default App;
