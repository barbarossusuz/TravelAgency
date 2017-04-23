import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    AsyncStorage
} from 'react-native';
import {firebaseRef} from "../Firebase";
import Menu from "../main/Menu";
import Cities from "./Cities.json"
import {Actions} from "react-native-router-flux";
import { Container, Content} from 'native-base';


var storageRef = firebaseRef.storage().ref("cities/");


export default class WelcomePage extends Menu {

    constructor(props) {
        super(props);
        this.state = {
            userData: null,
            url: null,
            arr: [],
            dataArr: []
        };
    }

    renderContent() {

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
        Cities.map((cities) => {
                arr.push
                (
                    <TouchableOpacity key={cities.key}  onPress={() => this.goPage(cities.key)}>
                    <Image
                        style={{width: 400, height: 180, marginBottom: 3, marginTop: 3,borderRadius: 15}}
                        source={{uri: "https://firebasestorage.googleapis.com/v0/b/travelagency-32090.appspot.com/o/cities%2Fpisa.jpg?alt=media&token=ca5a144b-53b5-4887-a275-df13ecfee859"}}>
                        <View>
                            <Text> {cities.country} </Text>
                            <Text> {cities.city} </Text>
                        </View>
                    </Image>
                    </TouchableOpacity>

                );
        });
        this.setState({arr:arr});
    }
    goPage(key){
        Actions.citycontent({cityKey: key});
    }

    getimage(){
    storageRef.child(cities.key + '.jpg').getDownloadURL().then((url) => {

    });


    }

    componentDidMount() {
        this.renderList();
    }

    componentWillMount() {

        // AsyncStorage.getItem('userData').then((user_data_json) => {
        //     let userData = JSON.parse(user_data_json);
        //     this.setState({
        //         userData: userData
        //     });
        //     firebaseRef.database().ref("users/" + this.state.userData.uid).set({
        //         name: this.state.userData.displayName,
        //         email: this.state.userData.email
        //     });
        // });

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