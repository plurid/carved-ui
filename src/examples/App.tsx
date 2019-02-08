import React from "react";
import { CarvedInput } from "../lib";



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
    </div>
);

export default App;
