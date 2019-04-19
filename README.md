# Documentation
- [Documentation](#documentation)
  - [`constructor(table, path = '.')`](#constructortable-path)
  - [`insert(key, value)`](#insertkey-value)
  - [`array()`](#array)
  - [`getAllTables()`](#getalltables)
  - [`get(key)`](#getkey)
  - [`remove(key)`](#removekey)
  - [`find(fn, thisArg)`](#findfn-thisarg)
- [Example](#example)
- [Issues](#issues)


## `constructor(table, path = '.')`

 * **Parameters:**
   * `table` — `string` — table to be used for saving/retrieving data from
   * `[path='.']` — `string` — 

## `insert(key, value)`

inserts a K,V pair into the selected table,automatically updates/replaces as needed

 * **Parameters:**
   * `key` — `string|number` — 
   * `value` — `*` — 
 * **Returns:** `this` — 

## `array()`

converts the DB into array form where format is ``[{table: (string), rows: ({})}]``

 * **Returns:** `Array<{table:string,rows:{}}>` — 

## `getAllTables()`

gets all of the Database's tables and exposes them in the format of `{ table:{key: value} }`

 * **Returns:** `{}` — 

## `get(key)`

gets the value of the key, if no key is present it returns `undefined`

 * **Parameters:** `key` — `string|number` — 
 * **Returns:** `*` — 

## `remove(key)`

remove a key from the table.

 * **Parameters:** `key` — `string|number` — 
 * **Returns:** `this` — 

## `find(fn, thisArg)`
Searches for a single item where the given function returns a boolean value. Behaves like
[Array.find()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find)

 * **Parameters:**
   * `fn` — `(value:*,key:string|number,this:this)=>boolean` — 
   * `[thisArg]` — `*` — 
 * **Returns:** `*` — 

# Example
`index.js`
```js
const jndb=require('jndb')
let db=new jndb('users')
db.insert('john','doe')
```
`jndb.json`
```json
{
  "users":{
    "john":"doe"
  }
}
```

# Issues
You can post issues [here](https://github.com/DeltaRade/jndb/issues).
If you have any questions you can join [the discord server](https://discord.gg/6n4Eda5).