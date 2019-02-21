import React, { Component } from "react";
import styled from 'styled-components';
import classNames from 'classnames/bind';

import uuid from 'uuid/v4';

import CarvedDots from '../../icons/CarvedDots';



const styles = require('./styles.module.scss')

const cx = classNames.bind(styles);


const StyledCarvedSelector = styled.span`
    position: relative;
    flex-direction: column;
    padding: 0px 0;
    width: 100%;
    height: 100%;
    max-width: 200px;
    max-height: 60px;
    user-select: none;
    align-items: center;
    justify-content: center;
    display: inline-flex;
    text-align: left;
    cursor: pointer;
`;





interface Selector {
    value: string,
    label: string,
}

interface CarvedSelectorProperties {
    style?: object,
    expand?: string,
    expanded?: string,
    initial?: string,
    noneText?: string,
    selectors: Array<Selector>
}

enum Direction {
    Up = 'UP',
    Down = 'DOWN',
    Left = 'LEFT',
    Right = 'RIGHT',
}

interface CarvedSelectorState {
    expand: string,
    expanded: boolean,
    selected: number,
}


class CarvedSelector extends Component<CarvedSelectorProperties, CarvedSelectorState> {
    constructor(props: CarvedSelectorProperties) {
        super(props);

        const { expand, expanded, selectors } = this.props;

        const initialSelected = this.initialSelect()

        this.state = {
            expand: expand ? expand.toUpperCase() : Direction.Down,
            expanded: expanded ? !!expanded : false,
            selected: initialSelected,
        };

        // console.log(selectors);
        // console.log(this.state);
    }

    initialSelect() {
        const { initial, selectors } = this.props;

        if (initial === 'none') {
            return -1;
        }

        if (initial) {
            const init = parseInt(initial);

            if (Number.isInteger(init)) {
                if (init > selectors.length) {
                    return 0;
                }
                return init;
            }

            return 0;
        }

        return 0;
    }

    expand = () => {
        this.setState(previousState => (
            { expanded: !previousState.expanded }
        ));
    }

    setSelector = (index: number) => {
        this.setState({
            selected: index
        });
    }

    render() {
        const { selected, expanded } = this.state
        const { selectors, noneText, style } = this.props;

        const currentSelection = (
            <span
                className={ cx(styles.carvedSelectorItem, styles.carvedSelectorCurrent ) }
            >
                {
                selected !== -1
                    ? selectors[selected].label
                    : noneText? noneText : 'None'
                }
                <span className={ cx(styles.dots) }>
                    <CarvedDots />
                </span>
            </span>
        );

        return (
            <StyledCarvedSelector
                style={style}
                onClick={this.expand}
            >
                {currentSelection}

                {expanded && (
                    <span
                        className={ cx(styles.carvedSelectorItemsWrapper) }
                    >
                        <span
                            className={ cx(styles.carvedSelectorItems) }
                        >
                            {currentSelection}
                            {selectors.map((selector, index) => {
                                const { value, label } = selector;

                                if (index === selected) {
                                    return null;
                                }

                                return (
                                    <span
                                        key={uuid()}
                                        className={ cx(styles.carvedSelectorItem) }
                                        onClick={this.setSelector.bind(this, index)}
                                    >
                                        {label}
                                    </span>
                                );
                            })}
                        </span>
                    </span>
                )}
            </StyledCarvedSelector>
        );
    }
}

export default CarvedSelector;
