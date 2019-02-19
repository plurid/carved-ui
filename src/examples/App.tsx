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

    CarvedHR,
    CarvedInput,
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
                <div>
                    <div>
                        <CarvedKarst>
                            <CarvedPolje>
                                <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Commodi explicabo corporis culpa accusantium eveniet natus quasi, consequuntur eligendi? Quis, itaque fugit dignissimos ratione molestiae libero voluptas recusandae ut. Harum, vel!</p>
                            </CarvedPolje>
                            <CarvedKarst>
                                <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Commodi explicabo corporis culpa accusantium eveniet natus quasi, consequuntur eligendi? Quis, itaque fugit dignissimos ratione molestiae libero voluptas recusandae ut. Harum, vel!</p>
                                <CarvedKarst>
                                    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Commodi explicabo corporis culpa accusantium eveniet natus quasi, consequuntur eligendi? Quis, itaque fugit dignissimos ratione molestiae libero voluptas recusandae ut. Harum, vel!</p>
                                </CarvedKarst>

                                <div style={{ display: 'grid', margin: '20px 0', gridTemplateColumns: '1fr 1fr 1fr', gridGap: '20px' }}>
                                    <CarvedDoline>
                                        <p>AAAAAAA Lorem ipsum dolor, sit amet consectetur adipisicing elit. Commodi explicabo corporis culpa accusantium eveniet natus quasi, consequuntur eligendi? Quis, itaque fugit dignissimos ratione molestiae libero voluptas recusandae ut. Harum, vel!</p>
                                    </CarvedDoline>
                                    <CarvedDoline>
                                        <p>BBBBBBB Lorem ipsum dolor, sit amet consectetur adipisicing elit. Commodi explicabo corporis culpa accusantium eveniet natus quasi, consequuntur eligendi? Quis, itaque fugit dignissimos ratione molestiae libero voluptas recusandae ut. Harum, vel!</p>
                                    </CarvedDoline>
                                    <CarvedDoline>
                                        <p>CCCCCCC Lorem ipsum dolor, sit amet consectetur adipisicing elit. Commodi explicabo corporis culpa accusantium eveniet natus quasi, consequuntur eligendi? Quis, itaque fugit dignissimos ratione molestiae libero voluptas recusandae ut. Harum, vel!</p>
                                    </CarvedDoline>
                                </div>
                            </CarvedKarst>

                        </CarvedKarst>
                    </div>
                </div>
            </CarvedApp>
        );
    }
}

export default App;
