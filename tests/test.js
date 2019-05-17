const jndb = require('../index');
const x = new jndb.Connection('users');
for(const i of x) {
	console.log(i);
}