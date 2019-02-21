import React, { Component } from 'react'

import MenuBar from '../../layout/MenuBar';

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

    CarvedMenuBar,
    CarvedMenuItems,
    CarvedMenuItem,
    CarvedMenuList,

    CarvedHR,
    CarvedInput,
    CarvedSelector,
} from 'carved-react';

const Expansion = (
    <CarvedMenuList>
        <CarvedMenuItem>About</CarvedMenuItem>
        <CarvedMenuItem>Documentation</CarvedMenuItem>
        <CarvedMenuItem>Support</CarvedMenuItem>
    </CarvedMenuList>
);


class CarvedTest extends Component {
    render() {
        return (
            <div className="App">
                <CarvedApp
                    theme="hsl(220, 40%, 40%)"
                >
                    {/* <MenuBar /> */}
                    <CarvedMenuBar>
                        <div>
                            Carved
                        </div>
                        <CarvedMenuItems>
                            <CarvedMenuItem pill decarved expand={Expansion}>
                                <img style={{ filter: 'invert(1)' }} src="https://image.flaticon.com/icons/png/512/64/64572.png" alt="User" height="20px" />
                            </CarvedMenuItem>
                            <CarvedMenuItem>
                                <img style={{ filter: 'invert(1)' }} src="https://pbs.twimg.com/media/DY6C2cQXUAAuiok.png" alt="Notification" height="20px" />
                            </CarvedMenuItem>
                            <CarvedMenuItem>About</CarvedMenuItem>
                            <CarvedMenuItem decarved expand={Expansion}>Documentation</CarvedMenuItem>
                            <CarvedMenuItem>Support</CarvedMenuItem>
                        </CarvedMenuItems>
                    </CarvedMenuBar>

                    <CarvedPolje>
                        <CarvedH1 text="Buttons H1">
                        </CarvedH1>

                        <CarvedH2 text="Buttons H2">
                        </CarvedH2>

                        <CarvedH3 text="Buttons H3">
                        </CarvedH3>

                        <CarvedH4 text="Buttons H4">
                        </CarvedH4>

                        <CarvedH5 text="Buttons H5">
                        </CarvedH5>

                        <CarvedH6 text="Buttons H6">
                        </CarvedH6>

                        <h2>Default Kinds</h2>
                        <CarvedButton
                            text="Submit"
                            kind="accept"
                        />
                        <CarvedButton
                            text="Cancel"
                            kind="decline"
                        />
                        <CarvedButton
                            text="Warning"
                            kind="warning"
                        />
                        <CarvedButton
                            text="Hazard"
                            kind="hazard"
                        />
                        <br />

                        <h2>
                            Themed Kinds
                        </h2>
                        <CarvedButton
                            text="Submit"
                            kind="acceptThemed"
                        />
                        <CarvedButton
                            text="Cancel"
                            kind="declineThemed"
                        />
                        <CarvedButton
                            text="Warning"
                            kind="warningThemed"
                        />
                        <CarvedButton
                            text="Hazard"
                            kind="hazardThemed"
                        />
                    </CarvedPolje>

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

                                    <div>
                                        <div>
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
                                        </div>
                                    </div>
                                </CarvedKarst>

                            </CarvedKarst>
                        </div>
                    </div>

                    <CarvedHR />


                    <CarvedCard>
                        <CarvedContainer>
                            <CarvedH1 text="Buttons">
                            </CarvedH1>

                            <CarvedButton
                                text="Submit"
                                kind="accept"
                            />
                            <CarvedButton
                                text="Cancel"
                                kind="decline"
                            />
                            <CarvedButton
                                text="Warning"
                                kind="warning"
                            />
                            <CarvedButton
                                text="Hazard"
                                kind="hazard"
                            />

                            <h2>
                                Themed Kinds
                            </h2>
                            <CarvedButton
                                text="Submit"
                                kind="acceptThemed"
                            />
                            <CarvedButton
                                text="Cancel"
                                kind="declineThemed"
                            />
                            <CarvedButton
                                text="Warning"
                                kind="warningThemed"
                            />
                            <CarvedButton
                                text="Hazard"
                                kind="hazardThemed"
                            />

                            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolore, nulla inventore maxime asperiores praesentium, nisi quae at modi voluptatem porro officiis vel. Minus quod eos qui dolore est sequi nihil!</p>

                            <CarvedCard>
                                <h2>Default Kinds</h2>
                                <CarvedButton
                                    text="Submit"
                                    kind="accept"
                                />
                                <CarvedButton
                                    text="Cancel"
                                    kind="decline"
                                />
                                <CarvedButton
                                    text="Warning"
                                    kind="warning"
                                />
                                <CarvedButton
                                    text="Hazard"
                                    kind="hazard"
                                />
                                <br />

                                <h2>
                                    Themed Kinds
                                </h2>
                                <CarvedButton
                                    text="Submit"
                                    kind="acceptThemed"
                                />
                                <CarvedButton
                                    text="Cancel"
                                    kind="declineThemed"
                                />
                                <CarvedButton
                                    text="Warning"
                                    kind="warningThemed"
                                />
                                <CarvedButton
                                    text="Hazard"
                                    kind="hazardThemed"
                                />

                                <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolore, nulla inventore maxime asperiores praesentium, nisi quae at modi voluptatem porro officiis vel. Minus quod eos qui dolore est sequi nihil!</p>
                            </CarvedCard>
                        </CarvedContainer>
                    </CarvedCard>

                    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolore, nulla inventore maxime asperiores praesentium, nisi quae at modi voluptatem porro officiis vel. Minus quod eos qui dolore est sequi nihil!</p>

                    <CarvedCard
                        text="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolore, nulla inventore maxime asperiores praesentium, nisi quae at modi voluptatem porro officiis vel. Minus quod eos qui dolore est sequi nihil!"
                    />

                    <div>
                        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolore, nulla inventore maxime asperiores praesentium, nisi quae at modi voluptatem porro officiis vel. Minus quod eos qui dolore est sequi nihil!</p>

                        <CarvedCard>
                            <CarvedButton
                                text="Submit"
                            />
                            <CarvedButton
                                text="Cancel"
                            />
                            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolore, nulla inventore maxime asperiores praesentium, nisi quae at modi voluptatem porro officiis vel. Minus quod eos qui dolore est sequi nihil!</p>
                        </CarvedCard>
                    </div>

                    <div>
                        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolore, nulla inventore maxime asperiores praesentium, nisi quae at modi voluptatem porro officiis vel. Minus quod eos qui dolore est sequi nihil!</p>

                        <CarvedCard>
                            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolore, nulla inventore maxime asperiores praesentium, nisi quae at modi voluptatem porro officiis vel. Minus quod eos qui dolore est sequi nihil!</p>
                        </CarvedCard>

                        <div>
                            <CarvedCard>
                                <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolore, nulla inventore maxime asperiores praesentium, nisi quae at modi voluptatem porro officiis vel. Minus quod eos qui dolore est sequi nihil!</p>
                            </CarvedCard>

                            <div>
                                <CarvedCard>
                                    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolore, nulla inventore maxime asperiores praesentium, nisi quae at modi voluptatem porro officiis vel. Minus quod eos qui dolore est sequi nihil!</p>
                                </CarvedCard>
                            </div>
                        </div>
                    </div>
                </CarvedApp>
            </div>
        )
    }
}

export default CarvedTest;
