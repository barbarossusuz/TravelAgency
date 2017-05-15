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
                                emptyStar='md-star-outline'
                                fullStar='md-star'
                                halfStar='md-star-half'
                                iconSet='Ionicons'
                                disabled={true}
                                maxStars={5}
                                rating={hotels.content.starRate}
                                starSize={20}
                                starColor={'yellow'}
                            />
                            </View>
                        </Image>
                        <View>
                            <Text style={{
                                fontWeight: "300",
                                color: "black",
                                fontSize: 15
                            }}> {(hotels.content.hotelName).toUpperCase()} </Text>
                            <Text style={{
                                fontWeight: "300",
                                color: "black",
                                fontSize: 12
                            }}> {(this.props.cityKey).toUpperCase()} </Text>

                        </View>
                    </TouchableOpacity>
                );

            });
            this.setState({renderArr: arr});
        });
    }



    goPage(content1) {
        setTimeout(() => {
            var user = firebaseRef.auth().currentUser;
            let content = content1;
            let hotelKey = content.content.key;
            let userRate=0;
            firebaseRef.database().ref("hotelStars/" + user.uid + "/" + hotelKey).once("value").then((userStar)=>{
                userRate= userStar.val().rating;
            }).then(()=>{
                Actions.hoteldetails({hotelContent: content,userStarRate:userRate});
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