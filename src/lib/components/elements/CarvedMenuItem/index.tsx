import React, { Component } from "react";

import {
    CarvedMenuItemProperties,
    CarvedMenuItemState,
} from './interfaces';
import {
    ICON_DEFAULT_WIDTH,
    ICON_DEFAULT_HEIGHT,
    PRE_ICON_DEFAULT_ALT,
    POST_ICON_DEFAULT_ALT,
} from './defaults';
import { StyledCarvedMenuItem } from './styled';
import { ThemeContext } from '../../app/CarvedApp';



class CarvedMenuItem extends Component<Partial<CarvedMenuItemProperties>, CarvedMenuItemState> {
    public static defaultProps = {
        decarved: false,
        pill: false,
    };

    static contextType = ThemeContext;

    constructor(props: CarvedMenuItemProperties) {
        super(props);

        const { theme, depth, depthComputed, themeComputed, decarved, pill, preIcon, postIcon } = this.props;

        this.state = {
            depth: depth || depthComputed || '0',
            theme: theme || themeComputed || 'ponton',
            decarved: decarved ? true : false,
            pill: pill ? true : false,
            hasPreIcon: preIcon ? true : false,
            hasPostIcon: postIcon ? true : false,
            showTooltip: false,
        };
    }

    onMouseEnter = () => {
        const { tooltip } = this.props;
        if (tooltip) {
            const { tooltipDelay } = this.props;
            let delay = 700;
            if (tooltipDelay) {
                delay = typeof tooltipDelay === 'string'
                    ? parseInt(tooltipDelay)
                    : tooltipDelay;
            }
            setTimeout(() => {
                this.setState( {
                    showTooltip: true
                });
            }, delay);
        }
    }

    onMouseLeave = () => {
        const { tooltip } = this.props;
        if (tooltip) {
            this.setState( {
               showTooltip: false
           });
        }
    }

    render() {
        const {
            children,
            expand,
            preIcon,
            preIconAlt,
            preIconStyle,
            preIconHeight,
            preIconWidth,
            postIcon,
            postIconAlt,
            postIconStyle,
            postIconHeight,
            postIconWidth,
            tooltip,
         } = this.props;

        const {
            depth,
            decarved,
            pill,
            hasPreIcon,
            hasPostIcon,
            showTooltip,
        } = this.state;

        const context = { ...this.context };
        context.depth = depth;
        context.component = {
            decarved,
            pill,
            hasPreIcon,
            hasPostIcon,
        };

        let expandWithProps;
        if (expand) {
            expandWithProps = React.Children.map(expand, child =>
                React.cloneElement(child, { depth: depth })
            );
        }

        return (
            <StyledCarvedMenuItem
                role="button"
                theme={context}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
            >
                {preIcon &&
                    <img
                        className="preIcon"
                        src={preIcon}
                        style={preIconStyle}
                        alt={preIconAlt || PRE_ICON_DEFAULT_ALT}
                        height={preIconHeight || preIconWidth || ICON_DEFAULT_HEIGHT}
                        width={preIconWidth || preIconHeight || ICON_DEFAULT_WIDTH}
                    />
                }
                {children}
                {postIcon &&
                    <img
                        className="postIcon"
                        src={postIcon}
                        style={postIconStyle}
                        alt={postIconAlt || POST_ICON_DEFAULT_ALT}
                        height={postIconHeight || postIconWidth || ICON_DEFAULT_HEIGHT}
                        width={postIconWidth || postIconHeight || ICON_DEFAULT_WIDTH}
                    />
                }

                {tooltip && showTooltip &&
                    <span className="tooltip">
                        {tooltip}
                    </span>
                }

                {expandWithProps &&
                    <span className="expand">
                        {expandWithProps}
                    </span>
                }
            </StyledCarvedMenuItem>
        );
    }
}

export default CarvedMenuItem;
