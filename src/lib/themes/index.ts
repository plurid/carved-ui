export interface Themes {
    [key: string]: Theme
}

export interface Theme {
    [key: string]: ThemeLevel,
}

export interface ThemeLevel {
    backgroundColor: string,
    textColor: string,
}



const DEPTH_LEVELS = 6;
const DEFAULT_THEME = 'ponton';
const DEFAULT_LEVEL = '0';


/**
 * Creates a Theme with DEPTH_LEVELS based on a single color.
 *
 * @param color Base color of the theme.
 * @param depthDifference Difference between depth levels, from 0 to 1 (default: 0.3).
 * @param lightnessInversionLimit Inversion limit for text color lightness (default: 50).
 * @param lightnessInversionLow Value if under inversion limit (default: 10).
 * @param lightnessInversionHigh Value if over inversion limit (default: 90).
 */
export function createTheme(
    color: string,
    depthDifference: number = 0.3,
    lightnessInversionLimit: number = 50,
    lightnessInversionLow: number = 10,
    lightnessInversionHigh: number = 90,
): Theme {
    const depthDiff = (depthDifference < 0) || (depthDifference > 1)
        ? 0.7
        : 1 - depthDifference;

    const theme: Theme = {};
    const { hue, saturation, lightness } = getColorElements(color);

    for (let i = 0; i < DEPTH_LEVELS; i++) {
        const reducedLightness = i === 0
            ? lightness
            : Math.ceil(lightness * depthDiff ** i);
        const invertedLightness = reducedLightness > lightnessInversionLimit
            ? lightnessInversionLow
            : lightnessInversionHigh;

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
export function getColorElements(color: string): ColorElements {
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



export function getTheme(
    themes: Themes,
    theme: string = DEFAULT_THEME,
    depth: string = DEFAULT_LEVEL,
    depthDifference: number = 0.3,
    lightnessInversionLimit: number = 50,
    lightnessInversionLow: number = 10,
    lightnessInversionHigh: number = 90,
) {
    let currentTheme: ThemeLevel;
    const hslRegex: RegExp = /hsl/;
    const depthLevel: string = parseInt(depth) <= 5 ? depth : '5';
    console.log('bbb', depthDifference);

    if (hslRegex.test(theme)) {
        currentTheme = createTheme(
            theme,
            depthDifference,
            lightnessInversionLimit,
            lightnessInversionLow,
            lightnessInversionHigh
        )[depthLevel];
    } else {
        currentTheme = themes[theme][depthLevel];
    }

    return currentTheme;
}





type DefaultTheme = {
    name: string;
    color: string;
}


const defaultThemes: DefaultTheme[] = [
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


export function createDefaultThemes(): Themes {
    const themes: Themes = {}
    for (let theme of defaultThemes) {
        themes[theme.name] = createTheme(theme.color);
    }
    return themes;
}
