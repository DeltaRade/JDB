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

//compress data into jndb.dat
x.compress()

//return uncompressed data from that file
console.log(x.uncompress())


/*const fs=require('fs')
const zlib=require('zlib')
let string=fs.readFileSync('jndb.json')
let buff=zlib.gzipSync(string)
fs.writeFileSync('jndb.json',buff)
let data=fs.readFileSync('jndb.json')

let bf= Buffer.from(buff.toString('binary'),'binary')
//let jsn=zlib.inflateSync(bf)
console.log(zlib.gunzipSync(data))*/