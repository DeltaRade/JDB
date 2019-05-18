const jndb = require('../index');
const x = new jndb.Connection();
x.use('users');
for(const i of x) {
	console.log(i);
}