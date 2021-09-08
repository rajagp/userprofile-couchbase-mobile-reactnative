import React from 'react'
import { SafeAreaView, Text, FlatList, StatusBar, View, TextInput, Button } from 'react-native'
import { whole } from '../assets/styles/stylesheet'
import CbliteAndroid from 'react-native-cblite'
import * as RNFS from 'react-native-fs'
import { SearchBar } from 'react-native-elements';
import { Icon } from "react-native-elements";
import { widthPercentageToDP } from 'react-native-responsive-screen'
import { TouchableOpacity } from 'react-native'


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

        //test delete
        // var dbaexists = CouchbaseNativeModule.deleteDatabase(this.state.dbname);
        // console.log("dbdelete", dbaexists)

        if (SuccessResponse == "Success" || SuccessResponse == "Database already exists") {

            this.dismissLoading();

        }
        else {
            alert("There was a problem while fetching universities.");
        }
    }

    componentDidMount() {
        this.copyDatabase();
    }

    error_callback = (ErrorResponse) => {
        this.dismissLoading();
        alert("An error has occured : " + ErrorResponse);
        console.warn(ErrorResponse);
    }


    copyDatabase() {

        this.startLoading();

        let newDirectory = RNFS.DocumentDirectoryPath + "/Universities";
        let newdbName = 'universities';
        let newconfig = {
            Directory: newDirectory,
        }

        this.setState({
            dbname: newdbName,
            dbconfig: newconfig
        });

        let directory = RNFS.CachesDirectoryPath;
        let dbName = 'universities.cblite';
        let config = {
            Directory: directory,
        }

        var dbexists = CouchbaseNativeModule.databaseExists(newdbName, newconfig);
        console.log("dbexists", dbexists);

        if (dbexists == "Database already exists") {

            CouchbaseNativeModule.CreateOrOpenDatabase(newdbName, newconfig, this.success_callback, this.error_callback);

        }
        else {
            CouchbaseNativeModule.copyDatabase(dbName, newdbName, config, newconfig,
                (SuccessResponse) => {
                    if (SuccessResponse == "Success") {

                        CouchbaseNativeModule.CreateOrOpenDatabase(newdbName, newconfig, this.DBopen_success_callback, this.error_callback);

                    }
                    else {
                        alert("There was a problem while copying universities database.");
                    }
                }
                , this.error_callback);


        }

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


    async search() {

        let whereExpr = "LOWER(name) LIKE '%" + this.state.searchText.toLowerCase() + "%'";

        if (this.state.countrySearchText != null && this.state.countrySearchText != "") {
            let countryQueryExpr = "LOWER(country) LIKE '%" + this.countrySearchText.toLowerCase() + "%'";
            whereExpr += " AND " + countryQueryExpr;
        }

        let queryStr = "SELECT * FROM universities WHERE " + whereExpr;
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
