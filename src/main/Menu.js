import React, {Component} from "react";
import Drawer from "react-native-drawer";
import Dimensions from "Dimensions";
import {
    View,
    Image,
    TouchableOpacity,
    AsyncStorage,
    Keyboard
} from "react-native";
import {Button, Container,Text} from "native-base";
import SideBar from "../forms/SideBar";

import Head from "./Head";

const {height, width} = Dimensions.get('window');

export default class Menu extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    };

    drawer = null;

    render() {
        const drawerStyles = {
            drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3},
            main: {paddingLeft: 3},
        };

        return (
            <Drawer
                ref={(drawer) => this.drawer = drawer}
                type="overlay"
                openDrawerOffset={width / 2}
                tweenDuration={ 300 }
                closedDrawerOffset={-3}
                panCloseMask={0.2}
                styles={drawerStyles}
                tweenHandler={ (ratio) => {
                    return {
                        drawer: {shadowRadius: ratio < 0.2 ? ratio * 5 * 5 : 5},
                        main: {opacity: (2 - ratio) / 2}
                    }
                }}
                tapToClose={true}
                content={<SideBar closeToggle={this.closeDrawer}/>}>
                <Container>
                    <Head openToggle={this.openDrawer}/>
                    {this.renderContent()}
                </Container>
            </Drawer>
        );
    }


    renderContent() {
        throw new Error("override this method from your page");
    }

    openDrawer = () => {
        this.drawer.open();
    };

    closeDrawer=() => {
        this.drawer.close();
    };

    componentDidMount() {
        Keyboard.dismiss();
    }


}