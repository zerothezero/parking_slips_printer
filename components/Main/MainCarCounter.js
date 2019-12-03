import {View, Icon, Text} from 'native-base';
import React, {Component} from 'react';
import {formatNumber} from '../helper';

export default class MainCarCounter extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		let cars = formatNumber((isNaN(parseInt(this.props.cars)) ? 0 : this.props.cars).toString());
		console.log(cars);
		return (
			<View style={[this.props.content]}>
				<Icon name={'car-multiple'} type={'MaterialCommunityIcons'}/>
				<Text style={{fontSize: 20, fontWeight: 'bold'}}>{cars}</Text>
			</View>
		);
	}
}
