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


export default class City extends Menu {

    constructor(props) {
        super(props);
        this.state = {
            renderArr: [],
            cityData:[]
        };
    }

    renderContent() {

        console.log("key", this.props.countryKey);
        return (
            <Container style={{alignItems: "center",backgroundColor: "#E0F2F1"}}>
                <Content>
                    {this.state.renderArr}
                </Content>
            </Container>
        )
    }


    getData(){
        firebaseRef.database().ref("city/"+this.props.countryKey).once("value").then( (value)=> {
            this.setState({cityData: value.val()})
        }).then(()=>{
            let arr=[];
            let cityData = this.state.cityData;
            cityData.map((cities) => {
                    arr.push(
                        <TouchableOpacity key={cities.cityName} onPress={() => this.goPage(cities.cityName)}>
                            <Image
                                style={{width: 400, height: 200, marginBottom: 5, marginTop: 5}}
                                source={{
                                    uri: cities.content.url
                                }}>
                                <View>
                                    <Text style={{fontWeight:"300", color: "white",fontSize:18}}> {(cities.cityName).toUpperCase()} </Text>
                                </View>
                            </Image>
                        </TouchableOpacity>
                    )
                });
            this.setState({renderArr:arr});
        });
    }


    goPage(key) {
        setTimeout(() => {
            Actions.hotel({cityKey: key});
        }, 300);
    }

    componentDidMount() {
        this.getData();
    }

    shouldComponentUpdate(nextProps,nextState){
        return this.props.countryKey !== nextProps.countryKey || this.state.renderArr !== nextState.renderArr;
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