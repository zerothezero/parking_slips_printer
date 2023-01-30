import { Buffer } from 'buffer';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import dateFormat from 'dateformat';
import { Button, Icon, Text } from 'native-base';
import React, { Component } from 'react';
import { DeviceEventEmitter, Platform, StyleSheet, View } from 'react-native';
import { BluetoothEscposPrinter, BluetoothManager } from 'react-native-bluetooth-escpos-printer';
import { Col, Grid, Row } from 'react-native-easy-grid';
import SQLite from 'react-native-sqlite-storage';
import { SafeAreaView } from 'react-navigation';
import { MenuProvider } from 'react-native-popup-menu';

import { footer1 as slipFooter1, footer2 as slipFooter2, header as slipHeader } from '../../app.json';
import { getError, itemToArray, toast } from '../helper';
import MainCP from './MainCP';
import MainInfo from './MainInfo';
import MainPos from './MainPos';
import MainRecentCars from './MainRecentCars';

global.Buffer = Buffer;
// console.ignoredYellowBox = ['Warning: Can'];

const database_name = 'parking.sqlite3';
// const database_version = '1.0';
// const database_displayname = 'Parking Slip Db';

const address = '02:04:36:C7:65:7A'; // MTP-II 02:04:36:C7:65:7A

export default class Main extends Component {
	events = [];

	constructor(props) {
		super(props);
		this.state = {
			plate: '',
			cars: 0,
			listCars: [],
			loading: false,
			connecting: false,
			connected: false // true if connected to printer - TODO: change back to false for production
		};
		this.getRecentCars();
	}

	componentDidMount() {
		if (Platform.OS === 'android') {
			this.events.push(
				DeviceEventEmitter.addListener(BluetoothManager.EVENT_CONNECTED, () => {
					this.setState({ connecting: false, connected: true });
				})
			);
			this.events.push(
				DeviceEventEmitter.addListener(BluetoothManager.EVENT_CONNECTION_LOST, () => {
					this.setState({ connecting: false, connected: false });
				})
			);
			this.events.push(
				DeviceEventEmitter.addListener(BluetoothManager.EVENT_UNABLE_CONNECT, () => {
					toast('Unable to Connect Printer');
					this.setState({ connecting: false, connected: false });
				})
			);
		}
		if (!this.state.connected) {
			this.connectPrinter();
		}
	}

	componentWillUnmount = () => {
		if (this.db) {
			this.db.close();
		}
	};

	opendb = () => {
		try {
			this.db = SQLite.openDatabase(
				{ name: database_name, createFromLocation: 1 },
				() => {},
				(error) => {
					toast(getError(error));
				}
			);
		} catch (e) {
			toast(getError(e));
		}
	};

	connectPrinter = () => {
		this.setState({ connecting: true });
		BluetoothManager.connect(address)
			.then(
				() => {
					this.setState({ connected: true });
				},
				(e) => {
					toast(getError(e));
					this.setState({ connected: false });
				}
			)
			.catch((e) => {
				toast(getError(e));
				this.setState({ connected: false });
			});
		this.setState({ connecting: false });
	};

	sql_today = () => {
		const _dateStart = new Date().toDateString() + ' 00:00:00',
			_dateEnd = new Date().toDateString() + ' 23:59:59';
		const start = format(new Date(_dateStart), 'TT', { locale: th }),
			end = format(new Date(_dateEnd), 'TT', { locale: th });

		return [ start, end ];
	};

	getCountCars = () => {
		this.opendb();
		this.db.transaction(
			(tx) => {
				const sql = 'select count(id) as "cars" from parking where created >= ? and created <= ?';
				const args = this.sql_today();
				tx.executeSql(
					sql,
					args,
					(tx, { rows }) => {
						const arrRows = itemToArray(rows);
						if (arrRows.length < 1) {
							this.setState({ cars: -1 });
						} else {
							this.setState({ cars: arrRows[0].cars });
						}
					},
					(error) => {
						toast(getError(error));
						this.setState({ cars: -1 });
					}
				);
			},
			(error) => {
				toast(getError(error));
				this.setState({ cars: -1 });
			}
		);
		this.db.close();
	};

	getRecentCars = () => {
		const sql = 'select * from parking where created >= ? and created <= ? order by id desc limit 5';
		const args = this.sql_today();

		this.opendb();
		this.db.transaction(
			(tx) => {
				tx.executeSql(
					sql,
					args,
					(tx, { rows }) => {
						const arrRows = itemToArray(rows);
						if (arrRows.length < 1) {
							this.setState({ listCars: [] });
						} else {
							this.setState({ listCars: arrRows });
						}
					},
					(error) => {
						toast(getError(error));
						// this.setState({listCars: []});
					}
				);
			},
			(error) => {
				toast(getError(error));
				this.setState({ cars: -1 });
			}
		);
		this.db.close();
	};

