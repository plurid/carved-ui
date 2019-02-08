import React from "react";
import { CarvedInput } from "../lib";



const App = () => (
    <div style={{ width: 640, margin: "15px auto" }}>
        <h1>CarvedInput</h1>
        <br />

        <code>
            {
                `
                <CarvedInput
                    label="Email Address"
                    placeholder="name@example.com"
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
        <CarvedInput
            label="Email Address"
            placeholder="name@example.com"
        />
        <br />
        <CarvedInput
            type="password"
            label="Password"
        />
        <br />
    </div>
);

export default App;
