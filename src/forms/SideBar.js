'use strict';
import React, {Component} from 'react';
import {
    AsyncStorage,
    View,
    ToastAndroid,
    TouchableOpacity,
    Image
} from 'react-native';
import {Button, Container,Text} from "native-base";
import Icon from "react-native-vector-icons/Ionicons";
import {Actions} from "react-native-router-flux";
import {firebaseRef} from "../Firebase";
import Dimensions from "Dimensions";

const {height, width} = Dimensions.get('window');



export default class SideBar extends Component {

    constructor(props){
        super(props);
        this.state = {
            name: null,
            email: null,
            photoUrl: null
        }
    }

    render() {
        console.log("this.state",this.state);

        return (
            <View style={{backgroundColor: "#fbfaff", width: width / 1.2, height: height,flexDirection: "column"}}>

               <View style={{flexDirection: "row"}}>
                   <TouchableOpacity onPress={() => Actions.profile()}>
                       <Image
                           style={{width: 50, height: 50,borderRadius: 30}}
                           source={this.state.photoUrl === null?require("../images/profile.png"):{uri: this.state.photoUrl}}/>
                   </TouchableOpacity>
                <View>
                <Text>{this.state.name}</Text>
                <Text>{this.state.email}</Text>
                </View>
               </View>

                <TouchableOpacity onPress={() => Actions.profile()}>
                <Text>Profile</Text>
                </TouchableOpacity>
                <Button transparent onPress={()=>this._logOut()}><Icon size={25} color="black" name='md-log-out'/></Button>

            </View>
        );
    }

    _logOut(){
        console.log("tıklandı");
        AsyncStorage.removeItem('userData').then(() => {
            firebaseRef.auth().signOut().then(function() {
                Actions.login();
            }).catch(function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;

                ToastAndroid.showWithGravity(errorCode, ToastAndroid.SHORT, ToastAndroid.CENTER);
            });
        });

    }

    _renderProfile(){
        firebaseRef.auth().onAuthStateChanged((user1)=> {
            if (user1) {
                var user = firebaseRef.auth().currentUser;
                if (user !== null) {
                    this.setState({
                        name: user.displayName || "Name",
                        email: user.email,
                        photoUrl: user.photoURL
                    });

                }
            } else {
                // No user is signed in.
            }
        });
    }
    componentDidMount(){
        this._renderProfile();
    }
}