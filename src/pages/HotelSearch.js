import React from 'react';
import {
    StyleSheet,
    TextInput,
    View,
    TouchableOpacity,
    Image,
    AsyncStorage
} from 'react-native';
import {firebaseRef} from "../Firebase";
import Menu from "../main/Menu";
import {Actions} from "react-native-router-flux";
import {Container, Content,Input,Item,Label,ListItem,List,Thumbnail,Text,Body,Right} from 'native-base';


export default class HotelSearch extends Menu {

    constructor(props) {
        super(props);
        this.state = {
            search: "",
            hotelData: {},
            renderArr:[],
            searchResultArr:[]
        };
    }

    renderContent() {
        return (
                <Content style={{backgroundColor: "#fbfaff"}}>
                    <View style={{justifyContent: "center"}}>

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
                    <View style={{marginTop: 10}}>
                    {this.state.renderArr}
                    </View>
                </Content>
        )
    }


    renderAllHotels(data) {
        let searchData = data;
        let arr=[];
            (searchData).map((insideObj) => {
                arr.push(
                        <View  key={insideObj.content.key}>
                        <List>
                            <ListItem>
                                <Thumbnail square size={80} source={{uri: insideObj.content.url}}/>
                                <Body>
                                <Text>{(insideObj.cityName).toUpperCase()}</Text>
                                <Text note> {insideObj.content.hotelName}</Text>
                                </Body>
                                <Right>
                                    <TouchableOpacity  onPress={() => this.goPage(insideObj)}>
                                        <Text style={{color: "blue",fontWeight:"400"}}>Go Page</Text>
                                    </TouchableOpacity>
                                </Right>
                            </ListItem>
                        </List>

                        </View>
                )
            });
        this.setState({renderArr:arr});
    }

    goPage(content1){
        console.log("content1", content1)
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
    handleSearch(e) {
        this.setState({search:e});


        let obj = this.state.hotelData;
        let objArr = Object.keys(obj);
        let searchResultArr=[];

        if(e!=="")
        for (let i = 0; i < objArr.length; i++){
            (obj[objArr[i]]).map((insideObj) => {
                if((insideObj.content.hotelName).toLowerCase().includes(e.toLowerCase()) ===true){
                    searchResultArr.push(insideObj);
                }
            });
        }
        this.renderAllHotels(searchResultArr);
    }


    componentDidMount() {
    }

    componentWillMount() {
        firebaseRef.database().ref("hotel/").once("value").then((value) => {
            this.setState({hotelData:value.val()})
        }).then(()=>{
        });
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