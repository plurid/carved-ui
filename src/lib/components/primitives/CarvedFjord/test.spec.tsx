import React from "react";
import CarvedFjord from "./index";
import renderer from "react-test-renderer";



describe("CarvedFjord", () => {
    it("renders properly", () => {
        const tree = renderer
            .create(<CarvedFjord />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
