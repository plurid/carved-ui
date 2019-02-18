import React from "react";
import CarvedH1 from "./index";
import renderer from "react-test-renderer";



describe("CarvedH1", () => {
    it("renders properly", () => {
        const tree = renderer
            .create(<CarvedH1 text="Submit" />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
