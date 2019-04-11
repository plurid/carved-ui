import React from "react";
import CarvedCard from "./index";
import renderer from "react-test-renderer";



describe("CarvedCard", () => {
    it("renders properly", () => {
        const tree = renderer
            .create(<CarvedCard text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed hendrerit erat in felis gravida dapibus at ut sapien. Ut ut justo eu elit congue rhoncus sed vel nisi. Donec mollis ultrices mi eget condimentum. Fusce condimentum non turpis a facilisis. Praesent tempor leo sit amet erat laoreet laoreet. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec sollicitudin facilisis augue vel pulvinar. Quisque eu nulla semper, varius mi ut, condimentum enim. Proin fermentum malesuada ligula at porttitor." />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
