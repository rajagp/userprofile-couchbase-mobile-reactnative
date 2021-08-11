import React from 'react';
import { SafeAreaView, StatusBar, Text, View, Keyboard, Button, ImageBackground, Image, TextInput, TouchableOpacity, ScrollView, PermissionsAndroid } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { whole } from '../assets/styles/stylesheet'
import CbliteAndroid from 'react-native-cblite-android';
import * as RNFS from 'react-native-fs';

const CouchbaseNativeModule = CbliteAndroid;
export default class Login extends React.Component {

    static navigationOptions = {
        headerShown: false
    };

    state = {
        loaded: false,
        showpass: false,
    }

    constructor(props) {
        super(props);
    }

    showAlert = () => {
        this.setState({
            showAlert: true,
            showAlertTwo: false
        });
    };

    hideAlert = () => {
        this.setState({
            showAlert: false
        });
    };


    componentDidMount = () => {



    }


    success_callback = (SuccessResponse) => {

        if (SuccessResponse=="Database Created") {

            this.props.navigation.navigate('profilescreen', {username:this.state.username});
        
        }
        else {
            alert("There was a problem while login.");
        }
    }


    error_callback = (ErrorResponse) => {
       
            alert("There was a problem while login : "+ErrorResponse);
 
    }


    async _userLogin() {

        if ((this.state.username) && (this.state.password)) {

           // CouchbaseNativeModule.init();
           
              let  _directory = RNFS.DocumentDirectoryPath+"/"+this.state.username;
              let dbName = 'userprofile';
             let config = {
                Directory : _directory,
             }

            CouchbaseNativeModule.createDatabase(dbName,config,this.success_callback,this.error_callback);
        }
        else {
            alert("Please enter Username and Password.");
        }
    }


    render() {
        var { navigate } = this.props.navigation;
        const { showAlertTwo, showAlert } = this.state;

        return (

            <SafeAreaView style={whole.container}>

                <StatusBar translucent backgroundColor="transparent" barStyle='dark-content' />

                <View style={whole.verticalLinearLayout}>

                    <View style={whole.main} >
                        <Image style={{ width: wp('50%'), height: 120, marginTop: hp('10%'), resizeMode: 'center' }} source={require('../assets/img/logo.png')}></Image>
                    </View>

                    <View>
                        <TextInput placeholder="Email" keyboardType='email-address' onChangeText={(username) => this.setState({ username })} style={whole.mtextinput} value={this.state.username} />
                        <TextInput placeholder="Password" onChangeText={(password) => this.setState({ password })} value={this.state.password} style={whole.mtextinput} secureTextEntry={true} />
                    </View>

                    <Button
                        title="Sign in"
                        color="#E62125"
                        style={whole.button}
                        onPress={() => this._userLogin()}
                        accessibilityLabel="Learn more about this purple button"
                    />

                </View>


            </SafeAreaView>


        );
    }
}
