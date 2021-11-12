import React from 'react'
import { SafeAreaView, Text, TouchableOpacity, StatusBar, DeviceEventEmitter, View, Button, Image, TextInput } from 'react-native'
import { whole } from '../assets/styles/stylesheet'
import { launchImageLibrary } from 'react-native-image-picker'
import CbliteAndroid from 'react-native-cblite'

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
        headerShown: true,

    };

    state = {
        loaded: false,
        UserObject: {},
        replicators: [],
        jsrepListner: "ReplicatorChangeEvent",
        jsqueryListner: "QueryChangeEvent",
        imagepath: require('../assets/img/avatar.png'),
    }

    constructor(props) {
        super(props);
    }

    setUserData = (successResponse) => {

        let result = successResponse;

        if (result != null && result != "Document is null") {

            var userobj = result;

            this.setState({
                UserObject: userobj,
                name: userobj.name,
                address: userobj.address,
                university: userobj.university
            });

            if (userobj.image) {

                CouchbaseNativeModule.getBlob(this.state.dbname, userobj.image, (imageBlob) => {

                    const encodedBase64 = imageBlob;
                    let imageuri = { uri: `data:${userobj.image.content_type};base64,${encodedBase64}` }
                    this.setState({
                        imagepath: imageuri,
                    });

                }, (errorResponse) => {
                    alert("There was a problem while fetching profile image. Details : " + errorResponse);
                });
            }

        }
    }

    getDocumentOnerrorCallback = (errorResponse) => {
        if (!errorResponse == "Document not found") {
            alert("There was a problem while fetching the user data. Details : " + errorResponse);
        }
    }

    componentDidMount = async () => {

        //setup
        var id = this.props.navigation.state.params.username;
        var replicatorID = this.props.navigation.state.params.ReplicatorID;
        let docId = `user::${id}`;
        let dbName = `userprofile`;

        this.setState({
            email: id,
            docid: docId,
            dbname: dbName,
            ReplicatorID : replicatorID
        });


        // Add JSlistener to replicator
        DeviceEventEmitter.addListener(this.state.jsrepListner, this.OnReplicatorChanged);

        // Enable Logging (null = All Domains)
        var loggingResponse = await CouchbaseNativeModule.enableConsoleLogging(null, "INFO")

        console.log("logging", loggingResponse);


        // Add Live Query
        this.setupLiveQuery();


    }


    OnReplicatorChanged = (event) => {
        console.log("Replicator Change Event", event);
    }

    setupLiveQuery = async () => {

        let queryStr = `SELECT * FROM ${this.state.dbname} WHERE META().id = "${this.state.docid}"`;
        this.setState({ queryStr });

        let queryResponse = await CouchbaseNativeModule.queryWithChangeListener(this.state.dbname, queryStr, this.state.jsqueryListner);
        console.log("query", queryResponse)

        if (queryResponse == "Success") {
            DeviceEventEmitter.addListener(this.state.jsqueryListner, this.onQueryUpdated);
        } else {
            alert("There was an issue while setting up sync")
        }

    }

    onQueryUpdated = (event) => {
        console.log("Query Change Event", event);
        let response = JSON.parse(event);
        if (response.length > 0) {
            this.setUserData(response[0].userprofile)
        }
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
                let mimagetype = response.assets[0].type;
                console.log(image, mimagetype)
                // You can also display the image using data:
                this.setState({
                    imagepath: source,
                    imagedata: image,
                    imagetype: mimagetype,
                });

            }
        });

    }

    error_callback = (ErrorResponse) => {
        alert(ErrorResponse)
    }

    saveProfile = () => {

        var data = this.state.UserObject;
        data.type = "user";
        data.email = this.state.email;
        data.name = this.state.name;
        data.address = this.state.address;
        data.university = this.state.university;

        if (this.state.imagedata) {
            let blob = CouchbaseNativeModule.setBlob(this.state.dbname, this.state.imagetype, this.state.imagedata);
            if (blob.length) {
                data.image = blob;
            }
        }
        console.log("User profile data", data);
        CouchbaseNativeModule.setDocument(this.state.dbname, this.state.docid, JSON.stringify(data), this.OnSetDocSuccess,
            (error) => {
                alert(error);
            });

    }

    OnSetDocSuccess = (result) => {

        if (result == 'Success') {
            alert('User Profile Updated');
        }
        else {
            alert('There was a problem while updating the user data. Details : ' + result);
        }

    }

    setuniversity = (name) => {
        this.setState({
            university: name,
        });
    }

    syncStop = async () => {

        //Stop Replication Listeners
        let ReplicatorListenerResponse = await CouchbaseNativeModule.replicationRemoveListener(this.state.dbname, this.state.ReplicatorID);
        if (ReplicatorListenerResponse == "Success") {
            DeviceEventEmitter.removeAllListeners(this.state.jsrepListner);
        }


        //Stop Replicators
        var ReplicatorStopResposne = await CouchbaseNativeModule.replicatorStop(this.state.dbname, this.state.ReplicatorID);
        if (ReplicatorStopResposne != "Success") {
            alert("Error while logout " + ReplicatorStopResposne)
        } else {

            //Stop Query Listener
            var querylistener = await CouchbaseNativeModule.removeQueryChangeListener(this.state.dbname, this.state.queryStr);
            if (querylistener != "Success")
                alert("Error while logout " + querylistener)
            else {
                DeviceEventEmitter.removeAllListeners(this.state.jsqueryListner);

                //Close DB and Logout
                this.logout();
            }
        }

    }

    logout = () => {

        //close userdb
        CouchbaseNativeModule.closeDatabase(this.state.dbname, (uDBsuccess) => {

            if (uDBsuccess == "Success") {

                //close universities db
                CouchbaseNativeModule.closeDatabase('universities', (uniDBSuccess) => {
                    this.props.navigation.goBack();
                }, this.error_callback);

            }
            else {
                this.error_callback();
            }
        }, this.error_callback);


    }

    render() {
        const { navigate } = this.props.navigation;
        return (

            <SafeAreaView style={whole.container}>

                <StatusBar translucent backgroundColor="transparent" barStyle='dark-content' />

                <View style={whole.verticalLinearLayout}>

                    <View style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>

                        <View>
                            <Image style={whole.profileImage} source={this.state.imagepath}></Image>

                            <Button
                                title="Upload Photo"
                                color="#E62125"
                                style={whole.btnUpload}
                                onPress={this.selectpicture}
                            />

                        </View>

                        <TextInput placeholder="Name" keyboardType='default' onChangeText={(username) => this.setState({ name: username })} style={whole.mtextinput} value={this.state.name} />
                        <TextInput placeholder="Email" editable={false} selectTextOnFocus={false} keyboardType='email-address' onChangeText={(username) => this.setState({ email: username })} style={whole.mtextinput} value={this.state.email} />
                        <TextInput placeholder="Address" keyboardType='default' onChangeText={(username) => this.setState({ address: username })} style={whole.mtextinput} value={this.state.address} />
                        <TouchableOpacity keyboardType='default' style={[whole.mselectinput, { justifyContent: 'space-between', flexDirection: 'row', alignContent: 'center', padding: 10 }]} onPress={() => { navigate("query", { ongoback: this.setuniversity }) }}>
                            <Text>{this.state.university ? this.state.university : "Select University"}</Text><Text>{">"}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={whole.centerLayoutProfile}>
                        <Button
                            title="Logout"
                            color="#E62125"
                            style={whole.button}
                            onPress={this.syncStop} />

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
