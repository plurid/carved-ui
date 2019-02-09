import React from "react";
import CarvedCrater from "./index";
import renderer from "react-test-renderer";



describe("CarvedCrater", () => {
    it("renders properly", () => {
        const tree = renderer
            .create(<CarvedCrater />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
