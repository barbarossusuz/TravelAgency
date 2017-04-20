'use strict';
import React, {Component} from 'react';
import {
    AppRegistry
} from 'react-native';
import { Router, Scene} from 'react-native-router-flux';


import Login from "./src/forms/Login";
import Register from "./src/forms/Register";
import WelcomePage from "./src/WelcomePage";
import InitialPage from "./src/main/InitialPage";
import Profile from "./src/forms/Profile";





export default class TravelAgency extends Component {

    constructor(props){
        super(props);

    }

    render() {
        return (
            <Router >
              <Scene key="root">
                <Scene key="initialPage" component={InitialPage} hideNavBar={true} initial={true}/>
                <Scene key="login" component={Login} hideNavBar={true} />
                <Scene key="register" component={Register} hideNavBar={true}/>
                <Scene key="welcomePage" component={WelcomePage} hideNavBar={true}/>
                <Scene key="profile" component={Profile} hideNavBar={true}/>
              </Scene>
            </Router>
        )
    }
}

AppRegistry.registerComponent('TravelAgency', () => TravelAgency);