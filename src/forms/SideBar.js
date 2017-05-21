'use strict';
import React, {Component} from 'react';
import {
    AsyncStorage,
    View,
    ToastAndroid,
    TouchableOpacity,
    Image,
    StyleSheet,
    Text,
    Switch
} from 'react-native';
import {Button, Container} from "native-base";
import Icon from "react-native-vector-icons/Ionicons";
import {Actions} from "react-native-router-flux";
import {firebaseRef} from "../Firebase";
import Dimensions from "Dimensions";
import RNFetchBlob from 'react-native-fetch-blob';

const {height, width} = Dimensions.get('window');


export default class SideBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: null,
            email: null,
            photoUrl: null,
            switch: false
        }

    }

    render() {
        return (
            <View style={{backgroundColor: "#B2DFDB", width: width / 1.2, height: height, flexDirection: "column"}}>

                <View style={{flexDirection: "column", padding: 20}}>

                    <TouchableOpacity style={{width: 100}} onPress={() => Actions.profile()}>
                        <Image
                            style={{width: 70, height: 70, borderRadius: 35}}
                            source={this.state.photoUrl === null ? require("../images/profile.png") : {uri: this.state.photoUrl}}/>
                    </TouchableOpacity>

                    <View style={{marginTop: 10}}>
                        <Text
                            style={styles.profileText}>{(this.state.name === null) ? null : (this.state.name).toUpperCase()}</Text>
                        <Text
                            style={styles.profileText}>{(this.state.email === null) ? null : (this.state.email).toUpperCase()}</Text>
                    </View>
                </View>

                <View style={styles.list}>

                    <TouchableOpacity style={styles.touchable} onPress={() => Actions.profile()}>
                        <Icon style={{marginRight: 25}} size={25} color="grey" name='md-person'/>
                        <Text style={styles.listText}>Profile</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.touchable} onPress={() => Actions.hotelsearch()}>
                        <Icon style={{marginRight: 25}} size={25} color="grey" name='md-search'/>
                        <Text style={styles.listText}>Hotel Search</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.touchable} onPress={() => this._logOut()}>
                        <Icon style={{marginRight: 25}} size={25} color="grey" name='md-log-out'/>
                        <Text style={styles.listText}>Log Out</Text>
                    </TouchableOpacity>

                    <View style={{marginTop:5,flexDirection: "row",justifyContent:"space-between",alignItems:"center"}}>
                    <Text style={styles.listText}>Table Mode: </Text>
                        <Switch
                            onValueChange={(value) =>this.changeTheme(value)}
                            onTintColor="blue"
                            style={{marginTop: 10}}
                            thumbTintColor="white"
                            tintColor="gray"
                            value={this.state.switch}/>
                    </View>
                </View>
            </View>
        );
    }

    _logOut() {
        console.log("tıklandı");
        AsyncStorage.removeItem('userData').then(() => {
            firebaseRef.auth().signOut().then(function () {
                Actions.login();
            }).catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;

                ToastAndroid.showWithGravity(errorCode, ToastAndroid.SHORT, ToastAndroid.CENTER);
            });
        });

    }

    deneme(){
        Actions.pop();
    }
    _renderProfile() {
        firebaseRef.auth().onAuthStateChanged((user1) => {
            if (user1) {
                var user = firebaseRef.auth().currentUser;
                if (user !== null) {
                    this.setState({
                        name: user.displayName,
                        email: user.email,
                        photoUrl: user.photoURL
                    });
                }
            } else {
                // No user is signed in.
            }
        });
    };


    changeTheme(themeValue) {
        this.setState({switch: themeValue});
        AsyncStorage.setItem('themeValue', JSON.stringify(themeValue));
        Actions.initialPage();
    }

    // _loadInitialState = async () => {
    //     try {
    //         var value = await AsyncStorage.getItem("themeValue");
    //         if (value !== null){
    //             this.setState({switch: value});
    //         } else {
    //             this._appendMessage('Initialized with no selection on disk.');
    //         }
    //     } catch (error) {
    //         this._appendMessage('AsyncStorage error: ' + error.message);
    //     }
    // };
    componentDidMount() {
        this._renderProfile();
        // this._loadInitialState().done();
        AsyncStorage.getItem("themeValue", (err, value) => {
            let val = (value === "true");
            this.setState({switch: val})
        });
    }
}

const styles = StyleSheet.create({
    list: {
        flexDirection: "column",
        padding: 20,
        marginTop: 20

    },
    listText: {
        fontWeight: "300",
        fontSize: 16,
        color: "black",
        fontFamily: "Serif"
    },
    touchable: {
        flexDirection: "row",
        marginBottom: 15
    },
    profileText: {
        fontSize: 18,
    }


});