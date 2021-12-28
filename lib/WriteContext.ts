'use strict';
import { strict as assert } from 'assert';
import { BufferContext } from './BufferContext';

export interface WriteContextConstructOptions {
	size?: number;
	autoGrow?: boolean;
	littleEndian?: boolean;
}

export class WriteContext extends BufferContext {
	autoGrow: boolean;

	constructor(p_options?: WriteContextConstructOptions) {
		const size = p_options?.size;
		const buffer = new ArrayBuffer(size && size > 0 ? size : 128);
		super(buffer, !p_options ? false : !!p_options.littleEndian);
		this.autoGrow = !p_options || (p_options.autoGrow ? !!p_options.autoGrow : true);
	}

	getBuffer(): Buffer {
		const newBuf = Buffer.from(this.buffer, 0, this.pos);
		return newBuf;
	}

	sizeLeft(): number {
		return this.buffer.byteLength - this.pos;
	}

	checkSize(p_size: number): void {
		while (true) {
			const diff = this.sizeLeft() - p_size;
			if (diff >= 0) {
				break;
			}
			if (this.autoGrow) {
				this.resize();
				continue;
			}
			assert.fail(`Writing ${-diff} bytes OOB of fixed size buffer`);
		}
	}

	resize(): void {
		assert(this.autoGrow);
		const size = this.buffer.byteLength;
		const newBuffer = new ArrayBuffer(size * 2);
		new Uint8Array(newBuffer).set(new Uint8Array(this.buffer));
		this.buffer = newBuffer;
	}

	write(p_buffer: Uint8Array, p_bytes: number = -1): number {
		if (p_bytes <= 0) {
			p_bytes = p_buffer.byteLength;
		}

		this.checkSize(p_bytes);

		new Uint8Array(this.buffer).set(p_buffer, this.pos);
		this.pos += p_bytes;
		return p_bytes;
	}

	writeUInt64(p_value: bigint): number {
		const size = 8;
		this.checkSize(size);
		new DataView(this.buffer).setBigUint64(this.pos, p_value, this.littleEndian);
		this.pos += size;
		return size;
	}

	writeUInt32(p_value: number): number {
		const size = 4;
		this.checkSize(size);
		new DataView(this.buffer).setUint32(this.pos, p_value, this.littleEndian);
		this.pos += size;
		return size;
	}

	writeUInt16(p_value: number): number {
		const size = 2;
		this.checkSize(size);
		new DataView(this.buffer).setUint16(this.pos, p_value, this.littleEndian);
		this.pos += size;
		return size;
	}

	writeUInt8(p_value: number): number {
		const size = 1;
		this.checkSize(size);
		new DataView(this.buffer).setUint8(this.pos, p_value);
		this.pos += size;
		return size;
	}
}
