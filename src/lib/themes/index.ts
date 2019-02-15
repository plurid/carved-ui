import { getColorElements } from './color';
import { shadowPositioning } from './shadow';
import { DEPTH_LEVELS } from './constants';



export interface Themes {
    [key: string]: Theme
}

export interface Theme {
    [key: string]: ThemeLevel,
}

export interface ThemeLevel {
    backgroundColor: string,
    shadowPosition: string,
    textColor: string,
}



/**
 * Creates a Theme with DEPTH_LEVELS based on a single color.
 *
 * @param themeParameters contains
 * color                        Base color of the theme.
 * depthDifference              Difference between depth levels, from 0 to 1 (default: 0.3).
 * lightnessInversionLimit      Inversion limit for text color lightness (default: 50).
 * lightnessInversionLow        Value if under inversion limit (default: 10).
 * lightnessInversionHigh       Value if over inversion limit (default: 90).
 * shadowAngle
 * shadowDistance
 */
export function createTheme(themeParameters: any): Theme {
    const {
        themeColor,
        depthDifference,
        lightnessInversionLimit,
        lightnessInversionLow,
        lightnessInversionHigh,
        shadowAngle,
        shadowDistance,
    } = themeParameters

    const depthDiff = (depthDifference < 0) || (depthDifference > 1)
        ? 0.7
        : 1 - depthDifference;

    const theme: Theme = {};
    const { hue, saturation, lightness } = getColorElements(themeColor);

    for (let i = 0; i < DEPTH_LEVELS; i++) {
        const reducedLightness = i === 0
            ? lightness
            : Math.ceil(lightness * depthDiff ** i);
        const invertedLightness = reducedLightness > lightnessInversionLimit
            ? lightnessInversionLow
            : lightnessInversionHigh;

        const {
            horizontalShadowPosition,
            verticalShadowPosition
        } = shadowPositioning(shadowAngle, shadowDistance);

        (theme[i] as ThemeLevel) = {
            backgroundColor: `hsl(${hue}, ${saturation}%, ${reducedLightness}%)`,
            textColor: `hsl(0, 0%, ${invertedLightness}%)`,
            shadowPosition: `${horizontalShadowPosition}px ${verticalShadowPosition}px`,
        };
    }

    return theme;
}



export function getTheme(themeParameters: any) {
    const { defaultThemes, themeColor, depth } = themeParameters;

    let currentTheme: Theme;
    let currentThemeLevel: ThemeLevel;
    const hslRegex: RegExp = /^hsl/;
    const rgbRegex: RegExp = /^rgb/;
    const hexRegex: RegExp = /^#/;
    const depthLevel: string = parseInt(depth) <= 5 ? depth : '5';

    currentTheme = defaultThemes['ponton'];

    try {
        if (
            hslRegex.test(themeColor)
            || rgbRegex.test(themeColor)
            || hexRegex.test(themeColor)
        ) {
            currentTheme = createTheme(themeParameters);
        } else {
            currentTheme = defaultThemes[themeColor];
        }
    } catch (err) {
        const humanErrorMessage = `\nTheme string not adequate.\nAdequate theme examples: color strings "hsl(220, 20%, 40%)", "rgb(82, 95, 122)", "#525f7a", or default themes words: "night", "dusk", "dawn", "light", "ponton", "jaune", "furor".\n\n`
        console.log(humanErrorMessage, err);
    }

    currentThemeLevel = currentTheme[depthLevel];

    return {
        currentTheme,
        currentThemeLevel,
    };
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
    const themes: Themes = {};
    for (let theme of defaultThemes) {
        themes[theme.name] = createTheme(theme.color);
    }
    return themes;
}
