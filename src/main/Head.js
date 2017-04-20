import React, {Component} from "react";
import {TouchableOpacity} from "react-native";
import {Button, Header, Left, Right, View,Body, Text} from "native-base";
import {Actions} from "react-native-router-flux";
import Icon from "react-native-vector-icons/Ionicons";

export default class Head extends Component {


    constructor(props) {
        super(props);

        this.state = {};
    };


    render() {
        return (
            <Header style={{backgroundColor: "#FFC107"}}>
                <Left>
                    <View style={{flex: 1, flexDirection: "row", justifyContent: "flex-start"}}>
                        <Button transparent onPress={this.props.openToggle}><Icon size={25} color="white" name='md-menu'/></Button>
                    </View>
                </Left>
                <Body>
                <TouchableOpacity onPress={() => Actions.welcomePage()}>
                <Text>Travel Agency</Text>
                </TouchableOpacity>
                </Body>
                <Right>
                    <View style={{flex: 1, flexDirection: "row", justifyContent: "flex-start"}}>
                        <Button transparent onPress={()=> Actions.profile()}><Icon size={25} color="white" name='md-menu'/></Button>
                    </View>
                </Right>
            </Header>
        );
    }


}