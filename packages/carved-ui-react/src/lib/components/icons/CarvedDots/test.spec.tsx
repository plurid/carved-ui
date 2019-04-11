import React from "react";
import CarvedDots from "./index";
import renderer from "react-test-renderer";



describe("CarvedDots", () => {
    it("renders properly", () => {
        const tree = renderer
            .create(<CarvedDots />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
