const fs = require('fs');
const afs = require('./afs');
const EventEmitter = require('events').EventEmitter;
const events = new EventEmitter();
/**
 * @type {Map<string,Buffer>}
 */
let bufferPool = new Map();
function syncData(path) {
	if(bufferPool.has(path))return;
	bufferPool.set(path, fs.readFileSync(path));
}
/**
 * 
 * @param {string} path 
 * @param {object} data 
 */
function writeFile(path, data) {
	bufferPool.set(path,Buffer.from(JSON.stringify(data)))
	process.nextTick(() => {
		events.emit('write', path, data);
	});
}
function parseBuffer(buffer) {
	return JSON.parse(buffer.toString());
}
function getParsedBuffer(path) {
	return bufferPool.has(path) ? parseBuffer(bufferPool.get(path)) : undefined;
}
events.on('write', async (path, data) => {
	let fd = await afs.open(path, 'w');
	await afs.fsync(fd);
	await afs.write(fd, Buffer.from(JSON.stringify(data, null, '\t')));
	await afs.close(fd);
});
exports.engine = { getParsedBuffer, bufferPool, writeFile, syncData };
