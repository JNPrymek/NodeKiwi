import KiwiBase from './kiwiBase.js';
import { DuplicateItemNameError } from './errors/duplicateItemError.js';
import { NoItemNameFoundError } from './errors/noItemFoundError.js';

export default class Tag extends KiwiBase {
	
	constructor(source) {
		super(source);
	}
	
	static async getByName(name) {
		const res = await this.filter({'name' : name});
		if (res.length == 1) {
			return res[0];
		}
		else if (res.length < 1) {
			throw new NoItemNameFoundError('Tag', name);
		}
		else {
			throw new DuplicateItemNameError('Tag', name);
		}
	}
	
	static async resolveToTag(tag) {
		let t = null;
		if (tag instanceof Tag) {
			t = tag;
		}
		else if (typeof tag === 'string') {
			t = await this.getByName(tag);
		}
		else if (this._assertValidId(tag)) {
			t = await this.getById(tag);
		}
		
		if (t == null) {
			throw new TypeError('Tag must be of type Tag, int, or string');
		}
		
		return t;
	}
	
	getName() {
		return this._source.name;
	}
	
	async setName(name) {
		await this.update({'name' : name});
	}
	
	toString() {
		return `${super.toString()} : ${this.getName()}`;
	}
	
}