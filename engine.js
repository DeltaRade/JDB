const fs = require('fs');
const EventEmitter = require('events').EventEmitter;
const events = new EventEmitter();
/**
 * @type {Map<string,Buffer>}
 */
let bufferPool = new Map();
function syncData(path) {
	if (bufferPool.has(path)) return;
	bufferPool.set(path, fs.readFileSync(path));
}
/**
 *
 * @param {string} path
 * @param {object} data
 */
function writeFile(path, data) {
	bufferPool.set(path, Buffer.from(JSON.stringify(data)));
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
	let dat = Buffer.from(JSON.stringify(data, null, '\t'));
	fs.writeFileSync(path, dat);
});
exports.engine = { getParsedBuffer, bufferPool, writeFile, syncData };
