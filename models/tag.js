import KiwiNamed from './kiwiNamed.js';

const DEFAULT_EXCLUDE_KEYS = ['case', 'plan', 'run', 'bugs'];

export default class Tag extends KiwiNamed {
	
	constructor(source) {
		super(source);
		
		// remove unused fields
		// delete this._source.case;
		// delete this._source.plan;
		// delete this._source.run;
		// delete this._source.bugs;
	}
	
	static async filter(filterDict = {}, excludeKeys = DEFAULT_EXCLUDE_KEYS) {
		// Exclude 'cases' property by default
		let exclude = [... excludeKeys];
		return super.filter(filterDict, exclude);
	}
	
	static async getByName(name, excludeKeys = DEFAULT_EXCLUDE_KEYS) {
		return await super.getByName(name, excludeKeys, 'Tag');
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