	printslip = (plate) => {
		this.setState({ plate });
		if (plate) {
			this.opendb();
			this.db.transaction((tx) => {
				const sql = 'insert into parking(plate, created_by) values (?,?)';
				const created_by = 'app';
				tx.executeSql(
					sql,
					[ plate, created_by ],
					(tx, { rowsAffected }) => {
						if (rowsAffected > 0) {
							this.print(plate);
						}
						this.getRecentCars();
					},
					(error) => {
						toast(getError(error));
					}
				);
			});
			this.db.close();
		}
	};

	reprintslip = (plate) => {
		if (plate) {
			this.print(plate);
		}
	};

	print = async (plate = '') => {
		const opts = { widthtimes: 0, heigthtimes: 0, fonttype: 0 };
		const opts2 = { widthtimes: 0, heigthtimes: 1, fonttype: 0 };
		await BluetoothEscposPrinter.printerInit();
		await BluetoothEscposPrinter.setBlob(0);
		await BluetoothEscposPrinter.printPic(slipHeader, { width: 180, left: 90 });
		await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
		await BluetoothEscposPrinter.printText('--------------------------------\r\n', opts);
		await BluetoothEscposPrinter.printText(dateFormat(new Date(), 'dd/mm/yyyy hh:MM:ss') + '\r\n', opts);
		await BluetoothEscposPrinter.printText('--------------------------------\r\n', opts);
		await BluetoothEscposPrinter.printColumn([ 16, 16 ], [ BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT ], [ 'Plate :', plate ], opts2);
		await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
		await BluetoothEscposPrinter.printText('--------------------------------\r\n', opts);
		await BluetoothEscposPrinter.printPic(slipFooter1, { width: 250, left: 60 });
		await BluetoothEscposPrinter.printPic(slipFooter2, { width: 250, left: 60 });
		// await BluetoothEscposPrinter.printText('-------------------------------\r\n\r\n', opts);
		await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', opts);

		// log printing
		// firebase realtime db
		// data structur
		// [date (Ymd)] : {
		//     [time (His)] : {
		//         'plat': [plat]
		//     }
		// }
	};

	render() {
		// alert(`state: [connecting] ${this.state.connecting.toString()} || [connected] ${this.state.connected.toString()}`);
		return (
			<MenuProvider backHandler={true}>
				<SafeAreaView style={StyleSheet.flatten([ defaultStyles.view, green ])}>
					<Grid>
						<Row size={0.8}>
							<Col size={1.8}>
								<MainInfo content={StyleSheet.flatten([ defaultStyles.content, defaultStyles.content_left ])} />
							</Col>
							<Col size={1}>
								<Row size={1}>
									{/*<MainCarCounter cars={null} content={StyleSheet.flatten([defaultStyles.content, defaultStyles.content_right])}/>*/}
									<View style={StyleSheet.flatten([ defaultStyles.content, defaultStyles.content_right ])}>
										<Button full disabled={this.state.connecting || this.state.connected} onPress={this.connectPrinter} style={{ flex: 1, alignSelf: 'center', alignItems: 'center', alignContent: 'center', justifyContent: 'center', width: '100%' }} iconLeft>
											<Icon name="printer" type={'SimpleLineIcons'} style={{ fontSize: 20 }} />
											<Text style={{ color: 'white', fontSize: 12 }}>{this.state.connected ? 'Connected' : 'Connect\nPrinter'}</Text>
										</Button>
									</View>
								</Row>
								<Row size={1}>
									<MainCP cars={this.state.cars} getCars={this.getCountCars} content={StyleSheet.flatten([ defaultStyles.content, defaultStyles.content_right ])} />
								</Row>
							</Col>
						</Row>
						<Row size={1.2}>
							<Col>
								<MainPos printslip={this.printslip} connected={this.state.connected} content={StyleSheet.flatten([ defaultStyles.content, defaultStyles.content_center ])} />
							</Col>
						</Row>
						<Row size={2}>
							<MainRecentCars onReprint={this.reprintslip} plates={this.state.listCars} connected={this.state.connected} style={StyleSheet.flatten([ defaultStyles.content, defaultStyles.content_bottom ])} />
						</Row>
					</Grid>
				</SafeAreaView>
			</MenuProvider>
		);
	}
}

// const pastel_yellow = {backgroundColor: '#fcffc9'};
// const pastel_green = {backgroundColor: '#c7ffc8'};
const green = { backgroundColor: '#28b672' };
const defaultStyles = StyleSheet.create({
	content: {
		backgroundColor: '#fcffc9',
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	content_left: {
		marginTop: 5,
		marginLeft: 5,
		marginRight: 2.5
	},
	content_right: {
		marginTop: 5,
		marginRight: 5,
		marginLeft: 2.5
	},
	content_center: {
		marginTop: 5,
		marginHorizontal: 5,
		flexDirection: 'row'
	},
	content_bottom: {
		margin: 5,
		flexDirection: 'row'
	},
	view: {
		flex: 1
	}
});
