import React from "react";
import CarvedH5 from "./index";
import renderer from "react-test-renderer";



describe("CarvedH5", () => {
    it("renders properly", () => {
        const tree = renderer
            .create(<CarvedH5 text="Submit" />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
