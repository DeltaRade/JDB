const fs = require('fs');
const Path = require('path');
const { EventEmitter } = require('events');
const _defineProp = Symbol('_defineProp');
const _writeFile = Symbol('writeFile');
const _init = Symbol('init');
const _checkUnused = Symbol('checkUnused');
const _noTable = Symbol('noTable');
/**
 * @class
 *  */
class Database {
	/**
	 *Creates an instance of JNDB. A difference from this, JNDBClient, doesn't load all the database contents making it perfect for huge amounts of data
	 *@param {string} table table to be used for saving/retrieving data from
	 * @param {string} [path='.']
	 */
	constructor(table, path = '.') {
		if (!table) {
			const err = new Error('Missing table name');
			throw err;
		}
		if (typeof table !== 'string') {
			throw new TypeError('table is not of type string');
		}
		this[_defineProp]('path', `${path}/jndb.json`, false);
		this[_defineProp]('events', new EventEmitter());
		this['events'].on('write', value => {
			const data = require(Path.resolve(this['path']));
			data[this['table']] ? '' : (data[this['table']] = {});
			data[this['table']] = value;
			fs.writeFileSync(this['path'], JSON.stringify(data, null, '\t'));
		});
		if (!fs.existsSync(this['path'])) {
			this[_writeFile]({});
		}
		this[_init](table);
	}
	/**
	 *
	 * @readonly
	 */
	get size() {
		return this.array().length;
	}
	[Symbol.iterator]() {
		// get the properties of the object
		const properties = Object.keys(this);
		let count = 0;
		// set to true when the loop is done
		let isDone = false;

		// define the next method, need for iterator
		const next = () => {
			// control on last property reach
			if (count >= properties.length) {
				isDone = true;
			}
			return { done: isDone, value: this[properties[count++]] };
		};

		// return the next method used to iterate
		return { next };
	}
	/**
	 * inserts a K,V pair into the selected table,automatically updates/replaces as needed
	 * @param {string|number} key
	 * @param {*} value
	 * @returns {this}
	 */
	insert(key, value) {
		if (!['string', 'number'].includes(typeof key)) {
			throw new TypeError('Key is neither a number or a string');
		}
		this[key] = value;
		this[_writeFile](this);
		return this;
	}

	/**
	 * converts the DB into array form
	 * where format is ``[{table: (string), rows: ({})}]``
	 *
	 * @returns {Array<{table:string,rows:{}}>}
	 */
	array() {
		const arr = [];
		for (const i in this) {
			arr.push({ [i]: this[i] });
		}
		return arr;
	}
	/**
	 * gets all of the Database's tables and exposes them in the format of `{ table:{key: value} }`
	 * @returns {{}}
	 */
	getAllTables() {
		const data = require(Path.resolve(this['path']));
		return data;
	}
	/**
	 * gets the value of the key, if no key is present it returns `undefined`
	 * @param {string|number} key
	 * @returns {*}
	 */
	get(key) {
		return this[key] || undefined;
	}
	/**
	 * remove a key from the table.
	 * @param {string|number} key
	 * @returns {this}
	 */
	remove(key) {
		if (!this[key]) {
			return this;
		}
		delete this[key];
		this[_writeFile](this);
		return this;
	}
	/**
	 *Searches for a single item where the given function returns a boolean value. Behaves like
	 * [Array.find()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find)
	 * @param {(value:*,key:string|number,this:this)=>boolean} fn
	 * @param {*} [thisArg]
	 * @returns {*}
	 */
	find(fn, thisArg) {
		if (thisArg) fn = fn.bind(thisArg);
		for (const value in this) {
			if (fn(this[value], value, this)) return this[value];
		}
		return undefined;
	}
	[_init](table) {
		this[_defineProp]('table', table);
		let data = fs.readFileSync(this['path']);
		data = JSON.parse(data);
		// this[table] = data[table] ? data[table] : {};
		for (const i in data[table]) {
			this[i] = data[table][i];
		}
	}
	[_defineProp](prop, value) {
		Object.defineProperty(this, prop, {
			value: value,
			enumerable: false,
		});
	}
	[_writeFile](value) {
		this['events'].emit('write', value);
		// fs.writeFileSync(this['path'], JSON.stringify(value, null, '\t'));
	}
}

/**
 *
 *	Noncache version of the latter, better for a big database
 * @class Connection
 */
