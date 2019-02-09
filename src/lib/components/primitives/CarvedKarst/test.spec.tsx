import React from "react";
import CarvedKarst from "./index";
import renderer from "react-test-renderer";



describe("CarvedKarst", () => {
    it("renders properly", () => {
        const tree = renderer
            .create(<CarvedKarst />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
