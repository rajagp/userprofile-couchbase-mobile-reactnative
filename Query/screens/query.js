import React from 'react'
import { SafeAreaView, Text, FlatList, StatusBar, View, TextInput, Button } from 'react-native'
import { whole } from '../assets/styles/stylesheet'
import CbliteAndroid from 'react-native-cblite'
import * as RNFS from 'react-native-fs'
import { SearchBar } from 'react-native-elements';
import { Icon } from "react-native-elements";
import { TouchableOpacity } from 'react-native'
import { zip, unzip, unzipAssets, subscribe } from 'react-native-zip-archive'


const CouchbaseNativeModule = CbliteAndroid;
export default class Query extends React.Component {


    static navigationOptions = {
        headerShown: false
    };

    state = {
        loaded: false,
        showpass: false,
        dataArray: []
    }

    constructor(props) {
        super(props);
    }



    componentDidMount() {
        this.checkCopyDatabase();
    }


    async checkCopyDatabase() {

        this.startLoading();

        let newDirectory = RNFS.DocumentDirectoryPath + "/UniversitiesDB";
        let newdbName = 'universities';
        let newconfig = {
            Directory: newDirectory
        }


        var dbexists = CouchbaseNativeModule.databaseExists(newdbName, newconfig) == "Database already exists";
        console.log("dbexists", dbexists);

        if (dbexists) {

            CouchbaseNativeModule.CreateOrOpenDatabase(newdbName, newconfig, this.success_callback, this.error_callback);

        }
        else {


            //copy from assets to documents folder to perform copydatabase
            let assetsDBFileName = "universities.zip";
            let tempDestination = `${RNFS.CachesDirectoryPath}/${assetsDBFileName}`;
            let dbTemp = `${RNFS.CachesDirectoryPath}/temp/`;
            let zipfile = await RNFS.readDirAssets("db");
    
            await RNFS.copyFileAssets(zipfile[0].path, tempDestination);
            await unzip(tempDestination,dbTemp);

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

                    CouchbaseNativeModule.CreateOrOpenDatabase(newdbName, newconfig, this.DBopen_success_callback, this.error_callback);

                }
                else {
                    alert("There was a problem while copying universities database.");
                }
                console.log("copydb", SuccessResponse)
            }
            , this.error_callback);

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




    DBopen_success_callback = (SuccessResponse) => {

        if (SuccessResponse == "Success" || SuccessResponse == "Database already exists") {

            let indexExpressions = ['name', 'location'];
            let indexName = "nameLocationIndex";

            var indexResponse = CouchbaseNativeModule.createValueIndex(this.state.dbname, indexName, indexExpressions);

            if (indexResponse == "Success") {
                this.dismissLoading();
                alert("Database setup complete you can search from universities now.");
            }

        }
        else {
            alert("There was a problem while opening database.");
        }

    }




    success_callback = (SuccessResponse) => {
        console.log(SuccessResponse)

        if (SuccessResponse == "Success" || SuccessResponse == "Database already exists") {

            this.dismissLoading();

        }
        else {
            alert("There was a problem while fetching universities.");
        }
    }



    error_callback = (ErrorResponse) => {
        this.dismissLoading();
        alert(ErrorResponse);
        console.warn(ErrorResponse);
    }






    async search() {

        let whereExpr = "LOWER(name) LIKE '%" + this.state.searchText.toLowerCase() + "%'";

        if (this.state.countrySearchText != null && this.state.countrySearchText != "") {
            let countryQueryExpr = "LOWER(country) LIKE '%" + this.countrySearchText.toLowerCase() + "%'";
            whereExpr += " AND " + countryQueryExpr;
        }

        let queryStr = "select country from universities limit 1";
        console.log(queryStr);
        CouchbaseNativeModule.query(this.state.dbname, queryStr, (response) => {
            console.log(response);
            this.setState({ dataArray: response })
            this.dismissLoading();
        }, this.error_callback);


    }


    render() {

        return (

            <SafeAreaView style={whole.container}>

                <StatusBar backgroundColor="#fff" barStyle='dark-content' />

                <View style={whole.verticalLinearLayout}>

                    <View style={whole.searchHeader}>
                        <SearchBar lightTheme showLoading={this.state.loading} placeholder="Name" keyboardType='default' onChangeText={(searchText) => this.setState({ searchText })} value={this.state.searchText} />
                        <SearchBar lightTheme showLoading={this.state.loading} placeholder="Country (optional)" onChangeText={(countryText) => this.setState({ countryText })} value={this.state.countryText} />
                        <Button
                            title="Search"
                            color="#E62125"
                            style={whole.button}
                            onPress={() => this.search()}
                        />
                        <View style={whole.msearchtextinput}></View>
                    </View>

                    <FlatList
                        data={this.state.dataArray}
                        renderItem={({ item }) =>
                            <TouchableOpacity style={whole.listitem}>
                                <Text style={whole.listMainText}>{item.name}</Text>
                                <Text style={whole.listDescriptionText}>{item.location}</Text>
                            </TouchableOpacity>

                        }
                    />



                </View>

            </SafeAreaView>


        );
    }
}
