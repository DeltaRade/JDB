const jndb = require('../index');
const x = new jndb.Connection();
// select the table that is going to be used
x.use('users');


console.log(x.count);
x.insert('mr john','doe')
console.log(x.count)

// returns undefined if value cannot be obtained
console.log(x.fetch('unknown'))

//fetch table items into an object
let obj=x.fetchAll();
for(let i in obj){
    console.log(i,obj[i])
}

// fetch table items as an array of objects
console.log(x.fetchArray())
