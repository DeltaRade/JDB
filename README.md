# JDB

JSON based database that strives to provide readability in both the json file and the functions itself

# Documentation

## `constructor(table,path='.')`

 * **Parameters:**
   * `table` — `string` — table to be used for saving/retrieving data from
   * `[path='.']` — `string` — 

## `insert(key,value)`

inserts a K,V pair into the selected table,automatically updates/replaces as needed

 * **Parameters:**
   * `key` — `string|number` — 
   * `value` — `*` — 

## `array()`

converts the DB into array form where format is ``[{table:string,rows:{}}]``

 * **Returns:** `[]` — 

## `switch(table)`

switches the table that the DB saves/retrieves data from

 * **Parameters:** `table` — `string` — table to switch to

## `create(table)`

 * **Parameters:** `table` — `string` — 

## `obtain(key)`

 * **Parameters:** `key` — `string|number` — 
 * **Returns:** `*` — 

## `collapse(table)`

 * **Parameters:** `table` — `string` — 

## `remove(key)`

 * **Parameters:** `key` — `string|number` — 