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
    TextInput,
    Keyboard
} from 'react-native';
import Menu from "../main/Menu";
import {firebaseRef} from "../Firebase";
import RNFetchBlob from 'react-native-fetch-blob';

var FilePickerManager = require('NativeModules').FilePickerManager;

export default class Profile extends Menu {

    constructor(props) {
        super(props);
        this.state = {
            userData: null,
            name: null,
            email: null,
            photoUrl: null,
            newPhotoUrl: null,
            password: null
        }


    }

    renderContent() {
        return (
            <View style={styles.profilContainer}>

                <View style={styles.logoContainer}>
                    <Image
                        style={{width: 120, height: 120, marginBottom: 10}}
                        source={this.state.photoUrl === null ? require("../images/profile.png") : {uri: this.state.newPhotoUrl}}/>

                    <TouchableOpacity style={styles.photoButtonContainer} onPress={() => this._onPressPhoto()}>
                        <Text style={styles.photoButtonText}>Select Image</Text>
                    </TouchableOpacity>

                </View>

                <View>
                    <View style={styles.formContainer}>
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
                            returnKeyType="next"
                            onChangeText={(text) => this.setState({name: text})}
                            placeholderTextColor="#000000"
                            style={styles.input}
                            autoCapitalize="none"
                            autoCorrect={false}/>
                        <TextInput
                            placeholder="PASSWORD"
                            value={this.state.password}
                            returnKeyType="done"
                            onChangeText={(text) => this.setState({password: text})}
                            placeholderTextColor="#000000"
                            style={styles.input}
                            autoCapitalize="none"
                            secureTextEntry={true}
                            autoCorrect={false}/>


                        <TouchableOpacity style={styles.buttonContainer} onPress={() => this._updateProfil()}>
                            <Text style={styles.updateButton}>Update Profil</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }


    _updateProfil() {
        var user = firebaseRef.auth().currentUser;

        console.log(user);

        //Update Email
        user.updateEmail(this.state.email).then(() => {
        }, (error) => {
            var errorMessage = error.message;
            console.log("",errorMessage)
            ToastAndroid.showWithGravity(errorMessage, ToastAndroid.SHORT, ToastAndroid.CENTER);
        });

        //Update Password
        if (this.state.password !== null) {
            user.updatePassword(this.state.password).then( ()=> {
                ToastAndroid.showWithGravity("pass successful", ToastAndroid.LONG, ToastAndroid.CENTER);
                this.setState({password: null});
            }, function (error) {
                var errorMessage = error.message;
            });
        }
        //Update Name and Photo
        user.updateProfile({
            displayName: this.state.name,
            photoURL: this.state.newPhotoUrl
        }).then( () =>{
            ToastAndroid.showWithGravity("Update successful", ToastAndroid.SHORT, ToastAndroid.CENTER);
        }, (error) => {
            var errorMessage = error.message;
            console.log("",errorMessage);
            ToastAndroid.showWithGravity(errorMessage,ToastAndroid.SHORT, ToastAndroid.CENTER);
        });
        Keyboard.dismiss();
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
                    if ((response.path).replace(/^.*[\\\/]/, '').slice(-4) === ".png" || ".jpg") {
                        this.setState({
                            newPhotoUrl: response.uri
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

    _checkPhotoExist=()=> {
        RNFetchBlob.fs.exists(this.state.photoUrl)
            .then((exist) => {
                if (exist === true)
                    this.setState({newPhotoUrl: this.state.photoUrl});
                else
                    this.setState({newPhotoUrl: "https://img.clipartfest.com/5a68d99cd467003c04b4ef64004c4313_download-this-image-as-profile-clipart_600-557.png"});
            })
    };

    _renderProfil=()=> {
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
        this._renderProfil();
    }

}

const styles = StyleSheet.create({
    profilContainer: {
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

    formContainer: {
        padding: 20
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
    photoButtonContainer: {
        backgroundColor: "#80CBC4",
        width: 200,
        paddingVertical: 15,
        borderWidth: 0.8,
        borderRadius: 5
    },
    photoButtonText: {
        textAlign: "center",
        color: "#ffffff",
        fontWeight: "700"
    },
    updateButton: {
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