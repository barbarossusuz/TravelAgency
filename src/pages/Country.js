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
import {Actions} from "react-native-router-flux";
import {Container, Content} from 'native-base';


export default class Country extends Menu {

    constructor(props) {
        super(props);
        this.state = {
            renderArr: [],
            countryData: []
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


    goPage(key) {
        setTimeout(() => {
            Actions.city({countryKey: key});
        }, 300);
    }


    getData(){
        firebaseRef.database().ref("country").once("value").then( (value)=> {
          this.setState({countryData: value.val()})
        }).then(()=>{
            let arr =[];
            let countryData = this.state.countryData;
            countryData.map((countries) => {
                arr.push
                (
                    <TouchableOpacity key={countries.key} onPress={() => this.goPage(countries.key)}>
                        <Image
                            style={{width: 400, height: 180, marginBottom: 3, marginTop: 3, borderRadius: 15}}
                            source={{
                                uri: countries.url
                            }}>
                            <View>
                                <Text style={{
                                    fontWeight: "300",
                                    color: "white",
                                    fontSize: 18
                                }}> {(countries.key).toUpperCase()} </Text>
                            </View>
                        </Image>
                    </TouchableOpacity>
                );
            });
            this.setState({renderArr: arr});
        });
    }
    componentDidMount() {
        this.getData();
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