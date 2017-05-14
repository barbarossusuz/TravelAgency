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


export default class HotelDetails extends Menu {

    constructor(props) {
        super(props);
        this.state = {
            renderArr: [],
            hotelData: [],
            starRate: 2.5,
            hotelContent: this.props.hotelContent,
            total: 0,
            userCount:0
        };
    }

    renderContent() {

        return (
            <Content style={{backgroundColor: "#E0F2F1"}}>
                <StarRating
                    emptyStar='md-star-outline'
                    fullStar='md-star'
                    halfStar='md-star-half'
                    iconSet='Ionicons'
                    disabled={false}
                    maxStars={5}
                    starSize={20}
                    selectedStar={(rating) => this.onStarRatingPress(rating)}
                    starColor='yellow'
                />
                {this.getData()}
            </Content>
        )
    }


    getData() {
        let hotelContent = this.state.hotelContent;
        return (
            <View style={{alignItems:"center"}}>
                    <TouchableOpacity key={hotelContent.content.key} onPress={() => this.goPage("a")}
                                      style={{marginTop: 5}}>
                        <View style={{flexDirection: "row"}}>
                            <View style={{flexDirection: "column"}}>
                                <Image
                                    style={{width: 200, height: 200, marginRight: 5, marginBottom: 5}}
                                    source={{
                                        uri: hotelContent.content.url2
                                    }}/>
                                <Image
                                    style={{width: 200, height: 200, marginRight: 5}}
                                    source={{
                                        uri: hotelContent.content.url3
                                    }}/>
                            </View>
                            <Image
                                style={{width: 200, height: 405}}
                                source={{
                                    uri: hotelContent.content.url
                                }}/>
                        </View>
                    </TouchableOpacity>
                    <View style={{width: 100, height: 20}}>
                        <Text>{this.state.total}</Text>
                    </View>
            </View>
        );
    }

    renderHotelStar(){

        let newHotelName= this.state.hotelContent.content.key;
        let total=0;
        let value2;
        firebaseRef.database().ref("hotelStars/").once("value").then((value) => {
            value2=value.val();
            for(newHotelName in value2) {
                total = newHotelName + total;
            }
        }).then(()=>{
            let newtotal;
            newtotal=total/this.state.userCount;
            this.setState({total:newtotal});
            console.log("newtotal",newtotal);
        });
    }

    onStarRatingPress(rating) {
        this.setState({
            starRate: rating
        });

        // var user = firebaseRef.auth().currentUser;
        // let content = this.props.hotelContent;
        // let cityName = content.cityName;
        // let hotelName = content.content.key;
        // firebaseRef.database().ref("hotelStars/" + user.uid + "/" + hotelName).set({
        //     rating
        // });
    }

    goPage(key) {
        Actions.payment({hotelKey: key});

    }

    componentDidMount() {
        firebaseRef.database().ref("hotelStars/").once("value").then((value) => {
            let count = (value.val()).length;
            this.setState({userCount: count});
            this.renderHotelStar();

        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.hotelContent !== nextProps.hotelContent || this.state.renderArr !== nextState.renderArr;

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