import { Component, Prop } from '@stencil/core';



@Component({
    tag: 'carved-input',
    styleUrl: 'carved-input.css',
    shadow: true
})
export class MyComponent {
    @Prop() type: string;
    @Prop() label: string;
    @Prop() placeholder: string;

    render() {
        return (
            <div class="carvedInputContainer">
                    <span class="carvedLabel">
                        {this.label} <span class="carvedInputPlaceholder">{this.placeholder}</span>
                    </span>

                    <input
                        class="carvedInput"
                        type={this.type}
                    />
            </div>
        );
    }
}
