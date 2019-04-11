import React from "react";
import CarvedH4 from "./index";
import renderer from "react-test-renderer";



describe("CarvedH4", () => {
    it("renders properly", () => {
        const tree = renderer
            .create(<CarvedH4 text="Submit" />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
