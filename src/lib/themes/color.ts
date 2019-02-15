interface ColorElements {
    hue: number,
    saturation: number,
    lightness: number,
}


/**
 * Extract from color,
 * e.g. 'hsl(220, 20%, 40%)', or 'rgb(82, 95, 122)', or '#525f7a',
 * the hue = 220
 * the saturation = 20
 * the lightness = 40
 *
 * @param   color
 * @returns object  The HSL representation
 */
export function getColorElements(color: string): ColorElements {
    const hslRegex: RegExp = /hsl/;
    const rgbRegex: RegExp = /rgb/;
    const hexRegex: RegExp = /#/
    let hue = 220;
    let saturation = 20;
    let lightness = 40;

    if (hslRegex.test(color)) {
        try {
            const hueRegex: RegExp = /\((\d+\.?\d{0,2})/;
            const saturationRegex: RegExp = /\(\d+\.?\d{0,2},\s?(\d+\.?\d?)/;
            const lightnessRegex: RegExp = /\(\d+\.?\d{0,2},\s?\d+\.?\d{0,2}%,\s?(\d+\.?\d{0,2})/;

            hue = parseFloat(color.match(hueRegex)![1]);
            saturation = parseFloat(color.match(saturationRegex)![1]);
            lightness = parseFloat(color.match(lightnessRegex)![1]);
            console.log('hsl', hue);
        } catch (err) {
            const humanErrorMessage = `\nColor representation not adequate.\nAdequate HSL examples: "hsl(220, 20%, 40%)" or "hsl(220.01, 20.10%, 40.99%)".\n\n`
            console.log(humanErrorMessage, err);
        }
    }

    if (rgbRegex.test(color)) {
        try {
            const redRegex: RegExp = /^rgb\((\d+)/;
            const greenRegex: RegExp = /^rgb\(\d+\s?,\s?(\d+)/;
            const blueRegex: RegExp = /^rgb\(\d+\s?,\s?\d+\s?,\s?(\d+)/;
            const red = parseInt(color.match(redRegex)![1]);
            const green = parseInt(color.match(greenRegex)![1]);
            const blue = parseInt(color.match(blueRegex)![1]);
            const { h, s, l } = rgbToHsl(red, green, blue);

            hue = h;
            saturation = s;
            lightness = l;
        } catch (err) {
            const humanErrorMessage = `\nColor representation not adequate.\nAdequate RGB example: "rgb(82, 95, 122)".\n\n`
            console.log(humanErrorMessage, err);
        }
    }

    if (hexRegex.test(color)) {
        try {
            const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
            const red = parseInt(match![1], 16);
            const green = parseInt(match![2], 16);
            const blue = parseInt(match![3], 16);
            const { h, s, l } = rgbToHsl(red, green, blue);

            hue = h;
            saturation = s;
            lightness = l;
        } catch (err) {
            const humanErrorMessage = `\nColor representation not adequate.\nAdequate HEX example: "#525f7a".\nSimple form, e.g. "#557", NOT supported.\n\n`
            console.log(humanErrorMessage, err);
        }
    }


    return {
        hue,
        saturation,
        lightness,
    }
}



/**
 * Adapted from https://gist.github.com/mjackson/5311256.
 *
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l.
 *
 * @param   red
 * @param   green
 * @param   blue
 * @returns object  The HSL representation
 */
function rgbToHsl(red: number, green: number, blue: number) {
    red /= 255;
    green /= 255
    blue /= 255;

    let max = Math.max(red, green, blue);
    let min = Math.min(red, green, blue);
    let h = (max + min) / 2;
    let s = (max + min) / 2;
    let l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case red: h = (green - blue) / d + (green < blue ? 6 : 0); break;
            case green: h = (blue - red) / d + 2; break;
            case blue: h = (red - green) / d + 4; break;
        }

        h /= 6;
    }

    h = parseFloat((h * 360).toFixed(2));
    s = parseFloat((s * 100).toFixed(2));
    l = parseFloat((l * 100).toFixed(2));

    return {
        h,
        s,
        l,
    };
}
