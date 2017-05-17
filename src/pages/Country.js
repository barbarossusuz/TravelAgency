import React from 'react';
import {

    View,
    Text,
    TouchableOpacity,
    Image,
    AsyncStorage
} from 'react-native';
import {firebaseRef} from "../Firebase";
import Menu from "../main/Menu";
import {Actions} from "react-native-router-flux";
import {Container, Content, List, ListItem} from 'native-base';
import Icon from "react-native-vector-icons/Ionicons";


var val;
var val2;

export default class Country extends Menu {

    constructor(props) {
        super(props);
        this.state = {
            renderArr: [],
            countryData: []
        };
    }

    renderContent() {
        AsyncStorage.getItem("themeValue", (err, value) => {

            val = (value === "true");
        });
        return (
            <Content style={{backgroundColor: "#fbfaff"}}>
                {val?
                    <View style={{justifyContent:"center"}}>
                        { this.state.renderArr}
                    </View>
                    :
                <List>{this.state.renderArr}</List>}
            </Content>
        )
    }


    goPage(key) {
        setTimeout(() => {
            Actions.city({countryKey: key});
        }, 300);
    }


    getData() {

            firebaseRef.database().ref("country").once("value").then((value) => {
                this.setState({countryData: value.val()})
            }).then(() => {
                let arr = [];
                let countryData = this.state.countryData;
                countryData.map((countries) => {
                    if (val === true) {
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
                    }
                    else {
                        arr.push
                        (
                                <ListItem  key={countries.key} >
                                    <TouchableOpacity style={{flex:1}} onPress={() => this.goPage(countries.key)}>
                                        <View style={{justifyContent:"space-between",flexDirection: "row"}}>
                                        <Text style={{ fontWeight: "200",fontSize: 17}}> {(countries.key).toUpperCase()} </Text>
                                        <Icon name="md-play" color="black"> </Icon>
                                        </View>
                                    </TouchableOpacity>
                                </ListItem>
                        );
                    }

                });
                this.setState({renderArr: arr});
            });
    }

    componentDidMount() {
        this.getData();
    }
}
