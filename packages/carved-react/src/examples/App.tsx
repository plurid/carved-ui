import React, { Component } from "react";

import MenuBarTest from './MenuBarTest';

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



class App extends Component {
    click = () => {
        console.log('clicked');
    }

    constructor(props: any) {
        super(props);


        this.state = {
            config: {
                theme: 'hsl(220, 40%, 40%)'
            }
        }
    }

    render() {
        return (
            <CarvedApp
                theme="hsl(220, 40%, 40%)"
            >
                {/* <CarvedMenuBar>
                    <h2 style={{ marginBottom: 0 }}>Carved</h2>

                    <CarvedMenuItems>
                        <CarvedMenuItem
                            decarved
                            pill
                            tooltip="Notification"
                        >
                            <img style={{ filter: 'invert(1)' }} src="https://pbs.twimg.com/media/DY6C2cQXUAAuiok.png" alt="Notification" height="20px" />
                        </CarvedMenuItem>

                        <CarvedMenuItem>
                            <CarvedButton>
                                Submit
                            </CarvedButton>
                        </CarvedMenuItem>
                    </CarvedMenuItems>
                </CarvedMenuBar> */}

                <MenuBarTest>
                </MenuBarTest>
            </CarvedApp>


            // <CarvedMenu.Bar>
            //     <CarvedMenu.Items>
            //         <CarvedMenu.Item>

            //         </CarvedMenu.Item>
            //     </CarvedMenu.Items>
            // </CarvedMenu.Bar>

            // <CarvedApp config={config} theme="hsl(220, 40%, 40%)">
            //     {(config) => (

            //     )}
            // </CarvedApp>
        );
    }
}

export default App;
