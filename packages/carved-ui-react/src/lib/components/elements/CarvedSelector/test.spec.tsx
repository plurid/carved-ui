import React from "react";
import CarvedSelector from "./index";
import renderer from "react-test-renderer";



describe("CarvedSelector", () => {
    it("renders properly", () => {
        const selectors = [
            {value: 'en', label: 'EN'},
            {value: 'ro', label: 'RO'},
            {value: 'fr', label: 'FR'},
            {value: 'de', label: 'DE'},
        ];

        const tree = renderer
            .create(<CarvedSelector selectors={selectors} />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
