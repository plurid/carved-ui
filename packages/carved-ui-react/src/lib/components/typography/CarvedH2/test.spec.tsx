import React from "react";
import CarvedH2 from "./index";
import renderer from "react-test-renderer";



describe("CarvedH2", () => {
    it("renders properly", () => {
        const tree = renderer
            .create(<CarvedH2 text="Submit" />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
