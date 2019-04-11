import React from "react";
import CarvedH3 from "./index";
import renderer from "react-test-renderer";



describe("CarvedH3", () => {
    it("renders properly", () => {
        const tree = renderer
            .create(<CarvedH3 text="Submit" />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
