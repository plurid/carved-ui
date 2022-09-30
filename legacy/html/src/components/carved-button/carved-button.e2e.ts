import { newE2EPage } from '@stencil/core/testing';



describe('carved-button', () => {
    it('renders', async () => {
        const page = await newE2EPage();

        await page.setContent('<carved-button></carved-button>');
        const element = await page.find('carved-button');
        expect(element).toHaveClass('hydrated');
    });

    // it('renders changes to the name data', async () => {
    //     const page = await newE2EPage();

    //     await page.setContent('<carved-button></carved-button>');
    //     const component = await page.find('carved-button');
    //     const element = await page.find('carved-button >>> div');
    //     expect(element.textContent).toEqual(`Hello, World! I'm `);
    // });
});
