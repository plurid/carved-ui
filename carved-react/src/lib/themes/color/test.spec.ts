import { getColorElements } from './index';



describe("getColorElements()", () => {
    it("gets hue, saturation, lightness from HSL string", () => {
        const { hue, saturation, lightness } = getColorElements('hsl(220, 20%, 40%)');

        expect(hue).toEqual(220);
        expect(saturation).toEqual(20);
        expect(lightness).toEqual(40);
    });
});

describe("getColorElements()", () => {
    it("gets hue, saturation, lightness from RGB string", () => {
        const { hue, saturation, lightness } = getColorElements('rgb(82, 95, 122)');

        expect(hue).toEqual(220.5);
        expect(saturation).toEqual(19.61);
        expect(lightness).toEqual(40);
    });
});

describe("getColorElements()", () => {
    it("gets hue, saturation, lightness from HEX string", () => {
        const { hue, saturation, lightness } = getColorElements('#525f7a');

        expect(hue).toEqual(220.5);
        expect(saturation).toEqual(19.61);
        expect(lightness).toEqual(40);
    });
});
