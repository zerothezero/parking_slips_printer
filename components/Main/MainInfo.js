import {format} from 'date-fns';
import {th} from 'date-fns/locale';
import React, {Component} from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-elements';

export default class MainInfo extends Component {
	textStyle = {
		fontSize: 30,
		fontWeight: 'bold',
		flexWrap: 'wrap',
	};

	constructor(props) {
		super(props);
		this.state = {
			date: '',
			time: '',
			isBdYear: false,
		};
	}

	componentDidMount() {
		this.timer = setInterval(() => {
			const _date = new Date();
			const _locale = {locale: th};
			const year = format(_date, 'yyyy', _locale);
			const customYear = this.state.isBdYear ? parseInt(year) + 543 : year;
			this.setState({
				date: format(_date, 'EEE dd/MM/', _locale) + customYear,
				time: format(_date, 'HH:mm:ss', _locale),
			});
		}, 100);
	}

	componentWillUnmount() {
		clearInterval(this.timer);
	}

	render() {
		return (
			<View style={this.props.content}>
				<Text style={this.textStyle} onPress={() => {this.setState({isBdYear: !this.state.isBdYear});}}>{this.state.date}</Text>
				<Text style={this.textStyle}>{this.state.time}</Text>
			</View>
		);
	}
}
