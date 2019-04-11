import React from "react";
import CarvedMenuItem from "./index";
import renderer from "react-test-renderer";



describe("CarvedMenuItem", () => {
    it("renders properly", () => {
        const tree = renderer
            .create(<CarvedMenuItem>Text</CarvedMenuItem>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
