import * as React from 'react'
import { Component } from 'react';
import { CarvedMenuBar } from 'carved-react';
import { CarvedFjord } from 'carved-react';



class App extends Component {
    render() {
        return (
            <div className="App">
                <CarvedMenuBar>
                    App
                </CarvedMenuBar>

                <div style={ { margin: '100px 0' } }>
                    <CarvedFjord>
                        <div>
                            Lorem, ipsum dolor<br /><br /><br /><br /> sit amet consectetur adipisicing elit. Voluptates quis voluptatibus fuga deleniti alias nobis iusto incidunt sint doloremque saepe, molestiae velit ab odit repellat dicta! Inventore minima a asperiores?
                        </div>
                    </CarvedFjord>

                    <carved-input type="text" label="Name" placeholder="John" />
                </div>
            </div>
        );
    }
}

export default App;
