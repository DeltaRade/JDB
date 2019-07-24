declare class Connection {
	/**
	 *Creates an instance of Connection.
	 */
	constructor(options?: { path: string; fileName: string });
	readonly count: number;
	use(tableName: string): this;
	/**
	 *	deletes a key from the database
	 */
	delete(key: string | number): this;
	/**
	 * checks if the database has a value
	 */
	has(key: string | number): boolean;
	/**
	 * insert a value into the database
	 */
	insert(key: string | number, value: any): this;
	/**
	 * fetch a value from the database and adds it to this.
	 */
	fetch(key: string | number): any;
	/**
	 * fetch all table objects from the database directly and inserts  them into an array in the form of:`[ { key:string|number,value:any } ]`
	 */
	fetchArray(): Array<{}>;
	/**
	 * fetch all table objects from the database directly
	 * @returns {{}}
	 * @memberof JNDBClient
	 */
	fetchAll(): {};
	locate(
		fn: (value: any, key: string | number) => boolean
	): Array<{ key: string; value: any }>;
	/**
	 * short-hand helper for `if(!key){Connection.insert(key,value); Connection.get(key)}`
	 * @example
	 * let db=new jndb.Connection('users')
	 * let value=db.secure('user1',{})
	 * console.log(value)// {}
	 *
	 */
	secure<T>(key: string | number, defaultValue: T): T;
	/**
	 * compresses the database into a separate file called `jndb.dat`
	 */
	compress(): CompressedJSON;
	/**
	 * gets the compressed data from `jndb.dat` (if it exists)
	 */
	uncompress(): CompressedJSON;
}
declare namespace Schema {
	class Schema{
		constructor(object:{ [key: string]: SchemaType });
	}
	class DB  {
		constructor(options?: { filename: string; path: string });
		public setSchema(schema: Schema): this;
		public insert(object: {[key:string]:any}): { [key: string]: any };
		public select(
			searchKey: string,
			searchValue: any
		): { [key: string]: any };
		public update(
			searchKey: string,
			searchValue: any,
			newValue: any
		): { [key: string]: any };
		public delete(
			searchKey: string,
			searchValue: string
		): { [key: string]: any };
	}
	type SchemaType =
		| NumberConstructor
		| StringConstructor
		| ObjectConstructor
		| BooleanConstructor
		| DateConstructor
		| ArrayConstructor
}
export { Connection, Schema };
declare class CompressedJSON {
	private buffer: Buffer;
	constructor(buffer: Buffer);
	readonly tables: string[];

	object(): {};
	json(): string;
	/**
	 * searches for a given key in all of the tables and returns it
	 */
	get(key: string | number): any;
}
