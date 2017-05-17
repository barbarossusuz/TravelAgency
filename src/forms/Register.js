import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ToastAndroid,
    Image,
    AsyncStorage,
    Keyboard
} from 'react-native';
import {firebaseRef} from "../Firebase";
import {Actions} from "react-native-router-flux";

export default class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            password2: ""
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <Image
                        style={styles.logo}
                        source={require("./../images/travel.png")}/>
                    <Text style={styles.title}>REgister </Text>
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
                            onFocus={this.onFocus}
                            autoCorrect={false}/>
                        <TextInput
                            placeholder="PASSWORD"
                            value={this.state.password}
                            returnKeyType="next"
                            secureTextEntry={true}
                            onChangeText={(text) => this.setState({password: text})}
                            placeholderTextColor="#000000"
                            style={styles.input}
                            autoCapitalize="none"
                            onFocus={this.onFocus}
                            autoCorrect={false}/>
                        <TextInput
                            placeholder="VERIFY PASSWORD"
                            value={this.state.password2}
                            returnKeyType="done"
                            secureTextEntry={true}
                            onChangeText={(text) => this.setState({password2: text})}
                            placeholderTextColor="#000000"
                            style={styles.input}
                            autoCapitalize="none"
                            onFocus={this.onFocus}
                            autoCorrect={false}/>

                        <TouchableOpacity style={styles.buttonContainer} onPress={() => this._register()}>
                            <Text style={styles.loginButton}>CREATE ACCOUNT</Text>
                        </TouchableOpacity>
                        <View style={{alignItems: "center"}}>
                            <TouchableOpacity onPress={() => this._backLogin()}>
                                <Text style={styles.registerButton}>back to login page</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>

        );
    }

    _register() {
        if (this.state.password === this.state.password2) {
            firebaseRef.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then((userData) => {
                {
                    AsyncStorage.setItem('userData', JSON.stringify(userData));
                    AsyncStorage.setItem('themeValue', JSON.stringify(false));
                    Keyboard.dismiss();
                    Actions.welcomePage();
                    ToastAndroid.showWithGravity("Account succesfuly created", ToastAndroid.SHORT, ToastAndroid.CENTER);
                }
            }).catch((error) => {

                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorCode === 'auth/weak-password') {
                    ToastAndroid.showWithGravity("The password is too weak.", ToastAndroid.SHORT, ToastAndroid.CENTER);
                }
                if (errorCode === "auth/invalid-email") {
                    ToastAndroid.showWithGravity("Email address is not valid", ToastAndroid.SHORT, ToastAndroid.CENTER);
                }
                if (errorCode === "auth/email-already-in-use") {
                    ToastAndroid.showWithGravity("There already exists an account with the given email", ToastAndroid.SHORT, ToastAndroid.CENTER);
                }
                if(errorCode === "auth/operation-not-allowed") {
                    ToastAndroid.showWithGravity("Email/Password accounts are not enabled", ToastAndroid.SHORT, ToastAndroid.CENTER);
                }
                console.log(error);
            });
        }
        else {
            ToastAndroid.showWithGravity("Passwords did not match", ToastAndroid.SHORT, ToastAndroid.CENTER);
        }
    }

    _backLogin() {
        Actions.login();
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
    logo: {
        width: 100,
        height: 100
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