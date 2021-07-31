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
    includeBase64: true
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

        //Fetchs profile data from Native module
         // {"dbname":"mydb" , "docid":"12312-sae12-31", "data":{"email":"abc@gmail.com","name":"Abc"}}
        
         let docargs={
            dbname : "userprofile",
            docid : "UniqueXYZ"
        }

        CouchbaseNativeModule.getDocument(JSON.stringify(docargs),(error, result) => {

           
           
            if (result!=null&&result!="Document is null") {
                var userobj = JSON.parse(result);

                if(userobj.image)
                CouchbaseNativeModule.getBlob(userobj.image,(error,ImageBlob)=>{
   
                   
                   console.log(userobj.image);
                   const encodedBase64 = ImageBlob;

                   let imageuri = {uri: `data:${userobj.image.content_type};base64,${encodedBase64}`}
                    this.setState({
                        email: userobj.email,
                        name: userobj.name,
                        address: userobj.address,
                        imagepath: imageuri,
                        });

                });
                else
                this.setState({
                    email: userobj.email,
                    name: userobj.name,
                    address: userobj.address,
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

                let image = response.assets[0].base64;
                let _imagetype = response.assets[0].type;
              //  console.log(image,imagetype)
                // You can also display the image using data:

                this.setState({
                    imagepath: source,
                    imagedata:image,
                    imagetype:_imagetype,
                });

            }
        });

    }

    _saveProfile = () => {


        if(this.state.imagedata)
        {
         let blob = CouchbaseNativeModule.setBlob(this.state.imagetype,this.state.imagedata);
      
            if(blob.length){
               
                var _data = {
                    email: this.state.email,
                    name: this.state.name,
                    address: this.state.address,
                    image : blob
                };


                var docargs = {
                    dbName : "userprofile",
                    data : _data,
                    docid : "UniqueXYZ"
                }

                CouchbaseNativeModule.setDocument(JSON.stringify(docargs),(error, result) => {
                   
                   if(!error) alert(result);
                 
                });

            }
            
        
        }
        else{
            var _data = {
                email: this.state.email,
                name: this.state.name,
                address: this.state.address,
            };


            var docargs = {
                dbName : "userprofile",
                data : _data,
                docid : "UniqueXYZ"
            }

            CouchbaseNativeModule.setDocument(JSON.stringify(docargs), (error, result) => {
               
                if(!error) alert(result);
             
            });
        }


    }

    async _logout() {

        let dbargs = {
            directory:'/'+this.state.username,
            dbName :'userprofile',
         }

        CouchbaseNativeModule.closeDatabase(dbargs.toString(), (error, result) => {
            this.props.navigation.goBack();
        });
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
