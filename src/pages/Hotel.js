import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image
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
            <Container style={{alignItems: "center",backgroundColor: "#fbfaff"}}>
                <Content>
                    {this.state.renderArr}
                </Content>
            </Container>
        )
    }


    getData() {
        firebaseRef.database().ref("hotel/" + this.props.cityKey).once("value").then((value) => {
            console.log(value.val());
            this.setState({hotelData: value.val()})
        }).then(() => {
            let arr = [];
            let hotelData = this.state.hotelData;
            for(let i=0; i<hotelData.length; i++) {
                arr.push(
                    <TouchableOpacity key={hotelData[i].content.key} onPress={() => this.goPage(hotelData[i], i)}
                                      style={{marginRight: 5, marginBottom: 5, marginTop: 5}}>
                        <Image
                            style={{width: 400, height: 200}}
                            source={{
                                uri: hotelData[i].content.url
                            }}>
                            <View style={{width: 100, height: 20}}>
                                <StarRating
                                    emptyStar='md-star-outline'
                                    fullStar='md-star'
                                    halfStar='md-star-half'
                                    iconSet='Ionicons'
                                    disabled={true}
                                    maxStars={5}
                                    rating={hotelData[i].content.starRate}
                                    starSize={25}
                                    starColor={'yellow'}
                                />
                            </View>
                        </Image>
                        <View>
                            <Text style={{
                                fontWeight: "300",
                                color: "black",
                                fontSize: 15
                            }}> {(hotelData[i].content.hotelName).toUpperCase()} </Text>
                            <Text style={{
                                fontWeight: "300",
                                color: "black",
                                fontSize: 12
                            }}> {(this.props.cityKey).toUpperCase()} </Text>

                        </View>
                    </TouchableOpacity>
                );
            }
            this.setState({renderArr: arr});
        });
    }



    goPage(hotelContent,objPlace) {
        setTimeout(() => {
            var user = firebaseRef.auth().currentUser;
            let content = hotelContent;
            let hotelKey = content.content.key;
            let userRate;
            firebaseRef.database().ref("hotelStars/" + user.uid + "/" + hotelKey).once("value").then((userStar)=>{
                if(userStar.val()===null){
                    userRate=0;
                }
                else{
                    userRate= userStar.val().rating;
                }
            }).then(()=>{
                Actions.hoteldetails({hotelContent: content,userStarRate:userRate,objPlace:objPlace});
            });
        }, 300);
    }



    componentDidMount() {
        this.getData();

    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.cityKey !== nextProps.cityKey || this.state.renderArr !== nextState.renderArr;

    }
}
const styles = StyleSheet.create({

});