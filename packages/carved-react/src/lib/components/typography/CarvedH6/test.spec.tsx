import React from "react";
import CarvedH6 from "./index";
import renderer from "react-test-renderer";



describe("CarvedH6", () => {
    it("renders properly", () => {
        const tree = renderer
            .create(<CarvedH6 text="Submit" />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
