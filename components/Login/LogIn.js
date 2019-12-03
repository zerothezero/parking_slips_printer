import React, {Component} from 'react';
import {SafeAreaView, StatusBar, View} from 'react-native';
import {Button, Icon, Input, Text} from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';

export default class LogIn extends Component {
	// static username = null;
	//
	// constructor(props) {
	// 	super(props);
	// 	this.state = {
	// 		username: '',
	// 	};
	// }
	//
	// componentDidMount = async () => {
	// 	try {
	// 		LogIn.username = await AsyncStorage.getItem('lastUser');
	// 	} catch (e) {}
	// };
	//
	// login = async () => {
	// 	try {
	// 		await AsyncStorage.setItem('lastUser', this.state.username);
	// 	} catch (e) {}
	// };
	//
	// render() {
	// 	return (
	// 		<SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
	// 			<StatusBar barStyle="dark-content"/>
	// 			<View
	// 				style={{
	// 					borderWidth: 2,
	// 					borderStyle: 'solid',
	// 					borderColor: 'black',
	// 					width: '80%',
	// 					height: '50%',
	// 					paddingHorizontal: '3%',
	// 				}}
	// 			>
	// 				{LogIn.username && (
	// 					<Text>
	// 						Last User{' : '}
	// 						{LogIn.username}
	// 					</Text>
	// 				)}
	// 				<View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-evenly'}}>
	// 					<Input placeholder="ชื่อผู้ใช้งาน" style={{flex: 1}} inputStyle={{fontSize: 24}}
	// 						   leftIcon={<Icon name="face" size={48} type={'material'}/>}
	// 						   onChange={username => this.setState({username})} value={this.state.username}/>
	//
	// 					<Button title="เข้าใช้งาน" titleStyle={{fontSize: 24}} style={{flex: 1}} onPress={this.login}/>
	// 				</View>
	// 			</View>
	// 		</SafeAreaView>
	// 	);
	// }
}
