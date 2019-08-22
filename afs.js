const fs = require('fs');
/**
 *
 * @param {string} path
 * @param {FileMode} mode
 * @returns {Promise<number>}
 */
function open(path, mode) {
	return new Promise((res, rej) => {
		fs.open(path, mode, (err, fd) => {
			if (err) rej(err);
			res(fd);
		});
	});
}
/**
 *
 * @param {number} fd
 * @returns {Promise<void>}
 */
function fsync(fd) {
	return new Promise((res, rej) => {
		fs.fsync(fd, (err) => {
			if (err) rej(err);
			res();
		});
	});
}
/**
 *
 * @param {number} fd
 * @param {*} data
 * @returns {Promise<{written:number,buffer:any}>}
 */
function write(fd, data) {
	return new Promise((res, rej) => {
		fs.write(fd, data, (err, written, buff) => {
			if (err) rej(err);
			res({ written, buffer: buff });
		});
	});
}
/**
 *
 * @param {number} fd file descriptor
 * @returns {Promise<void>}
 */
function close(fd) {
	return new Promise((res, rej) => {
		fs.close(fd, (err) => {
			if (err) rej(err);
			res();
		});
	});
}
const FileMode =
	'a' ||
	'ax' ||
	'a+' ||
	'ax+' ||
	'as' ||
	'as+' ||
	'r' ||
	'r+' ||
	'rs+' ||
	'w' ||
	'wx' ||
	'w+' ||
	'wx+';

/**
 * @typedef {'a'|'ax'|'a+' |'ax+'|'as'|'as+'|'r' |'r+'|'rs+'|'w' |'wx'|'w+'|'wx+'} FileMode
 */
module.exports = { open, fsync, write, close };
