import React from "react";
import CarvedMenuBar from "./index";
import renderer from "react-test-renderer";



describe("CarvedMenuBar", () => {
    it("renders properly", () => {
        const tree = renderer
            .create(<CarvedMenuBar>Text</CarvedMenuBar>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
