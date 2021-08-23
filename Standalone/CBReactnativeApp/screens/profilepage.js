import React from 'react';
import { SafeAreaView, StatusBar, DeviceEventEmitter, View, Button, Image, TextInput } from 'react-native';
import { whole } from '../assets/styles/stylesheet'
import { launchImageLibrary } from 'react-native-image-picker';
import CbliteAndroid from 'react-native-cblite';

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
        name: '',
        email: '',
        address: '',
        imagepath: require('../assets/img/avatar.png'),
    }

    constructor(props) {
        super(props);
    }

    getDocumentOnsuccessCallback = (successResponse) => {

        let result = successResponse;
        console.log(result.name);
        if (result != null && result != "Document is null") {
            var userobj = JSON.parse(result);

            if (userobj.image){
                CouchbaseNativeModule.getBlob(this.state.dbname, userobj.image, (imageBlob) => {
                   
                    const encodedBase64 = imageBlob;

                    let imageuri = { uri: `data:${userobj.image.content_type};base64,${encodedBase64}` }
                    this.setState({

                        name: userobj.name,
                        address: userobj.address,
                        imagepath: imageuri,
                    });

                }, (errorResponse) => {
                    alert("There was a problem while GET Blob : " + errorResponse);
                });
            }
            else {
                this.setState({
                    name: userobj.name,
                    address: userobj.address,
                });
            }
        }
    }

    getDocumentOnerrorCallback = (errorResponse) => {
        alert("There was a problem while GET DOCUMENT : " + errorResponse);
    }

    componentDidMount = () => {

        //setup
        var id = this.props.navigation.state.params.username;
        let docId = `user::<${id}>`;
        let dbName = `userprofile`;

        this.setState({
            email: id,
            docid: docId,
            dbname: dbName
        });

        CouchbaseNativeModule.getDocument(dbName, docId, this.getDocumentOnsuccessCallback, this.getDocumentOnerrorCallback);


        //add listeners
        var x = CouchbaseNativeModule.addChangeListener(dbName, docId);
        console.log(x);
        if(x=="Success")
        {
            //start listening
            DeviceEventEmitter.addListener('DatabaseChangeEvent', this.onDbchange);
        }    


    }

    onDbchange = (event) => {
        console.warn("event", event);
    };

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
                    imagedata: image,
                    imagetype: _imagetype,
                });

            }
        });

    }

    saveProfile = () => {


        if (this.state.imagedata) {
            let blob = CouchbaseNativeModule.setBlob(this.state.dbname, this.state.imagetype, this.state.imagedata);
            console.log("blob", blob);
            if (blob.length) {

                var data = {
                    type: "user",
                    name: this.state.name,
                    address: this.state.address,
                    image: blob
                };

                CouchbaseNativeModule.setDocument(this.state.dbname, this.state.docid, JSON.stringify(data), (result) => { console.log("setdcSUCESS", result); alert(result); }, (error) => { console.log("setdcERR", error); alert(error); });
            }


        }
        else {
            var data = {
                type: "user",
                name: this.state.name,
                address: this.state.address,
            };

            CouchbaseNativeModule.setDocument(this.state.dbname, this.state.docid, JSON.stringify(data), (result) => { alert(result); }, (error) => { alert(error); });
        }


    }

     logout = () => {

        //remove listners
        var removeListnerResponse = CouchbaseNativeModule.removeChangeListener(this.state.dbname);
        if (removeListnerResponse == "Success") {
            console.log(removeListnerResponse);
            //stop listeneing
            DeviceEventEmitter.removeAllListeners('OnDatabaseChange');
            let close = CouchbaseNativeModule.closeDatabase(this.state.dbname);
            console.log(close);
            this.props.navigation.goBack();
        }


    }

    render() {

        return (

            <SafeAreaView style={whole.container}>

                <StatusBar translucent backgroundColor="transparent" barStyle='dark-content' />

                <View style={whole.verticalLinearLayout}>

                    <View>
                        <Image style={whole.profileImage} source={this.state.imagepath}></Image>

                        <Button
                            title="Upload Photo"
                            color="#E62125"
                            style={whole.btnUpload}
                            onPress={this.selectpicture}
                        />

                    </View>

                    <View>
                        <TextInput placeholder="Name" keyboardType='default' onChangeText={(username) => this.setState({ name: username })} style={whole.mtextinput} value={this.state.name} />
                        <TextInput placeholder="Email" editable={false} selectTextOnFocus={false} keyboardType='email-address' onChangeText={(username) => this.setState({ email: username })} style={whole.mtextinput} value={this.state.email} />
                        <TextInput placeholder="Address" keyboardType='default' onChangeText={(username) => this.setState({ address: username })} style={whole.mtextinput} value={this.state.address} />
                    </View>

                    <View style={whole.centerLayoutProfile}>
                        <Button
                            title="Logout"
                            color="#E62125"
                            style={whole.button}
                            onPress={this.logout}
                        />

                        <Button
                            title="Save"
                            color="#888"
                            style={whole.button}
                            onPress={this.saveProfile}
                        />
                    </View>
                </View>




            </SafeAreaView>
        );
    }
}
