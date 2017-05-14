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
import {Actions} from "react-native-router-flux";
import {Container, Content} from 'native-base';
import StarRating from 'react-native-star-rating';


export default class Hotel extends Menu {

    constructor(props) {
        super(props);
        this.state = {
            renderArr: [],
            hotelData: [],
            userCount: 0

        };
    }

    renderContent() {

        return (
            <Container style={{alignItems: "center",backgroundColor: "#E0F2F1"}}>
                <Content>
                    {this.state.renderArr}
                </Content>
            </Container>
        )
    }


    getData() {
        firebaseRef.database().ref("hotel/" + this.props.cityKey).once("value").then((value) => {
            this.setState({hotelData: value.val()})
        }).then(() => {
            let arr = [];
            let hotelData = this.state.hotelData;
            hotelData.map((hotels) => {
                arr.push(
                    <TouchableOpacity key={hotels.content.key} onPress={() => this.goPage(hotels)}
                                      style={{marginRight: 5, marginBottom: 5,marginTop: 5}}>
                        <Image
                            style={{width: 400, height: 200}}
                            source={{
                                uri: hotels.content.url
                            }}>
                            <View style={{width: 100,height:20}}>
                            <StarRating
                                disabled={true}
                                maxStars={5}
                                rating={hotels.content.starRate}
                                starSize={20}
                                starColor={'yellow'}
                            /></View>

                        </Image>
                        <View>
                            <Text style={{
                                fontWeight: "300",
                                color: "black",
                                fontSize: 15
                            }}> {(hotels.hotelName).toUpperCase()} </Text>
                            <Text style={{
                                fontWeight: "300",
                                color: "black",
                                fontSize: 12
                            }}> {(this.props.cityKey).toUpperCase()} </Text>

                        </View>
                    </TouchableOpacity>
                )
            });
            this.setState({renderArr: arr});
        });
    }



    goPage(content) {
        setTimeout(() => {
            Actions.hoteldetails({hotelContent: content});
        }, 300);
    }

    renderHoteStar(hotelName){
        let hotelName= hotelName;
        firebaseRef.database().ref("hotelStars/").once("value").then((value) => {
            let value=value.val();

            value.map((newValue)=>{
                newValue.$(hotelName)
            })
        });
        }

    componentDidMount() {
        this.getData();
        firebaseRef.database().ref("hotelStars/").once("value").then((value) => {
            let count = (value.val()).length;
            this.setState({userCount: count})
        });

    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.cityKey !== nextProps.cityKey || this.state.renderArr !== nextState.renderArr;

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