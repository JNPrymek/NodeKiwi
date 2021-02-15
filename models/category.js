import KiwiNamed from './kiwiNamed.js';
import Product from './product.js';

export default class Category extends KiwiNamed {
	
	constructor(source) {
		super(source);
	}
	
	static async getByName(name) {
		return await super.getByName(name, 'Category');
	}
	
	getDescription() {
		return this._source.description;
	}
	
	async setDescription(description) {
		await this.update({'description' : description});
	}
	
	async getProduct() {
		return await Product.getById(this._source.product_id);
	}
	
	toString() {
		return `${super.toString()} : ${this.getName()}`;
	}
	
}