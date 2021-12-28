import { strict as assert } from 'assert';
import { BufferContext } from './BufferContext';

export class ReadContext extends BufferContext {
	constructor(p_buffer: ArrayBuffer, p_littleEndian = false) {
		super(p_buffer, p_littleEndian);
	}

	read(p_bytes: number): Uint8Array | null {
		const bytesToRead = Math.min(this.sizeLeft(), p_bytes);
		if (bytesToRead <= 0) {
			return null;
		}

		const view = new Uint8Array(this.buffer, this.pos, bytesToRead);
		this.pos += bytesToRead;
		assert(view.byteLength === bytesToRead);
		return view;
	}

	readRemaining(): Uint8Array | null {
		return this.read(this.sizeLeft());
	}

	readRemainingAsNewBuffer(): Buffer | null {
		const view = this.readRemaining();
		if (view !== null) {
			const newArrayBuffer = view.buffer.slice(view.byteOffset, view.byteOffset + view.length);
			return Buffer.from(newArrayBuffer);
		}
		return null;
	}

	readUInt64(): bigint | number {
		const offset = this.pos;
		if (offset + 8 <= this.buffer.byteLength) {
			const value = new DataView(this.buffer).getBigUint64(this.pos, this.littleEndian);
			this.pos += 8;
			return value;
		}

		assert.fail(`Read outside buffer`);
		return NaN;
	}

	readInt64(): bigint | number {
		const offset = this.pos;
		if (offset + 8 <= this.buffer.byteLength) {
			const value = new DataView(this.buffer).getBigInt64(this.pos, this.littleEndian);
			this.pos += 8;
			return value;
		}

		assert.fail(`Read outside buffer`);
		return NaN;
	}

	readUInt32(): number {
		const size = 4;
		const offset = this.pos;
		if (offset + size <= this.buffer.byteLength) {
			const value = new DataView(this.buffer).getUint32(this.pos, this.littleEndian);
			this.pos += size;
			return value;
		}

		assert.fail(`Read outside buffer`);
		return NaN;
	}

	readInt32(): number {
		const size = 4;
		const offset = this.pos;
		if (offset + size <= this.buffer.byteLength) {
			const value = new DataView(this.buffer).getInt32(this.pos, this.littleEndian);
			this.pos += size;
			return value;
		}

		assert.fail(`Read outside buffer`);
		return NaN;
	}

	readUInt16(): number {
		const size = 2;
		const offset = this.pos;
		if (offset + size <= this.buffer.byteLength) {
			const value = new DataView(this.buffer).getUint16(this.pos, this.littleEndian);
			this.pos += size;
			return value;
		}

		assert.fail(`Read outside buffer`);
		return NaN;
	}

	readInt16(): number {
		const size = 2;
		const offset = this.pos;
		if (offset + size <= this.buffer.byteLength) {
			const value = new DataView(this.buffer).getInt16(this.pos, this.littleEndian);
			this.pos += size;
			return value;
		}

		assert.fail(`Read outside buffer`);
		return NaN;
	}

	readUInt8(): number {
		const size = 1;
		const offset = this.pos;
		if (offset + size <= this.buffer.byteLength) {
			const value = new DataView(this.buffer).getUint8(this.pos);
			this.pos += size;
			return value;
		}

		assert.fail(`Read outside buffer`);
		return NaN;
	}

	readInt8(): number {
		const size = 1;
		const offset = this.pos;
		if (offset + size <= this.buffer.byteLength) {
			const value = new DataView(this.buffer).getInt8(this.pos);
			this.pos += size;
			return value;
		}

		assert.fail(`Read outside buffer`);
		return NaN;
	}
}
