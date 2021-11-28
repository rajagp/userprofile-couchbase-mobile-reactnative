import React from 'react'
import { SafeAreaView, ActivityIndicator, StatusBar, View, Button, Image, TextInput } from 'react-native'
import { whole } from '../assets/styles/stylesheet'
import CbliteAndroid from 'react-native-cblite'
import * as RNFS from 'react-native-fs'
import { zip, unzip, unzipAssets, subscribe } from 'react-native-zip-archive'

const CouchbaseNativeModule = CbliteAndroid;
export default class Login extends React.Component {

    static navigationOptions = {
        headerShown: false
    };

    state = {
        showpass: false,
        loading: false,
        UniversitiesDBname: 'universities',
        UniversitiesDBconfig: { Directory: RNFS.DocumentDirectoryPath + "/universitydatabase" }
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.checkUniversitiesDBCopy();
    }

    async user_Login() {


        this.startLoading();

        if ((this.state.username) && (this.state.password)) {

            let directory = RNFS.DocumentDirectoryPath + "/" + this.state.username;
            let dbName = 'userprofile';
            let config = {
                Directory: directory,
            }

            CouchbaseNativeModule.CreateOrOpenDatabase(dbName, config, (SuccessResponse) => {

                if (SuccessResponse == "Success" || SuccessResponse == "Database already exists") {

                    CouchbaseNativeModule.CreateOrOpenDatabase(this.state.UniversitiesDBname, this.state.UniversitiesDBconfig, this.universities_dbcreated_success_callback, this.error_callback);

                    this.setupReplicator(dbName, this.state.username, this.state.password)

                }
                else {
                    alert("There was a problem while login.");
                }

            }, this.error_callback);
        }
        else {
            alert("Please enter Username and Password.");
        }
    }

    setupReplicator = async (dbname, authUsername, authpassword) => {

        this.startLoading();

        var config = {
            databaseName: dbname,
            continuous: true,
            target: "ws://10.0.2.2:4984/userprofile",
            authenticator: {
                authType: "Basic",
                username: authUsername,
                password: authpassword
            }
        }

        //Create Replicator
        let ReplicatorID = await CouchbaseNativeModule.createReplicator(dbname, config);
        console.log("ReplicatorID", ReplicatorID);


        //Add Replicator Listener
        let ReplicatorListenerResponse = await CouchbaseNativeModule.replicationAddListener(dbname, ReplicatorID, "ReplicatorChangeEvent");
        console.log("ReplicatorListenerResponse", ReplicatorListenerResponse);



        //Start Replicator
        let startReplicatorResponse = await CouchbaseNativeModule.replicatorStart(dbname, ReplicatorID);
        console.log("replicator started", startReplicatorResponse)

        if (startReplicatorResponse == "Success") {
            // Add Replicator ID
            this.setState({ ReplicatorID }, () => {
                this.loginSucess();
            });

        }
        else {
            console.error("Replicator starting error", eror)
        }


    }


    async checkUniversitiesDBCopy() {

        this.startLoading();

        let newdbName = this.state.UniversitiesDBname;
        let newconfig = this.state.UniversitiesDBconfig;


        var dbexists = CouchbaseNativeModule.databaseExists(newdbName, newconfig) == "Database already exists";

        if (!dbexists) {

            //copy from assets to documents folder to perform copydatabase
            let assetsDBFileName = "universities.zip";
            let tempDestination = `${RNFS.CachesDirectoryPath}/${assetsDBFileName}`;
            let dbTemp = `${RNFS.CachesDirectoryPath}/temp/`;
            let zipfile = await RNFS.readDirAssets("db");

            await RNFS.copyFileAssets(zipfile[0].path, tempDestination);
            await unzip(tempDestination, dbTemp);

            //copy database
            this.copyDatabase(dbTemp, newdbName, newconfig);

        }
        else {
            this.dismissLoading();
        }


        this.setState({
            dbname: newdbName,
            dbconfig: newconfig
        });
    }

    copyDatabase(directory, newdbName, newconfig) {
        let dbName = 'universities';
        let config = {
            Directory: directory
        }
        CouchbaseNativeModule.copyDatabase(dbName, newdbName, config, newconfig,
            (SuccessResponse) => {
                this.dismissLoading();
                if (SuccessResponse != "Success") {
                    alert("There was a problem while universities data setup.");
                }
            }
            , this.error_callback);

    }

    universities_dbcreated_success_callback = (SuccessResponse) => {

        if (SuccessResponse == "Success" || SuccessResponse == "Database already exists") {

            let indexExpressions = ['name', 'location'];
            let indexName = "nameLocationIndex";

            var indexResponse = CouchbaseNativeModule.createValueIndex(this.state.dbname, indexName, indexExpressions);
            console.log(indexResponse);

            if (indexResponse != "Success") {
                alert("Failed to load Universities data.");
            }

            this.dismissLoading();
        }
        else {
            alert("Failed to load Universities data.");
        }

    }


    loginSucess = () => {
        this.dismissLoading();
        this.props.navigation.navigate('profilescreen', { username: this.state.username, password: this.state.password, ReplicatorID: this.state.ReplicatorID });
        this.setState({ username: null, password: null });
    }

    error_callback = (ErrorResponse) => {
        console.log(ErrorResponse);
        alert("There was a problem while login : " + ErrorResponse);
        this.dismissLoading();
    }

    startLoading = () => {
        this.setState({
            loading: true,
        });
    }

    dismissLoading = () => {
        this.setState({
            loading: false,
        });
    }



    render() {

        return (

            <SafeAreaView style={whole.container}>

                <StatusBar translucent backgroundColor="transparent" barStyle='dark-content' />

                <View style={whole.verticalLinearLayout}>

                    <View style={whole.main} >
                        <Image style={whole.logoImage} source={require('../assets/img/logo.png')}></Image>
                    </View>

                    <View>
                        <TextInput placeholder="Email" keyboardType='email-address' onChangeText={(username) => this.setState({ username })} style={whole.mtextinput} value={this.state.username} />
                        <TextInput placeholder="Password" onChangeText={(password) => this.setState({ password })} value={this.state.password} style={whole.mtextinput} secureTextEntry={true} />
                    </View>

                    <Button
                        title="Sign in"
                        color="#E62125"
                        style={whole.button}
                        disabled={this.state.loading}
                        onPress={() => this.user_Login()}
                    />
                    {!this.state.loading ? null : <ActivityIndicator size="large" color="#E62125" />}
                </View>


            </SafeAreaView>


        );
    }
}
