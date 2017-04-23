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
import { Container, Content} from 'native-base';


var storageRef = firebaseRef.storage().ref("cities/");


export default class CityContent extends Menu {

    constructor(props) {
        super(props);
        this.state = {
            userData: null,
            arr: []
        };
        this.cityKey = this.props.cityKey || undefined;
    }

    renderContent() {

        console.log("girdi");
        console.log("key",this.cityKey);
        return (
            <Container style={{alignItems: "center"}}>
                <Content>
                    {this.state.arr}
                </Content>
            </Container>
        )
    }


    renderList() {
        let arr = [];

        Hotels.map((cityContent) => {

           if( cityContent.key === this.cityKey) {

               cityContent.content.map((a)=>{
                   arr.push
                   (
                       <TouchableOpacity key={a.hotel} >
                       <Image
                           style={{width: 400, height: 200, marginBottom: 5, marginTop: 5}}
                           source={{uri:
                               this.cityKey === "pisa" ?
                                   "https://www.norwegian.com/globalassets/ip/media/destinations/pisa/guide/pisa-campo-dei-miracoli.jpg" : "http://www.parisattitude.com/images/monuments.jpg"
                           }}>
                           <View>
                               <Text> {a.hotel} </Text>
                               <Text> {a.price} </Text>
                           </View>
                       </Image>
                       </TouchableOpacity>
                   );
               });
               this.setState({arr:arr})

           }
           else {
               return null;
           }

        });
    }

    componentDidMount() {
        this.renderList();
    }

    componentWillMount() {
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