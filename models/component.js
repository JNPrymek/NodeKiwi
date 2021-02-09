import KiwiBase from './kiwiBase.js';
import { DuplicateItemNameError } from './errors/duplicateItemError.js';
import { NoItemNameFoundError } from './errors/noItemFoundError.js';
import Product from './product.js';

export default class Component extends KiwiBase {
	
	constructor(source) {
		super(source);
	}
	
	static async getByName(name) {
		const res = await this.filter({'name' : name});
		if (res.length == 1) {
			return res[0];
		}
		else if (res.length < 1) {
			throw new NoItemNameFoundError('Component', name);
		}
		else {
			throw new DuplicateItemNameError('Component', name);
		}
	}
	
	static async resolveToComponent(component) {
		let comp = null;
		if (component instanceof Component) {
			comp = component;
		}
		else if (typeof component === 'string') {
			comp = await this.getByName(component);
		}
		else if (this._assertValidId(component)) {
			comp = await this.getById(component);
		}
		
		if (comp == null) {
			throw new TypeError('Component can only be resolved from types Component, int, or string');
		}
		
		return comp;
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
	
	async getProduct() {
		return await Product.getById(this._source.product_id);
	}
	
	toString() {
		return `${super.toString()} : ${this.getName()}`;
	}
	
}