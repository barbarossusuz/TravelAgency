import React from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    DatePickerAndroid,
    TouchableWithoutFeedback,
    StyleSheet,
    ToastAndroid
} from 'react-native';
import {firebaseRef} from "../Firebase";
import Menu from "../main/Menu";
import {Content,Button} from 'native-base';
import Icon from "react-native-vector-icons/Ionicons";

import StarRating from 'react-native-star-rating';


export default class HotelDetails extends Menu {

    constructor(props) {
        super(props);
        this.state = {
            renderArr: [],
            hotelData: [],
            userStarRate: this.props.userStarRate,
            hotelContent: this.props.hotelContent,
            userCount: 0,
            startingDate: new Date(),
            endingDate: new Date(),
            startingText:"Pick Start Date",
            endingText:"Pick End Date",
            total: 0,
            madeChoice: true
        };
    }

    renderContent() {
        var timeDiff = Math.abs(this.state.endingDate.getTime() - this.state.startingDate.getTime());
        if(this.state.startingDate >= this.state.endingDate){
            var diffDays = "Start Date cannot be equal or higher than End Date ";
        }
        else if(this.state.startingDate < new Date()){
            var diffDays ="Start Date cannot be lower than Todays Date";
        }
        else if(this.state.endingDate <= new Date()){
            var diffDays ="End Date cannot be lower than Todays Date";
        }
        else {
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        }

        return (
            <Content style={{backgroundColor: "#fbfaff",padding:5}}>
                <View style={{width: 100, height: 20}}>
                <StarRating
                    emptyStar='md-star-outline'
                    fullStar='md-star'
                    halfStar='md-star-half'
                    iconSet='Ionicons'
                    disabled={false}
                    rating={this.state.userStarRate}
                    maxStars={5}
                    starSize={25}
                    selectedStar={(rating) => this.onStarRatingPress(rating)}
                    starColor='yellow'
                />
                </View>
                {this.getData()}
                <View style={{justifyContent: "flex-start",flexDirection:"row",marginBottom: 10}}>
                <TouchableWithoutFeedback
                    onPress={this.showPicker.bind(this, 'starting', {date: this.state.startingDate})}>
                    <View style={styles.dateContainer}>
                            <Icon size={20} name="md-time" style={{color: 'white', marginRight: 5,marginLeft:2}}/>
                            <Text style={styles.dateText}>{this.state.startingText}</Text>
                    </View>
                </TouchableWithoutFeedback>
                </View>



                <View style={{justifyContent: "flex-start",flexDirection:"row"}}>
                    <TouchableWithoutFeedback
                        onPress={this.showPicker.bind(this, 'ending', {date: this.state.endingDate})}>
                        <View style={styles.dateContainer}>
                            <Icon size={20} name="md-time" style={{color: 'white', marginRight: 5,marginLeft: 2}}/>
                            <Text style={styles.dateText}>{this.state.endingText}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <View style={{justifyContent: "flex-start",flexDirection:"row",marginBottom: 10}}>
                {typeof diffDays !== "string"?


                        <Text>Total Price for {diffDays} {diffDays>1?"Days" : "Day"} is: {diffDays*this.state.hotelContent.content.price}</Text>
                    :<Text style={{color:"red"}}>{diffDays}</Text>}</View>
                <View style={{  backgroundColor: "#fbfaff",
                    paddingVertical: 15,
                    borderWidth: 0.8,
                    borderRadius: 30,marginTop:10}}>
                    <TouchableOpacity onPress={()=>this.deneme()}>
                        <Text style={{
                            textAlign: "center",
                            color: "#000000",
                            fontWeight: "700"}}>Send Booking Request</Text>
                    </TouchableOpacity>
                </View>
            </Content>
        )
    }


    getData() {
        let hotelContent = this.state.hotelContent;
        return (
            <View style={{alignItems: "center"}}>
                <TouchableOpacity key={hotelContent.content.key}
                                  style={{marginTop: 5}}>
                    <View style={{flexDirection: "row"}}>
                        <View style={{flexDirection: "column"}}>
                            <Image
                                style={{width: 150, height: 150, marginRight: 5, marginBottom: 5}}
                                source={{
                                    uri: hotelContent.content.url2
                                }}/>
                            <Image
                                style={{width: 150, height: 150, marginRight: 5}}
                                source={{
                                    uri: hotelContent.content.url3
                                }}/>
                        </View>
                        <Image
                            style={{width: 150, height: 305}}
                            source={{
                                uri: hotelContent.content.url
                            }}/>
                    </View>
                </TouchableOpacity>
                <Text>${hotelContent.content.price} For A Day</Text>
                <View style={{width: 100, height: 20}}>
                </View>
            </View>
        );
    }

    showPicker = async (stateKey, options) => {
        try {
            var newState = {};
            const {action, year, month, day} = await DatePickerAndroid.open(options);
            if (action === DatePickerAndroid.dismissedAction) {
                newState[stateKey + 'Text'] = 'Invalid Date';
            } else {
                var date = new Date(year, month, day);
                newState[stateKey + 'Text'] = date.toLocaleDateString();
                newState[stateKey + 'Date'] = date;
            }
            this.setState(newState);
            this.forceUpdate();
        } catch ({code, message}) {
            console.warn(`Error in example '${stateKey}': `, message);
        }
    };
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
            this.setHotelStar();
        });
    }

    deneme() {
        var user = firebaseRef.auth().currentUser;
        let content = this.props.hotelContent;
        let hotelKey = content.content.key;
        let hotelName = content.content.hotelName;
        var timeDiff = Math.abs(this.state.endingDate.getTime() - this.state.startingDate.getTime());
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

        if(this.state.endingDate && this.state.startingDate){
        if(this.state.startingDate >= this.state.endingDate){
            ToastAndroid.showWithGravity("Start Date cannot be equal or higher than End Date ", ToastAndroid.SHORT, ToastAndroid.CENTER);
        }
        else if(this.state.startingDate < new Date()){
            ToastAndroid.showWithGravity("Start Date cannot be lower than Todays Date", ToastAndroid.SHORT, ToastAndroid.CENTER);
        }
        else if(this.state.endingDate <= new Date()){
            ToastAndroid.showWithGravity("End Date cannot be lower than Todays Date", ToastAndroid.SHORT, ToastAndroid.CENTER);
        }
        else {
            firebaseRef.database().ref("resarvation/" + user.uid + "/" + hotelKey).set({
                startDate: this.state.startingDate,
                endDate: this.state.endingDate,
                hotelName: hotelName,
                hotelKey: hotelKey,
                price: diffDays*content.content.price
            }).then(() => {
                ToastAndroid.showWithGravity("Reservation successfully saved", ToastAndroid.SHORT, ToastAndroid.CENTER);
            });
        }
        }
        else{
            ToastAndroid.showWithGravity("Please Select Dates", ToastAndroid.SHORT, ToastAndroid.CENTER);

        }
    }

    setHotelStar() {
        let count = 0;
        let total = 0;
        let starRate = 0;
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

            firebaseRef.database().ref("hotel/" + content.cityName + "/"+this.props.objPlace+"/content").update({
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

    dateContainer: {
        backgroundColor: "#009688",
        width: 150,
        paddingVertical: 10,
        borderWidth: 0,
        borderRadius: 1,
        flexDirection:"row",
        justifyContent: "flex-start"
    },
    dateText: {
        textAlign: "center",
        color: "#ffffff",
        fontWeight: "700"
    }
});