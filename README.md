# Documentation

## `constructor(table, path = '.')`

 * **Parameters:**
   * `table` — `string` — table to be used for saving/retrieving data from
   * `[path='.']` — `string` — 

## `insert(key, value)`

inserts a K,V pair into the selected table,automatically updates/replaces as needed

 * **Parameters:**
   * `key` — `string|number` — 
   * `value` — `*` — 

## `array()`

converts the DB into array form where format is ``[{table: (string), rows: ({})}]``

 * **Returns:** `Array<any>` — 

## `obtain(key)`

gets the value of the key, if no key is present it returns `undefined`

 * **Parameters:** `key` — `string|number` — 
 * **Returns:** `*` — - [Documentation](#documentation)
  - [`constructor(table, path = '.')`](#constructortable-path)
  - [`insert(key, value)`](#insertkey-value)
  - [`array()`](#array)
  - [`obtain(key)`](#obtainkey)
  - [`remove(key)`](#removekey)

## `remove(key)`

remove a key from the table.

 * **Parameters:** `key` — `string|number` — 