import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import { postcss } from '@stencil/postcss';
import autoprefixer from 'autoprefixer';



export const config: Config = {
    namespace: 'carved-html',
    outputTargets:[
        { type: 'dist' },
        { type: 'docs' },
        {
            type: 'www',
            serviceWorker: null,
        },
    ],
    plugins: [
        sass(),
        postcss({
            plugins: [autoprefixer()]
        }),
    ],
};
