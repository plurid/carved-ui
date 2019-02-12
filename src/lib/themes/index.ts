import theme from "styled-theming";


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
        backgroundColor: 'hsl(220, 20%, 15%)',
    }
    // backgroundColor: 'hsl(360, 90%, 30%)',
}


export const themes: any = {
    night,
    dusk,
    dawn,
    light,
    ponton,
    jaune,
    furor,
}


export const backgroundColor = theme.variants('theme', 'depth', {
    night: {
        one: 'hsl(0, 0%, 10%)',
        two: 'hsl(0, 0%, 10%)',
        three: 'hsl(0, 0%, 10%)',
        four: 'hsl(0, 0%, 10%)',
        five: 'hsl(0, 0%, 10%)',
        six: 'hsl(0, 0%, 10%)',
    },
    dusk: {
        one: 'hsl(0, 0%, 20%)',
        two: 'hsl(0, 0%, 20%)',
        three: 'hsl(0, 0%, 20%)',
        four: 'hsl(0, 0%, 20%)',
        five: 'hsl(0, 0%, 20%)',
        six: 'hsl(0, 0%, 20%)',
    },
    dawn: {
        one: 'hsl(0, 0%, 70%)',
        two: 'hsl(0, 0%, 70%)',
        three: 'hsl(0, 0%, 70%)',
        four: 'hsl(0, 0%, 70%)',
        five: 'hsl(0, 0%, 70%)',
        six: 'hsl(0, 0%, 70%)',
    },
    light: {
        one: 'hsl(0, 0%, 100%)',
        two: 'hsl(0, 0%, 100%)',
        three: 'hsl(0, 0%, 100%)',
        four: 'hsl(0, 0%, 100%)',
        five: 'hsl(0, 0%, 100%)',
        six: 'hsl(0, 0%, 100%)',
    },
    ponton: {
        one: 'hsl(220, 20%, 20%)',
        two: 'hsl(220, 20%, 20%)',
        three: 'hsl(220, 20%, 20%)',
        four: 'hsl(220, 20%, 20%)',
        five: 'hsl(220, 20%, 20%)',
        six: 'hsl(220, 20%, 20%)',
    },
    jaune: {
        one: 'hsl(35, 90%, 45%)',
        two: 'blue',
        three: 'hsl(35, 90%, 45%)',
        four: 'hsl(35, 90%, 45%)',
        five: 'hsl(35, 90%, 45%)',
        six: 'hsl(35, 90%, 45%)',
    },
    furor: {
        one: 'hsl(360, 90%, 30%)',
        two: 'hsl(360, 90%, 30%)',
        three: 'hsl(360, 90%, 30%)',
        four: 'hsl(360, 90%, 30%)',
        five: 'hsl(360, 90%, 30%)',
        six: 'hsl(360, 90%, 30%)',
    }
});

// export const backgroundColor = theme('theme', {
//     night: 'hsl(0, 0%, 10%)',
//     dusk: 'hsl(0, 0%, 20%)',
//     dawn: 'hsl(0, 0%, 70%)',
//     light: 'hsl(0, 0%, 100%)',
//     ponton: 'hsl(220, 20%, 20%)',
//     jaune: 'hsl(35, 90%, 45%)',
//     furor: 'hsl(360, 90%, 30%)',
// });

export const color = theme('theme', {
    night: 'hsl(0, 0%, 50%)',
    dusk: 'hsl(0, 0%, 60%)',
    dawn: 'hsl(0, 0%, 90%)',
    light: 'hsl(0, 0%, 10%)',
    ponton: 'hsl(220, 20%, 80%)',
    jaune: 'hsl(35, 90%, 45%)',
    furor: 'hsl(360, 90%, 30%)',
});
