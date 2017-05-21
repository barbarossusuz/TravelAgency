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
                    <View style={{justifyContent: "center",padding:10,marginTop:8,marginBottom:8}}>
                        <Item floatingLabel>
                            <Label style={{fontWeight:"300"}} > Hotel Name</Label>
                            <Input
                                value={this.state.search}
                                returnKeyType="done"
                                onChangeText={(text) => this.handleSearch(text)}
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
        console.log("data",data);
        let arr=[];
            for(let i=0; i<searchData.length; i++) {
                arr.push(
                        <View  key={searchData[i].content.key}>
                        <List>
                            <ListItem>
                                <Thumbnail square size={80} source={{uri: searchData[i].content.url}}/>
                                <Body>
                                <Text>{(searchData[i].cityName).toUpperCase()}</Text>
                                <Text note> {searchData[i].content.hotelName}</Text>
                                </Body>
                                <Right>
                                    <TouchableOpacity  onPress={() => this.goPage(searchData[i],i)}>
                                        <Text style={{color: "blue",fontWeight:"400"}}>Go Page</Text>
                                    </TouchableOpacity>
                                </Right>
                            </ListItem>
                        </List>

                        </View>
                )
            }
        this.setState({renderArr:arr});
    }

    goPage(content1,objPlace){
        setTimeout(() => {
            var user = firebaseRef.auth().currentUser;
            let content = content1;
            let hotelKey = content.content.key;
            let userRate=0;
            firebaseRef.database().ref("hotelStars/" + user.uid + "/" + hotelKey).once("value").then((userStar)=>{
                if(userStar.val()===null){
                    userRate=0;
                }
                else{
                    userRate= userStar.val().rating;
                }
            }).then(()=>{
                Actions.hoteldetails({hotelContent: content,userStarRate:userRate,objPlace:objPlace});
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