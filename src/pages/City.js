import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    AsyncStorage,
    ToastAndroid
} from 'react-native';
import {firebaseRef} from "../Firebase";
import Menu from "../main/Menu";
import Cities from "./Cities.json"
import {Actions} from "react-native-router-flux";
import {Container, Content} from 'native-base';


var storageRef = firebaseRef.storage().ref("city/");


export default class City extends Menu {

    constructor(props) {
        super(props);
        this.state = {
            userData: null,
            imageArr: []
        };
        this.countryKey = this.props.countryKey;
    }

    renderContent() {

        console.log("key", this.countryKey);
        return (
            <Container style={{alignItems: "center"}}>
                <Content>
                    {this.renderList()}
                </Content>
            </Container>
        )
    }


    renderList() {
        let arr = [];
        let content = [];

        Cities.map((cityContent) => {
            if (cityContent.countryKey === this.countryKey) {
                content = cityContent.content;
            }
        });

        if(content.length !==0) {
            content.map((cities) => {
                let url = "";
                (this.state.imageArr).map((imageArr) => {
                    if (imageArr.key === cities.key) {
                        url = imageArr.url
                    }
                });
                arr.push
                (
                    <TouchableOpacity key={cities.key} onPress={() => this.goPage(cities.key)}>
                        <Image
                            style={{width: 400, height: 200, marginBottom: 5, marginTop: 5}}
                            source={{
                                uri: url ? url : "http://www.jqueryscript.net/images/jQuery-Ajax-Loading-Overlay-with-Loading-Text-Spinner-Plugin.jpg"

                            }}>
                            <View>
                                <Text style={{fontWeight:"300", color: "white",fontSize:18}}> {(cities.key).toUpperCase()} </Text>
                                <Text style={{fontWeight:"300", color: "white",fontSize:18}}> {cities.hotels} </Text>
                            </View>
                        </Image>
                    </TouchableOpacity>
                );
            });
            return arr;
        }else {
            return <Text> Loading.. </Text>;
        }


    }

    getimage() {
        let imageArr = [];
        let content = [];

        Cities.map((cityContent) => {
            if (cityContent.countryKey === this.countryKey) {
                content = cityContent.content;
            }
        });

        if(content.length !==0) {
            content.map((cities) => {
                storageRef.child(cities.key + ".jpg").getDownloadURL().then((url) => {
                    imageArr.push(
                        {
                            key: cities.key,
                            url: url
                        }
                    );
                    this.setState({
                        imageArr
                    });
                });
            });
        }
    }

    goPage(key) {
        Actions.hotel({cityKey: key});
    }

    componentDidMount() {
        this.getimage();
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