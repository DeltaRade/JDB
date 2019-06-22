const jndb = require('../index');
let x=new jndb.Connection()
x.use('data')
x.compress()
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