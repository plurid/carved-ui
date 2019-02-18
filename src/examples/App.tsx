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
                theme="dusk"
            >
                <CarvedPolje>
                    <CarvedH1 text="Buttons">
                    </CarvedH1>

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

                <CarvedKarst>
                    <CarvedPolje>
                        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Commodi explicabo corporis culpa accusantium eveniet natus quasi, consequuntur eligendi? Quis, itaque fugit dignissimos ratione molestiae libero voluptas recusandae ut. Harum, vel!</p>
                    </CarvedPolje>
                    <CarvedKarst>
                        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Commodi explicabo corporis culpa accusantium eveniet natus quasi, consequuntur eligendi? Quis, itaque fugit dignissimos ratione molestiae libero voluptas recusandae ut. Harum, vel!</p>
                        <CarvedKarst>
                            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Commodi explicabo corporis culpa accusantium eveniet natus quasi, consequuntur eligendi? Quis, itaque fugit dignissimos ratione molestiae libero voluptas recusandae ut. Harum, vel!</p>
                        </CarvedKarst>

                        <CarvedDoline>
                            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Commodi explicabo corporis culpa accusantium eveniet natus quasi, consequuntur eligendi? Quis, itaque fugit dignissimos ratione molestiae libero voluptas recusandae ut. Harum, vel!</p>
                        </CarvedDoline>
                        <CarvedDoline>
                            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Commodi explicabo corporis culpa accusantium eveniet natus quasi, consequuntur eligendi? Quis, itaque fugit dignissimos ratione molestiae libero voluptas recusandae ut. Harum, vel!</p>
                        </CarvedDoline>
                    </CarvedKarst>


                    <CarvedFjord>
                        TEXT
                    </CarvedFjord>
                </CarvedKarst>


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
        );
    }
}

export default App;
