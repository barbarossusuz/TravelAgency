'use strict';
import React, {Component} from 'react';
import {
    AsyncStorage,
    View,
    ToastAndroid,
    TouchableOpacity,
    Image,
    StyleSheet,
    Text
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
            newPhotoUrl: null
        }

    }

    render() {
        return (
            <View style={{backgroundColor: "#E0F2F1", width: width / 1.2, height: height, flexDirection: "column"}}>

                <Button transparent onPress={this.props.closeToggle}><Icon size={25} color="black"
                                                                           name='md-menu'/></Button>

                <View style={{flexDirection: "column", padding: 20}}>

                    <TouchableOpacity style={{width: 100}} onPress={() => Actions.profile()}>
                        <Image
                            style={{width: 70, height: 70, borderRadius: 35}}
                            source={this.state.photoUrl === null ? require("../images/profile.png") : {uri:this.state.newPhotoUrl}}/>
                    </TouchableOpacity>

                    <View style={{marginTop: 10}}>
                        <Text style={styles.profileText}>{this.state.name}</Text>
                        <Text style={styles.profileText}>{this.state.email}</Text>
                    </View>
                </View>

                <View style={styles.list}>

                    <TouchableOpacity style={styles.touchable} onPress={() => Actions.profile()}>
                        <Icon style={{marginRight: 25}} size={25} color="grey" name='md-person'/>
                        <Text style={styles.listText}>Profile</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.touchable} onPress={() => Actions.profile()}>
                        <Icon style={{marginRight: 25}} size={25} color="grey" name='md-search'/>
                        <Text style={styles.listText}>Ara</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.touchable} onPress={() => this._logOut()}>
                        <Icon style={{marginRight: 25}} size={25} color="grey" name='md-log-out'/>
                        <Text style={styles.listText}>Log Out</Text>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }

    _checkPhotoExist=()=> {
        RNFetchBlob.fs.exists(this.state.photoUrl)
            .then((exist) => {
                if (exist===true)
                    this.setState({newPhotoUrl:this.state.photoUrl});
                else
                    this.setState({newPhotoUrl:"https://img.clipartfest.com/5a68d99cd467003c04b4ef64004c4313_download-this-image-as-profile-clipart_600-557.png"});
            })
    };

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

    _renderProfile=()=> {
        firebaseRef.auth().onAuthStateChanged((user1) => {
            if (user1) {
                var user = firebaseRef.auth().currentUser;
                if (user !== null) {
                    this.setState({
                        name: user.displayName || "Name",
                        email: user.email,
                        photoUrl: user.photoURL
                    });
                    this._checkPhotoExist();

                }
            } else {
                // No user is signed in.
            }
        });
    };

    componentWillMount() {
        this._renderProfile();
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
        marginBottom: 15,
        width: 100
    },
    profileText: {
        fontSize: 18,
    }


});