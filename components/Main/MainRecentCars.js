import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, ListItem, Text, Tooltip} from 'react-native-elements';
import {Menu, MenuTrigger, MenuOptions, renderers} from 'react-native-popup-menu';
import {dt_format} from '../helper';

const TooltipReprint = (props) => {
	const {text, plate, onReprint, connected} = props;
	return (
		<Menu renderer={renderers.Popover} rendererProps={{placement: 'right', preferredPlacement: 'right', anchorStyle: {left: '40%'}}}>
			<MenuTrigger disabled={!connected} text={text}/>
			<MenuOptions optionsContainerStyle={{width: '40%', left: '40%'}}>
				<Button type='clear' title={'พิมพ์'} onPress={() => { onReprint(plate); }}/>
			</MenuOptions>
		</Menu>
	);
};

export default class MainRecentCars extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showReprint: false,
		};
	}

	show = () => {
		this.setState({showReprint: true});
	};

	hide = () => {
		this.setState({showReprint: false});
	};

	render() {
		return (
			<View style={[this.props.style, style.section]}>
				<Text style={style.header}>รถที่เข้ามาล่าสุด 5 คัน</Text>
				{
					this.props.plates && this.props.plates.map((item, index) => (
						<ListItem
							key={item.id}
							title={item.plate}
							rightElement={
								<TooltipReprint
									plate={item.plate}
									onReprint={this.props.onReprint}
									onSelect={this.hide}
									connected={this.props.connected}
									text={dt_format(item.created, 'HH:mm:ss')}
								/>
							}
							bottomDivider={index !== this.props.plates.length}
							style={style.list}
							// containerStyle={{paddingVertical: 6}}
						/>
					))
				}
			</View>
		);
	}
}

const style = StyleSheet.create({
	section: {
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'stretch',
	},
	header: {
		marginVertical: '2%',
		textAlign: 'center',
		fontSize: 24,
		fontWeight: 'bold',
	},
	list: {
		marginLeft: '10%',
		marginRight: '20%',
	},
});
