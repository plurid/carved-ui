import * as React from 'react'
import { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import CarvedTest from './components/pages/CarvedTest';
import CarvedTestMenuBar from './components/pages/CarvedTestMenuBar';



class App extends Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/" component={CarvedTestMenuBar} />
                    <Route exact path="/test" component={CarvedTest} />
                    <Route exact path="/test/menu-bar" component={CarvedTestMenuBar} />
                </Switch>
            </Router>
        );
    }
}

export default App;
