let fs = require('fs');
let path = require('path');
let { EventEmitter } = require('events');
let typesWProps = ['Object', 'Array'];
class DB {
	constructor(options = { fileName: 'schDB.json', path: '.' }) {
		options.fileName ? '' : (options.fileName = 'schDB.json');
		options.path ? '' : (options.path = '.');
		this._schema = null;
		this._path = options.path + '/' + options.fileName;
		this._events = new EventEmitter();
		this._events.on('write', (data) => {
			fs.writeFileSync(this._path, JSON.stringify(data, null, '\t'));
		});
		if (!fs.existsSync(path.resolve(this._path))) {
			fs.writeFileSync(this._path, JSON.stringify([], null, '\t'));
		}
	}
	/**
	 *
	 * @param {import('./schema')} schema
	 */
	setSchema(schema) {
		if (schema.constructor.name !== 'Schema')
			throw new Error('Schema must be from Schema class');
		this._schema = schema;
		return this;
	}
	insert(object) {
		let obj = {};
		let storage = require(path.resolve(this._path));
		for (let i in object) {
			let key = i,
				value = object[i];
			if (!this._schema[key]) {
				throw new Error(`key '${key}' does not exist on schema`);
			}
			if (this._schema[key] !== value.constructor.name) {
				throw new Error(
					`invalid type provided for '${key}': '${
						value.constructor.name
					}'; supported type is '${this._schema[key]}'`
				);
			}
			obj[key] = value;
		}
		for (let v in this._schema) {
			// @ts-ignore
			if (!obj[v]) {
				// @ts-ignore
				obj[v] = null;
			}
		}
		storage.push(obj);
		this._write(storage);
		return obj;
	}
	select(key, value) {
		let storage = require(path.resolve(this._path));
		let row = this._searchSchema(storage, key, value);
		if (!row) return;
		return row.row;
	}

	update(key, searchValue, newValue) {
		let [k, prop] = key.split('.');
		let storage = require(path.resolve(this._path));
		let row = this._searchSchema(storage, key, searchValue).row;
		if (!row) return;
		if (prop) {
			this._checkSchemaTypes(k, newValue);
			row[k][prop] = newValue;
			return row;
		}
		this._checkSchemaTypes(key, newValue);
		row[key] = newValue;
		this._write(storage);
		return row;
	}

	delete(key, value) {
		let storage = require(path.resolve(this._path));
		let row = this._searchSchema(storage, key, value);
		if (!row) return;
		let spliced = storage.splice(row.index, 1);
		this._write(storage);
		return spliced;
	}
	_checkSchemaTypes(key, value) {
		if (!this._schema)
			throw new Error(
				'Schema is not defined, define it first using setSchema'
			);
		if (!this._schema[key]) {
			throw new Error(`key '${key}' does not exist on schema`);
		}
		if (this._schema[key] !== value.constructor.name) {
			throw new Error(
				`invalid type provided for '${key}': '${
					value.constructor.name
				}'; supported type is '${this._schema[key]}'`
			);
		}
	}
	/**
	 *
	 * @param {*} container
	 * @param {string} key
	 * @param {any} searchValue
	 */
	_searchSchema(container, key, searchValue) {
		let [k, prop] = key.split('.');
		for (let i in container) {
			if (!this._isSchema(container[i])) {
				continue;
			}
			if (prop) {
				if (!typesWProps.includes(this._schema[k])) {
					throw new Error(
						`${k} is not a type that supports keys or indexes`
					);
				}
				let found = this._resolve(key, container[i]);
				if (found === searchValue) {
					return {
						index: parseInt(i),
						value: found,
						row: container[i],
					};
				}
			}
			if (container[i][key] !== searchValue) {
				continue;
			}
			return {
				index: parseInt(i),
				value: container[i][key],
				row: container[i],
			};
		}
	}
	_isSchema(row) {
		for (let i in this._schema) {
			if (!(i in row)) {
				return false;
			}
		}
		//for (let i in row) {
		//	if (!this._schema[i]) {
		//		return false;
		//	}

		//}
		return true;
	}
	_resolve(path, obj) {
		return path.split('.').reduce(function(prev, curr) {
			return prev ? prev[curr] : null;
		}, obj || self);
	}
	_write(data) {
		this._events.emit('write', data);
	}
}
module.exports = DB;
