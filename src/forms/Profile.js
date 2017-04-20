import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ToastAndroid,
    AsyncStorage,
    Button,
    Image,
    TextInput
    } from 'react-native';
import Menu from "../main/Menu";
import {firebaseRef} from "../Firebase";

var FilePickerManager = require('NativeModules').FilePickerManager;

export default class Profile extends Menu {

    constructor(props) {
        super(props);
        this.state = {
            userData: null,
            name: null,
            email: null,
            photoUrl: null
        }


    }

    renderContent() {
        return (
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <Image
                        style={{width: 100, height: 100}}
                        source={this.state.photoUrl === null?require("../images/profile.png"):{uri: this.state.photoUrl}}/>
                    <Button
                        onPress={this._onPressPhoto.bind(this)}
                        title="Please Click To Select Image"
                        color="#337ab7"
                        accessibilityLabel="Select Image From Device"
                    />

                </View>
                <View>
                    <View style={styles.loginContainer}>
                        <TextInput
                            placeholder="EMAIL"
                            value={this.state.email}
                            returnKeyType="next"
                            onChangeText={(text) => this.setState({email: text})}
                            keyboardType="email-address"
                            placeholderTextColor="#000000"
                            style={styles.input}
                            autoCapitalize="none"
                            autoCorrect={false}/>
                        <TextInput
                            placeholder="NAME"
                            value={this.state.name}
                            returnKeyType="done"
                            onChangeText={(text) => this.setState({name: text})}
                            placeholderTextColor="#000000"
                            style={styles.input}
                            autoCapitalize="none"
                            autoCorrect={false}/>

                        <TouchableOpacity style={styles.buttonContainer} onPress={() => this._updateEmail()}>
                            <Text style={styles.loginButton}>Update Profil</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }


    _updateEmail() {
        var user = firebaseRef.auth().currentUser;

        console.log("user",user);
        if (this.state.email === null) {
            user.updateEmail(this.state.email).then(function () {
                if ((this.state.name && this.state.photoUrl) === null) {
                    this._updateProfil();
                }else return false;
            }, function (error) {
                console.log(error);
            });
        }
        else {
            this._updateProfil();
        }
    }

    _updateProfil() {
        var user = firebaseRef.auth().currentUser;

        user.updateProfile({
            displayName: this.state.name,
            photoURL: this.state.photoUrl
        }).then(function () {
            ToastAndroid.showWithGravity("Update successful", ToastAndroid.SHORT, ToastAndroid.CENTER);
        }, function (error) {
            console.log(error)
        });
    }

    _onPressPhoto() {
        const options = {
            title: 'File Picker',
            chooseFileButtonTitle: 'Choose File...'
        };

        FilePickerManager.showFilePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled photo picker');
            }
            else if (response.error) {
                console.log('ImagePickerManager Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                if (response) {
                    if ((response.path).replace(/^.*[\\\/]/, '').slice(-4) ===  ".png"||".jpg") {
                        this.setState({
                            photoUrl: response.uri
                        });
                    }
                    else {
                        ToastAndroid.showWithGravity("Selected file is not a png or jpg file", ToastAndroid.LONG, ToastAndroid.TOP);
                        return null;
                    }
                }
            }
        });
    }

    _renderProfil() {
        var user = firebaseRef.auth().currentUser;

        if (user !== null) {
            this.setState({
                name: user.displayName || "Name",
                email: user.email,
                photoUrl: user.photoURL
            });

        }
    }

    componentDidMount() {
        this._renderProfil();
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fbfaff"
    },
    logoContainer: {
        alignItems: "center",
        flexGrow: 1,
        justifyContent: "center"
    },
    title: {
        color: "#000000",
        marginTop: 10,
        width: 160,
        textAlign: "center",
        opacity: 0.9
    },
    //login
    loginContainer: {
        padding: 20,
    },
    input: {
        height: 40,
        marginBottom: 10,
        color: "#000000",
        paddingHorizontal: 10
    },
    buttonContainer: {
        backgroundColor: "#fbfaff",
        paddingVertical: 15,
        borderWidth: 0.8,
        borderRadius: 30
    },
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