import React, { Component } from 'react';
import { View,StatusBar,AppRegistry } from 'react-native';
import Login from './screens/login'
import Profile from './screens/profilepage'
import { createAppContainer, NavigationActions } from 'react-navigation';
import { createStackNavigator } from "react-navigation-stack";
import { whole } from './assets/styles/stylesheet'

import NavigationService from "./assets/components/navigationservice";

const Navigation = createStackNavigator({
 
  loginscreen: { screen: Login },
  profilescreen: { screen: Profile , 
    navigationOptions: {
    headerTitle:'User Profile' 
  },},

});   

const AppContainer = createAppContainer(Navigation);

class App extends Component {
  constructor() {
    super();
  }

render() {
  return (
  
    <View style={whole.container}>
        <AppContainer
            ref={(navigatorRef) => {
              NavigationService.setTopLevelNavigator(navigatorRef);
            }}
            onNavigationStateChange={() => {
              this.setState({ loaded: true });
            }}
          />
      <StatusBar style="auto" />
    </View>

  );
}
}

export default App;

AppRegistry.registerComponent("app", () => App);
