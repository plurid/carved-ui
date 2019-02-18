import React from "react";
import CarvedApp from "./index";
import renderer from "react-test-renderer";



describe("CarvedApp", () => {
    it("renders properly", () => {
        const tree = renderer
            .create(<CarvedApp />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
