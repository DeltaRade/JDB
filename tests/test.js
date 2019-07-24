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

let schemaStorage=[]
let acceptedNames=['Object','String','Number','Array','Date']
let typesWProps=['Object','Array']
function schema(obj){
    let _schema={}
    for(let i in obj){
        if(!obj[i].name){
            throw new Error('type must be a constructor')
        }
        if(!acceptedNames.includes(obj[i].name)){
            throw new Error(`invalid type '${obj[i].name}'`);
        }
        _schema[i]=obj[i].name
    }
    return _schema
}
function add(schema,object){
    let obj={}
    for(let i in object){
        let key=i,value=object[i]
    if(!schema[key]){
        throw new Error(`key '${key}' does not exist on schema`)
    }
    if(schema[key]!==value.constructor.name){
        throw new Error(`invalid type provided for '${key}': '${value.constructor.name}'; supported type is '${schema[key]}'`)
    }
    obj[key]=value
    }
    for(let v in schema){
        if(!obj[v]){
            obj[v]=null
        }
    }
    //let obj=schemaStorage
    //obj[key]=value
    schemaStorage.push(obj)
    return obj

}
function get(schema,key,value){
    let [k,prop]=key.split('.')
    //console.log(k,prop)
    for(let i of schemaStorage){
       if(!isSchema(schema,i)){continue}
       //console.log(i[key],value)
       if(prop){
           let found=i[k][prop]||i[k].find(x=>x==prop)
           if(found===value){
               return i
           }
       }
       if(i[key]!==value){continue}
       return i
    }
}

function delet(schema,key,value){
    let row=searchSchema(schema,key,value)
    if(!row)return;
    schemaStorage.splice(row.index,1)
}
function update(schema,key,searchValue,newValue){
    let [k,prop]=key.split('.')
    let row=searchSchema(schema,key,searchValue).row
    if(!row)return;
    if(prop){
        checkSchemaTypes(schema,k,newValue)
        row[k][prop]=newValue
        return row
    }
    checkSchemaTypes(schema,key,newValue)
    row[key]=newValue
    return row
}
function checkSchemaTypes(schema,key,value){
    if(!schema[key]){
        throw new Error(`key '${key}' does not exist on schema`)
    }
    if(schema[key]!==value.constructor.name){
        throw new Error(`invalid type provided for '${key}': '${value.constructor.name}'; supported type is '${schema[key]}'`)
    }
}
function searchSchema(schema,key,searchValue){
    let [k,prop]=key.split('.')
    //console.log(k,prop)
    
    for(let i in schemaStorage){
       if(!isSchema(schema,schemaStorage[i])){continue}
       //console.log(i[key],value)
       if(prop){
           if(!typesWProps.includes(schema[k])){throw new Error(`${k} is not an Object or Array`)}
           let found=schemaStorage[i][k][prop]||schemaStorage[i][k].find(x=>x==prop)
           if(found===searchValue){
               return {index:parseInt(i),value:found,row:schemaStorage[i]}
           }
       }
       if(schemaStorage[i][key]!==searchValue){continue}
       return {index:parseInt(i),value:schemaStorage[i][key],row:schemaStorage[i]}
    }
}
function isSchema(schema,row){
    for(let i in row){
        if(!schema[i]){
            return false
        }
    }
    return true
}

let sch=schema({
    init:Object,
    ammount:Number,
    pearls:Date,
    any:Array
})
let sch2=schema({
    pp:String
})
add(sch2,{pp:''})
add(sch,{init:{id:1},ammount:1,any:['pp','ooof']})
//console.log(schemaStorage)
//console.log(get(sch,'init.id',1))
update(sch,'init.id',1,{old:true})
//console.log(schemaStorage)
delet(sch,'ammount',1)
console.log(schemaStorage)
//console.log(searchSchema(sch,'pp','pp'))

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