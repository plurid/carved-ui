import { Component, Prop } from '@stencil/core';



@Component({
    tag: 'carved-button',
    styleUrl: 'carved-button.css',
    shadow: true
})
export class CarvedButton {
    @Prop() text: string;

    render() {
        return (
        <button class="carvedButton">
            {this.text}
        </button>
        );
    }
}
