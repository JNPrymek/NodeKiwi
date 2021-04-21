import KiwiNamed from './kiwiNamed.js';

export default class Tag extends KiwiNamed {
	
	constructor(source) {
		super(source);
		
		// remove unused fields
		delete this._source.case;
		delete this._source.plan;
		delete this._source.run;
		delete this._source.bugs;
	}
	
	static async filter(filterDict = {}, excludeKeys = []) {
		// Exclude 'cases' property by default
		let exclude = [... excludeKeys];
		exclude.push('case');
		exclude.push('plan');
		exclude.push('run');
		exclude.push('bugs');
		return super.filter(filterDict, exclude);
	}
	
	static async getByName(name, excludeKeys = []) {
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