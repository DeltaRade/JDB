# Documentation
- [Documentation](#documentation)
  - [`class JNDB` (`Database`)](#class-jndb-database)
    - [`constructor(table, path = '.')`](#constructortable-path)
    - [`get size()`](#get-size)
    - [`insert(key, value)`](#insertkey-value)
    - [`array()`](#array)
    - [`getAllTables()`](#getalltables)
    - [`get(key)`](#getkey)
    - [`remove(key)`](#removekey)
    - [`find(fn, thisArg)`](#findfn-thisarg)
  - [`class JNDBClient` (`Connection`)](#class-jndbclient-connection)
    - [`constructor(table, options)`](#constructortable-options)
    - [`get count()`](#get-count)
    - [`delete(key)`](#deletekey)
    - [`has(key)`](#haskey)
    - [`insert(key, value)`](#insertkey-value-1)
    - [`fetch(key)`](#fetchkey)
    - [`fetchArray()`](#fetcharray)
    - [`fetchAll()`](#fetchall)
- [Example](#example)
  - [`Database`](#database)
  - [`Connection`](#connection)
- [Issues](#issues)
## `class JNDB` (`Database`)
main class

### `constructor(table, path = '.')`

 * **Parameters:**
   * `table` — `string` — table to be used for saving/retrieving data from
   * `[path='.']` — `string` — 

### `get size()`


### `insert(key, value)`

inserts a K,V pair into the selected table,automatically updates/replaces as needed

 * **Parameters:**
   * `key` — `string|number` — 
   * `value` — `*` — 
 * **Returns:** `this` — 

### `array()`

converts the DB into array form where format is ``[{table: (string), rows: ({})}]``

 * **Returns:** `Array<{table:string,rows:{}}>` — 

### `getAllTables()`

gets all of the Database's tables and exposes them in the format of `{ table:{key: value} }`

 * **Returns:** `{}` — 

### `get(key)`

gets the value of the key, if no key is present it returns `undefined`

 * **Parameters:** `key` — `string|number` — 
 * **Returns:** `*` — 

### `remove(key)`

remove a key from the table.

 * **Parameters:** `key` — `string|number` — 
 * **Returns:** `this` — 

### `find(fn, thisArg)`

[Array.find()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find)

 * **Parameters:**
   * `fn` — `(value:*,key:string|number,this:this)=>boolean` — 
   * `[thisArg]` — `*` — 
 * **Returns:** `*` — 

## `class JNDBClient` (`Connection`)

Noncache version of the latter, better for a big database


### `constructor(table, options)`

 * **Parameters:**
   * `table` — `string` — 
   * `{{path:'.',fetchAll:false}}` — 

### `get count()`

gets the amount of entries from the database directly


### `delete(key)`

deletes a key from the database

 * **Parameters:** `key` — `string|number` — 
 * **Returns:** `this` — 

### `has(key)`

checks if the database has a value

 * **Parameters:** `key` — `string|number` — 
 * **Returns:** `boolean` — 

### `insert(key, value)`

insert a value into the database

 * **Parameters:**
   * `key` — `string|number` — 
   * `value` — `*` — 
 * **Returns:** `this` — 

### `fetch(key)`

fetch a value from the database and adds it to this.

 * **Parameters:** `key` — `string|number` — 
 * **Returns:** `*` — 

### `fetchArray()`

fetch all table objects from the database directly and inserts them into an array in the form of:`[ { key:string|number,value:any } ]`

 * **Returns:** `Array<{}>` — 

### `fetchAll()`

fetch all table objects from the database directly

 * **Returns:** `{}` — 

# Example
## `Database`
`index.js`
```js
const jndb=require('jndb')
let db=new jndb.Database('users')
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

## `Connection`
`index.js`
```js
const jndb=require('jndb')
let db=new jndb.Connection('users')
db.fetchAll()
// {john:'doe'}
```
# Issues
You can post issues [here](https://github.com/DeltaRade/jndb/issues).
If you have any questions you can join [the discord server](https://discord.gg/6n4Eda5).