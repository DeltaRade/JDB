const fs = require('fs');
const { EventEmitter } = require('events');
const _defineProp = Symbol('_defineProp');
const _writeFile = Symbol('writeFile');
const _init = Symbol('init');
const _tableCheck = Symbol('tableCheck');
class JDB {

	/**
     *Creates an instance of JDB.
     *@param {string} table table to be used for saving/retrieving data from
     * @param {string} [path='.']
     */
	constructor(table, path = '.') {
		this[_defineProp]('path', `${path}/jndb.json`, false);
		this[_defineProp]('events', new EventEmitter());
		this['events'].on('write', (value)=>{
			console.log(value);
			fs.writeFileSync(this['path'], JSON.stringify(value, null, '\t'));
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
     */
	insert(key, value) {
		this[this['table']][key] = value;
		this[_writeFile](this);
	}

	/**
     * converts the DB into array form
     * where format is ``[{table: (string), rows: ({})}]``
     *
     * @returns {Array<any>}
     */
	array() {
		const arr = [];
		for(const i of Object.keys(this)) {
			arr.push({ table:i, rows:this[i] });
		}
		return arr;
	}
	/**
     *  switches the table that the DB saves/retrieves data from
     * @param {string} table table to switch to
     */
	switch(table) {
		this['table'] = table;
	}
	/**
     * creates a new table
     * @param {string} table
     */
	create(table) {
		if(!this[table]) {
			this[table] = {};
		}
	}
	/**
	 * gets the value of the key, if no key is present it returns `undefined`
     * @param {string|number} key
     * @returns {*}
     */
	obtain(key) {
		return this[this['table']][key] || undefined;
	}
	/**
	 * deletes an entire table from the database
     * @param  {string} table
     */
	collapse(table) {
		if(!this[_tableCheck](table)) {
			throw new Error(`table (${table}) does not exist`);
		}
		delete this[table];
		this[_writeFile](this);
	}
	/**
	 * remove a key from the table.
     * @param {string|number} key
     */
	remove(key) {
		this[this['table']][key] = undefined;
		this[this['table']] = JSON.parse(JSON.stringify(this[this['table']]));
		this[_writeFile](this);
	}
	[_init](table) {
		if(!this[table]) {
			this[table] = {};
		}
		this[_defineProp]('table', table);
		let data = fs.readFileSync(this['path']);
		data = JSON.parse(data);
		for(const i in data) {
			this[i] = data[i];
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
	[_tableCheck](table) {
		return this[table] ? true : false;
	}
}
module.exports = JDB;