import Classification from './classification.js';
import KiwiBase from './kiwiBase.js';

export default class Product extends KiwiBase {
	
	constructor(source) {
		super(source);
	}
	
	getName() {
		return this._source.name;
	}
	
	async setName(name) {
		await this.update({'name' : name});
	}
	
	getDescription() {
		return this._source.description;
	}
	
	async setDescription(description) {
		await this.update({'description' : description});
	}
	
	async getClassification() {
		return await Classification.getById(this._source.classification_id);
	}
	
	toString() {
		return `${super.toString()} : ${this.getName()}`;
	}
	
}