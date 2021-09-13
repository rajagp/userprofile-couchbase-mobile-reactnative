import React from 'react'
import { SafeAreaView, Text, ActivityIndicator, FlatList, StatusBar, View, TextInput, Button } from 'react-native'
import { whole } from '../assets/styles/stylesheet'
import CbliteAndroid from 'react-native-cblite'
import { SearchBar } from 'react-native-elements'
import { TouchableOpacity } from 'react-native'


const CouchbaseNativeModule = CbliteAndroid;
export default class Query extends React.Component {


    static navigationOptions = {
        headerShown: false
    };

    state = {
        loaded: false,
        showpass: false,
        dbname: "universities",
        dataArray: []
    }

    constructor(props) {
        super(props);
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



    error_callback = (ErrorResponse) => {
        this.dismissLoading();
        alert(ErrorResponse);
        console.warn(ErrorResponse);
    }


    async search() {

        this.startLoading();

        let whereExpr = "LOWER(name) LIKE '%" + this.state.searchText.toLowerCase() + "%'";

        if (this.state.countrySearchText != null && this.state.countrySearchText != "") {
            let countryQueryExpr = "LOWER(country) LIKE '%" + this.countrySearchText.toLowerCase() + "%'";
            whereExpr += " AND " + countryQueryExpr;
        }

        let queryStr = "SELECT * FROM universities WHERE " + whereExpr;
        
        console.log(queryStr);
        CouchbaseNativeModule.query(this.state.dbname, queryStr, (response) => {


            if (response != null) {

                if (response.length > 0) {
                    var jsonArray = [];

                    response.forEach((object) => {
                        jsonArray.push(JSON.parse(object));
                    })

                    console.log(jsonArray);
                    this.setState({ dataArray: jsonArray })
                    this.dismissLoading();
                }
            }
        }, this.error_callback);


    }


    selectuni(name) {
        this.props.navigation.state.params.ongoback(name);
        this.props.navigation.goBack();
    }

    render() {

        return (

            <SafeAreaView style={whole.container}>

                <StatusBar backgroundColor="#fff" barStyle='dark-content' />

                <View style={whole.verticalLinearLayout}>

                    <View style={whole.searchHeader}>
                        <SearchBar lightTheme placeholder="Name" keyboardType='default' onChangeText={(searchText) => this.setState({ searchText })} value={this.state.searchText} />
                        <SearchBar lightTheme placeholder="Country (optional)" onChangeText={(countryText) => this.setState({ countryText })} value={this.state.countryText} />
                        <Button
                            title="Search"
                            color="#E62125"
                            style={whole.button}
                            onPress={() => this.search()}
                        />
                        <View style={whole.msearchtextinput}></View>
                    </View>
                 
                    {!this.state.loading ? null : <ActivityIndicator size="large" color="#E62125" />}
                 
                    <FlatList
                        data={this.state.dataArray}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) =>
                            <TouchableOpacity style={whole.listitem} onPress={() => this.selectuni(item.universities.name)}>
                                <Text style={whole.listMainText}>{item.universities.name}</Text>
                                <Text style={whole.listDescriptionText}>{item.universities.country}</Text>
                            </TouchableOpacity>
                        }
                    />



                </View>

            </SafeAreaView>


        );
    }
}
