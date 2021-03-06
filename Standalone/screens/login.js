import React from 'react';
import { SafeAreaView, StatusBar, View, Button, Image, TextInput } from 'react-native';
import { whole } from '../assets/styles/stylesheet'
import * as Cblite from 'react-native-cblite';
import * as RNFS from 'react-native-fs';

const CouchbaseNativeModule = Cblite;
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


    success_callback = (SuccessResponse) => {

        console.log(SuccessResponse);

        if (SuccessResponse == "Success" || SuccessResponse == "Database already exists") {

            this.props.navigation.navigate('profilescreen', { username: this.state.username });

            this.setState({username:null,password:null});

        }
        else {
            alert("There was a problem while login.");
        }
    }


    error_callback = (ErrorResponse) => {
        console.log(ErrorResponse);
        alert("There was a problem while login : " + ErrorResponse);

    }


    async user_Login() {

        if ((this.state.username) && (this.state.password)) {

            let _directory = RNFS.CachesDirectoryPath + "/" + this.state.username;
            let dbName = 'userprofile';
            let config = { Directory: _directory, }
            CouchbaseNativeModule.CreateOrOpenDatabase(dbName, config, this.success_callback, this.error_callback);
        
        }
        else {
            alert("Please enter Username and Password.");
        }
    }


    render() {

        return (

            <SafeAreaView style={whole.container}>

                <StatusBar translucent backgroundColor="transparent" barStyle='dark-content' />

                <View style={whole.verticalLinearLayout}>

                    <View style={whole.main} >
                        <Image style={whole.logoImage} resizeMode='contain' source={require('../assets/img/logo.png')}></Image>
                    </View>

                    <View>
                        <TextInput placeholder="Email" autoCapitalize="none" keyboardType='email-address' onChangeText={(username) => this.setState({ username })} style={whole.mtextinput} value={this.state.username} />
                        <TextInput placeholder="Password" autoCapitalize="none" onChangeText={(password) => this.setState({ password })} value={this.state.password} style={whole.mtextinput} secureTextEntry={true} />
                    </View>

                    <Button
                        title="Sign in"
                        color="#E62125"
                        style={whole.button}
                        onPress={() => this.user_Login()}
                        accessibilityLabel="Learn more about this purple button"
                    />

                </View>


            </SafeAreaView>


        );
    }
}
