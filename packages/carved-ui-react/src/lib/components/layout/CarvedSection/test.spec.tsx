import React from "react";
import CarvedSection from "./index";
import renderer from "react-test-renderer";



describe("CarvedSection", () => {
    it("renders properly", () => {
        const tree = renderer
            .create(<CarvedSection />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
