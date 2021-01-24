import KiwiBase from './kiwiBase.js';
import Product from './product.js';

export default class Version extends KiwiBase {
	
	constructor(source) {
		super(source);
	}
	
	getName() {
		return this._source.value;
	}
	getValue() {
		return this.getName();
	}
	
	getProductName() {
		return this._source.product;
	}
	getProductId() {
		return this._source.product_id;
	}
	async getProduct() {
		return await Product.getById(this._source.product_id);
	}
}