function crc32(buffer) {
	let c = 0xffffffff;
	for (const b of buffer) {
		c ^= b;
		for (let i = 0; i < 8; i++) c = (c >>> 1) ^ (c & 1 ? 0xedb88320 : 0);
	}
	return (c ^ 0xffffffff) >>> 0;
}
// ZIP store mode: UTF-8 filenames, deterministic bytes, no shell or extra runtime.
export function zip(entries) {
	let offset = 0;
	const body = [],
		central = [];
	for (const [name, data] of entries) {
		const n = Buffer.from(name);
		const header = Buffer.alloc(30);
		header.writeUInt32LE(0x04034b50);
		header.writeUInt16LE(20, 4);
		header.writeUInt16LE(0x800, 6);
		header.writeUInt16LE(33, 12);
		header.writeUInt32LE(crc32(data), 14);
		header.writeUInt32LE(data.length, 18);
		header.writeUInt32LE(data.length, 22);
		header.writeUInt16LE(n.length, 26);
		body.push(header, n, data);
		const c = Buffer.alloc(46);
		c.writeUInt32LE(0x02014b50);
		c.writeUInt16LE(20, 4);
		c.writeUInt16LE(20, 6);
		c.writeUInt16LE(0x800, 8);
		c.writeUInt16LE(33, 14);
		c.writeUInt32LE(crc32(data), 16);
		c.writeUInt32LE(data.length, 20);
		c.writeUInt32LE(data.length, 24);
		c.writeUInt16LE(n.length, 28);
		c.writeUInt32LE(offset, 42);
		central.push(c, n);
		offset += header.length + n.length + data.length;
	}
	const cd = Buffer.concat(central),
		end = Buffer.alloc(22);
	end.writeUInt32LE(0x06054b50);
	end.writeUInt16LE(entries.length, 8);
	end.writeUInt16LE(entries.length, 10);
	end.writeUInt32LE(cd.length, 12);
	end.writeUInt32LE(offset, 16);
	return Buffer.concat([...body, cd, end]);
}
