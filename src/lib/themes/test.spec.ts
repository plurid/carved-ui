import { createTheme, getColorElements } from './index';


describe("createTheme()", () => {
    it("creates theme with default settings", () => {
        const theme = createTheme('hsl(220, 20%, 20%)');

        expect(Object.keys(theme).length).toEqual(6);
        expect(theme[5]['backgroundColor']).toEqual('hsl(220, 20%, 4%)');
    });
});


describe("getColorElements()", () => {
    it("gets hue, saturation, lightness from string", () => {
        const { hue, saturation, lightness } = getColorElements('hsl(220, 20%, 40%)');

        expect(hue).toEqual(220);
        expect(saturation).toEqual(20);
        expect(lightness).toEqual(40);
    });
});
