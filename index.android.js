'use strict';
import React, {Component} from 'react';
import {
    AppRegistry
} from 'react-native';
import { Router, Scene,ActionConst,Actions} from 'react-native-router-flux';


import Login from "./src/forms/Login";
import Register from "./src/forms/Register";
import WelcomePage from "./src/pages/WelcomePage";
import InitialPage from "./src/main/InitialPage";
import Profile from "./src/forms/Profile";
import CityContent from "./src/pages/CityContent";




export default class TravelAgency extends Component {

    constructor(props){
        super(props);

    }

    render() {
        return (
            <Router >
              <Scene key="root">
                <Scene key="initialPage" component={InitialPage} hideNavBar={true} initial={true}/>
                <Scene key="login" component={Login} hideNavBar={true} type={ActionConst.RESET} />
                <Scene key="register" component={Register} hideNavBar={true} type={ActionConst.RESET} />
                <Scene key="welcomePage" component={WelcomePage} hideNavBar={true} type={ActionConst.RESET} />
                <Scene key="profile" component={Profile} hideNavBar={true}/>
                <Scene key="citycontent" component={CityContent} hideNavBar={true}/>
              </Scene>
            </Router>
        )
    }
}

AppRegistry.registerComponent('TravelAgency', () => TravelAgency);