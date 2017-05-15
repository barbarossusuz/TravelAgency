import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ToastAndroid,
    Image,
    TextInput,
    Keyboard
} from 'react-native';
import Menu from "../main/Menu";
import {firebaseRef} from "../Firebase";
import RNFetchBlob from 'react-native-fetch-blob';

var FilePickerManager = require('NativeModules').FilePickerManager;

const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;


export default class Profile extends Menu {

    constructor(props) {
        super(props);
        this.state = {
            userData: null,
            phName: null,
            name: null,
            phEmail: null,
            email: null,
            photoUrl: null,
            imageUri: null,
            password: null,
            rePassword: null,
            photoSelected: false
        }


    }

    renderContent() {
        return (
            <View style={styles.profilContainer}>

                <View style={styles.logoContainer}>
                    <Image
                        style={{width: 120, height: 120, marginBottom: 10}}
                        source={this.state.photoUrl === null ? require("../images/profile.png") : {uri: this.state.photoUrl}}/>

                    <TouchableOpacity style={styles.photoButtonContainer} onPress={() => this._onPressPhoto()}>
                        <Text style={styles.photoButtonText}>Select Image</Text>
                    </TouchableOpacity>

                </View>

                <View>
                    <View style={styles.formContainer}>
                        <TextInput
                            placeholder={this.state.phEmail}
                            returnKeyType="next"
                            onChangeText={(text) => this.setState({email: text})}
                            keyboardType="email-address"
                            placeholderTextColor="#BABABA"
                            style={styles.input}
                            autoCapitalize="none"
                            autoCorrect={false}/>
                        <TextInput
                            placeholder={this.state.phName}
                            returnKeyType="next"
                            onChangeText={(text) => this.setState({name: text})}
                            placeholderTextColor="#BABABA"
                            style={styles.input}
                            autoCapitalize="none"
                            autoCorrect={false}/>
                        <TextInput
                            placeholder="PASSWORD"
                            value={this.state.password}
                            returnKeyType="done"
                            onChangeText={(text) => this.setState({password: text})}
                            placeholderTextColor="#BABABA"
                            style={styles.input}
                            autoCapitalize="none"
                            secureTextEntry={true}
                            autoCorrect={false}/>
                        <TextInput
                            placeholder="CONFIRM PASSWORD"
                            value={this.state.password}
                            returnKeyType="done"
                            onChangeText={(text) => this.setState({rePassword: text})}
                            placeholderTextColor="#BABABA"
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


        //Update Email
        if (this.state.email !== null) {
            user.updateEmail(this.state.email).then(() => {
                ToastAndroid.showWithGravity("Update successful", ToastAndroid.SHORT, ToastAndroid.CENTER);
            }, (error) => {
                var errorMessage = error.message;
                console.log("", errorMessage);
                ToastAndroid.showWithGravity(errorMessage, ToastAndroid.SHORT, ToastAndroid.CENTER);
            });
        }


        //Update Name
        if (this.state.name !== null) {
            user.updateProfile({
                displayName: this.state.name
            }).then(() => {
                ToastAndroid.showWithGravity("Update successful", ToastAndroid.SHORT, ToastAndroid.CENTER);
            }, (error) => {
                var errorMessage = error.message;
                console.log("", errorMessage);
                ToastAndroid.showWithGravity(errorMessage, ToastAndroid.SHORT, ToastAndroid.CENTER);
            });
        }

        //Update Photo
        if (this.state.photoUrl !== null && this.state.photoSelected === true) {
            let uploadedPhotoUrl = this.uploadImage(this.state.photoUrl);
            uploadedPhotoUrl.then((url) => {
                user.updateProfile({
                    photoURL: url
                }).then(() => {
                    ToastAndroid.showWithGravity("Update successful", ToastAndroid.SHORT, ToastAndroid.CENTER);
                }, (error) => {
                    var errorMessage = error.message;
                    console.log("", errorMessage);
                    ToastAndroid.showWithGravity(errorMessage, ToastAndroid.SHORT, ToastAndroid.CENTER);
                });
            });
        }
        //Update Password
        if (this.state.password !== null) {
            if (this.state.password === this.state.rePassword) {
                user.updatePassword(this.state.password).then(() => {
                    ToastAndroid.showWithGravity("pass successful", ToastAndroid.LONG, ToastAndroid.CENTER);
                    firebaseRef.auth().signOut().then(function () {
                        Actions.login();
                    }).catch(function (error) {
                        var errorCode = error.code;
                        var errorMessage = error.message;

                        ToastAndroid.showWithGravity(errorCode, ToastAndroid.SHORT, ToastAndroid.CENTER);
                    });
                }, function (error) {
                    var errorMessage = error.message;
                });
            }
            else {
                ToastAndroid.showWithGravity("Passwords do not match!!", ToastAndroid.SHORT, ToastAndroid.CENTER);
            }
        }

        Keyboard.dismiss();
    }

    uploadImage(uri, mime = 'img/jpg') {

        return new Promise((resolve, reject) => {
            const uploadUri = uri;
            let uploadBlob = null;

            var user = firebaseRef.auth().currentUser;
            const imageRef = firebaseRef.storage().ref("userProfilePhoto/").child(user.uid + ".jpg");

            fs.readFile(uploadUri, 'base64')
                .then((data) => {
                    return Blob.build(data, {type: `${mime};BASE64`})
                })
                .then((blob) => {
                    uploadBlob = blob;
                    return imageRef.put(blob, {contentType: mime})
                })
                .then(() => {
                    uploadBlob.close();
                    return imageRef.getDownloadURL()
                })
                .then((url) => {
                    resolve(url)

                })
                .catch((error) => {
                    reject(error)
                })
        })
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
                            photoUrl: response.uri,
                            photoSelected: true
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
        firebaseRef.auth().onAuthStateChanged((user1) => {
            if (user1) {
                var user = firebaseRef.auth().currentUser;
                if (user !== null) {
                    this.setState({
                        phName: user.displayName || "UserName",
                        phEmail: user.email,
                        name: user.displayName || "UserName",
                        email: user.email,
                        photoUrl: user.photoURL
                    });
                }
            } else {
                // No user is signed in.
            }
        });
    };

    componentDidMount() {
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