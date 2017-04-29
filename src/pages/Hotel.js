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
import Hotels from "./Hotels.json"
import {Actions} from "react-native-router-flux";
import {Container, Content} from 'native-base';


var storageRef = firebaseRef.storage().ref("hotel/");


export default class Hotel extends Menu {

    constructor(props) {
        super(props);
        this.state = {
            userData: null,
            imageArr: []
        };
        this.cityKey = this.props.cityKey;
    }

    renderContent() {

        console.log("key", this.cityKey);
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

        Hotels.map((hotelContent) => {
            if (hotelContent.cityKey === this.cityKey) {
                content = hotelContent.content;
            }
        });

        if(content.length !==0) {
            content.map((hotels) => {
                let url = "";
                (this.state.imageArr).map((imageArr) => {
                    if (imageArr.key === hotels.key) {
                        url = imageArr.url
                    }
                });
                arr.push
                (
                    <TouchableOpacity key={hotels.price} onPress={() => this.goPage(hotel.price)}>
                        <Image
                            style={{width: 400, height: 200, marginBottom: 5, marginTop: 5}}
                            source={{
                                uri: "http://www.thefloridahotelorlando.com/var/floridahotelorlando/storage/images/media/images/photo-gallery/hotel-images/florida-hotel-orlando-night/27177-1-eng-US/Florida-Hotel-Orlando-Night.jpg"

                            }}>
                            <View>
                                <Text style={{fontWeight:"300", color: "white",fontSize:18}}> {(hotels.hotel).toUpperCase()} </Text>
                                <Text style={{fontWeight:"300", color: "white",fontSize:18}}> {hotels.price} </Text>
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

        Hotels.map((hotelContent) => {
            if (hotelContent.cityKey === this.cityKey) {
                content = hotelContent.content;
            }
        });

        if(content.length !==0) {
            content.map((hotels) => {
                storageRef.child(hotels.key + ".jpg").getDownloadURL().then((url) => {
                    imageArr.push(
                        {
                            key: hotels.key,
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
        Actions.payment({hotelKey: key});
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