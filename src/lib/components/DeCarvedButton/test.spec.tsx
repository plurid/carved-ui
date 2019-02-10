import React from "react";
import CarvedButton from "./index";
import renderer from "react-test-renderer";



describe("CarvedButton", () => {
    it("renders properly", () => {
        const tree = renderer
            .create(<CarvedButton text="Submit" />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
