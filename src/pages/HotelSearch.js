import React from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    Image,
    AsyncStorage
} from 'react-native';
import {firebaseRef} from "../Firebase";
import Menu from "../main/Menu";
import {Actions} from "react-native-router-flux";
import {Container, Content,Input,Item,Label} from 'native-base';


export default class HotelSearch extends Menu {

    constructor(props) {
        super(props);
        this.state = {
            search: ""
        };
    }

    renderContent() {
        return (
                <Content style={{backgroundColor: "#fbfaff"}}>
                    <View style={{justifyContent: "center"}}>
                        <View style={{borderWidth:1}}>
                        <TextInput
                            placeholder="Hotel Name"
                            value={this.state.search}
                            returnKeyType="done"
                            onChangeText={(text) => this.setState({search: text})}
                            placeholderTextColor="#BABABA"
                            style={styles.input}
                            autoCapitalize="none"
                            autoCorrect={false}

                        />
                        </View>
                        <Item floatingLabel>
                            <Label > Hotel Name</Label>
                            <Input
                                value={this.state.search}
                                returnKeyType="done"
                                onChangeText={(text) => this.setState({search: text})}
                                autoCapitalize="none"
                                autoCorrect={false}
                                />
                        </Item>
                    </View>
                </Content>
        )
    }


    goPage(key) {
        setTimeout(() => {
            Actions.city({countryKey: key});
        }, 300);
    }


    componentDidMount() {
    }

    componentWillMount() {

    }
}
const styles = StyleSheet.create({
    input: {
        height: 50,
        marginBottom: 10,
        color: "#000000",
        paddingHorizontal: 10
    },
});