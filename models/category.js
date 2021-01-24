import KiwiBase from './kiwiBase.js';

export default class Category extends KiwiBase {
	
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
	
	async setDescription() {
		await this.update({'description' : description});
	}
	
	async getProduct() {
		return await Product.getById(this._source.product_id);
	}
	
	toString() {
		return `${super.toString()} : ${this.getName()}`;
	}
	
}