const jndb = require('../index');
const x = new jndb.Connection();
const zlib=require('zlib');
const fs=require('fs')
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


// search the db for specific property matching
// returns an array of objects containing key and value
let kv=x.locate(v=>v=="doe")
console.log(kv,kv[0],kv[0].key,kv[0].value)

//compress data into jndb.dat
x.compress()

//return uncompressed data from that file
console.log(x.uncompress().json())


let str=fs.readFileSync('test.json')
let deflate=zlib.deflateSync(str)
fs.writeFileSync('deflate.dat',deflate)
let defdat=fs.readFileSync('deflate.dat')
let inflate=zlib.inflateSync(defdat)


let tbls=x.fetchAll()
let strmd=`# Table: ${x.table}\n| key | value | type |\n|-----|-------|------|\n`
for(let i in tbls){
    strmd +='|'+i+'|'+tbls[i]+'|'+typeof tbls[i]+'|\n'
}

fs.writeFileSync('test.md',strmd)
console.group(strmd)
//console.log(deflate.toString())


/*const fs=require('fs')
const zlib=require('zlib')
let string=fs.readFileSync('jndb.json')
let buff=zlib.gzipSync(string)
fs.writeFileSync('jndb.json',buff)
let data=fs.readFileSync('jndb.json')

let bf= Buffer.from(buff.toString('binary'),'binary')
//let jsn=zlib.inflateSync(bf)
console.log(zlib.gunzipSync(data))*/