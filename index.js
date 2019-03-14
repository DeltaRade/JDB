const fs=require('fs')
let _defineProp=Symbol('_defineProp')
let _writeFile=Symbol('writeFile')
let _init=Symbol('init')
let _tableCheck=Symbol('tableCheck')
class JDB{

    /**
     *Creates an instance of JDB.
     *@param {string} table table to be used for saving/retrieving data from
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
       * inserts a K,V pair into the selected table,automatically updates/replaces as needed
     * @param {string|number} key
     * @param {*} value
     */
    insert(key,value){
        this[this['table']][key]=value
        this[_writeFile](this)
    }
    
    /**
     * converts the DB into array form
     * where format is ``[{table: (string), rows: ({})}]``
     * 
     * @returns {Array<any>}
     */
    array(){
        let arr=[]
        for(let i of Object.keys(this)){
            arr.push({table:i,rows:this[i]})
        }
        return arr
    }
    /**
     *  switches the table that the DB saves/retrieves data from
     * @param {string} table table to switch to
     */
    switch(table){
        this['table']=table
    }
    /**
     *
     * @param {string} table
     */
    create(table){
        if(!this[table]){
        this[table]={}
        }
    }
    /**
     * @param {string|number} key
     * @returns {*}
     */
    obtain(key){
        return this[this['table']][key] || undefined
    }
    /**
     * @param  {string} table
     */
    collapse(table){
        if(!this[_tableCheck](table)){
            throw new Error(`table (${table}) does not exist`)
        }
        delete this[table]
        this[_writeFile](this)
    }
    /**
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
    [_defineProp](prop,value){
        Object.defineProperty(this,prop,{
            value:value,
            enumerable:false,
        })
    }
    [_writeFile](value){
        fs.writeFileSync(this['path'],JSON.stringify(value,null,'\t'))
    }
    [_tableCheck](table){
        return this[table] ? true : false
    }
}
module.exports=JDB
let x=new JDB('users')
x.insert('gavriel',{skills:['archery','sword-fighting','magic']})
console.log(x)