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
export default class City extends Menu {

    constructor(props) {
        super(props);
        this.state = {
            renderArr: [],
            cityData:[]
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


    getData(){
        firebaseRef.database().ref("city/"+this.props.countryKey).once("value").then( (value)=> {
            this.setState({cityData: value.val()})
        }).then(()=>{
            let arr=[];
            let cityData = this.state.cityData;
            cityData.map((cities) => {
                if(val===true){
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
                }else{
                    arr.push
                    (
                        <ListItem  key={cities.cityName} >
                            <TouchableOpacity style={{flex:1}} onPress={() => this.goPage(cities.cityName)}>
                                <View style={{justifyContent:"space-between",flexDirection: "row"}}>
                                    <Text style={{ fontWeight: "200",fontSize: 17}}> {(cities.cityName).toUpperCase()} </Text>
                                    <Icon name="md-play" color="black"> </Icon>
                                </View>
                            </TouchableOpacity>
                        </ListItem>
                    );
                }

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