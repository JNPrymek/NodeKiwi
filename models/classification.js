import KiwiBase from './kiwiBase.js';

export default class Classification extends KiwiBase {
	
	constructor(source) {
		super(source);
	}
	
	getName() {
		return this._source.name;
	}
	
	async setName(name) {
		await this.update({'name' : name});
	}
	
	async getClassification() {
		return await Classification.getById(this._source.classification_id);
	}
	
	toString() {
		return `${super.toString()} : ${this.getName()}`;
	}
	
}