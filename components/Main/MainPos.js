import {Button, Icon, Text} from 'native-base';
import React, {Component} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {Grid, Row} from 'react-native-easy-grid';

const styles = StyleSheet.create({
	txtPlate: {
		borderColor: 'black',
		borderWidth: 2,
		borderStyle: 'dashed',
		borderRadius: 1,
		backgroundColor: 'white',
		marginHorizontal: '15%',
		marginTop: '4%',
		includeFontPadding: false,
		fontSize: 60,
		letterSpacing: 10,
		fontWeight: 'bold',
		textAlign: 'center',
		textAlignVertical: 'center',
		flex: 1,
	},
	btnPrint: {
		flex: 1,
		alignSelf: 'center',
		height: '65%',
		marginHorizontal: '15%',
	},
});

export default class MainPos extends Component {
	constructor(props) {
		super(props);
		this.state = {plate: ''};
	}

	handlePlate = plate => {
		this.setState({plate});
	};

	handlePrint = () => {
		this.props.printslip(this.state.plate);
		this.setState({plate: ''});
	};

	render() {
		return (
			<View style={this.props.content}>
				<Grid>
					<Row size={1}>
						<TextInput style={styles.txtPlate} autoFocus={true} autoCorrect={false} keyboardType="number-pad" autoCompleteType="off" textAlignVertical="center" value={this.state.plate} onChangeText={this.handlePlate} maxLength={4}/>
					</Row>
					<Row size={1}>
						<Button rounded success onPress={this.handlePrint} style={styles.btnPrint} disabled={!this.props.connected} iconLeft>
							<Icon name="print" style={{fontSize: 36}}/>
							<Text style={{fontSize: 36, fontWeight: 'bold', textAlignVertical: 'center'}}>Print</Text>
						</Button>
					</Row>
					{/*<Row size={5}/>*/}
				</Grid>
			</View>
		);
	}
}
