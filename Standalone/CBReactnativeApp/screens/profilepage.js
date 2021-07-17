import React from 'react';
import { SafeAreaView, StatusBar, Text, View, Keyboard, Button, ImageBackground, Image, TextInput, TouchableOpacity, ScrollView, PermissionsAndroid } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { whole } from '../assets/styles/stylesheet'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import CbliteAndroid from 'react-native-cblite-android';

const options = {
    title: 'Select image',
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};


const CouchbaseNativeModule = CbliteAndroid;

export default class Profile extends React.Component {

    static navigationOptions = {
        headerShown: true
    };

    state = {
        loaded: false,
        showpass: false,
        name: '',
        email: '',
        address: '',
        imagepath: require('../assets/img/avatar.png'),

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



        CouchbaseNativeModule.GetProfile((error, result) => {

              console.log("asd"+result);
            var userobj = JSON.parse(result);
            if (result!=null) {
                this.setState({
                    email: userobj.email,
                    name: userobj.name,
                    address: userobj.address,
                    imageData: userobj.imageData,
                });
            }
        });



    }

    selectpicture = () => {

        launchImageLibrary(options, (response) => {

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = { uri: response.assets[0].uri };

                // You can also display the image using data:

                this.setState({
                    imagepath: source,
                });

            }
        });

    }

    _saveProfile = () => {


        var userobj = {
            email: this.state.email,
            name: this.state.name,
            address: this.state.address,
            imageData: this.state.imagepath,
        };

        CouchbaseNativeModule.SetProfile(JSON.stringify(userobj), (error, result) => {
            console.log(result);
        });
    }

    async _logout() {

    }
    render() {
        var { navigate } = this.props.navigation;
        const { showAlertTwo, showAlert } = this.state;

        return (

            <SafeAreaView style={whole.container}>

                <StatusBar translucent backgroundColor="transparent" barStyle='dark-content' />

                <View style={whole.verticalLinearLayout}>

                    <View>
                        <Image style={{ width: wp('80%'), height: 120, marginBottom: 30, resizeMode: 'contain' }} source={this.state.imagepath}></Image>

                        <Button
                            title="Upload Photo"
                            color="#E62125"
                            style={{ marginTop: 10, width: 50 }}
                            onPress={this.selectpicture}
                        />

                    </View>

                    <View>
                        <TextInput placeholder="Name" keyboardType='default' onChangeText={(username) => this.setState({ name: username })} style={whole.mtextinput} value={this.state.name} />
                        <TextInput placeholder="Email" keyboardType='email-address' onChangeText={(username) => this.setState({ email: username })} style={whole.mtextinput} value={this.state.email} />
                        <TextInput placeholder="Address" keyboardType='default' onChangeText={(username) => this.setState({ address: username })} style={whole.mtextinput} value={this.state.address} />
                    </View>

                    <View style={[whole.centerLayout, { justifyContent: 'space-between', width: "50%" }]}>
                        <Button
                            title="Logout"
                            color="#E62125"
                            style={whole.button}
                            onPress={this._logout}
                        />

                        <Button
                            title="Save"
                            color="#888"
                            style={whole.button}
                            onPress={this._saveProfile}
                        />
                    </View>
                </View>




            </SafeAreaView>


        );
    }
}
