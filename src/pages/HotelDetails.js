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
            userStarRate: this.props.userStarRate,
            hotelContent: this.props.hotelContent,
            total: 0,
            userCount: 0,
        };
    }

    renderContent() {
        return (

            <Content style={{backgroundColor: "#E0F2F1"}}>
                {this.getData()}
                <StarRating
                    emptyStar='md-star-outline'
                    fullStar='md-star'
                    halfStar='md-star-half'
                    iconSet='Ionicons'
                    disabled={false}
                    rating={this.state.userStarRate}
                    maxStars={5}
                    starSize={40}
                    selectedStar={(rating) => this.onStarRatingPress(rating)}
                    starColor='yellow'
                />
            </Content>
        )
    }


    getData() {
        let hotelContent = this.state.hotelContent;
        return (
            <View style={{alignItems: "center"}}>
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

    onStarRatingPress(rating) {
        var user = firebaseRef.auth().currentUser;
        let content = this.props.hotelContent;
        let hotelKey = content.content.key;
        let hotelName = content.content.hotelName;

        firebaseRef.database().ref("hotelStars/" + user.uid + "/" + hotelKey).set({
            rated: true,
            rating: rating,
            hotelName: hotelName,
            hotelKey: hotelKey
        }).then(() => {
            this.setState({
                userStarRate: rating
            });
            this.forceUpdate();
            this.getUserCount();
        });
    }

    goPage(key) {
        Actions.payment({hotelKey: key});
    }

    getUserCount() {
        let count = 0;
        let total = 0;
        let starRate = 0;
        let user = firebaseRef.auth().currentUser;
        let content = this.props.hotelContent;
        let hotelKey = content.content.key;
        firebaseRef.database().ref("hotelStars/").once("value").then((value) => {
            let obj = (value.val());
            let objArr = Object.keys(obj);


            for (let i = 0; i < objArr.length; i++) {
                if (obj[objArr[i]])
                    (obj[objArr[i]]).map((insideObj) => {
                        if (insideObj.rated === true && insideObj.hotelKey === hotelKey) {
                            count = count + 1;
                            total = total + (insideObj.rating);
                        }
                    });
                starRate=total/count;
            }
        }).then(() => {
            firebaseRef.database().ref("hotel/" + content.cityName + "/"+content.content.key+"/content").update({
                starRate: starRate
            });
        });
    };

    componentDidMount() {
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