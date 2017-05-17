'use strict';
import React, {Component} from 'react';
import {
    AppRegistry
} from 'react-native';
import { Router, Scene,ActionConst,Actions} from 'react-native-router-flux';


import Login from "./src/forms/Login";
import Register from "./src/forms/Register";
import Country from "./src/pages/Country";
import InitialPage from "./src/main/InitialPage";
import Profile from "./src/forms/Profile";
import City from "./src/pages/City";
import Hotel from "./src/pages/Hotel";
import HotelDetails from "./src/pages/HotelDetails";
import HotelSearch from "./src/pages/HotelSearch";




export default class TravelAgency extends Component {

    constructor(props){
        super(props);

    }

    render() {
        return (
            <Router >
              <Scene key="root"  hideNavBar={true}>
                <Scene key="initialPage" component={InitialPage} initial={true}/>
                <Scene key="login" component={Login} type={ActionConst.RESET} />
                <Scene key="register" component={Register}  type={ActionConst.RESET} />
                <Scene key="welcomePage" component={Country} type={ActionConst.RESET} />
                <Scene key="profile" component={Profile} />
                <Scene key="city" component={City}/>
                <Scene key="hotel" component={Hotel} />
                <Scene key="hoteldetails" component={HotelDetails} />
                <Scene key="hotelsearch" component={HotelSearch} />
              </Scene>
            </Router>
        )
    }
}

AppRegistry.registerComponent('TravelAgency', () => TravelAgency);