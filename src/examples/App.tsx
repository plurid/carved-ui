import React from "react";
import { CarvedButton } from "../lib";
import { CarvedCard } from "../lib";
import { CarvedInput } from "../lib";
import { CarvedSelector } from "../lib";



const App = () => (
    <div style={{ width: 640, margin: "15px auto" }}>
        <br />
        <br />
        <h1>CarvedInput</h1>
        <br />

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



        <br />
        <br />
        <h1>CarvedButton</h1>

        <CarvedButton text="Submit" />


        <br />
        <br />
        <br />
        <br />
        <br />
        <br />

        <br />
        <br />
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
    </div>
);

export default App;
