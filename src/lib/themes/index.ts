export interface Themes {
    [key: string]: Theme
}

interface Theme {
    [key: string]: ThemeLevel,
}

interface ThemeLevel {
    [key: string]: string,
}


const DEPTH_LEVELS = 6;

export function createTheme(color: string): Theme {
    const theme: Theme = {};
    const { hue, saturation, lightness } = getColorElements(color);

    for (let i = 0; i <= DEPTH_LEVELS; i++) {
        const reducedLightness = i === 0 ? lightness : Math.ceil(lightness * 0.7 ** i);
        const invertedLightness = reducedLightness > 50 ? 10 : 80;

        (theme[i] as ThemeLevel) = {
            backgroundColor: `hsl(${hue}, ${saturation}%, ${reducedLightness}%)`,
            textColor: `hsl(0, 0%, ${invertedLightness}%)`,
        };
    }

    return theme;
}

interface ColorElements {
    hue: number,
    saturation: number,
    lightness: number,
}


/**
 * Extract from color, e.g. 'hsl(220, 20%, 40%)',
 * the hue = 220
 * the saturation = 20
 * the lightness = 40
 *
 * @param color
 */
function getColorElements(color: string): ColorElements {
    const hueRegex = /\((\d+)/;
    const saturationRegex = /\(\d+,\s?(\d+)/;
    const lightnessRegex = /\(\d+,\s?\d+%,\s?(\d+)/;
    const hue = parseInt(color.match(hueRegex)![1]);
    const saturation = parseInt(color.match(saturationRegex)![1]);
    const lightness = parseInt(color.match(lightnessRegex)![1]);

    return {
        hue,
        saturation,
        lightness,
    }
}


const defaultThemes = [
    {
        name: 'night',
        color: 'hsl(0, 0%, 10%)',
    },
    {
        name: 'dusk',
        color: 'hsl(0, 0%, 20%)',
    },
    {
        name: 'dawn',
        color: 'hsl(0, 0%, 70%)',
    },
    {
        name: 'light',
        color: 'hsl(0, 0%, 100%)',
    },
    {
        name: 'ponton',
        color: 'hsl(220, 20%, 20%)',
    },
    {
        name: 'jaune',
        color: 'hsl(35, 90%, 45%)',
    },
    {
        name: 'furor',
        color: 'hsl(360, 90%, 30%)',
    },
]


export function createThemes(): Themes {
    const themes: Themes = {}
    for (let theme of defaultThemes) {
        themes[theme.name] = createTheme(theme.color);
    }
    return themes;
}



const night = {
    "0": {
        backgroundColor: 'hsl(220, 20%, 20%)',
    },
    "1": {
        backgroundColor: 'hsl(220, 20%, 15%)',
    }
    // backgroundColor: 'hsl(0, 0%, 10%)',
}

const dusk = {
    "0": {
        backgroundColor: 'hsl(220, 20%, 20%)',
    },
    "1": {
        backgroundColor: 'hsl(220, 20%, 15%)',
    }
    // backgroundColor: 'hsl(0, 0%, 20%)',
}

const dawn = {
    "0": {
        backgroundColor: 'hsl(220, 20%, 20%)',
    },
    "1": {
        backgroundColor: 'hsl(220, 20%, 15%)',
    }
    // backgroundColor: 'hsl(0, 0%, 70%)',
}

const light = {
    "0": {
        backgroundColor: 'hsl(220, 20%, 20%)',
    },
    "1": {
        backgroundColor: 'hsl(220, 20%, 15%)',
    }
    // backgroundColor: 'hsl(0, 0%, 100%)',
}

const ponton = {
    "0": {
        backgroundColor: 'hsl(220, 20%, 20%)',
    },
    "1": {
        backgroundColor: 'hsl(220, 20%, 15%)',
    },
    "2": {
        backgroundColor: 'hsl(220, 20%, 10%)',
    },
}

const jaune = {
    "0": {
        backgroundColor: 'hsl(220, 20%, 20%)',
    },
    "1": {
        backgroundColor: 'hsl(220, 20%, 15%)',
    }
    // backgroundColor: 'hsl(35, 90%, 45%)',
}

const furor = {
    "0": {
        backgroundColor: 'hsl(220, 20%, 20%)',
    },
    "1": {
        backgroundColor: 'hsl(360, 90%, 25%)',
    }
    // backgroundColor: 'hsl(360, 90%, 30%)',
}


export const themes: Themes = {
    night,
    dusk,
    dawn,
    light,
    ponton,
    jaune,
    furor,
}
