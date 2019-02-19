import * as React from 'react'
import { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import CarvedTest from './components/pages/CarvedTest';



class App extends Component {
    render() {
        return (
            <Router>
                <Route path="/test" component={CarvedTest} />
            </Router>
        );
    }
}

export default App;
