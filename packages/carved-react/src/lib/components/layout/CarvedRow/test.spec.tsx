import React from "react";
import CarvedRow from "./index";
import renderer from "react-test-renderer";



describe("CarvedRow", () => {
    it("renders properly", () => {
        const tree = renderer
            .create(<CarvedRow />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
