import React from "react";
import CarvedHr from "./index";
import renderer from "react-test-renderer";



describe("CarvedHr", () => {
    it("renders properly", () => {
        const tree = renderer
            .create(<CarvedHr />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
