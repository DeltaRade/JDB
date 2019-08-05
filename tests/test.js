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

let tschema=new jndb.Schema.Schema({
    _id:String,
    index:Number,
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
	friends:Array,
	greeting: String,
	favoriteFruit: String
})
let db=new jndb.Schema.DB()
db.setSchema(tschema)
//db.insert({id:1,mutes:{pp:{a:1}},pp:[[1],[2],{a:3}]})
let address=db.select('_id','5d38c941593a83ae5f307fbd')

let hsstr=''
for(let i in tschema){
	hsstr+=i
}
let schemaHash=createHash(hsstr)
let prophash=''
for(let i in address){
	prophash+=i+address[i]
}
console.log(schemaHash)
console.log(createHash(prophash))
let assert = require("assert");

function deepEqual(a, b) {
    try {
	  assert.deepEqual(a, b);
    } catch (error) {
      if (error.name === "AssertionError"||error.code === 'ERR_ASSERTION') {
        return false;
      }
      throw error;
    }
    return true;
};
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
function deepSearch(path,obj){
	let props=path.split('.')
	if(!props.length||!path)return obj
	if(typeof obj!='object')return obj
		if(obj[props[0]]!=undefined){
			return deepSearch(props.slice(1).join('.'),obj[props[0]])
		}
		
}
function deepModification(path,obj,newval){
	let props=path.split('.')
	//if(!props.length||!path)return obj
	//if(typeof obj!='object')return obj
	if(props[1]==undefined){ //|| obj[props[0]]==undefined
		obj[props[0]]=newval
	}
	if(obj[props[0]]!=undefined&&typeof obj[props[0]]=='object'){
		deepModification(props.slice(1).join('.'),obj[props[0]],newval)
	}
		
}
//console.log(deepSearch('friends.0.name',address),deepModification('friends.0.name',address,'test'),address)
console.log(deepEqual(tschema,address))
db.update('friends.0.name','Birkenau','Burke')
function createHash(string) {
	let crypto=require('crypto')
	return crypto
		.createHash('md5')
		.update(string, 'utf8')
		.digest('hex');
}
x.events.on('debug',(msg)=>{
	console.log(msg)
})
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