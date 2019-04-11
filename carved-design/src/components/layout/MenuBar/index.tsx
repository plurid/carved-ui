import React, { Component } from 'react'

import {
    CarvedMenuBar,
    CarvedMenuItems,
    CarvedMenuItem,
    CarvedMenuList,
} from 'carved-react';



const Expansion = (
    <CarvedMenuList>
        <CarvedMenuItem>About</CarvedMenuItem>
        <CarvedMenuItem>Documentation</CarvedMenuItem>
        <CarvedMenuItem>Support</CarvedMenuItem>
    </CarvedMenuList>
);


class MenuBar extends Component {
    render() {
        return (
            <CarvedMenuBar>
                <div>
                    Carved
                </div>
                <CarvedMenuItems>
                    <CarvedMenuItem expand={Expansion}>
                        <img style={{ filter: 'invert(1)' }} src="https://image.flaticon.com/icons/png/512/64/64572.png" alt="User" height="20px" />
                    </CarvedMenuItem>
                    <CarvedMenuItem>
                        <img style={{ filter: 'invert(1)' }} src="https://pbs.twimg.com/media/DY6C2cQXUAAuiok.png" alt="Notification" height="20px" />
                    </CarvedMenuItem>
                    <CarvedMenuItem>About</CarvedMenuItem>
                    <CarvedMenuItem expand={Expansion}>Documentation</CarvedMenuItem>
                    <CarvedMenuItem>Support</CarvedMenuItem>
                </CarvedMenuItems>
            </CarvedMenuBar>
        )
    }
}

export default MenuBar;
