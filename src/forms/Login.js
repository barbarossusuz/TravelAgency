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

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: ""
        }
    }

    render() {
        return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image
                    style={styles.logo}
                    source={require("./../images/travel.png")}/>
                <Text style={styles.title}>LOgin </Text>
            </View>
            <View>
                <View style={styles.loginContainer}>
                    <TextInput
                        placeholder="EMAIL"
                        value={this.state.email}
                        returnKeyType="next"
                        onChangeText={(text)=> this.setState({email:text})}
                        keyboardType="email-address"
                        placeholderTextColor="#000000"
                        style={styles.input}
                        autoCapitalize="none"
                        autoCorrect={false}/>
                    <TextInput
                        placeholder="PASSWORD"
                        value={this.state.password}
                        returnKeyType="done"
                        secureTextEntry={true}
                        onChangeText={(text)=> this.setState({password:text})}
                        placeholderTextColor="#000000"
                        style={styles.input}
                        autoCapitalize="none"
                        autoCorrect={false}/>


                    <TouchableOpacity style={styles.buttonContainer} onPress={()=>this._login()}>
                        <Text style={styles.loginButton}>LOG IN</Text>
                    </TouchableOpacity>
                    <View style={{alignItems: "center"}}>
                    <TouchableOpacity onPress={()=>this._goRegister()}>
                        <Text style={styles.registerButton}>create account?</Text>
                    </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>

        );
    }

    _login(){
        if(this.state.password && this.state.email) {
            firebaseRef.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((userData) => {
                {
                    AsyncStorage.setItem('userData', JSON.stringify(userData));
                    Keyboard.dismiss();
                    Actions.welcomePage();
                }
            }).catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorCode === "auth/invalid-email") {
                    ToastAndroid.showWithGravity("Email address is not valid", ToastAndroid.SHORT, ToastAndroid.CENTER);
                }
                if (errorCode === "auth/wrong-password") {
                    ToastAndroid.showWithGravity("Wrong password", ToastAndroid.SHORT, ToastAndroid.CENTER);
                }
                if (errorCode === "auth/user-disabled") {
                    ToastAndroid.showWithGravity("This email has been disabled", ToastAndroid.SHORT, ToastAndroid.CENTER);
                }
                if (errorCode === "auth/user-not-found") {
                    ToastAndroid.showWithGravity("There is no user to the given email", ToastAndroid.SHORT, ToastAndroid.CENTER);
                }
                console.log(error);
            });
        }else {
            ToastAndroid.showWithGravity("Email or password can not be empty", ToastAndroid.SHORT, ToastAndroid.CENTER);
        }
    }

    _goRegister() {
        Actions.register();
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