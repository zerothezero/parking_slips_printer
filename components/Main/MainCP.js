import React, {Component} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-elements';
import {Icon} from 'native-base';
import {formatNumber} from '../helper';

export default class MainCP extends Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false,
			cars: 0,
		};
	}

	show = () => {
		this.props.getCars();
		const cars = this.props.cars || 0;
		this.setState({visible: true, cars});
	};

	hide = () => {
		this.setState({visible: false});
	};

	render() {
		const cars = formatNumber(this.state.cars.toString());

		return (
			<TouchableOpacity activeOpacity={1} onPressIn={this.show} onPressOut={this.hide} style={this.props.content}>
				<View>
					{
						this.state.visible && (
							<>
								<Icon name='car-multiple' type={'MaterialCommunityIcons'} style={{alignSelf: 'center'}}/>
								<Text style={{fontSize: 24, fontWeight: 'bold', alignSelf: 'center'}}>{cars}</Text>
							</>
						)
					}
				</View>
			</TouchableOpacity>
		);
	}
}
