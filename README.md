- [Installation](#Installation)
- [Docs](#Docs)
  - [`class Connection`](#class-Connection)
    - [`constructor(table, options)`](#constructortable-options)
    - [`get count()`](#get-count)
    - [`delete(key)`](#deletekey)
    - [`has(key)`](#haskey)
    - [`insert(key, value)`](#insertkey-value)
    - [`fetch(key)`](#fetchkey)
    - [`fetchArray()`](#fetchArray)
    - [`fetchAll()`](#fetchAll)
    - [`compress()`](#compress)
    - [`uncompress()`](#uncompress)
- [Usage](#Usage)
- [Issues](#Issues)

# Installation

master: `npm i DeltaRade/jndb`<br>
stable: `npm i jndb`

# Docs

## `class Connection`

### `constructor(table, options)`

-   **Parameters:**
    -   `table` — `string` —
    -   `{{path:'.',fetchAll:false}}` —

### `get count()`

gets the amount of entries from the database directly

### `delete(key)`

deletes a key from the database

-   **Parameters:** `key` — `string|number` —
-   **Returns:** `this` —

### `has(key)`

checks if the database has a value

-   **Parameters:** `key` — `string|number` —
-   **Returns:** `boolean` —

### `insert(key, value)`

insert a value into the database

-   **Parameters:**
    -   `key` — `string|number` —
    -   `value` — `*` —
-   **Returns:** `this` —

### `fetch(key)`

fetch a value from the database and adds it to this.

-   **Parameters:** `key` — `string|number` —
-   **Returns:** `*` —

### `fetchArray()`

fetch all table objects from the database directly and inserts them into an array in the form of:`[ { key:string|number,value:any } ]`

-   **Returns:** `Array<{}>` —

### `fetchAll()`

fetch all table objects from the database directly

-   **Returns:** `{}` —

### `compress()`

compresses the database into a separate file called `jndb.dat`

-   **Returns:** `CompressedJSON` —

### `uncompress()`

gets the compressed data from `jndb.bat` (if it exists)

-   **Returns:** `CompressedJSON` —
-   
# Usage

```js
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

// search the table for specific property matching
// returns an array of objects containing key and value
let kv=x.locate(v=>v=="doe")
console.log(kv,kv[0],kv[0].key,kv[0].value)

//compress data into jndb.dat
x.compress()

//return uncompressed data from that file
console.log(x.uncompress().json())
```

# Issues

You can post issues [here](https://github.com/DeltaRade/jndb/issues).
