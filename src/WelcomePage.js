import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    AsyncStorage
} from 'react-native';
import {firebaseRef} from "./Firebase";
import Menu from "./main/Menu"



export default class WelcomePage extends Menu {

    constructor(props){
        super(props);
        this.state={
            userData: null
        }
    }

    renderContent() {
        return (
           <View>
               <Text>Hello</Text>

           </View>
        )
    }





    componentWillMount() {

        AsyncStorage.getItem('userData').then((user_data_json) => {
            let userData = JSON.parse(user_data_json);
            this.setState({
                userData: userData
            });
        });

    }
}
const styles = StyleSheet.create({
    loginButton: {
        textAlign: "center",
        color: "#000000",
        fontWeight: "700"
    },
    registerButton: {
        color: "#000000",
        marginTop: 50,
        opacity: 0.5
    },
});