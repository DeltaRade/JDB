const jndb = require('../index');
let tschema = new jndb.Schema.Schema({
	_id: String,
	index: Number,
	guid: String,
	isActive: Boolean,
	balance: String,
	picture: String,
	age: Number,
	eyeColor: String,
	name: String,
	gender: String,
	company: String,
	email: String,
	phone: String,
	address: String,
	about: String,
	registered: String,
	latitude: Number,
	longitude: Number,
	tags: Array,
	friends: Array,
	greeting: String,
	favoriteFruit: String,
});
let db = new jndb.Schema.DB();
db.setSchema(tschema);
//db.insert({id:1,mutes:{pp:{a:1}},pp:[[1],[2],{a:3}]})
let address = db.select('_id', '5d38c941593a83ae5f307fbd');

let hsstr = '';
for (let i in tschema) {
	hsstr += i;
}
let schemaHash = createHash(hsstr);
let prophash = '';
for (let i in address) {
	prophash += i + address[i];
}
console.log(schemaHash);
console.log(createHash(prophash));
let assert = require('assert');

function deepEqual(a, b) {
	try {
		assert.deepEqual(a, b);
	} catch (error) {
		if (error.name === 'AssertionError' || error.code === 'ERR_ASSERTION') {
			return false;
		}
		throw error;
	}
	return true;
}
function objectsAreEqual(a, b) {
	for (var prop in a) {
		if (a.hasOwnProperty(prop)) {
			if (b.hasOwnProperty(prop)) {
				if (typeof a[prop] === 'object') {
					if (!objectsAreEqual(a[prop], b[prop])) return false;
				} else {
					if (a[prop] !== b[prop]) return false;
				}
			} else {
				return false;
			}
		}
	}
	return true;
}

/**
 *
 * @param {string} path
 * @param {{}} obj
 */
function deepSearch(path, obj) {
	let props = path.split('.');
	if (!props.length || !path) return obj;
	if (typeof obj != 'object') return obj;
	if (obj[props[0]] != undefined) {
		return deepSearch(props.slice(1).join('.'), obj[props[0]]);
	}
}
function deepModification(path, obj, newval) {
	let props = path.split('.');
	//if(!props.length||!path)return obj
	//if(typeof obj!='object')return obj
	if (props[1] == undefined) {
		//|| obj[props[0]]==undefined
		obj[props[0]] = newval;
	}
	if (obj[props[0]] != undefined && typeof obj[props[0]] == 'object') {
		deepModification(props.slice(1).join('.'), obj[props[0]], newval);
	}
}
//console.log(deepSearch('friends.0.name',address),deepModification('friends.0.name',address,'test'),address)
console.log(deepEqual(tschema, address));
db.update('friends.0.name', 'Birkenau', 'Burke');
function createHash(string) {
	let crypto = require('crypto');
	return crypto
		.createHash('md5')
		.update(string, 'utf8')
		.digest('hex');
}
