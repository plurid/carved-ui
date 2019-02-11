import React, { Component } from "react";

import './styles.scss';


import { CarvedCrater } from "../lib";
import { CarvedFjord } from "../lib";
import { CarvedKarst } from "../lib";



import { CarvedButton } from "../lib";
import { DeCarvedButton } from "../lib";
import { CarvedCard } from "../lib";
import { CarvedH1 } from "../lib";
import { CarvedHr } from "../lib";
import { CarvedInput } from "../lib";
import { CarvedMenuBar } from "../lib";
import { CarvedSelector } from "../lib";



class App extends Component {
    click = () => {
        console.log('clicked');
    }

    render() {
        return (
            <div>
                <CarvedMenuBar>
                    <CarvedKarst>
                        <div className='logo'>
                            <CarvedH1 text='Carved' />
                        </div>
                    </CarvedKarst>
                </CarvedMenuBar>

                <div className='appContainer'>
                    <h2>User Interface Components</h2>

                    <p>Carved Design uses 3 concepts to derive all the components</p>

                    <ul>
                        <li>the Carved Fjord</li>
                        <li>the Carved Karst</li>
                        <li>the Carved Crater</li>
                    </ul>

                    <CarvedHr />



                    <h3>The Carved Fjord</h3>

                    <CarvedFjord />

                    <h5>Description</h5>

                    <p>An element with more length than width.</p>

                    <h5>Uses</h5>

                    <ul>
                        <li>Nav Bar</li>
                        <li>Footer</li>
                        <li>Titles</li>
                    </ul>

                    <CarvedHr />



                    <h3>The Carved Karst</h3>

                    <CarvedKarst />

                    <h5>Description</h5>

                    <p>An element of almost equal length and width.</p>

                    <h5>Uses</h5>

                    <ul>
                        <li>Menus</li>
                        <li>Cards</li>
                    </ul>

                    <CarvedHr />



                    <h3>The Carved Crater</h3>

                    <CarvedCrater />

                    <h5>Description</h5>

                    <p>An element with border radius and hover effects, usually small in size</p>

                    <h5>Uses</h5>

                    <ul>
                        <li>Buttons</li>
                    </ul>

                    <CarvedHr />



                    <h1>Components</h1>

                    <h1>CarvedInput</h1>

                    <code>
                        {
                            `
                            <CarvedInput
                                label="Name"
                                placeholder="John Smith"
                            />
                            `
                        }
                    </code>
                    <br />
                    <br />
                    <CarvedInput
                        label="Name"
                        placeholder="John Smith"
                    />
                    <br />
                    <br />

                    <code>
                        {
                            `
                            <CarvedInput
                                label="Email"
                                placeholder="name@email.com"
                            />
                            `
                        }
                    </code>
                    <br />
                    <br />
                    <CarvedInput
                        label="Email"
                        placeholder="name@email.com"
                    />
                    <br />
                    <br />


                    <code>
                        {
                            `
                            <CarvedInput
                                type="password"
                                label="Password"
                            />
                            `
                        }
                    </code>
                    <br />
                    <br />
                    <CarvedInput
                        type="password"
                        label="Password"
                    />


                    <CarvedHr />


                    <br />
                    <br />
                    <h1>CarvedSelector</h1>

                    <pre>{
            `
            <CarvedSelector
                selectors={ [
                    {value: 'en', label: 'EN'},
                    {value: 'ro', label: 'RO'},
                    {value: 'fr', label: 'FR'},
                    {value: 'de', label: 'DE'},
                ] }
            />
            `
                    }</pre>
                    <br />

                    <CarvedSelector
                        selectors={ [
                            {value: 'en', label: 'EN'},
                            {value: 'ro', label: 'RO'},
                            {value: 'fr', label: 'FR'},
                            {value: 'de', label: 'DE'},
                        ] }
                    />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />


                    <pre>{
            `
            <CarvedSelector
                expand="right"
                selectors={ [
                    {value: 'en', label: 'EN'},
                    {value: 'ro', label: 'RO'},
                    {value: 'fr', label: 'FR'},
                    {value: 'de', label: 'DE'},
                ] }
            />
            `
                    }</pre>
                    <br />

                    <CarvedSelector
                        expand="right"
                        selectors={ [
                            {value: 'en', label: 'EN'},
                            {value: 'ro', label: 'RO'},
                            {value: 'fr', label: 'FR'},
                            {value: 'de', label: 'DE'},
                        ] }
                    />
                    <br />


                    <pre>{
            `
            <CarvedSelector
                expand="up"
                expanded="true"
                selectors={ [
                    {value: 'en', label: 'EN'},
                    {value: 'ro', label: 'RO'},
                    {value: 'fr', label: 'FR'},
                    {value: 'de', label: 'DE'},
                ] }
            />
            `
                    }</pre>
                    <br />

                    <CarvedSelector
                        expand="right"
                        expanded="true"
                        selectors={ [
                            {value: 'en', label: 'EN'},
                            {value: 'ro', label: 'RO'},
                            {value: 'fr', label: 'FR'},
                            {value: 'de', label: 'DE'},
                        ] }
                    />
                    <br />


                    <pre>{
            `
            <CarvedSelector
                initial="2"
                selectors={ [
                    {value: 'en', label: 'EN'},
                    {value: 'ro', label: 'RO'},
                    {value: 'fr', label: 'FR'},
                    {value: 'de', label: 'DE'},
                ] }
            />
            `
                    }</pre>
                    <br />

                    <CarvedSelector
                        initial="2"
                        selectors={ [
                            {value: 'en', label: 'EN'},
                            {value: 'ro', label: 'RO'},
                            {value: 'fr', label: 'FR'},
                            {value: 'de', label: 'DE'},
                        ] }
                    />
                    <br />


                    <pre>{
            `
            <CarvedSelector
                initial="none"
                noneText="Please Select a Value"
                selectors={ [
                    {value: 'en', label: 'EN'},
                    {value: 'ro', label: 'RO'},
                    {value: 'fr', label: 'FR'},
                    {value: 'de', label: 'DE'},
                ] }
            />
            `
                    }</pre>
                    <br />

                    <CarvedSelector
                        initial="none"
                        noneText="Please Select a Value"
                        selectors={ [
                            {value: 'en', label: 'EN'},
                            {value: 'ro', label: 'RO'},
                            {value: 'fr', label: 'FR'},
                            {value: 'de', label: 'DE'},
                        ] }
                    />
                    <br />


                    <CarvedHr />



                    <h1>CarvedButton</h1>

                    <CarvedButton text="Submit" onClick={this.click} />

                    <CarvedHr />

                    <h1>DeCarvedButton</h1>

                    <DeCarvedButton text="Submit" />

                    <CarvedHr />



                    <h1>CarvedCard</h1>

                    <CarvedCard
                        text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed hendrerit erat in felis gravida dapibus at ut sapien. Ut ut justo eu elit congue rhoncus sed vel nisi. Donec mollis ultrices mi eget condimentum. Fusce condimentum non turpis a facilisis. Praesent tempor leo sit amet erat laoreet laoreet. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec sollicitudin facilisis augue vel pulvinar. Quisque eu nulla semper, varius mi ut, condimentum enim. Proin fermentum malesuada ligula at porttitor."
                    />


                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />

                    <CarvedHr />



                    <h1>Headings</h1>

                    <CarvedH1
                        text="CarvedH1"
                    />

                    <CarvedHr />



                    <h1>Carved Crater</h1>

                    <CarvedCrater />

                    <CarvedHr />



                    <h1>Carved Fjord</h1>

                    <CarvedFjord />

                    <CarvedHr />



                    <h1>Carved Karst</h1>
                    <br />
                    <br />
                    <br />

                    <div style={{ height: '500px',  overflow: 'hidden', boxSizing: 'border-box' }}>
                        <CarvedKarst>

                        </CarvedKarst>
                    </div>

                    <CarvedHr />

                    <div style={{ height: '500px', overflow: 'hidden', boxSizing: 'border-box' }}>
                        <CarvedKarst>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam in justo mauris. Donec quis hendrerit ante. Nunc ut lacinia risus. Sed tempus, neque ac posuere vestibulum, nunc dui porttitor mauris, eu sodales massa est sit amet quam. Nunc vestibulum ante id arcu varius, sed finibus neque viverra. Aenean posuere, justo vel venenatis accumsan, diam ex iaculis quam, in ornare nisl quam vitae mi. Donec cursus odio in eleifend vehicula. Maecenas ac nisl non nisi ultrices sodales ut sit amet ipsum. Pellentesque iaculis vel est vulputate dapibus. Praesent viverra ante vel dui auctor, in tincidunt dolor gravida. Maecenas porta lobortis lacus, quis aliquet mauris congue eu.</p>
                            <CarvedKarst>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam in justo mauris. Donec quis hendrerit ante. Nunc ut lacinia risus. Sed tempus, neque ac posuere vestibulum, nunc dui porttitor mauris, eu sodales massa est sit amet quam. Nunc vestibulum ante id arcu varius, sed finibus neque viverra. Aenean posuere, justo vel venenatis accumsan, diam ex iaculis quam, in ornare nisl quam vitae mi. Donec cursus odio in eleifend vehicula. Maecenas ac nisl non nisi ultrices sodales ut sit amet ipsum. Pellentesque iaculis vel est vulputate dapibus. Praesent viverra ante vel dui auctor, in tincidunt dolor gravida. Maecenas porta lobortis lacus, quis aliquet mauris congue eu.</p>
                                <CarvedKarst>
                                    <p>Maecenas ac justo nisl. Sed vulputate nibh ut congue porttitor. Duis rutrum sem ut tortor accumsan, euismod scelerisque lacus vulputate. Nam vulputate vel turpis in tempus. Praesent facilisis sodales pharetra. Morbi neque turpis, pharetra eu orci et, euismod porttitor sem. In ut vestibulum felis. Duis sit amet commodo ipsum. Ut quis aliquet sapien.</p>
                                    <p>Vestibulum viverra lacus vel erat mattis, quis semper ligula lacinia. Vestibulum mollis nibh ante, ut egestas lorem tincidunt in. Ut in ante sit amet eros accumsan vulputate. Vivamus sed nisi gravida, egestas elit ornare, ullamcorper velit. Etiam non purus nec augue vestibulum placerat nec rhoncus felis. Integer maximus accumsan dui sed tempus. Vivamus vel lacus at urna eleifend malesuada non a enim. Suspendisse vel sem in risus convallis volutpat et sit amet lorem. Aliquam imperdiet maximus justo nec cursus. In efficitur enim quis placerat egestas. Donec dui diam, euismod non lacinia in, tempus et metus. Nunc id commodo nisl.</p>
                                    <p>Donec lacus nulla, facilisis sit amet tincidunt pretium, dapibus vel elit. Phasellus auctor massa aliquet, iaculis sem nec, sollicitudin ex. Cras luctus nisl eu ipsum vehicula, non posuere erat egestas. Nullam sit amet risus sit amet lacus varius sagittis. Duis sed placerat felis. Vivamus felis neque, congue non bibendum vel, sagittis vitae turpis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec laoreet dapibus mauris, id ornare risus.</p>
                                </CarvedKarst>
                            </CarvedKarst>
                        </CarvedKarst>
                    </div>

                    <CarvedHr />
                </div>
            </div>
        );
    }
}

export default App;
