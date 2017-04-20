'use strict';
import React, {Component} from 'react';
import {Actions} from 'react-native-router-flux';
import {
    AsyncStorage,
    View,
    ActivityIndicator,
    Image
} from 'react-native';


export default class InitialPage extends Component {

    constructor(props){
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <View style={{flex: 1,justifyContent: "center",alignItems: "center"}}>
                <Image source={require("./../images/travel.png")}/>
                <ActivityIndicator
                    size="large"
                    color="#aa3300"
                />
            </View>
        );
    }
componentDidMount(){
    //Check if userData is stored on device else open Login
    setTimeout(()=>{
        AsyncStorage.getItem('userData').then((user_data_json) => {
            let userData = JSON.parse(user_data_json);
            if(userData !== null){
                Actions.welcomePage();
            }else{
                Actions.login();
            }
        });
    },2000);
}
}