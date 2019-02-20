import React from "react";
import CarvedMenuItems from "./index";
import renderer from "react-test-renderer";



describe("CarvedMenuItems", () => {
    it("renders properly", () => {
        const tree = renderer
            .create(<CarvedMenuItems>Text</CarvedMenuItems>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
