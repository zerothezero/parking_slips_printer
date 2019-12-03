/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import AsyncStorage from '@react-native-community/async-storage';
import React, {Component} from 'react';
import {ActivityIndicator, SafeAreaView, StatusBar} from 'react-native';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import LogIn from './components/Login/LogIn';
import Main from './components/Main/Main';

// TODO : implement authen & author
class CheckAuth extends Component {
	componentDidMount() {
		this._checkUser();
	}

	_checkUser = async () => {
		try {
			const {navigate} = this.props.navigation;
			const user = await AsyncStorage.getItem('lastUser') + '_test';
			// TODO : For now speedy production, skip log in.
			navigate(user ? 'Main' : 'Login');
		} catch (e) {
			alert(e);
		}
	};

	render() {
		return (
			<SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
				<StatusBar barStyle="dark-content"/>
				<ActivityIndicator/>
			</SafeAreaView>
		);
	}
}

const naviLogin = {
	routes: {
		Login: LogIn,
	},
	config: {
		headerMode: 'none',
	},
};
const LoginStack = createStackNavigator(naviLogin.routes, naviLogin.config);

const naviMain = {
	routes: {
		Main: Main,
	},
	config: {
		headerMode: 'none',
	},
};
const AppStack = createStackNavigator(naviMain.routes, naviMain.config);

const naviContainer = {
	Auth: CheckAuth,
	Login: LoginStack,
	Main: AppStack,
};
// TODO: skip Authen. and Login
const AppContainer = createAppContainer(createSwitchNavigator(naviContainer, {initialRouteName: 'Main'}));

export default AppContainer;
