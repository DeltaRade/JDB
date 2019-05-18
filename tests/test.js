const jndb = require('../index');
const x = new jndb.Connection();
x.use('users');
console.log(x.count);