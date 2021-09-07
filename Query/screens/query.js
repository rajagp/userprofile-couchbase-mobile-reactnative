import React from 'react'
import { SafeAreaView,Text,FlatList, StatusBar, View, TextInput,Button } from 'react-native'
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
        dataArray:[]
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


    async search() {

        if ((this.state.username) && (this.state.password)) {

            let _directory = RNFS.DocumentDirectoryPath + "/" + this.state.username;
            let dbName = 'userprofile';
            let config = {
                Directory: _directory,
            }

            CouchbaseNativeModule.CreateOrOpenDatabase(dbName, config, this.success_callback, this.error_callback);
        }
        else {
            alert("Please enter Username and Password.");
        }
    }


    render() {

        return (

            <SafeAreaView style={whole.container}>

                <StatusBar backgroundColor="#fff" barStyle='dark-content' />

                <View style={whole.verticalLinearLayout}>

                    <View style={whole.searchHeader}>
                        <SearchBar lightTheme placeholder="Name" keyboardType='default' onChangeText={(username) => this.setState({ username })} value={this.state.username} />
                        <SearchBar lightTheme placeholder="Country (optional)" onChangeText={(password) => this.setState({ password })} value={this.state.password} />
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
                        renderItem={({item}) => 
                        <TouchableOpacity style={whole.listitem}>
                            <Text style={whole.listMainText}>{item.key}</Text>
                            <Text style={whole.listDescriptionText}>{item.key}</Text>
                        </TouchableOpacity>
                        
                    }
                    />



                </View>

            </SafeAreaView>


        );
    }
}
