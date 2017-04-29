import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    AsyncStorage
} from 'react-native';
import {firebaseRef} from "../Firebase";
import Menu from "../main/Menu";
import Countries from "./Countries.json"
import {Actions} from "react-native-router-flux";
import {Container, Content} from 'native-base';


var storageRef = firebaseRef.storage().ref("country/");


export default class Country extends Menu {

    constructor(props) {
        super(props);
        this.state = {
            userData: null,
            url: null,
            imageArr: []
        };
    }

    renderContent() {
        return (
            <Container style={{alignItems: "center"}}>
                <Text> COUNTRIES </Text>
                <Content>
                    {this.renderList() }
                </Content>
            </Container>
        )
    }


    renderList() {
        if ((this.state.imageArr).length === Countries.length) {
            let arr = [];
            Countries.map((countries) => {
                let url = "";
                (this.state.imageArr).map((imageArr) => {
                    if (imageArr.key === countries.key) {
                        url = imageArr.url
                    }
                });
                arr.push
                (
                    <TouchableOpacity key={countries.key} onPress={() => this.goPage(countries.key)}>
                        <Image
                            style={{width: 400, height: 180, marginBottom: 3, marginTop: 3, borderRadius: 15}}
                            source={{
                                uri: url ? url : "http://www.jqueryscript.net/images/jQuery-Ajax-Loading-Overlay-with-Loading-Text-Spinner-Plugin.jpg"
                            }}>
                            <View>
                                <Text style={{fontWeight:"300", color: "white",fontSize:18}}> {(countries.key).toUpperCase()} </Text>
                            </View>
                        </Image>
                    </TouchableOpacity>
                );
            });
            return arr;
        }
        else {
            return <Text> Loading.. </Text>;
        }

    }

    goPage(key) {
        Actions.city({countryKey: key});
    }

    getimage() {
        let imageArr = [];
        Countries.map((countries) => {
            storageRef.child(countries.key + ".jpg").getDownloadURL().then((url) => {
                imageArr.push(
                    {
                        key: countries.key,
                        url: url
                    }
                );
                this.setState({
                    imageArr
                });
            });
        });
    }

    componentDidMount() {
        this.getimage();
    }

    componentWillMount() {

        // AsyncStorage.getItem('userData').then((user_data_json) => {
        //     let userData = JSON.parse(user_data_json);
        //     this.setState({
        //         userData: userData
        //     });
        //     firebaseRef.database().ref("users/" + this.state.userData.uid).set({
        //         name: this.state.userData.displayName,
        //         email: this.state.userData.email
        //     });
        // });

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