import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

const database_name = 'parking.db';
const database_version = '1.0';
const database_displayname = 'Parking Slip Database';
const database_size = 100 * 1024 * 1024;

export default class Database {
	constructor() {
		// this._db = SQLite.openDatabase(
		// 	{name: name, createFromLocation: true},
		// 	() => { console.log('Database: opened');},
		// 	error => {console.log('Database: error', error);},
		// );
		this.openDB();
	}

	openDB = () => {
		SQLite
			.openDatabase({
				name: database_name,
				createFromLocation: true,
			})
			.then(r => {
				this._db = r;
			})
			.catch(e => {
				console.log(e);
			});
	};

	getDb = () => {
		console.log('-- getDb --', this._db);
		return this._db;
	};

	closeDb = () => {
		if (this._db) {
			try {
				this._db.close();
			} catch (error) {
				console.log(error);
			}
		} else {
			console.log('Database was not opened.');
		}
	};
}
