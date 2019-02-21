import styled from 'styled-components';



export const StyledCarvedMenuItem = styled.div`
    align-items: center;
    background-color: transparent;
    box-shadow: none;
    color: ${props => {
        const { currentTheme, depth, decrementDepth } = props.theme;
        if (parseInt(decrementDepth(depth)) > 0) {
            return currentTheme[decrementDepth(depth)].textColor;
        } else {
            return currentTheme[depth].textColor;
        }
    }};
    cursor: pointer;
    display: grid;
    grid-template-columns: ${props => {
        let val = '';
        props.theme.component.hasPreIcon === true ? val += '30px ' : val += '';
        val += 'auto ';
        props.theme.component.hasPostIcon === true ? val += '30px ' : val += '';
        return val;
    }};
    font-size: 0.9rem;
    justify-items: center;
    position: relative;
    height: ${props => {
        let val;
        props.theme.component.pill === true ? val = '36px' : val = '100%';
        return val;
    }};
    border-radius: ${props => {
        let val;
        props.theme.component.pill === true ? val = '10000px' : val = '0px';
        return val;
    }};
    min-width: 60px;
    padding: 0 15px;
    text-align: center;
    user-select: none;


    /* TODO focus needs behavior */
    /* :focus {
        outline-offset: -1px;
        outline: 1px solid ${props =>  {
            const { currentTheme, depth } = props.theme;
            return currentTheme[depth].textColor;
        }};
    } */

    :hover {
        background-color: ${props =>  {
            const { currentTheme, depth, decrementDepth,  } = props.theme;
            if (parseInt(decrementDepth(depth)) > 0) {
                return currentTheme[decrementDepth(depth)].backgroundColor;
            } else {
                return currentTheme[depth].backgroundColor;
            }
        }};
        box-shadow: ${props => {
                        const val = props.theme.component.decarved === true ? '' : 'inset';
                        return val;
                    }} ${props => {
                            const { currentTheme, depth } = props.theme;
                            return currentTheme[depth].shadowPosition;
                        }} 10px 0 rgba(0, 0, 0, 0.5),
                    ${props => {
                        const val = props.theme.component.decarved === true ? '' : 'inset';
                        return val;
                    }} 0px -1px 10px -3px rgba(0, 0, 0, 0.5),
                    ${props => {
                        const val = props.theme.component.decarved === true ? '' : 'inset';
                        return val;
                    }} 0px 1px 10px -3px rgba(0, 0, 0, 0.5);

        .expand {
            display: block;
        }

        .tooltip {
            display: block;
        }
    }

    .expand::before {
        position: absolute;
        content: '';
        right: 20px;

        top: ${props => {
            const val = props.theme.component.pill === true ? '-12px' : '-10px';
            return val;
        }};
        height: 10px;
        width: 20px;

        border-left: 10px solid transparent;
        border-right: 10px solid transparent;

        border-bottom: ${props => {
                            const val = props.theme.component.pill === true ? '12px' : '10px';
                            return val;
                        }}
                        solid
                        ${props =>  {
                            const { currentTheme, depth, decrementDepth,  } = props.theme;
                            if (parseInt(decrementDepth(depth)) > 0) {
                                return currentTheme[decrementDepth(depth)].backgroundColor;
                            } else {
                                return currentTheme[depth].backgroundColor;
                            }
                        }};
    }

    .expand::after {
        position: absolute;
        content: '';
        right: 0;
        top: ${props => {
            const val = props.theme.component.pill === true ? '-12px' : '-10px';
            return val;
        }};
        height: ${props => {
            const val = props.theme.component.pill === true ? '12px' : '10px';
            return val;
        }};
        width: 100%;
    }

    .expand {
        cursor: default;
        display: none;
        z-index: 1000;
        position: absolute;
        top: ${props => {
            const val = props.theme.component.pill === true ? '48px' : '70px';
            return val;
        }};
        right: 0;
        min-width: 200px;
        background-color: ${props =>  {
            const { currentTheme, depth, decrementDepth } = props.theme;
            return currentTheme[decrementDepth(depth)].backgroundColor;
        }};
        /* background-color: inherit; */
        box-shadow: inherit;
    }

    .preIcon {
        justify-self: left;
    }

    .postIcon {
        justify-self: right;
    }

    .tooltip {
        display: none;
        position: absolute;
        z-index: 1000;
        padding: 10px;
        top: ${props => {
            return props.theme.component.pill === true ? '60px' : '70px';
        }};
        background-color: ${props =>  {
            const { currentTheme, depth, decrementDepth } = props.theme;
            return currentTheme[decrementDepth(depth)].backgroundColor;
        }};
        box-shadow: inherit;
    }
`;
