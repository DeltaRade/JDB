const fs=require('fs')

let _defineProp=Symbol('_defineProp')
let _writeFile=Symbol('writeFile')
let _init=Symbol('init')
class JDB{

    /**
     *Creates an instance of JDB.
     *@param {string} table
     * @param {string} [path='.']
     */
    constructor(table,path='.'){
        this[_defineProp]('path',`${path}/jdb.json`,false)
        if(!fs.existsSync(this['path'])){
            this[_writeFile]({})
        }
        this[_init](table)
    }
      /**
     *
     *
     * @param {string|number} key
     * @param {*} val
     */
    insert(key,val){
        this[this['table']][key]=val
        this[_writeFile](this)
    }


    /**
     *
     *
     * @param {string|number} key
     * @returns {*}
     */
    obtain(key){
        return this[this['table']][key] || undefined
    }

    /**
     *
     *
     * @param {string|number} key
     */
    remove(key){
        this[this['table']][key]=undefined
        this[this['table']]=JSON.parse(JSON.stringify(this[this['table']]))
        this[_writeFile](this)
    }
    [_init](table){
        if(!this[table]){
            this[table]={}
        }
        this[_defineProp]('table',table)
        let data=fs.readFileSync(this['path'])
        data=JSON.parse(data)
        for(let i in data){
            this[i]=data[i]
        }
    }
    [_defineProp](prop,value,writable=true){
        Object.defineProperty(this,prop,{
            value:value,
            enumerable:false,
            writable:writable
        })
    }
    [_writeFile](value){
        fs.writeFileSync(this['path'],JSON.stringify(value))
    }
}
