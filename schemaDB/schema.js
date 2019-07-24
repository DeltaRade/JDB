let acceptedNames = ['Object', 'String', 'Number', 'Array', 'Date', 'Boolean'];

class Schema {
	constructor(obj) {
		let _schema = {};
		for (let i in obj) {
			if (!obj[i].name) {
				throw new Error('type must be a constructor');
			}
			if (!acceptedNames.includes(obj[i].name)) {
				throw new Error(`invalid type '${obj[i].name}'`);
			}
			_schema[i] = obj[i].name;
			this[i]=obj[i].name
		}
		//this.structure=_schema;
		//return _schema;
	}
}

module.exports = Schema;
