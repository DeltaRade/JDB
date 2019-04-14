const fs = require('fs');
const { EventEmitter } = require('events');
const _defineProp = Symbol('_defineProp');
const _writeFile = Symbol('writeFile');
const _init = Symbol('init');
/**
 * @class JNDB
 */
class JNDB {

	/**
     *Creates an instance of JNDB.
     *@param {string} table table to be used for saving/retrieving data from
     * @param {string} [path='.']
     */
	constructor(table, path = '.') {
		if(!table) {
			const err = new Error('Missing table name');
			throw err;
		}
		this[_defineProp]('path', `${path}/jndb.json`, false);
		this[_defineProp]('events', new EventEmitter());
		this['events'].on('write', (value)=>{
			const data = require(this['path']);
			data[this['table']] ? '' : data[this['table']] = {};
			data[this['table']] = value;
			fs.writeFileSync(this['path'], JSON.stringify(data, null, '\t'));
		});
		if(!fs.existsSync(this['path'])) {
			this[_writeFile]({});
		}
		this[_init](table);
	}
	/**
       * inserts a K,V pair into the selected table,automatically updates/replaces as needed
     * @param {string|number} key
     * @param {*} value
	 * @returns {this}
     */
	insert(key, value) {
		if(!['string', 'number'].includes(typeof key)) {
			throw new Error('Key is neither a number or a string');
		}
		this[key] = value;
		this[_writeFile](this);
		return this;
	}

	/**
     * converts the DB into array form
     * where format is ``[{table: (string), rows: ({})}]``
     *
     * @returns {Array<any>}
     */
	array() {
		const arr = [];
		for(const i in this) {
			arr.push({ [i]:this[i] });
		}
		return arr;
	}
	/**
	 * gets all of the Database's tables and exposes them in the format of `{ table:{key: value}}`
	 * @returns {{}}
	 */
	getAllTables() {
		const data = require(this['path']);
		return data;
	}
	/**
	 * gets the value of the key, if no key is present it returns `undefined`
     * @param {string|number} key
     * @returns {*}
     */
	obtain(key) {
		return this[key] || undefined;
	}
	/**
	 * remove a key from the table.
     * @param {string|number} key
	 * @returns {this}
     */
	remove(key) {
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
	/**
	 *
	 * @param {(value:any,key:string|number,this:this)=>boolean} fn
	 * @param {*} [thisArg]
	 * @returns {{}}
	 */
	filter(fn, thisArg) {
		if (thisArg) fn = fn.bind(thisArg);
		const results = {};
		for (const key in this) {
			if (fn(this[key], key, this)) results[key] = this[key];
		}
		return results;
	}
	[_init](table) {
		this[_defineProp]('table', table);
		let data = fs.readFileSync(this['path']);
		data = JSON.parse(data);
		// this[table] = data[table] ? data[table] : {};
		for(const i in data[table]) {
			this[i] = data[table][i];
		}

	}
	[_defineProp](prop, value) {
		Object.defineProperty(this, prop, {
			value:value,
			enumerable:false,
		});
	}
	[_writeFile](value) {
		this['events'].emit('write', value);
		// fs.writeFileSync(this['path'], JSON.stringify(value, null, '\t'));
	}
}
// const x = new JNDB('people');
module.exports = JNDB;

class Result {
	constructor(object) {
		if(typeof object != 'object') {throw new TypeError('value give is not of type object');}
		this.fullResult = {};
		this.keys = [];
		this.values = [];
		for(const i in object) {
			this.fullResult[i] = object.i;
			this.keys.push(i);
			this.values.push(object[i]);
		}
	}

	/**
	 *
	 * @param {(value:any,key:string|number,this:this)=>boolean} fn
	 * @param {*} [thisArg]
	 * @returns {Result}
	 */
	filter(fn, thisArg) {
		if (thisArg) fn = fn.bind(thisArg);
		const results = new Result({});
		for (const key in this) {
			if (fn(this[key], key, this)) results[key] = this[key];
		}
		return results;
	}

	has(key) {
		return this.fullResult[key] ? true : false;
	}
}