import React from "react";
import CarvedTile from "./index";
import renderer from "react-test-renderer";



describe("CarvedTile", () => {
    it("renders properly", () => {
        const tree = renderer
            .create(<CarvedTile />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
