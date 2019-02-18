import React from "react";
import CarvedStratum from "./index";
import renderer from "react-test-renderer";



describe("CarvedStratum", () => {
    it("renders properly", () => {
        const tree = renderer
            .create(<CarvedStratum>Children</CarvedStratum>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
