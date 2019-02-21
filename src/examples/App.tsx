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
            preIcon="http://s16574.pcdn.co/wp-content/uploads/2018/05/About-icon.png"
            preIconStyle={{ filter: 'invert(1)' }}
        >About</CarvedMenuItem>
        <CarvedMenuItem
            preIcon="https://image.flaticon.com/icons/svg/35/35920.svg"
            preIconStyle={{ filter: 'invert(1)' }}
            postIcon="https://static.thenounproject.com/png/10897-200.png"
            postIconStyle={{ filter: 'invert(1)' }}
        >Documentation</CarvedMenuItem>
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
                        <CarvedMenuItem expand={Expansion}>
                            <img style={{ filter: 'invert(1)' }} src="https://image.flaticon.com/icons/png/512/64/64572.png" alt="User" height="20px" />
                        </CarvedMenuItem>

                        <CarvedMenuItem decarved expand={Expansion}>
                            <img style={{ filter: 'invert(1)' }} src="https://image.flaticon.com/icons/png/512/64/64572.png" alt="User" height="20px" />
                        </CarvedMenuItem>

                        <CarvedMenuItem pill expand={Expansion}>
                            <img style={{ filter: 'invert(1)' }} src="https://image.flaticon.com/icons/png/512/64/64572.png" alt="User" height="20px" />
                        </CarvedMenuItem>

                        <CarvedMenuItem pill decarved expand={Expansion}>
                            <img style={{ filter: 'invert(1)' }} src="https://image.flaticon.com/icons/png/512/64/64572.png" alt="User" height="20px" />
                        </CarvedMenuItem>

                        <CarvedMenuItem
                            tooltip="Notification"
                        >
                            <img style={{ filter: 'invert(1)' }} src="https://pbs.twimg.com/media/DY6C2cQXUAAuiok.png" alt="Notification" height="20px" />
                        </CarvedMenuItem>

                        <CarvedMenuItem
                            pill
                            tooltip="Notification"
                        >
                            <img style={{ filter: 'invert(1)' }} src="https://pbs.twimg.com/media/DY6C2cQXUAAuiok.png" alt="Notification" height="20px" />
                        </CarvedMenuItem>

                        <CarvedMenuItem
                            pill
                            decarved
                            tooltip="Notification"
                        >
                            <img style={{ filter: 'invert(1)' }} src="https://pbs.twimg.com/media/DY6C2cQXUAAuiok.png" alt="Notification" height="20px" />
                        </CarvedMenuItem>

                        <CarvedMenuItem
                            preIcon="http://s16574.pcdn.co/wp-content/uploads/2018/05/About-icon.png"
                            preIconStyle={{ filter: 'invert(1)' }}
                        >
                            About
                        </CarvedMenuItem>

                        <CarvedMenuItem
                            preIcon="https://image.flaticon.com/icons/svg/35/35920.svg"
                            preIconStyle={{ filter: 'invert(1)' }}
                            postIcon="https://static.thenounproject.com/png/10897-200.png"
                            postIconStyle={{ filter: 'invert(1)' }}
                            expand={Expansion}
                        >
                            Documentation
                        </CarvedMenuItem>

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

                        <CarvedMenuItem>Support</CarvedMenuItem>
                    </CarvedMenuItems>
                </CarvedMenuBar>
            </CarvedApp>
        );
    }
}

export default App;
