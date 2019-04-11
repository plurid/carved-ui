import React from "react";
import CarvedContainer from "./index";
import renderer from "react-test-renderer";



describe("CarvedContainer", () => {
    it("renders properly", () => {
        const tree = renderer
            .create(<CarvedContainer />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
