<a name="JNDB"></a>

## JNDB
**Kind**: global class  
- [JNDB](#jndb)
  - [new JNDB(table, [path])](#new-jndbtable-path)
  - [JNDB.insert(key, value)](#jndbinsertkey-value)
  - [JNDB.array() ⇒ <code>Array.&lt;any&gt;</code>](#jndbarray-%E2%87%92-codearrayltanygtcode)
  - [JNDB.obtain(key) ⇒ <code>\*</code>](#jndbobtainkey-%E2%87%92-codecode)
  - [JNDB.remove(key)](#jndbremovekey)

<a name="new_JDB_new"></a>

### new JNDB(table, [path])
Creates an instance of JDB.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| table | <code>string</code> |  | table to be used for saving/retrieving data from |
| [path] | <code>string</code> | <code>&quot;&#x27;.&#x27;&quot;</code> |  |

<a name="JDB+insert"></a>

### JNDB.insert(key, value)
inserts a K,V pair into the selected table,automatically updates/replaces as needed

**Kind**: instance method of [<code>JDB</code>](#JDB)  

| Param | Type |
| --- | --- |
| key | <code>string</code> \| <code>number</code> | 
| value | <code>\*</code> | 

<a name="JNDB+array"></a>

### JNDB.array() ⇒ <code>Array.&lt;any&gt;</code>
converts the DB into array form
where format is ``[{table:string,rows:{}}]``

**Kind**: instance method of [<code>JDB</code>](#JDB) 

<a name="JDB+obtain"></a>

### JNDB.obtain(key) ⇒ <code>\*</code>
**Kind**: instance method of [<code>JDB</code>](#JDB)  

| Param | Type |
| --- | --- |
| key | <code>string</code> \| <code>number</code> | 

<a name="JNDB+remove"></a>

### JNDB.remove(key)
**Kind**: instance method of [<code>JDB</code>](#JDB)  

| Param | Type |
| --- | --- |
| key | <code>string</code> \| <code>number</code> | 