class Connection {
	/**
	 *Creates an instance of JNDBClient.
	 * @param {string} table
	 * @param {{path:'.',fileName:string,fetchAll:false}} options
	 */
	constructor(
		options = { path: '.', fileName: 'jndb.json', fetchAll: false }
	) {
		options.fileName ? '' : (options.fileName = 'jndb.json');
		options.path ? '' : (options.path = '.');
		this[_defineProp]('path', `${options.path}/${options.fileName}`, false);
		this[_defineProp]('events', new EventEmitter());
		this.events.on('write', value => {
			let data = require(Path.resolve(this.path));
			data = value;
			fs.writeFileSync(this['path'], JSON.stringify(data, null, '\t'));
		});
		if (!fs.existsSync(this['path'])) {
			fs.writeFileSync(this['path'], JSON.stringify({}, null, '\t'));
		}
		this[_defineProp]('lastUsedKeys', []);
		this[_init](options);
	}
	[Symbol.iterator]() {
		// get the properties of the object
		const props = this.fetchAll();
		const properties = Object.keys(props);
		let count = 0;
		// set to true when the loop is done
		let isDone = false;

		// define the next method, need for iterator
		const next = () => {
			// control on last property reach
			if (count >= properties.length) {
				isDone = true;
			}
			return { done: isDone, value: props[properties[count++]] };
		};

		// return the next method used to iterate
		return { next };
	}
	/**
	 * gets the amount of entries from the database directly
	 * @readonly
	 */
	get count() {
		const data = require(Path.resolve(this['path']));
		const length = Object.keys(data[this.table]).length;
		return length;
	}
	/**
	 * selects the table to use
	 * @param {string} tableName
	 * @returns {this}
	 * @example
	 * let x=new jndb.Connection()
	 * x.use('users')
	 * if(x.has('john')){
	 *	x.use('specialUsers')
	 *	if(x.has('john')){
	*	console.log('john is special')
	*	}
	 * }
	 */
	use(tableName) {
		this[_defineProp]('table', tableName, true);
		const data = require(Path.resolve(this['path']));
		if (!data[tableName]) {
			data[tableName] = {};
			this[_writeFile](data);
		}
	}
	/**
	 *	deletes a key from the database
	 * @param {string|number} key
	 * @returns {this}
	 */
	delete(key) {
		this[_noTable]();
		const data = require(Path.resolve(this['path']));
		if (!data[this['table']][key]) {
			return this;
		}
		delete data[this['table']][key];
		delete this[key];
		this[_writeFile](data);
		return this;
	}
	/**
	 * checks if the database has a value
	 * @param {string|number} key
	 * @returns {boolean}
	 */
	has(key) {
		this[_noTable]();
		let data = require(Path.resolve(this['path']));
		data = data[this['table']];
		return data[key] ? true : false;
	}
	/**
	 * insert a value into the database
	 * @param {string|number} key
	 * @param {*} value
	 * @returns {this}
	 */
	insert(key, value) {
		this[_noTable]();
		this[_checkUnused]();
		const data = require(Path.resolve(this['path']));
		data[this['table']][key] = value;
		this[key] = value;
		this.lastUsedKeys.push(key);
		this[_writeFile](data);
		return this;
	}
	/**
	 * fetch a value from the database and adds it to this.
	 * @param {string|number} key
	 * @returns {*}
	 */
	fetch(key) {
		this[_noTable]();
		this[_checkUnused]();
		const data = require(Path.resolve(this['path']));
		const val = data[this['table']][key];
		if (!this[key] && val) {
			this[key] = val;
		}
		val ? this.lastUsedKeys.push(key) : '';
		return val || undefined;
	}
	/**
	 * fetch all table objects from the database directly and inserts  them into an array in the form of:`[ { key:string|number,value:any } ]`
	 * @returns {Array<{}>}
	 */
	fetchArray() {
		this[_noTable]();
		const arr = [];
		let data = require(Path.resolve(this['path']));
		data = data[this['table']];
		for (const i in data) {
			arr.push({ [i]: data[i] });
		}
		return arr;
	}
	/**
	 * fetch all table objects from the database directly
	 * @returns {{}}
	 * @memberof JNDBClient
	 */
	fetchAll() {
		this[_noTable]();
		let data = require(Path.resolve(this['path']));
		data = data[this['table']];
		// for(const i in data[this['table']]) {
		// this[i] = data[this['table']][i];
		// }
		return data;
	}
	/**
	 * short-hand helper for `if(!key){Connection.insert(key,value); Connection.get(key)}`
	 *
	 * @param {string|number} key
	 * @param {any} defaultValue
	 * @returns {any}
	 * @example
	 * let db=new jndb.Connection('users')
	 * let value=db.secure('user1',{})
	 * console.log(value)// {}
	 *
	 */
	secure(key, defaultValue) {
		this[_noTable]();
		const oldVal = this.fetch(key);
		if (!oldVal) {
			this.insert(key, defaultValue);
			return defaultValue;
		}
		return oldVal;
	}

	[_init](options) {
		if (options.fetchAll) {
			this.fetchAll();
		}
	}
	[_defineProp](prop, value, writable) {
		Object.defineProperty(this, prop, {
			value: value,
			enumerable: false,
			writable,
		});
	}
	[_checkUnused]() {
		const lastUsed = this.lastUsedKeys;
		if (lastUsed.length >= 5) {
			const lastvalue = lastUsed.splice(0, 1);
			const has = lastUsed.find(x => x == lastvalue[0]);
			if (has) {
				return;
			}
			delete this[lastvalue];
		}
	}
	[_writeFile](data) {
		this.events.emit('write', data);
	}
	[_noTable]() {
		if (!this['table']) {
			throw new Error(
				'[table] is not defined use Connection.use to define one'
			);
		}
	}
}
exports.Database = Database;
exports.Connection = Connection;
