import { createTheme } from './index';



describe("createTheme()", () => {
    it("creates theme with default settings", () => {
        const theme = createTheme('hsl(220, 20%, 20%)');

        expect(Object.keys(theme).length).toEqual(6);
        expect(theme[5]['backgroundColor']).toEqual('hsl(220, 20%, 4%)');
    });
});
