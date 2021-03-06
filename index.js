const fs = require('fs');
const Path = require('path');
const zlib = require('zlib');
const { EventEmitter } = require('events');
const _defineProp = Symbol('_defineProp');
const _writeFile = Symbol('writeFile');
const _init = Symbol('init');
const _noTable = Symbol('noTable');
const engine = require('./engine').engine;

//@template {number|string} K
/**
 *
 * @class Connection
 */
class Connection {
	/**
	 *Creates an instance of Connection.
	 * @param {{path?:'.',fileName?:string}} [options]
	 */
	constructor(options = { path: '.', fileName: 'jndb.json' }) {
		options.fileName ? '' : (options.fileName = 'jndb.json');
		options.path ? '' : (options.path = '.');
		this[_defineProp]('path', `${options.path}/${options.fileName}`, false);
		this[_defineProp]('events', new EventEmitter());
		// this.events.on('write', async (value) => {
		// 	let data = require(Path.resolve(this.path));
		// 	data = value;
		//
		// 	let fd=await afs.open(this['path'],'w')
		// 	await afs.fsync(fd)
		// 	await afs.write(fd,Buffer.from(JSON.stringify(data, null, '\t')))
		// 	await afs.close(fd)
		// });
		if (!fs.existsSync(this['path'])) {
			fs.writeFileSync(this['path'], JSON.stringify({}, null, '\t'));
		}
		engine.syncData(this['path']);
		this[_init](options);
		return this;
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
		const data = engine.getParsedBuffer(this['path']);
		const length = Object.keys(data[this['table']]).length;
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
		this['debug'](`[debug][use] setting table to '${tableName}'`);
		this[_defineProp]('table', tableName, true);
		const data = engine.getParsedBuffer(this['path']);
		if (!data[tableName]) {
			data[tableName] = {};
			this[_writeFile](data);
		}
		return this;
	}
	/**
	 *	deletes a key from the database
	 * @param {string|number} key
	 * @returns {this}
	 */
	delete(key) {
		this[_noTable]();
		const data = engine.getParsedBuffer(this['path']);
		if (!data[this['table']][key]) {
			this['debug'](`[debug][delete] key '${key}' not found`);
			return this;
		}
		this['debug'](`[debug][delete] deleting key '${key}'`);
		delete data[this['table']][key];
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
		this['debug'](`[debug][has] checking if '${key}' exists`);
		let data = engine.getParsedBuffer(this['path']);
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
		const data = engine.getParsedBuffer(this['path']);
		data[this['table']][key] = value;
		this['debug'](
			`[debug][insert] inserting value '${JSON.stringify(
				value
			)}' with key '${key}'`
		);
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
		this['debug'](`[debug][fetch] fetching value with key '${key}'`);
		const data = engine.getParsedBuffer(this['path']);
		const val = data[this['table']][key];
		if (!this[key] && val) {
			this[key] = val;
		}
		return val || undefined;
	}
	/**
	 * fetch all table objects from the database directly and inserts  them into an array in the form of:`[ { key:string|number,value:any } ]`
	 * @returns {Array<{[key:string]:any}>}
	 */
	fetchArray() {
		this[_noTable]();
		this['debug']('[debug][fetchArray] fetching array of values');
		const arr = [];
		let data = engine.getParsedBuffer(this['path']);
		data = data[this['table']];
		for (const i in data) {
			arr.push({ [i]: data[i] });
		}
		return arr;
	}
	/**
	 * fetch all table objects from the database directly
	 * @returns {{[key:string]:any}}
	 * @memberof JNDBClient
	 */
	fetchAll() {
		this[_noTable]();
		this['debug']('[debug][fetchAll] fetching values');
		let data = engine.getParsedBuffer(this['path']);
		data = data[this['table']];
		// for(const i in data[this['table']]) {
		// this[i] = data[this['table']][i];
		// }
		return data;
	}
	/**
	 * short-hand helper for `if(!key){Connection.insert(key,value); Connection.get(key)}`
	 * @template T
	 * @param {string|number} key
	 * @param {T} defaultValue
	 * @returns {T}
	 * @example
	 * let db=new jndb.Connection('users')
	 * let value=db.secure('user1',{})
	 * console.log(value)// {}
	 *
	 */
	secure(key, defaultValue) {
		this[_noTable]();
		this['debug'](`[debug][secure] fetching value, key '${key}'`);
		const oldVal = this.fetch(key);
		if (!oldVal) {
			this['debug']('[debug][secure] inserting new value');
			this.insert(key, defaultValue);
			return defaultValue;
		}
		this['debug'](`[debug][secure] return old value with key '${key}'`);
		return oldVal;
	}
	/**
	 *
	 * @param {(value:any,key:string|number)=>boolean} fn
	 */
	locate(fn) {
		this['debug'](`[debug][locate] called with function:\n${fn}`);
		let res = [];
		let values = this.fetchAll();
		for (let i in values) {
			if (fn(values[i], i)) {
				res.push({ key: i, value: values[i] });
			}
		}
		return res;
	}
	/**
	 * compresses the database into a separate file called `jndb.dat`
	 * @returns {CompressedJSON}
	 */
	compress() {
		this['debug']('[debug][compress] compressing json data');
		const data = require(Path.resolve(this['path']));
		let buff = zlib.gzipSync(JSON.stringify(data));
		fs.writeFileSync('jndb.dat', buff);
		return new CompressedJSON(buff);
	}
	/**
	 * gets the compressed data from `jndb.dat` (if it exists)
	 */
	uncompress() {
		if (!fs.existsSync(Path.resolve('./jndb.dat'))) {
			throw new Error('jndb.dat doesnt exist to extract data from');
		}
		this['debug']('[debug][uncompress] uncompressing data');
		const data = fs.readFileSync(Path.resolve('./jndb.dat'));
		let buff = zlib.gunzipSync(data);
		return new CompressedJSON(buff);
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
	[_writeFile](data) {
		engine.writeFile(this['path'], data);
		this['debug'](
			`[debug][db] writing data\n${JSON.stringify(data, null, '\t')}`
		);
	}
	[_noTable]() {
		if (!this['table']) {
			throw new Error(
				'[table] is not defined use Connection.use to define one'
			);
		}
	}
	['debug'](message) {
		process.nextTick(() => {
			this.events.emit('debug', message);
		});
	}
}
exports.Connection = Connection;
exports.Schema = {
	DB: require('./schemaDB/db'),
	Schema: require('./schemaDB/schema'),
};
class CompressedJSON {
	constructor(buffer) {
		Object.defineProperty(this, 'buffer', {
			value: buffer,
			enumerable: false,
		});
	}
	get tables() {
		let tbls = [];
		let obj = this.object();
		for (let i in obj) {
			tbls.push(i);
		}
		return tbls;
	}
	/**
	 * @returns {{[key:string] :any}}
	 */
	object() {
		return JSON.parse(this.buffer.toString());
	}
	/**
	 * @returns {string}
	 */
	json() {
		return this.buffer.toString();
	}
	/**
	 * searches for a given key in all of the tables and returns it
	 * @param {string} key
	 */
	get(key) {
		let val = undefined;
		let obj = this.object();
		for (let i in obj) {
			if (obj[i][key]) {
				val = obj[i][key];
				break;
			}
		}
		return val;
	}
}
