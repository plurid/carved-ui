import { newE2EPage } from '@stencil/core/testing';



describe('carved-input', () => {
    it('renders', async () => {
        const page = await newE2EPage();

        await page.setContent('<carved-input></carved-input>');
        const element = await page.find('carved-input');
        expect(element).toHaveClass('hydrated');
    });

    // it('renders changes to the name data', async () => {
    //     const page = await newE2EPage();

    //     await page.setContent('<carved-input></carved-input>');
    //     const component = await page.find('carved-input');
    //     const element = await page.find('carved-input >>> div');
    //     expect(element.textContent).toEqual(`Hello, World! I'm `);
    // });
});
