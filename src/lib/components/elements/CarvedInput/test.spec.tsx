import React from "react";
import CarvedInput from "./index";
import renderer from "react-test-renderer";



describe("CarvedInput", () => {
    it("renders properly", () => {
        const tree = renderer
            .create(<CarvedInput label="Email" placeholder="name@example.com" />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
