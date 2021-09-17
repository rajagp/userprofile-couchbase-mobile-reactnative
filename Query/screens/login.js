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
    }

    constructor(props) {
        super(props);
    }


    async user_Login() {

        if ((this.state.username) && (this.state.password)) {

            let directory = RNFS.DocumentDirectoryPath + "/" + this.state.username;
            let dbName = 'userprofile';
            let config = {
                Directory: directory,
            }

            CouchbaseNativeModule.CreateOrOpenDatabase(dbName, config, this.userdb_success_callback, this.error_callback);
        }
        else {
            alert("Please enter Username and Password.");
        }
    }

    userdb_success_callback = (SuccessResponse) => {


        if (SuccessResponse == "Success" || SuccessResponse == "Database already exists") {
            this.checkCopyDatabase();
        }
        else {
            alert("There was a problem while login.");
        }
    }

    async checkCopyDatabase() {

        this.startLoading();

        let newDirectory = RNFS.DocumentDirectoryPath + "/universitydatabase";
        let newdbName = 'universities';
        let newconfig = {
            Directory: newDirectory
        }


        var dbexists = CouchbaseNativeModule.databaseExists(newdbName, newconfig) == "Database already exists";
        

        if (dbexists) {

            CouchbaseNativeModule.CreateOrOpenDatabase(newdbName, newconfig, this.dbexists_success_callback, this.error_callback);

        }
        else {

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
                if (SuccessResponse == "Success") {

                    CouchbaseNativeModule.CreateOrOpenDatabase(newdbName, newconfig, this.universities_dbcreated_success_callback, this.error_callback);

                }
                else {
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

            if (indexResponse == "Success") {
                this.dismissLoading();
                this.props.navigation.navigate('profilescreen', { username: this.state.username });
                this.setState({ username: null, password: null });
            }

        }
        else {
            alert("Failed to load Universities data.");
        }

    }

    dbexists_success_callback = (SuccessResponse) => {


        if (SuccessResponse == "Success" || SuccessResponse == "Database already exists") {

            this.dismissLoading();
            this.props.navigation.navigate('profilescreen', { username: this.state.username });
            this.setState({ username: null, password: null });
        }
        else {
            alert("Failed to load Universities data.");
        }
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
