import KiwiNamed from './kiwiNamed.js';

export default class Tag extends KiwiNamed {
	
	constructor(source) {
		super(source);
	}
	
	static async getByName(name) {
		return await super.getByName(name, 'Tag');
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
	
	toString() {
		return `${super.toString()} : ${this.getName()}`;
	}
	
}